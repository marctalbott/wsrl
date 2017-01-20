Game.DATASTORE.MAP = {};

Game.Map = function (mapTileSetName) {

  this._tiles = Game.MapTileSets[mapTileSetName].getMapTiles();

  this.attr = {
    _id: Game.util.randomString(32),
    _mapTileSetName: mapTileSetName,
    _width: this._tiles.length,
    _height: this._tiles[0].length,
    _entityIdsByLocation: {},
    _locationsByEntityId: {},
    _rememberCoords: {},
    _itemsByLocation: {}
  };

  this._fov = null;
  this.setUpFov();

  Game.DATASTORE.MAP[this.attr._id] = this;
};

Game.Map.prototype.setUpFov = function () {
  var map = this;
  this._fov = new ROT.FOV.DiscreteShadowcasting(function(x, y) {
                    return !map.getTile(x, y).isOpaque();
                }, {topology: 8});
};

Game.Map.prototype.getId = function() {
  return this.attr._id;
}

Game.Map.prototype.getFov = function() {
  return this._fov;
}

Game.Map.prototype.getWidth = function() {
  return this.attr._width;
};

Game.Map.prototype.getHeight = function() {
  return this.attr._height;
};

Game.Map.prototype.getTile = function (x_or_pos,y) {
  var useX = x_or_pos,useY=y;

  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  if ((useX < 0) || (useX >= this.attr._width) || (useY<0) || (useY >= this.attr._height)) {
    return Game.Tile.nullTile;
  }

  return this._tiles[useX][useY] || Game.Tile.nullTile;
};

Game.Map.prototype.getEntitiesNearby = function (radius, x_or_pos, y) {
  var useX = x_or_pos, useY = y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }

  var entLocs = Object.keys(this.attr._entitiesByLocation);
  var foundEnts = [];
  if (entLocs.length < radius*radius*4) {
    for (var i = 0; i < entLocs.length; i++) {
      var el = entLocs[i].split(',');
      if ((Math.abs(el[0] - useX) <= radius) && (Math.abs(el[1] - useY) <= radius)) {
        foundEnts.push(Game.DATASTORE.ENTITY[this.attr._entitiesByLocation[entLocs[i]]]);
      }
    }
  } else {
    for (var cx = radius * -1; cx <= radius; cx++) {
      for (var cy = radius * -1; cy <= radius; cy++) {
        var entId = this.getEntity(useX + cx, useY + cy);
        if (entId) {
          foundEnts.push(Game.DATASTORE.ENTITY[entId]);
        }
      }
    }
  }
  return foundEnts;
};

// Game.Map.prototype.getEntitiesNearby_LoS = function (radius, x_or_pos, y) {
//   var useX = x_or_pos,useY=y;
//   if (typeof x_or_pos == 'object') {
//     useX = x_or_pos.x;
//     useY = x_or_pos.y;
//   }
//   var entLocs = Object.keys(this.attr._entitiesByLocation);
//   var foundEnts = [];
//   if (entLocs.length < radius*radius*4) {
//     for (var i = 0; i < entLocs.length; i++) {
//       var el = entLocs[i].split(',');
//       if ((Math.abs(el[0]-useX) <= radius) && (Math.abs(el[1]-useY) <= radius)) {
//         foundEnts.push(Game.DATASTORE.ENTITY[this.attr._entitiesByLocation[entLocs[i]]]);
//       }
//     }
//   } else {
//     for (var cx = radius*-1; cx <= radius; cx++) {
//       for (var cy = radius*-1; cy <= radius; cy++) {
//         var entId = this.getEntity(useX+cx,useY+cy);
//         if (entId) {
//           foundEnts.push(Game.DATASTORE.ENTITY[entId]);
//         }
//       }
//     }
//   }
//   return foundEnts;
// };

Game.Map.prototype.renderOn = function (display, camX, camY, renderOptions) {
  // var renderOps = renderOptions || {};
  // if( renderOps ) var visCells = renderOps.visibleCells;
  // var entitiesVisible = (showEntities !== undefined) ? showEntities : true;
  // var tilesVisible = (showTiles !== undefined) ? showTiles : true;
  // var isMasked = (maskRendered !== undefined) ? maskRendered : true;
  // var filterForRemembered = (memoryOnly !== undefined) ? memoryOnly : true;
  //
  // if (!entitiesVisible && !tilesVisible) { return; }

  var opt = renderOptions || {};
  console.log(opt);
  var checkCellsVisible = opt.visibleCells !== undefined;
  var visibleCells = opt.visibleCells || {};
  var showVisibleEntities = (opt.showVisibleEntities !== undefined) ? opt.showVisibleEntities : true;
  var showVisibleItems = (opt.showVisibleItems !== undefined) ? opt.showVisibleItems : true;
  var showVisibleTiles = (opt.showVisibleTiles !== undefined) ? opt.showVisibleTiles : true;

  var checkCellsMasked = opt.maskedCells !== undefined;
  var maskedCells = opt.maskedCells || {};
  var showMaskedEntities = (opt.showMaskedEntities !== undefined) ? opt.showMaskedEntities : false;
  var showMaskedItems = (opt.showMaskedItems !== undefined) ? opt.showMaskedItems : false;
  var showMaskedTiles = (opt.showMaskedTiles !== undefined) ? opt.showMaskedTiles : true;

  if (!(showVisibleEntities || showVisibleTiles || showMaskedEntities || showMaskedTiles)) { return; }

//  console.dir( visCells );
  var dispW = display._options.width;
  var dispH = display._options.height;
  var xStart = camX - Math.round(dispW/2);
  var yStart = camY - Math.round(dispH/2);
  for (var x = 0; x < dispW; x++) {
    for (var y = 0; y < dispH; y++) {
      var mapPos = {x:x+xStart, y:y+yStart};
      var mapCoord = mapPos.x + ',' + mapPos.y;

      // if (filterForRemembered) {
      //   if (!this.attr._rememberCoords[mapPos.x + ',' + mapPos.y]) {
      //     continue;
      //   }
      // }
      // console.log("rendering map");

      if (!((checkCellsVisible && visibleCells[mapCoord]) || (checkCellsMasked && maskedCells[mapCoord]))) {
        continue;
      }
      // if (tilesVisible) {
      var tile = this.getTile(mapPos);
      if (tile.getName() == 'nullTile') {
        tile = Game.MapTileSets[this.attr._mapTileSetName]._wallTile;
      }
      if (showVisibleTiles && visibleCells[mapCoord]) {
        tile.draw(display, x, y);
      } else if (showMaskedTiles && maskedCells[mapCoord]) {
        tile.draw(display, x, y, true);
      }
      // tile.draw(display, x, y, isMasked);

      // if( visCells.hasOwnProperty(mapPos.x+','+mapPos.y) ) {
      //   tile.draw(display,x,y,'#ff0000', '#00ff00');
      // } else {
      //   tile.draw(display, x, y);
      // }
      // }

      var items = this.getItems(mapPos);
      if (items.length == 1) {
        if (showVisibleItems && visibleCells[mapCoord]) {
          items[0].draw(display, x, y);
        } else if (showMaskedItems && maskedCells[mapCoord]) {
          items[0].draw(display, x, y, true);
        }
      } else if (items.length > 1) {
        if (showVisibleItems && visibleCells[mapCoord]) {
          Game.Symbol.ITEM_PILE.draw(display,x,y);
        } else if (showMaskedItems && maskedCells[mapCoord]) {
          Game.Symbol.ITEM_PILE.draw(display,x,y,true);
        }
      }

      var ent = this.getEntity(mapPos);
      if (ent) {
        if (showVisibleEntities && visibleCells[mapCoord]) {
          ent.draw(display,x,y);
        } else if (showMaskedEntities && maskedCells[mapCoord]) {
          ent.draw(display,x,y,true);
        }
      }

      // if (entitiesVisible) {
      //   var ent = this.getEntity(mapPos);
      //   if(ent) {
      //     ent.draw(display,x,y, isMasked);
      //   }
      // }
    }
  }
};

Game.Map.prototype.renderFovOn = function (display, camX, camY, radius) {
  var dispW = display._options.width;
  var dispH = display._options.height;
  var xStart = camX - Math.round(dispW/2);
  var yStart = camY - Math.round(dispH/2);

  var inFov = {};
  this._fov.compute(camX, camY, radius, function (x, y , radius, visibility) {
    inFov[x+","+y] = true;
  });

  for (var x = 0; x < dispW; x++) {
    for (var y = 0; y < dispH; y++) {
      var mapPos = {x: x + xStart, y: y + yStart};
      if (inFov[mapPos.x + ',' + mapPos.y]) {
        var tile = this.getTile(mapPos);
        if (tile.getName() == 'nullTile') {
          tile = Game.MapTileSets[this.attr._mapTileSetName]._wallTile;
        }
        tile.draw(display, x, y);
        var ent = this.getEntity(mapPos);
        if (ent) {
          ent.draw(display, x, y);
        }
      }
    }
  }
  return inFov;
};


Game.Map.prototype.addEntity = function (ent,pos) {
  this.attr._entityIdsByLocation[pos.x+","+pos.y] = ent;
  // console.log(ent.getId());
  this.attr._locationsByEntityId[ent.getId()] = pos.x+","+pos.y;
  ent.setMap(this);
  ent.setPos(pos.x, pos.y);
};

Game.Map.prototype.updateEntityLocation = function (ent) {
  var origLoc = this.attr._locationsByEntityId[ent.getId()];
  if (origLoc) {
    delete this.attr._entityIdsByLocation[origLoc];
  }
  var pos = ent.getPos();
  this.attr._entityIdsByLocation[pos.x+","+pos.y] = ent;
  this.attr._locationsByEntityId[ent.getId()] = pos.x+","+pos.y;
};
Game.Map.prototype.getEntity = function (x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  return this.attr._entityIdsByLocation[useX+','+useY] || false;
};

Game.Map.prototype.extractEntity = function (ent) {
  delete this.attr._entityIdsByLocation[ent.getX()+","+ent.getY()];
  delete this.attr._locationsByEntityId[ent.getId()];
  return ent;
};

Game.Map.prototype.extractEntityAt = function (x_or_pos,y) {
  var ent = this.getEntity(x_or_pos,y);
  if (ent) {
    delete this.attr._entityIdsByLocation[ent.getX()+","+ent.getY()];
    delete this.attr._locationsByEntityId[ent.getId()];
  }
  return ent;
};

Game.Map.prototype.addItem = function (itm, pos) {
  var loc = pos.x + "," + pos.y;
  if (!this.attr._itemsByLocation[loc]) {
    this.attr._itemsByLocation[loc] = [];
  }
  this.attr._itemsByLocation[loc].push(itm.getId());
};

Game.Map.prototype.getItems = function (x_or_pos, y) {
  var useX = x_or_pos, useY = y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  var itemIds = this.attr._itemsByLocation[useX + ',' + useY];
  if (itemIds) { return itemIds.map(function (iid) { return Game.DATASTORE.ITEM[iid]; }); }
  return [];
};

Game.Map.prototype.extractItemAt = function (itm_or_idx,x_or_pos,y) {
  var useX = x_or_pos,useY=y;
  if (typeof x_or_pos == 'object') {
    useX = x_or_pos.x;
    useY = x_or_pos.y;
  }
  var itemIds = this.attr._itemsByLocation[useX+','+useY];
  if (! itemIds) { return false; }

  var item = false, extractedId = '';
  if (Number.isInteger(itm_or_idx)) {
    extractedId = itemIds.splice(itm_or_idx,1);
    item = Game.DATASTORE.ITEM[extractedId];
  } else {
    var idToFind = itm_or_idx.getId();
    for (var i = 0; i < itemIds.length; i++) {
      if (idToFind === itemIds[i]) {
        extractedId = itemIds.splice(i,1);
        item = Game.DATASTORE.ITEM[extractedId];
        break;
      }
    }
  }
  return item;
};

Game.Map.prototype.getRandomLocation = function(filter_func) {
  if (filter_func === undefined) {
    filter_func = function(tile) { return true; };
  }
  var tX,tY,t;
  do {
    tX = Game.util.randomInt(0,this.attr._width - 1);
    tY = Game.util.randomInt(0,this.attr._height - 1);
    t = this.getTile(tX,tY);
    console.log("getting location");
  } while (! filter_func(t));
  return {x:tX,y:tY};
};

Game.Map.prototype.getRandomWalkableLocation = function() {
  return this.getRandomLocation(function(t){ return t.isWalkable(); });
};

Game.Map.prototype.rememberCoords = function( toRemember ) {
  for ( var coord in toRemember ) {
    if( toRemember.hasOwnProperty(coord)) {
      this.attr._rememberCoords[coord] = true;
    }
  }
};
/*

Game.Map.prototype.getRandomFloorPosition = function() {
  // Randomly generate a tile which is a floor
  var x, y;
  do {
    x = Math.floor( Math.random() * this.getWidth() );
    y = Math.floor( Math.random() * this.getHeight() );
  } while( !this.getTile( x, y ).isWalkable() );

  return {x: x, y: y};
};

Game.Map.prototype.addEntityAtRandomPosition = function( entity ) {
  var position = this.getRandomFloorPosition();
  entity.setX(position.x);
  entity.setY(position.y);
//  console.log( "FIRST: "+entity.getX());
  this.addEntity(entity);
};*/

Game.Map.prototype.toJSON = function(json) {
  return Game.UIMode.gamePersistence.BASE_toJSON.call(this);
};

Game.Map.prototype.fromJSON = function(json){
  Game.UIMode.gamePersistence.BASE_toJSON.call(this, json);
};
