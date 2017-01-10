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
