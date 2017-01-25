Game.DATASTORE.ITEM = {};

Game.Item = function (template) {
  template = template || {};

  this._mixinSet = Game.ItemMixin;

  Game.SymbolActive.call(this, template);
  this.attr._x = template.x || 0;
  this.attr._y = template.y || 0;
  this.attr._generator_template_key = template.generator_template_key || '';
  this.attr._mapId = null;

  Game.DATASTORE.ITEM[this.attr._id] = this;
  console.dir( this._mixinSet );
};


Game.Item.extend(Game.SymbolActive);

Game.Item.prototype.getMixins = function() {
	return this.attr._mixins;
};

Game.Item.prototype.getMap = function() {
	return Game.DATASTORE.MAP[this.attr._mapId];
};

Game.Item.prototype.setMap = function( map ) {
	this.attr._mapId = map.getId();
};

Game.Item.prototype.getPos = function() {
	return {x:this.attr._x, y:this.attr._y};
}

Game.Item.prototype.setPos = function( x, y ) {
	this.attr._x = x;
	this.attr._y = y;
};