Game.Tile = function(properties) {
  properties = properties || {};
  Game.Symbol.call(this, properties);
  if (! ('attr' in this)) {
    this.attr = {};
  }
  this.attr._name = properties.name || 'unknown';
  this.attr._walkable = properties.walkable||false;
  this.attr._diggable = properties.diggable||false;
  this.attr._transparent = properties.transparent||false;
  this.attr._opaque = (properties.opaque !== undefined) ? properties.opaque : (! this.attr._transparent);
  this.attr._transparent = !this.attr._opaque;

//  this.attr._tileId = x
  // this.attr = {
  //   _name: name,
  //   _sym: symbol
  // };
};
Game.Tile.extend(Game.Symbol);

// Game.Tile.prototype.getPosition() {
//   return {x: this.attr._x, y: this.attr._y};
// }

Game.Tile.prototype.isWalkable = function() {
  return this.attr._walkable;
};

Game.Tile.prototype.isDiggable = function() {
  return this.attr._diggable;
};

Game.Tile.prototype.getName = function() {
  return this.attr._name;
};

Game.Tile.prototype.isTransparent = function() {
  return this.attr._transparent;
};

Game.Tile.prototype.isOpaque = function() {
  return this.attr._opaque;
};

Game.Tile.nullTile = new Game.Tile({name:'nullTile'});
Game.Tile.floorTile = new Game.Tile({name:'floor', chr: '.', walkable:true, transparent:true});
Game.Tile.wallTile = new Game.Tile({name:'wall', chr: '#'});
Game.Tile.desertTile = new Game.Tile({name:'desert', chr: '.', walkable:true, transparent:true, fg: '#f4a460', maskedFg: '#7a5230'});
Game.Tile.desertWallTile = new Game.Tile({name:'desertWall', chr: '#', fg:'#db9356', maskedFg: '#614126'});
//Game.Tile.doorTile = new Game.Tile({name:'door', chr: '/', walkable: true});

