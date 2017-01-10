Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = "#fff";
Game.UIMode.DEFAULT_COLOR_BG = "#000";
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

Game.UIMode.gameStart = {
  enter: function() {
    console.log("entered gameStart");
    Game.Message.send("welcome to WSRL");
  },
  exit: function() {
    console.log("exited gameStart");
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
  },
  exit: function() {
    console.log("exited gamePersistence");
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
    if (inputChar == 83 || inputChar == 115) {
      this.saveGame();
    } else if (inputChar == 76 || inputChar == 108) {
      this.loadGame();
    } else if (inputChar == 78 || inputChar == 110) {
      this.newGame();
    }
  },

  saveGame: function(json_state_data) {
    if (this.localStorageAvailable()) {
      window.localStorage.setItem(Game._PERSISTENCE_NAMESPACE, JSON.stringify(Game._game));
    }

    Game.switchUIMode(Game.UIMode.gamePlay);
  },

  loadGame: function() {
    if (this.localStorageAvailable()) {
      var json_state_data = window.localStorage.getItem(Game._PERSISTENCE_NAMESPACE);
      var state_data = JSON.parse(json_state_data);
    }

    Game.setRandomSeed(state_data._randomSeed);
    Game.UIMode.gamePlay.setupPlay(state_data);
    Game.switchUIMode(Game.UIMode.gamePlay);
  },

  newGame: function() {
    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupPlay();
    console.log( "Check: " + Game.EntityTemplates );
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
  }
};


Game.UIMode.gamePlay = {
  attr: {
    _map: null,
    _mapWidth: 300,
    _mapHeight: 200,
    _cameraX: 100,
    _cameraY: 100,
    _avatarX: 100,
    _avatarY: 100,
    _avatar: null
  },
  JSON_KEY: 'UIMode_gamePlay',
  enter: function() {
    console.log("entered gamePlay");

    Game.Message.clear();
  },
  exit: function() {
    console.log("exited gamePlay");
  },
  render: function (display) {
    console.log("rendered gamePlay");
    this.attr._map.renderOn(display, this.attr._cameraX, this.attr._cameraY);
    this.renderAvatar(display);
    // display.drawText(5,5,"[enter] to win, [esc] to lose.");
    // display.drawText(5,7,"[=] to save, load, or start over");

  },
  handleInput: function (inputType, inputData) {
    var pressedKey = String.fromCharCode(inputData.charCode);

    console.log("input for gamePlay");
    Game.Message.send("you pressed the '" + String.fromCharCode(inputData.charCode)+ "' key");
    if (inputType == 'keypress') {
      if (inputData.key == "Enter") {
        Game.switchUIMode(Game.UIMode.gameWin);
        return;
      } else if (inputData.key == "=") {
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

  renderAvatar: function(display) {
    Game.Symbol.AVATAR.draw(display, this.attr._avatar.getX() - this.attr._cameraX + display._options.width/2,
                                      this.attr._avatar.getY() - this.attr._cameraY + display._options.height/2);
  },

  renderAvatarInfo: function(display) {
    var fg = Game.UIMode.DEFAULT_COLOR_FG;
    var bg = Game.UIMode.DEFAULT_COLOR_BG;
    display.drawText(1,2,"avatar x: "+this.attr._avatar.getX(),fg,bg); // DEV
    display.drawText(1,3,"avatar y: "+this.attr._avatar.getY(),fg,bg); // DEV
  },

  moveAvatar: function(dx, dy) {
    // if (this.attr._map.getTile(Math.min(Math.max(0, this.attr._avatar.getX() + dx), this.attr._mapWidth),
    //                           Math.min(Math.max(0, this.attr._avatar.getY() + dy), this.attr._mapHeight)).isWalkable()) {
    //   this.attr._avatar.setX(Math.min(Math.max(0, this.attr._avatar.getX() + dx), this.attr._mapWidth));
    //   this.attr._avatar.setY(Math.min(Math.max(0, this.attr._avatar.getY() + dy), this.attr._mapHeight));
    //   this.setCameraToAvatar();
    // }
    console.log( this.attr._avatar );
    if (this.attr._avatar.tryWalk(this.attr._map, dx, dy)) {
      this.setCameraToAvatar();
    }

  },

  moveCamera: function(dx, dy) {
    this.setCamera(this.attr._cameraX + dx,this.attr._cameraY + dy);
  },

  setCamera: function(sx, sy) {
    this.attr._cameraX = Math.min(Math.max(0, sx), this.attr._mapWidth);
    this.attr._cameraY = Math.min(Math.max(0, sy), this.attr._mapHeight);
    Game.renderAll();
  },

  setCameraToAvatar: function() {
    this.setCamera(this.attr._avatar.getX(), this.attr._avatar.getY());
  },

  setupPlay: function(restorationData) {
    var mapTiles = Game.util.init2DArray(this.attr._mapWidth, this.attr._mapHeight, Game.Tile.nullTile);
    var generator = new ROT.Map.Cellular(this.attr._mapWidth, this.attr._mapHeight);
    generator.randomize(0.5);

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
    this.attr._map = new Game.Map(mapTiles);

    this.attr._avatar = new Game.Entity(Game.EntityTemplates.Avatar);
    this.attr._avatar.setPos(100,100);


    // restore anything else if the data is available
    if (restorationData !== undefined && restorationData.hasOwnProperty(Game.UIMode.gamePlay.JSON_KEY)) {
      this.fromJSON(restorationData[Game.UIMode.gamePlay.JSON_KEY]);
    }

    this.setCameraToAvatar();
  },

  toJSON: function() {
    var json = {};
    for (var at in this.attr) {
      if (this.attr.hasOwnProperty(at)) {
        if (this.attr[at] instanceof Object && 'toJSON' in this.attr[at]) {
          json[at] = this.attr[at].toJSON();
        } else {
          json[at] = this.attr[at];
        }
      }
    }
    return json;
  },
  fromJSON: function (json) {
    for (var at in this.attr) {
      if (this.attr.hasOwnProperty(at)) {
        if (this.attr[at] instanceof Object && 'fromJSON' in this.attr[at]) {
          this.attr[at].fromJSON(json[at]);
        } else {
          this.attr[at] = json[at];
        }
      }
    }
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
