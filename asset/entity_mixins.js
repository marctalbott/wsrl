Game.EntityMixin = {};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker'
  },

  tryWalk: function (map, dx, dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());
    if(map.getEntity(targetX,targetY)){
      this.raiseEntityEvent('bumpEntity', {actor:this, recipient:map.getEntity(targetX, targetY)});
      this.raiseEntityEvent('tookTurn');
      return true;
    }
    if (map.getTile(targetX, targetY).isWalkable()) {
      this.setPos(targetX, targetY);
      var myMap = this.getMap();
      if( myMap ) {
        myMap.updateEntityLocation(this);
      }
      // if( this.hasMixin('Chronicle')) {
      //   this.trackTurn();
      // }
      this.raiseEntityEvent('tookTurn');
      return true;
    }
    return false;
  }
};

Game.EntityMixin.Chronicle = {
  META: {
    mixinName: 'Chronicle',
    mixinGroup: 'Chronicle',
    stateNamespace: '_Chronicle_attr',
    stateModel: {
      turnCounter: 0,
      killLog:{},
      deathMessage:''
    },
    listeners: {
      'tookTurn': function(evtData) {
        this.trackTurn();
      },
      'madeKill': function(evtData) {
        console.log('chronicle kill');
        this.addKill(evtData.entKilled);
      },
      'killed': function(evtData) {
        this.attr._Chronicle_attr.deathMessage = 'killed by ' + evtData.killedBy.getName();
      }
    }
  },
  // _Chronicle_attr: {
  //   turnCounter: 0
  // },
  trackTurn: function() {
    // console.log("trackturns");
    // console.log(this.attr);
    this.attr._Chronicle_attr.turnCounter++;
  },
  getTurns: function() {
    // console.log("getturns");
    // console.log(this.attr);
    return this.attr._Chronicle_attr.turnCounter;
  },
  setTurns: function(n) {
    this.attr._Chronicle_attr.turnCounter = n;
  },
  getKills: function() {
    return this.attr._Chronicle_attr.killLog;
  },
  clearKills: function() {
    this.attr._Chronicle_attr.killLog = {};
  },
  addKill: function(entKilled) {
    var entName = entKilled.getName();
    if (this.attr._Chronicle_attr.killLog[entName]) {
      this.attr._Chronicle_attr.killLog[entName]++;
    } else {
      this.attr._Chronicle_attr.killLog[entName] = 1;
    }
  }
};

Game.EntityMixin.HitPoints = {
  META: {
    mixinName: 'HitPoints',
    mixinGroup: 'Destructable',
    stateNamespace: '_HitPoints_attr',
    stateModel: {
      maxHp: 1,
      curHp:1
    },
    init: function( template ) {
      this.attr._HitPoints_attr.maxHp = template.maxHp || 1;
      this.attr._HitPoints_attr.curHp = template.curHp || this.attr._HitPoints_attr.maxHp;
    },
    listeners: {
      'attacked': function(evtData) {
        console.log('HitPoints attacked');

        this.takeHits(evtData.attackPower);
        this.raiseEntityEvent('damagedBy',{damager:evtData.attacker,damageAmount:evtData.attackPower});
        evtData.attacker.raiseEntityEvent('dealtDamage',{damagee:this,damageAmount:evtData.attackPower});
        if (this.getCurHp() <= 0) {
          this.raiseEntityEvent('killed',{entKilled: this, killedBy: evtData.attacker});
          evtData.attacker.raiseEntityEvent('madeKill',{entKilled: this, killedBy: evtData.attacker});
        }
      },
      'killed': function(evtData) {
        //console.log('HitPoints killed');
        this.destroy();
        this.raiseEntityEvent('entityDestroyed');
        console.log("entity destroyed");
        console.dir(this);
      }
    }
  },

  // getters
  getMaxHp: function() {
    return this.attr._HitPoints_attr.maxHp;
  },
  setMaxHp: function(n) {
    this.attr._HitPoints_attr.maxHp = n;
  },
  getCurHp: function() {
    return this.attr._HitPoints_attr.curHp;
  },
  setCurHp: function(n) {
    this.attr._HitPoints_attr.curHp = n;
  },
  takeHits: function(amt) {
    this.attr._HitPoints_attr.curHp -= amt;
  },
  recoverHits: function(amt) {
    this.attr._HitPoints_attr.curHp = Math.min(this.attr._HitPoints_attr.curHp+amt, this.attr._HitPoints_attr.maxHp);
  }
};

Game.EntityMixin.Destructable = {
  META: {
    mixinName: 'Destructable',
    mixinGroup: 'Destructable',
  },
  takeDamage: function(amt) {
    this.takeHits(amt);
  }

};

Game.EntityMixin.MeleeAttacker = {
  META: {
    mixinName: 'MeleeAttacker',
    mixinGroup: 'Attacker',
    stateNamespace: '_MeleeAttacker_attr',
    stateModel:  {
      attackPower: 1
    },
    init: function (template) {
      this.attr._MeleeAttacker_attr.attackPower = template.attackPower || 1;
    },
    listeners: {
      'bumpEntity': function(evtData) {
        console.log('MeleeAttacker bumpEntity');
        evtData.recipient.raiseEntityEvent('attacked',{attacker:evtData.actor,attackPower:this.getAttackPower()});
      }
    }
  },
  getAttackPower: function () {
    return this.attr._MeleeAttacker_attr.attackPower;
  }
};

/* Not sure how this will work right now
Game.EntityMixin.Friendly = {
  META: {
    mixinName: 'Friendly',
    mixinGroup: 'Friendly',
  },
} */

Game.EntityMixin.PlayerActor = {
  META: {
    mixinName: 'PlayerActor',
    mixinGroup: 'Actor',
    stateNamespace: '_PlayerActor_attr',
    stateModel: {
      baseActionDuration: 1000,
      actingState: false,
      currentActionDuration: 1000
    },
    init: function(template) {
      Game.Scheduler.add(this, true, this.getBaseActionDuration());
    },
    listeners: {
      'actionDone': function( evtData ) {
        Game.Scheduler.setDuration(this.getCurrentActionDuration());
        this.setCurrentActionDuration(this.getBaseActionDuration());
        Game.TimeEngine.unlock();
      }
    }
  },
  getBaseActionDuration: function() {
    return this.attr._PlayerActor_attr.baseActionDuration;
  },

  setBaseActionDuration: function(n) {
    this.attr._PlayerActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function() {
    return this.attr._PlayerActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function(n) {
    this.attr._PlayerActor_attr.currentActionDuration = n;
  },
  isActing: function(state) {
    if( state !== undefined ) {
      this.attr._PlayerActor_attr.actingState = state;
    }
    return this.attr._PlayerActor_attr.actingState;
  },
  act: function() {
    if( this.isActing()) { return; } // A gate to deal with JS timing issues
    this.isActing(true);
    Game.renderAll();
    Game.TimeEngine.lock();
    this.isActing(false);
  }
};

Game.EntityMixin.PeacefulWanderActor = {
  META: {
    mixinName: 'PeacefulWanderActor',
    mixinGroup: 'Actor',
    stateNamespace: '_PeacefulWanderActor_attr',
    stateModel:  {
      baseActionDuration: 1000,
      currentActionDuration: 1000
    },
    init: function (template) {
      Game.Scheduler.add(this,true, this.getBaseActionDuration());
    },
    listeners: {
      'entityDestroyed': function(evt) {
        Game.Scheduler.remove(this);
      }
    }
  },
  getBaseActionDuration: function () {
    return this.attr._PeacefulWanderActor_attr.baseActionDuration;
  },
  setBaseActionDuration: function (n) {
    this.attr._PeacefulWanderActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function () {
    return this.attr._PeacefulWanderActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function (n) {
    this.attr._PeacefulWanderActor_attr.currentActionDuration = n;
  },
  getMoveDeltas: function () {
    return Game.util.positionsAdjacentTo({x:0,y:0}).random();
  },
  act: function () {
    console.log('wander for '+this.getName());
    var moveDeltas = this.getMoveDeltas();
    if( this.hasMixin('Walker')) {
      this.tryWalk(this.getMap(), moveDeltas.x, moveDeltas.y);
    }
    Game.Scheduler.setDuration(this.getCurrentActionDuration());
    this.setCurrentActionDuration(this.getBaseActionDuration());
    this.raiseEntityEvent('actionDone');
  }
};

Game.EntityMixin.AvatarFollower = {
  META: {
    mixinName: 'AvatarFollower',
    mixinGroup: 'Follower',
  },
  followAvatar: function() {

  }

}
