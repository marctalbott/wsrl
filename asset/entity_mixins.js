Game.EntityMixin = {};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },

  tryWalk: function (map, dx, dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());
    if (map.getTile(targetX, targetY).isWalkable()) {
      this.setPos(targetX, targetY);
      if( this.hasMixin('Chronicle')) {
        this.trackTurn();
      }
      return true;
    }
    return false;
  }
};

Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle'
    //stateNamespace: '_Chronicle_attr'
    /*stateModel: {
      turnCounter: 0
    }*/
  },
  _Chronicle_attr: {
    turnCounter: 0
  },
  trackTurn: function() {
    this._Chronicle_attr.turnCounter++;
  },
  getTurns: function() {
    return this._Chronicle_attr.turnCounter;
  },
  setTurns: function(n) {
    this._Chronicle_attr.turnCounter = n;
  }
};

Game.Entity.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'HitPoints',
    init: function( template ) {
      this._HitPoints_attr.maxHp = template.maxHp || 1;
      this._HitPoints_attr.curHp = template.curHp || this._HitPoints_attr.maxHp;
    }
  },
  _HitPoints_attr: {
    maxHp: 1,
    curHp: 1
  },
  // getters
  getMaxHp: function() {
    return this._HitPoints_attr.maxHp;
  },
  setMaxHp: function(n) {
    this._HitPoints_attr.maxHp = n;
  },
  getCurHp: function() {
    return this._HitPoints_attr.curHp;
  },
  setCurHp: function(n) {
    this._HitPoints_attr.curHp = n;
  },
  takeHits: function(amt) {
    this._HitPoints_attr.curHp -= amt;
  },
  recoverHits: function(amt) {
    this._HitPoints_attr.curHp = Math.min(this._HitPoints_attr.curHp+amt, this._HitPoints_attr.maxHp);
  }
}
