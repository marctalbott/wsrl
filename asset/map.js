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
    _rememberCoords: {}
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

Game.Map.prototype.renderOn = function (display, camX, camY) {
  var dispW = display._options.width;
  var dispH = display._options.height;
  var xStart = camX - Math.round(dispW/2);
  var yStart = camY - Math.round(dispH/2);
  for (var x = 0; x < dispW; x++) {
    for (var y = 0; y < dispH; y++) {
      var mapPos = {x:x+xStart, y:y+yStart};

      var tile = this.getTile(mapPos);
      if (tile.getName() == 'nullTile') {
        tile = Game.Tile.wallTile;
      }
      tile.draw(display, x, y);
      var ent = this.getEntity(mapPos);
      if(ent) {
        ent.draw(display,x,y);
      }

      //  var sym = tile.getSymbol();
      //
      //  display.draw(x,y,sym.getChar(),sym.getFg(),sym.getBg());
    }
  }
};
/*
  for( var i=0; i<this.attr._entities.length; i++ ) {
    var entity = this.attr._entities[i];
    display.draw(entity.getX(), entity.getY(), Game.Symbol.AVATAR.getChar(), "#fff", "#000" );
  }
};

Game.Map.prototype.addEntity = function(entity) {
  if( entity.getX() < 0 || entity.getX() >= this._width ||
      entity.getY() < 0 || entity.getY() >= this._height ) {
    throw new Error('Adding entity out of bounds');
  }
  this.attr._entities.push(entity);
};*/

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

Game.Map.prototype.getRandomLocation = function(filter_func) {
  if (filter_func === undefined) {
    filter_func = function(tile) { return true; };
  }
  var tX,tY,t;
  do {
    tX = Game.util.randomInt(0,this.attr._width - 1);
    tY = Game.util.randomInt(0,this.attr._height - 1);
    t = this.getTile(tX,tY);
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
