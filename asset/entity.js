Game.DATASTORE.ENTITY = {};


Game.Entity = function( template ) {
	template = template || {};
	Game.Symbol.call( this, template );
	if( !( 'attr' in this )) { this.attr= {}; }
	this.attr._name = template.name || '';
	this.attr._x = template.x || 0;
	this.attr._y = template.y || 0;
	this.attr._generator_template_key = template._generator_template_key || '';
	this.attr._mapId = null;

	this.attr._id = this.attr._name + "-" + Game.util.randomString(32);
	Game.DATASTORE.ENTITY[this.attr._id] = this;

	this._mixins = template.mixins || [];

	this._mixinTracker = {};
//	console.dir(template);
//	console.dir(template.mixins);
//	if (template.hasOwnProperty('mixins')) {
	for (var i = 0; i < this._mixins.length; i++) {
//		for (var i = 0; i < template.mixins.length; i++) {
		var mixin = this._mixins[i];
	// if (template.hasOwnProperty('mixins')) {
		this._mixinTracker[mixin.META.mixinName] = true;
		this._mixinTracker[mixin.META.mixinGroup] = true;
		for (var mixinProp in mixinProp != 'META' && mixin) {
			if (mixinProp != 'META' && mixin.hasOwnProperty(mixinProp)) {
				this[mixinProp] = mixin[mixinProp];
			}
		}

		if (mixin.META.hasOwnProperty('stateNamespace')) {
			this.attr[mixin.META.stateNamespace] = {};
			for (var mixinStateProp in mixin.META.stateModel) {

				if (mixin.META.stateModel.hasOwnProperty(mixinStateProp)) {
					this.attr[mixin.META.stateNamespace][mixinStateProp] = mixin.META.stateModel[mixinStateProp];
				}
			}
		}
		if (mixin.META.hasOwnProperty('init')) {
			mixin.META.init.call(this, template);
		}
	}

};

Game.Entity.extend( Game.Symbol );

Game.Entity.prototype.hasMixin = function(checkThis) {
	if (typeof checkThis == 'object') {
		return this._mixinTracker.hasOwnProperty(checkThis.META.mixinName);
	} else {
		return this._mixinTracker.hasOwnProperty(checkThis);
	}
};

// Basic getters
Game.Entity.prototype.getName = function() {
	return this.attr._name;
};

Game.Entity.prototype.setName = function( name ) {
	this.attr._name = name;
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

Game.Entity.prototype.setMap = function( map ) {
	this.attr._mapId = map.getId();
};

Game.Entity.prototype.getMixins = function() {
	return this._mixins;
}

Game.Entity.prototype.toJSON = function () {
	return Game.UIMode.gamePersistence.BASE_toJSON.call(this);
};

Game.Entity.prototype.fromJSON = function (json) {
	Game.UIMode.gamePersistence.BASE_fromJSON.call(this, json);
};
