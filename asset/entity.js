Game.DATASTORE.ENTITY = {};


Game.Entity = function( template ) {
	template = template || {};

	this._mixinSet = Game.EntityMixin;

	Game.SymbolActive.call (this, template);
	this.attr._x = template.x || 0;
	this.attr._y = template.y || 0;
	this.attr._generator_template_key = template._generator_template_key || '';
	this.attr._mapId = null;

	Game.DATASTORE.ENTITY[this.attr._id] = this;
};


Game.Entity.extend( Game.SymbolActive );

Game.Entity.prototype.destroy = function () {
	// remove from map
	this.getMap().extractEntity(this);
	// remove from Datastore
	delete Game.DATASTORE.ENTITY[this.getId()];
	console.log("Entity:");
	console.dir(Game.DATASTORE.ENTITY);
};


Game.Entity.prototype.getPos = function() {
	return {x:this.attr._x,y:this.attr._y};
};
Game.Entity.prototype.setPos = function( x, y ) {
	this.attr._x = x;
	this.attr._y = y;
};

Game.Entity.prototype.getX = function() {
	return this.attr._x;
};

Game.Entity.prototype.setX = function( x ) {
	this.attr._x = x;
};

Game.Entity.prototype.getY = function() {
	return this.attr._y;
};

Game.Entity.prototype.setY = function( y ) {
	this.attr._y = y;
};

Game.Entity.prototype.getId = function() {
	return this.attr._id;
};

Game.Entity.prototype.getMap = function() {
	return Game.DATASTORE.MAP[this.attr._mapId];
};

Game.Entity.prototype.getMapId = function() {
	return this.attr._mapId;
}

Game.Entity.prototype.setMap = function( map ) {
	this.attr._mapId = map.getId();
};

Game.Entity.prototype.getMixins = function() {
	return this.attr._mixins;
};
