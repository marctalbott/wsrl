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
  enter: function() {
    console.log("entered gamePersistence");
    Game.Message.send("save, restore, or new game");
    Game.renderAll();
  },
  exit: function() {
    console.log("exited gamePersistence");
    Game.renderAll();
  },
  render: function (display) {
    console.log("rendered gamePersistence");
    display.drawText(5,5,"s to save, l to load, n for a new game");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gamePersistence");

    // var inputChar = inputData.key;
    var inputChar = inputData.charCode;
    // if (inputChar == "S" || inputChar == "s") {
      // S
    if (inputChar == 83 || inputChar == 115) {
      this.saveGame();
      // L
    } else if (inputChar == 76 || inputChar == 108) {
      this.restoreGame();
      // N
    } else if (inputChar == 78 || inputChar == 110) {
      this.newGame();
    }
  },

  saveGame: function(json_state_data) {
    if (this.localStorageAvailable()) {
      console.log(JSON.stringify(Game._game));
      window.localStorage.setItem(Game._PERSISTENCE_NAMESPACE, JSON.stringify(Game._game));
    } else {
      console.log( "Not enough storage" );
    }

    Game.switchUIMode(Game.UIMode.gamePlay);
  },
  restoreGame: function () {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTANCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);

      // console.log('state data: ');
      // console.dir(state_data);

      // game level stuff
      Game.setRandomSeed(state_data[this.RANDOM_SEED_KEY]);

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

      // entities
      for (var entityId in state_data.ENTITY) {
        if (state_data.ENTITY.hasOwnProperty(entityId)) {
          var entAttr = JSON.parse(state_data.ENTITY[entityId]);
          Game.DATASTORE.ENTITY[entityId] = Game.EntityGenerator.create(entAttr._generator_template_key);
          Game.DATASTORE.ENTITY[entityId].fromJSON(state_data.ENTITY[entityId]);
        }
      }

      // game play
      Game.UIMode.gamePlay.attr = state_data.GAME_PLAY;

      Game.switchUiMode(Game.UIMode.gamePlay);
    }
  },/*
  loadGame: function() {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTENCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);
    }

    Game.setRandomSeed(state_data._randomSeed);
    Game.UIMode.gamePlay.setupPlay(state_data);
    Game.switchUIMode(Game.UIMode.gamePlay);
  },*/

  newGame: function() {
    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupNewGame();
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
    var json = {};
    for (var at in state) {
      if (state.hasOwnProperty(at)) {
        if (state[at] instanceof Object && 'toJSON' in state[at]) {
          json[at] = state[at].toJSON();
        } else {
          json[at] = state[at];
        }
      }
    }
    return json;
  },

  BASE_fromJSON: function(json, state_hash_name) {
    var using_state_hash = 'attr';
    if (state_hash_name) {
      using_state_hash = state_hash_name;
    }
    for (var at in this[using_state_hash]) {
      if (this[using_state_hash].hasOwnProperty(at)) {
        if (this[using_state_hash][at] instanceof Object && 'fromJSON' in this[using_state_hash][at]) {
          this[using_state_hash][at].fromJSON(json[at]);
        } else {
          this[using_state_hash][at] = json[at];
        }
      }
    }
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

    Game.Message.clear();
    Game.renderAll();
  },
  exit: function() {
    console.log("exited gamePlay");
    Game.renderAll();
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

    console.log(this.attr._cameraX);
    console.dir(this.getAvatar());
    this.getMap().renderOn(display, this.attr._cameraX, this.attr._cameraY);

//    this.getMap().renderOn(display, this.attr._cameraX, this.attr._cameraY);
    /*this.renderAvatar(display);*/
    // display.drawText(5,5,"[enter] to win, [esc] to lose.");
    // display.drawText(5,7,"[=] to save, load, or start over");

  },
  handleInput: function (inputType, inputData) {
    var pressedKey = String.fromCharCode(inputData.charCode);

    console.log("input for gamePlay");
    if (inputType == 'keypress') {
      Game.Message.send("you pressed the '" + String.fromCharCode(inputData.charCode) + "' key");
      if (inputData.key == "Enter") {
        Game.switchUIMode(Game.UIMode.gameWin);
        return;
      } else if (inputData.charCode == 61) {
        Game.switchUIMode(Game.UIMode.gamePersistence);
      } else if (pressedKey == 'b') {
        this.moveAvatar(-1,1);
      } else if (pressedKey == 'j') {
        this.moveAvatar(0,1);
      } else if (pressedKey == 'n') {
        this.moveAvatar(1,1);
      } else if (pressedKey == 'h') {
        this.moveAvatar(-1,0);
      } else if (pressedKey == 'l') {
        this.moveAvatar(1,0);
      } else if (pressedKey == 'y') {
        this.moveAvatar(-1,-1);
      } else if (pressedKey == 'k') {
        this.moveAvatar(0,-1);
      } else if (pressedKey == 'u') {
        this.moveAvatar(1,-1);
      }
    } else if (inputType == 'keydown') {
      if (inputData.key == "Escape") {
        Game.switchUIMode(Game.UIMode.gameLose);
      }
    }
  },

  /*renderAvatar: function(display) {
    Game.Symbol.AVATAR.draw(display, this.getAvatar().getX() - this.attr._cameraX + display._options.width/2,
                                      this.getAvatar()Ytar.getY() - this.attr._cameraY + display._options.height/2);
  },*/

  renderAvatarInfo: function(display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.getAvatar().getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.getAvatar().getY(),fg,bg); // DEV
    display.drawText(1,4,"turns taken: "+this.getAvatar().getTurns(),fg,bg);
    display.drawText(1,5,"hp: "+this.getAvatar().getCurHp(),fg,bg);
  },

  moveAvatar: function(dx, dy) {
    if (this.getAvatar().tryWalk(this.getMap(), dx, dy)) {
      this.setCameraToAvatar();
    }
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
    this.setMap(new Game.Map('caves1'));
    this.setAvatar(Game.EntityGenerator.create('avatar'));
    this.getMap().addEntity(this.getAvatar(), this.getMap().getRandomWalkableLocation());
    //this.getMap().addEntity(this.getAvatar(), this.getMap().getTile(50,50));
    this.setCameraToAvatar();

    for( var ecount=0; ecount<50; ecount++ ) {
        this.getMap().addEntity(Game.EntityGenerator.create('fungus'),this.getMap().getRandomWalkableLocation());
      }
    /*generator.randomize(0.5);

    //repeated cellular automata process
    var totalIterations = 3;
    for (var i = 0; i < totalIterations - 1; i++) {
      generator.create();
    }

    // run again then update map
    generator.create(function(x,y,v) {
      if (v === 1) {
        mapTiles[x][y] = Game.Tile.floorTile;
      } else {
        mapTiles[x][y] = Game.Tile.wallTile;
      }
    });

    // create map from the tiles
    this.getMap() = new Game.Map(mapTiles);
    this.getAvatar() = new Game.EntityGenerator.create('avatar');
    this.getAvatar().setMap(this.getMap());
/*    this.getMap().addEntityAtRandomPosition( this.getAvatar() );
//    this.getAvatar().setPos(100,100);
    for( var i=0; i<3; i++ ) {
      this.getMap().addEntityAtRandomPosition( new Game.Entity(Game.EntityTemplates.Fungus) );
    }*/

    // restore anything else if the data is available
    if (restorationData !== undefined && restorationData.hasOwnProperty(Game.UIMode.gamePlay.JSON_KEY)) {
      console.log(restorationData);
      this.fromJSON(restorationData[Game.UIMode.gamePlay.JSON_KEY]);
      // TODO: restore all entities
      this.getMap().updateEntityLocation(this.getAvatar());
    } else {
      var randomWalkableLocation = this.getMap().getRandomWalkableLocation();
      this.getAvatar().setPos(randomWalkableLocation['x'], randomWalkableLocation['y']);
      this.getMap().updateEntityLocation(this.getAvatar());
      // add entities to map
      for( var ecount=0; ecount<50; ecount++ ) {
        this.getMap().addEntity(Game.EntityGenerator.create('fungus'),this.getMap().getRandomWalkableLocation());
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
