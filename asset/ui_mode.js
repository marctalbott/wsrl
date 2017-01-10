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
    Game.UIMode.gamePlay.setupPlay();
    Game.switchUIMode(Game.UIMode.gamePlay);
  },

  newGame: function() {
    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));
    Game.UIMode.gamePlay.setupPlay();
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
    _cameraY: 100
  },

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
        this.moveCamera(-1,1);
      } else if (pressedKey == 'j') {
        this.moveCamera(0,1);
      } else if (pressedKey == 'n') {
        this.moveCamera(1,1);
      } else if (pressedKey == 'h') {
        this.moveCamera(-1,0);
      } else if (pressedKey == 'l') {
        this.moveCamera(1,0);
      } else if (pressedKey == 'y') {
        this.moveCamera(-1,-1);
      } else if (pressedKey == 'k') {
        this.moveCamera(0,-1);
      } else if (pressedKey == 'u') {
        this.moveCamera(1,-1);
      }
      Game.renderAll();
    } else if (inputType == 'keydown') {
      if (inputData.key == "Escape") {
        Game.switchUIMode(Game.UIMode.gameLose);
      }
    }
  },

  moveCamera: function(dx, dy) {
    this.attr._cameraX = Math.min(Math.max(0, this.attr._cameraX + dx), this.attr._mapWidth);
    this.attr._cameraY = Math.min(Math.max(0, this.attr._cameraY + dy), this.attr._mapHeight);
  },

  setupPlay: function() {
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

    // // restore anything else if the data is available
    // if (restorationData !== undefined && restorationData.hasOwnProperty(Game.UIMode.gamePlay.JSON_KEY)) {
    //   this.fromJSON(restorationData[Game.UIMode.gamePlay.JSON_KEY]);
    // }
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
