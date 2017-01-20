Game.SymbolActive = function (template) {
  template = template || {};
  Game.Symbol.call(this, template);
  this.attr._name = template.name || '';
  this.attr._id = template.presetId || Game.util.uniqueId();

  this._mixinNames = template.mixins || [];
  this._mixins = [];

  for (var i = 0; i < this._mixinNames.length; i++) {
    this._mixins.push(this._mixinSet[this._mixinNames[i]]);
  }


	this._mixinTracker = {};

	for (var i = 0; i < this._mixins.length; i++) {
		var mixin = this._mixins[i];

		this._mixinTracker[mixin.META.mixinName] = true;
		this._mixinTracker[mixin.META.mixinGroup] = true;

		for (var mixinProp in mixin) {
			if (mixinProp != 'META' && mixin.hasOwnProperty(mixinProp)) {
				this[mixinProp] = mixin[mixinProp];
			}
		}

		if (mixin.META.hasOwnProperty('stateNamespace')) {
			this.attr[mixin.META.stateNamespace] = {};
			for (var mixinStateProp in mixin.META.stateModel) {
				if (mixin.META.stateModel.hasOwnProperty(mixinStateProp)) {
					if (typeof mixin.META.stateModel[mixinStateProp] == 'object') {
						this.attr[mixin.META.stateNamespace][mixinStateProp] = JSON.parse(JSON.stringify(mixin.META.stateModel[mixinStateProp]));
					} else {
						this.attr[mixin.META.stateNamespace][mixinStateProp] = mixin.META.stateModel[mixinStateProp];
					}
				}
			}
		}
		if (mixin.META.hasOwnProperty('init')) {
			mixin.META.init.call(this, template);
		}
	}
};
Game.SymbolActive.extend(Game.Symbol);

Game.SymbolActive.prototype.getId = function() {
  return this.attr._id;
};

Game.SymbolActive.prototype.hasMixin = function(checkThis) {
	if (typeof checkThis == 'object') {
		return this._mixinTracker.hasOwnProperty(checkThis.META.mixinName);
	} else {
		return this._mixinTracker.hasOwnProperty(checkThis);
	}
};

Game.SymbolActive.prototype.raiseSymbolActiveEvent = function(evtLabel, evtData) {
	for (var i = 0; i < this._mixins.length; i++) {
		var mixin = this._mixins[i];
		if (mixin.META.listeners && mixin.META.listeners[evtLabel]) {
			mixin.META.listeners[evtLabel].call(this, evtData);
		}
	}
};

Game.SymbolActive.prototype.getName = function() {
    return this.attr._name;
};

Game.SymbolActive.prototype.setName = function(name) {
    this.attr._name = name;
};

Game.SymbolActive.prototype.toJSON = function () {
  return Game.UIMode.gamePersistence.BASE_toJSON.call(this);
};

Game.SymbolActive.prototype.fromJSON = function (json) {
  Game.UIMode.gamePersistence.BASE_fromJSON.call(this,json);
};
