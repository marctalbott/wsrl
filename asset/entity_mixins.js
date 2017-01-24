Game.EntityMixin = {};

Game.EntityMixin.WalkerCorporeal = {
  META: {
    mixinName: 'WalkerCorporeal',
    mixinGroup: 'Walker',
    listeners: {
      'adjacentMove': function( evt ) {
        var map = this.getMap();
        var dx = evt.dx, dy = evt.dy;

        var targetX = this.getX() + dx;
        var targetY = this.getY() + dy;
        if((targetX < 0 || targetX >= map.getWidth() || targetY < 0 || targetY >= map.getHeight())) {
          return {madeAdjacentMove: false};
        }

        if( map.getEntity(targetX, targetY)) { // cant walk into spaces occupied by other entities
          this.raiseSymbolActiveEvent('bumpEntity', {actor: this, recipient: map.getEntity(targetX, targetY)});
          return {madeAdjacentMove: true};
        }
        var targetTile = map.getTile(targetX, targetY);
        if( targetTile.isWalkable()) {
          this.setPos(targetX, targetY);
          var myMap = this.getMap();
          if( myMap ) {
            myMap.updateEntityLocation(this);
          }
          return {madeAdjacentMove: true};
        }
        return {madeAdjacentMove: false};
      }
    }
  },

  tryWalk: function (map, dx, dy) {
    var targetX = Math.min(Math.max(0,this.getX() + dx),map.getWidth());
    var targetY = Math.min(Math.max(0,this.getY() + dy),map.getHeight());
    if(map.getEntity(targetX,targetY)){
      this.raiseSymbolActiveEvent('bumpEntity', {actor:this, recipient:map.getEntity(targetX, targetY)});
      this.raiseSymbolActiveEvent('tookTurn');
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

      this.raiseSymbolActiveEvent('tookTurn');
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
        this.raiseSymbolActiveEvent('damagedBy',{damager:evtData.attacker,damageAmount:evtData.attackPower});
        evtData.attacker.raiseSymbolActiveEvent('dealtDamage',{damagee:this,damageAmount:evtData.attackPower});
        // Game.Message.send(this.getName() + " hit for " + evtData.attackPower + " damage!");
        if (this.getCurHp() <= 0) {
          this.raiseSymbolActiveEvent('killed',{entKilled: this, killedBy: evtData.attacker});
          evtData.attacker.raiseSymbolActiveEvent('madeKill',{entKilled: this, killedBy: evtData.attacker});
        }
      },
      'killed': function(evtData) {
        //console.log('HitPoints killed');
        Game.Message.send(this.getName() + " killed!");
        this.destroy();
        this.raiseSymbolActiveEvent('entityDestroyed');
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
        Game.Message.send(evtData.recipient.getName() + " hit for " + this.getAttackPower() + " damage!");
        Game.Message.ageMessages();
        evtData.recipient.raiseSymbolActiveEvent('attacked',{attacker:evtData.actor,attackPower:this.getAttackPower()});
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
        // Game.TimeEngine.lock();
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
  },

 };

Game.EntityMixin.Sight = {
  META: {
    mixinName: 'Sight',
    mixinGroup: 'Sense',
    stateNamespace: '_Sight_attr',
    stateModel:  {
      sightRadius: 3
    },
    init: function (template) {
      this.attr._Sight_attr.sightRadius = template.sightRadius || 3;
    },
    listeners: {
      'senseForEntity': function(evt) {
       return {entitySensed: this.canSeeEntity(evt.senseForEntity)};
      }
    }
  },
  getSightRadius: function () {
    return this.attr._Sight_attr.sightRadius;
  },
  setSightRadius: function (n) {
    this.attr._Sight_attr.sightRadius = n;
  },

  canSeeEntity: function(entity) {
      // If not on the same map or on different maps, then exit early
      if (!entity || this.getMapId() !== entity.getMapId()) {
          return false;
      }
      return this.canSeeCoord(entity.getX(),entity.getY());
  },
  canSeeCoord: function(x_or_pos,y) {
    var otherX = x_or_pos,otherY=y;

    if (typeof x_or_pos == 'object') {
      otherX = x_or_pos.x;
      otherY = x_or_pos.y;
    }

    // If we're not within the sight radius, then we won't be in a real field of view either.
    if (Math.max(Math.abs(otherX - this.getX()),Math.abs(otherY - this.getY())) > this.attr._Sight_attr.sightRadius) {
      return false;
    }

    var inFov = this.getVisibleCells();
    return inFov[otherX+','+otherY] || false;
  },
  getVisibleCells: function() {
      var visibleCells = {'byDistance':{}};
      for (var i=0;i<=this.getSightRadius();i++) {
          visibleCells.byDistance[i] = {};
      }
      // console.log("this");
      // console.dir( this );
      // console.dir(this.getSightRadius());
      this.getMap().getFov().compute(
          this.getX(), this.getY(),
          this.getSightRadius(),
          function(x, y, radius, visibility) {
            // console.log( "radius:");
            // console.log( radius );
              visibleCells[x+','+y] = true;
              visibleCells.byDistance[radius][x+','+y] = true;
          }
      );
      return visibleCells;
  },
  canSeeCoord_delta: function(dx,dy) {
      return this.canSeeCoord(this.getX()+dx,this.getY()+dy);
  }
};

Game.EntityMixin.MapMemory = {
  META: {
    mixinName: 'MapMemory',
    mixinGroup: 'MapMemory',
    stateNamespace: '_MapMemory_attr',
    stateModel:  {
      mapsHash: {}
    },
    init: function (template) {
      this.attr._MapMemory_attr.mapsHash = template.mapsHash || {};
    }
  },
  rememberCoords: function (coordSet,mapId) {
    var mapKey=mapId || this.getMapId();
    if (! this.attr._MapMemory_attr.mapsHash[mapKey]) {
      this.attr._MapMemory_attr.mapsHash[mapKey] = {};
    }
    for (var coord in coordSet) {
      if (coordSet.hasOwnProperty(coord) && (coord != 'byDistance')) {
        this.attr._MapMemory_attr.mapsHash[mapKey][coord] = true;
      }
    }
  },
  getRememberedCoordsForMap: function (mapId) {
    var mapKey=mapId || this.getMapId();
    return this.attr._MapMemory_attr.mapsHash[mapKey] || {};
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
//    console.log('wander for '+this.getName());
    var moveDeltas = this.getMoveDeltas();
    if( this.hasMixin('Walker')) {
      //console.log (this.getMap());
      this.tryWalk(this.getMap(), moveDeltas.x, moveDeltas.y);
    }
    Game.Scheduler.setDuration(this.getCurrentActionDuration());
    this.setCurrentActionDuration(this.getBaseActionDuration());
    this.raiseSymbolActiveEvent('actionDone');
  }
};

Game.EntityMixin.EnemyWanderActor = {
  META: {
    mixinName: 'EnemyWanderActor',
    mixinGroup: 'Actor',
    stateNamespace: '_EnemyWanderActor_attr',
    stateModel: {
      baseActionDuration: 1000,
      currentActionDuration: 1000
    },
    init: function(template) {
      Game.Scheduler.add( this, true, this.getBaseActionDuration() );
      this.attr._EnemyWanderActor_attr.baseActionDuration = template.EnemyWanderActionDuration || 1000;
      this.attr._EnemyWanderActor_attr.currentActionDuration = this.attr._EnemyWanderActor_attr.baseActionDuration;
    },
    listeners: {
      'entityDestroyed': function(evt) {
        Game.Scheduler.remove(this);
      }
    }
    // },
    // listeners: {
    //   'adjacentMove': function( evt )
    // }
  },
  getBaseActionDuration: function () {
    return this.attr._EnemyWanderActor_attr.baseActionDuration;
  },
  setBaseActionDuration: function (n) {
    this.attr._EnemyWanderActor_attr.baseActionDuration = n;
  },
  getCurrentActionDuration: function () {
    return this.attr._EnemyWanderActor_attr.currentActionDuration;
  },
  setCurrentActionDuration: function (n) {
    this.attr._EnemyWanderActor_attr.currentActionDuration = n;
  },
  getMoveDeltas: function() {
    var avatar = Game.UIMode.gamePlay.getAvatar();
    var senseResp = this.raiseSymbolActiveEvent('senseForEntity', {senseForEntity:avatar});
    if( Game.util.compactBooleanArray_or(senseResp.entitySensed)) {

      // Build path instance for avatar
      var source = this;
      var map = this.getMap();
      var path = new ROT.Path.AStar(avatar.getX(), avatar.getY(), function(x, y) {
        // If entity is present at tile, can't move there.
        var entity = map.getEntity(x, y);
        if( entity && entity !== avatar && entity !== source ) {
          return false;
        }
        return map.getTile(x, y).isWalkable();
      },{ topology: 8});

      // Compute path from here to there
      var count = 0;
      var moveDeltas = {x:0,y:0};
      path.compute(this.getX(), this.getY(), function(x, y) {
        if( count == 1 ) {
          moveDeltas.x = x - source.getX();
          moveDeltas.y = y - source.getY();
        }
        count++;
      });

      return moveDeltas;
    }
    return Game.util.positionsAdjacentTo({x:0, y:0}).random();
  },
  act: function() {
    Game.TimeEngine.lock();
    var moveDeltas = this.getMoveDeltas();
    this.raiseSymbolActiveEvent('adjacentMove', {dx: moveDeltas.x, dy: moveDeltas.y});
    Game.Scheduler.setDuration(this.getCurrentActionDuration());
    this.setCurrentActionDuration(this.setCurrentActionDuration(this.getBaseActionDuration()+Game.util.randomInt(-10,10)));
    Game.TimeEngine.unlock();
  }
  // listeners: {
  //   'entityDestroyed': function(evt) {
  //     Game.Scheduler.remove( this );
  //   },
  //   'avatarNearby': function(evt) {
  //     if( this.canSeeEntity( this.getMap().getAvatar() ) ) {
  //       this.attackAvatar()
  //     }
  //   }
  // }

}



Game.EntityMixin.AvatarFollower = {
  META: {
    mixinName: 'AvatarFollower',
    mixinGroup: 'Follower',
  },
  followAvatar: function() {

  }

}
