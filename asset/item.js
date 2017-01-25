Game.DATASTORE.ITEM = {};

Game.Item = function (template) {
  template = template || {};

  this._mixinSet = Game.ItemMixin;

  Game.SymbolActive.call(this, template);
  this.attr._generator_template_key = template.generator_template_key || '';
  this.attr._mapId = null;

  Game.DATASTORE.ITEM[this.attr._id] = this;
//  console.dir( this.attr );
};

Game.Item.prototype.getMixins = function() {
	return this.attr._mixins;
};

Game.Item.extend(Game.SymbolActive);
