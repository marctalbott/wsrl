Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = "#fff";
Game.UIMode.DEFAULT_COLOR_BG = "#000";
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

Game.UIMode.gameStart = {
  enter: function() {
    console.log("entered gameStart");
    Game.Message.send("welcome to WSRL");
    Game.renderAll();
  },
  exit: function() {
    console.log("exited gameStart");
    Game.renderAll();
  },
  render: function (display) {
    console.log("rendered gameStart");
    display.drawText(5,5,"game start mode");
    display.drawText(5,7,"press any key to start");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gameStart");
    console.dir(inputType);
    console.dir(inputData);
    if (inputData.charCode !== 0) {
      Game.switchUIMode(Game.UIMode.gamePersistence);
    }
  }
};

Game.UIMode.gamePersistence = {
  RANDOM_SEED_KEY: 'gameRandomSeed',

  enter: function() {
    console.log("entered gamePersistence");
    Game.Message.ageMessages();
    Game.Message.send("save, restore, or new game");
    Game.renderAll();
  },
  exit: function() {
    console.log("exited gamePersistence");
    Game.renderAll();
    // Game.Message.clear();
  },
  render: function (display) {
    console.log("rendered gamePersistence");
    display.drawText(5,5,"s to save, l to load, n for a new game");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gamePersistence");
    var actionBinding = Game.KeyBinding.getInputBinding(inputType, inputData);
    console.log(actionBinding);

    if (!actionBinding) {
      return false;
    }

    if (actionBinding.actionKey == 'PERSISTENCE_SAVE') {
      this.saveGame();
      // L
    } else if (actionBinding.actionKey == 'PERSISTENCE_LOAD') {
      this.restoreGame();
      // N
    } else if (actionBinding.actionKey == 'PERSISTENCE_NEW') {
      console.log( "NEW GAME");
      this.newGame();
    } else if (actionBinding.actionKey == 'CANCEL') {
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  },

  saveGame: function(json_state_data) {
    if (this.localStorageAvailable()) {
      // console.log(JSON.stringify(Game._game));
      console.log( "Save data:");
      console.dir( Game.DATASTORE);

      Game.DATASTORE.SCHEDULE = {};
      Game.DATASTORE.SCHEDULE[Game.Scheduler._current.getId()] = 1;
      for (var i = 0; i < Game.Scheduler._queue._eventTimes.length; i++) {
        Game.DATASTORE.SCHEDULE[Game.Scheduler._queue._events[i].getId()] = Game.Scheduler._queue._eventTimes[i] + 1;
      }

      Game.DATASTORE.SCHEDULE_TIME = Game.Scheduler._queue.getTime() - 1;
      Game.DATASTORE.GAME_PLAY = Game.UIMode.gamePlay.attr;
      Game.DATASTORE.MESSAGES = Game.Message.attr;

      window.localStorage.setItem(Game._PERSISTENCE_NAMESPACE, JSON.stringify(Game.DATASTORE));
      Game.switchUIMode(Game.UIMode.gamePlay);
    }

  },
  restoreGame: function () {
    if (this.localStorageAvailable()) {
      Game.clearDataStore();
      console.log( "after clear: ");
//      console.log( JSON.stringify(Game.DATASTORE) );
      console.dir( Game.DATASTORE.ENTITY );
      var json_state_data = window.localStorage.getItem(Game._PERSISTENCE_NAMESPACE);
//      console.log( Game._PERSISTANCE_NAMESPACE );
      var state_data = JSON.parse(json_state_data);
      Game.initializeTimingEngine();

/*      console.log('state data: ');
      console.dir(state_data);
      console.dir( JSON.parse(json_state_data));*/

      // game level stuff
      Game.setRandomSeed(state_data[this.RANDOM_SEED_KEY]);

      console.log( "state data 1: ");
      console.dir( Game.DATASTORE.ENTITY );
      // maps
      for (var mapId in state_data.MAP) {
        if (state_data.MAP.hasOwnProperty(mapId)) {
          var mapAttr = JSON.parse(state_data.MAP[mapId]);
          // console.log("restoring map "+mapId+" with attributes:");
          // console.dir(mapAttr);
          Game.DATASTORE.MAP[mapId] = new Game.Map(mapAttr._mapTileSetName);
          Game.DATASTORE.MAP[mapId].fromJSON(state_data.MAP[mapId]);
        }
      }
      console.log( "state data 2: ");
      console.dir( Game.DATASTORE );
      // entities
      for (var entityId in state_data.ENTITY) {
        if (state_data.ENTITY.hasOwnProperty(entityId)) {
          var entAttr = JSON.parse(state_data.ENTITY[entityId]);
          console.log( "endATTR: ");
          console.dir( state_data.ENTITY[entityId] );
          Game.DATASTORE.ENTITY[entityId] = Game.EntityGenerator.create(entAttr._name, entAttr._id );
          console.log( "addition: " + entityId);
          console.dir( Game.DATASTORE.ENTITY[entityId]);
          Game.DATASTORE.ENTITY[entityId].fromJSON(state_data.ENTITY[entityId]);
        }
      }

      for (var itemId in state_data.ITEM) {
        if (state_data.ITEM.hasOwnProperty(itemId)) {
          var itemAttr = JSON.parse(state_data.ITEM[itemId]);
          var newI = Game.ItemGenerator.create(itemAttr._generator_template_key,itemAttr._id);
          Game.DATASTORE.ITEM[itemId] = newI;
          Game.DATASTORE.ITEM[itemId].fromJSON(state_data.ITEM[itemId]);
        }
      }
      console.log( "state data 3: ");
      console.dir( Game.DATASTORE.ENTITY );
      // game play
      Game.UIMode.gamePlay.attr = state_data.GAME_PLAY;
      Game.Message.attr = state_data.MESSAGES;

      Game.initializeTimingEngine();
      for (var schedItemId in state_data.SCHEDULE) {
        if (state_data.SCHEDULE.hasOwnProperty(schedItemId)) {
          if (Game.DATASTORE.ENTITY.hasOwnProperty(schedItemId)) {
            Game.Scheduler.add(Game.DATASTORE.ENTITY[schedItemId], true, state_data.SCHEDULE[schedItemId]);
          }
        }
      }
      Game.Scheduler._queue._time = state_data.SCHEDULE_TIME;

      Game.switchUIMode(Game.UIMode.gamePlay);
    }

  },

  newGame: function() {
    Game.clearDataStore();
    Game.initializeTimingEngine();
    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupNewGame();
    // Game.TimeEngine.lock();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },

  localStorageAvailable: function() {
    try {
      var x = "__storage_test__";
      window.localStorage.setItem(x, x);
      window.localStorage.removeItem(x,x);
      return true;
    } catch (e) {
      Game.Message.send("sorry, there is no storage available for this browser");
      return false;
    }
  },

  BASE_toJSON: function(state_hash_name) {
    var state = this.attr;
    if (state_hash_name) {
      state = this[state_hash_name];
    }
    var json = JSON.stringify(state);
    /*for (var at in state) {
      if (state.hasOwnProperty(at)) {
        if (state[at] instanceof Object && 'toJSON' in state[at]) {
          json[at] = state[at].toJSON();
        } else {
          json[at] = state[at];
        }
      }
    }*/
    return json;
  },

  BASE_fromJSON: function(json, state_hash_name) {
    var using_state_hash = 'attr';
    if (state_hash_name) {
      using_state_hash = state_hash_name;
    }
    /*for (var at in this[using_state_hash]) {
      if (this[using_state_hash].hasOwnProperty(at)) {
        if (this[using_state_hash][at] instanceof Object && 'fromJSON' in this[using_state_hash][at]) {
          this[using_state_hash][at].fromJSON(json[at]);
        } else {
          this[using_state_hash][at] = json[at];
        }
      }
    }*/
    this[using_state_hash] = JSON.parse(json);
  }
};


Game.UIMode.gamePlay = {
  attr: {
    _mapId: '',
    _cameraX: 100,
    _cameraY: 100,
    _avatarId: ''
  },
  JSON_KEY: 'UIMode_gamePlay',
  enter: function() {
    console.log("entered gamePlay");

    // Game.Message.clear();
    Game.renderAll();
    Game.TimeEngine.unlock();
  },
  exit: function() {
    console.log("exited gamePlay");
    Game.renderAll();
    Game.TimeEngine.lock();
  },
  getMap: function() {
    return Game.DATASTORE.MAP[this.attr._mapId];
  },
  setMap: function(m) {
    this.attr._mapId = m.getId();
  },
  getAvatar: function() {
    return Game.DATASTORE.ENTITY[this.attr._avatarId];
  },
  setAvatar: function(a) {
    this.attr._avatarId = a.getId();
  },
  render: function (display) {
    console.log("rendered gamePlay");

    // console.log(this.attr._cameraX);
    // console.dir(this.getAvatar());



    var seenCells = this.getAvatar().getVisibleCells();
    this.getMap().renderOn(display, this.attr._cameraX, this.attr._cameraY, {
      visibleCells: seenCells,
      maskedCells: this.getAvatar().getRememberedCoordsForMap()
    });
    this.getAvatar().rememberCoords(seenCells);

    // this.getMap().renderOn(display, this.attr._cameraX, this.attr._cameraY, false, true, true);
    // this.getMap().rememberCoords(this.getMap().renderFovOn(display, this.attr._cameraX, this.attr._cameraY, this.getAvatar().getSightRadius()));

//     for( var cell in seenCells ) {
//       if( cell == 'byDistance') continue;
// //      console.dir( cell );
//       var mapCellTile = cell.split(',');
// //      console.log(mapCellTile);

//       // var screenTileX = parseInt(mapCellTile[0]) + this.attr._cameraX - Math.round(display._options.width/2);;
//       // var screenTileY = parseInt(mapCellTile[1]) + this.attr._cameraY - Math.round(display._options.height/2);;

//       var screenTileX = this.attr._cameraX - parseInt(mapCellTile[0]) + Math.round(display._options.width/2);
//       var screenTileY = this.attr._cameraY - parseInt(mapCellTile[1]) + Math.round(display._options.height/2);

//       //var fullTile = screenTileX+','+screenTileY;
//       var fullTile = this.getMap().getTile(mapCellTile[0], mapCellTile[1]);
//       fullTile.draw(display, screenTileX, screenTileY, '#ff0000', '#00ff00');
//      console.log( this.getMap().getWidth());
/*      console.dir( fullTile );
      console.log( "display cell");
      console.dir( display._data[fullTile] );*/
      //display._data[fullTile][3] = "ff0000";



//    this.getMap().renderOn(display, this.attr._cameraX, this.attr._cameraY);
    /*this.renderAvatar(display);*/
    // display.drawText(5,5,"[enter] to win, [esc] to lose.");
    // display.drawText(5,7,"[=] to save, load, or start over");

  },
  handleInput: function (inputType, inputData) {
    var actionBinding = Game.KeyBinding.getInputBinding(inputType, inputData);

    //var pressedKey = String.fromCharCode(inputData.charCode);
    var tookTurn = false;
    if (!actionBinding) {
      return false;
    }

    console.log("input for gamePlay");
    // if (inputType == 'keypress') {
    // Game.Message.send("you pressed the '" + String.fromCharCode(inputData.charCode) + "' key");
    if (actionBinding.actionKey == 'WIN') {
      Game.switchUIMode(Game.UIMode.gameWin);
      return;
    } else if (actionBinding.actionKey == 'PERSISTENCE') {
      Game.switchUIMode(Game.UIMode.gamePersistence);
    } else if (actionBinding.actionKey == 'MOVE_DL') {
      tookTurn = this.moveAvatar(-1,1);
    } else if (actionBinding.actionKey == 'MOVE_D') {
      tookTurn = this.moveAvatar(0,1);
    } else if (actionBinding.actionKey == 'MOVE_DR') {
      tookTurn = this.moveAvatar(1,1);
    } else if (actionBinding.actionKey == 'MOVE_L') {
      tookTurn = this.moveAvatar(-1,0);
    } else if (actionBinding.actionKey == 'MOVE_R') {
      tookTurn = this.moveAvatar(1,0);
    } else if (actionBinding.actionKey == 'MOVE_UL') {
      tookTurn = this.moveAvatar(-1,-1);
    } else if (actionBinding.actionKey == 'MOVE_U') {
      tookTurn = this.moveAvatar(0,-1);
    } else if (actionBinding.actionKey == 'MOVE_UR') {
      tookTurn = this.moveAvatar(1,-1);
    } else if (actionBinding.actionKey == 'CANCEL') {
      Game.switchUIMode(Game.UIMode.gameLose);
    } else if (actionBinding.actionKey == 'MOVE_WAIT') {
      tookTurn = true;
    }

    //Game.Message.ageMessages();
//    } else if (inputType == 'keydown') {
    if( tookTurn ) {
      this.getAvatar().raiseSymbolActiveEvent('actionDone');
      Game.Message.ageMessages();
      return true;
    }


  },

  /*renderAvatar: function(display) {
    Game.Symbol.AVATAR.draw(display, this.getAvatar().getX() - this.attr._cameraX + display._options.width/2,
                                      this.getAvatar()Ytar.getY() - this.attr._cameraY + display._options.height/2);
  },*/

  renderAvatarInfo: function(display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
/*    console.log( "avatar:");
    console.dir( this.getAvatar() );*/
    display.drawText(1,2,"avatar x: "+this.getAvatar().getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.getAvatar().getY(),fg,bg); // DEV
    display.drawText(1,4,"turns taken: "+this.getAvatar().getTurns(),fg,bg);
    display.drawText(1,5,"hp: "+this.getAvatar().getCurHp(),fg,bg);
  },

  moveAvatar: function(dx, dy) {
    if (this.getAvatar().tryWalk(this.getMap(), dx, dy)) {
      this.setCameraToAvatar();
      return true;
    }
    return false;
  },

  moveCamera: function(dx, dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },

  setCamera: function(sx, sy) {
    this.attr._cameraX = Math.min(Math.max(0, sx), this.getMap().getWidth());
    this.attr._cameraY = Math.min(Math.max(0, sy), this.getMap().getHeight());
    Game.renderAll();
  },

  setCameraToAvatar: function() {
    this.setCamera(this.getAvatar().getX(), this.getAvatar().getY());
  },

  setupNewGame: function(restorationData) {
    // this.setMap(new Game.Map('caves1'));
    this.setMap(new Game.Map('desert1'));
    this.setAvatar(Game.EntityGenerator.create('avatar'));
    this.getMap().addEntity(this.getAvatar(), this.getMap().getRandomWalkableLocation());
    console.log( "avatar: ");
    console.dir( this.getAvatar().getMixins() );
    this.setCameraToAvatar();


    // restore anything else if the data is available
    if (restorationData !== undefined && restorationData.hasOwnProperty(Game.UIMode.gamePlay.JSON_KEY)) {
      // console.log(restorationData);
      this.fromJSON(restorationData[Game.UIMode.gamePlay.JSON_KEY]);
      // TODO: restore all entities
      this.getMap().updateEntityLocation(this.getAvatar());
    } else {
      var randomWalkableLocation = this.getMap().getRandomWalkableLocation();
      this.getAvatar().setPos(randomWalkableLocation['x'], randomWalkableLocation['y']);
      this.getMap().updateEntityLocation(this.getAvatar());
      // add entities to map

      var test = Game.ItemGenerator.create('folder');
      for( var ecount=0; ecount<2; ecount++ ) {
        this.getMap().addEntity(Game.EntityGenerator.create('fungus'),this.getMap().getRandomWalkableLocation());
        this.getMap().addEntity(Game.EntityGenerator.create('jerry'), this.getMap().getRandomWalkableLocation());
        this.getMap().addItem(Game.ItemGenerator.create('folder'), this.getMap().getRandomWalkableLocation());
      }
    }

    this.setCameraToAvatar();
  },

  toJSON: function() {
    return Game.UIMode.gamePersistence.BASE_toJSON.call(this);
  },
  fromJSON: function (json) {
    Game.UIMode.gamePersistence.BASE_fromJSON.call(this, json);
  }
};


Game.UIMode.gameWin = {
  enter: function() {
    console.log("entered gameWin");
  },
  exit: function() {
    console.log("exited gameWin");
  },
  render: function (display) {
    console.log("rendered gameWin");
    display.drawText(5,5,"congratulations, hope you're proud of yourself.");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gameWin");
    if (inputData.key == "r") {
      Game.switchUIMode(Game.UIMode.gameStart);
    }
  }
};

Game.UIMode.gameLose = {
  enter: function() {
    console.log("entered gameLose");
  },
  exit: function() {
    console.log("exited gameLose");
  },
  render: function (display) {
    console.log("rendered gameLose");
    display.drawText(5,5,"you're terrible.");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gameLose");
    if (inputData.key == "r") {
      Game.switchUIMode(Game.UIMode.gameStart);
    }
  }
};
