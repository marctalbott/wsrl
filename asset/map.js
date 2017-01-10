Game.Map = function (tilesGrid) {
  this.attr = {
    _tiles: tilesGrid,
    _width: tilesGrid.length,
    _height: tilesGrid[0].length,
    _entities: [],
  };
};

Game.Map.prototype.getWidth = function() {
  return this.attr._width;
};

Game.Map.prototype.getHeight = function() {
  return this.attr._height;
};

Game.Map.prototype.getTile = function(x,y) {
  if ((x < 0) || (x >= this.attr._width) || (y < 0) || (y >= this.attr._height)) {
    return Game.Tile.nullTile;
  }
  return this.attr._tiles[x][y] || Game.Tile.nullTile;
};

Game.Map.prototype.renderOn = function (display, camX, camY) {
  var dispW = display._options.width;
  var dispH = display._options.height;
  var xStart = camX - Math.round(dispW/2);
  var yStart = camY - Math.round(dispH/2);
  for (var x = 0; x < dispW; x++) {
    for (var y = 0; y < dispH; y++) {
      var tile = this.getTile(x + xStart, y + yStart);
      if (tile.getName() == 'nullTile') {
        tile = Game.Tile.wallTile;
      }
      tile.draw(display, x, y);

      //  var sym = tile.getSymbol();
      //
      //  display.draw(x,y,sym.getChar(),sym.getFg(),sym.getBg());
    }
  }

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
};

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
};

Game.Map.prototype.toJSON = function(json) {
};

Game.Map.prototype.fromJSON = function(json){
};


