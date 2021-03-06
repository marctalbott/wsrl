console.log("game.js has been loaded");

window.onload = function() {
  console.log("starting WSRL - window loaded");
  // Check if rot.js is supported
  if(!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
  } else {
    // Initialize the game

    Game.init();

    // add containers to html
    document.getElementById('wsrl-avatar-display').appendChild(Game.getDisplay('avatar').getContainer());
    document.getElementById('wsrl-main-display').appendChild(Game.getDisplay('main').getContainer());
    document.getElementById('wsrl-message-display').appendChild(Game.getDisplay('message').getContainer());


    Game.switchUIMode('gameStart');
    // console.log(this);
    var bindEventToUIMode = function(eventType) {
      window.addEventListener(eventType, function(evt){
        if (Game.getCurUIMode() !== null) {
          Game.getCurUIMode().handleInput(event, evt);
        }
      });
    };

    //Bind Keyboard events
    bindEventToUIMode('keypress');
    bindEventToUIMode('keydown');
  }
};

// Hash
var Game = {
  _PERSISTENCE_NAMESPACE: "wsrlgame",

  _DISPLAY_SPACING: 1.1,
  _display: {
    main: {
      w: 80,
      h: 24,
      o: null
    },
    message: {
      w: 100,
      h: 8,
      o: null
    },
    avatar: {
      w: 20,
      h: 24,
      o: null
    }
  },

  _game: null,
  _curUIMode: null,
  _randomSeed: 0,
  _uiModeNameStack: [],

  DATASTORE: {},

  Scheduler: null,
  TimeEngine: null,

  init: function() {
    this._game = this;
    console.log("game init");

    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));

    // Game.Scheduler = new ROT.Scheduler.Action();
    // Game.TimeEngine = new ROT.Engine(Game.Scheduler);
    Game.initializeTimingEngine();
    Game.TimeEngine.start();
    Game.TimeEngine.lock();

    for (var display_key in this._display) {
      this._display[display_key].o = new ROT.Display(
        { width: this._display[display_key].w,
          height: this._display[display_key].h,
          spacing: Game._DISPLAY_SPACING }
      );
    }
    // console.dir(this.display);

    this.renderAll();


    Game.KeyBinding.setKeyBinding();
  },

  initializeTimingEngine: function() {
    Game.Scheduler = new ROT.Scheduler.Action();
    Game.TimeEngine = new ROT.Engine(Game.Scheduler);
  },

  getRandomSeed: function() {
    return this._randomSeed;
  },

  setRandomSeed: function(s) {
    this._randomSeed = s;
    console.log("using random seed "+this._randomSeed);
    this.DATASTORE[Game.UIMode.gamePersistence.RANDOM_SEED_KEY] = this._randomSeed;
    ROT.RNG.setSeed(this._randomSeed);
  },

  getDisplay: function(displayId) {
    if (this._display.hasOwnProperty(displayId)) {
      return this._display[displayId].o;
    }
    return null;
  },

  getDisplayHeight: function (displayId) {
    if (this._display.hasOwnProperty(displayId)) {
      return this._display[displayId].h;
    }
    return null;
  },

  renderAll: function() {
    this.renderMain();
    this.renderAvatar();
    this.renderMessage();
  },

  renderMain: function() {
    this.getDisplay("main").clear();
    if(this.getCurUIMode()) {
      this.getCurUIMode().render(this.getDisplay("main"));
    }
  },

  renderAvatar: function() {
    this.getDisplay("avatar").clear();
    if (this.getCurUIMode() === null) {
      return;
    }
    if (this.getCurUIMode().hasOwnProperty('renderAvatarInfo')) {
      this.getCurUIMode().renderAvatarInfo(this.getDisplay("avatar"));
    }

  },

  renderMessage: function() {
    Game.Message.render(this.getDisplay("message"));
  },

  eventHandler: function(eventType, evt) {
    if(this.getCurUIMode()) {
      this.getCurUIMode().handleInput(eventType, evt);
      // this.renderAll();
    }
  },
  
  // switchUIMode: function(newMode) {
  //   // handle exit for old mode
  //   if(this.getCurUIMode()) {
  //     this._curUIMode.exit();
  //   }
  //   // set new mode
  //   this._curUIMode = newMode;
  //   // handle enter for new mode
  //   this._curUIMode.enter();
  //   // render new mode
  //   this.renderAll();
  // },

  switchUIMode: function (newUIModeName) {
    var curMode = this.getCurUIMode();
    if (curMode !== null) {
      curMode.exit();
    }
    this._uiModeNameStack[0] = newUIModeName;
    var newMode = Game.UIMode[newUIModeName];
//    console.dir( Game.UIMode );
    if (newMode) {
      newMode.enter();
    }
    this.renderAll();
  },
  addUIMode: function (newUIModeName) {
    this._uiModeNameStack.unshift(newUIModeName);
    var newMode = Game.UIMode[newUIModeName];
    if (newMode) {
      newMode.enter();
    }

    this.renderAll();
  },
  removeUIMode: function () {
    var curMode = this.getCurUIMode();
    if (curMode !== null) {
      curMode.exit();
    }
    this._uiModeNameStack.shift();
    this.renderAll();
  },
  getCurUIMode: function () {
    var uiModeName = this._uiModeNameStack[0];
    if (uiModeName) {
      return Game.UIMode[uiModeName];
    }
    return null;
  },

  clearDataStore: function() {
    console.log( "Clearing datastore");
    this.DATASTORE = {};
    this.DATASTORE.ENTITY = {};
    this.DATASTORE.MAP = {};
    this.DATASTORE.GAME_PLAY = {};
    this.DATASTORE.ITEM = {};
  }


  /*toJSON: function() {
    // console.log("game toJSON");
    var json = {};
    json._randomSeed = this._randomSeed;
    json[Game.UIMode.gamePlay.JSON_KEY] = Game.UIMode.gamePlay.toJSON();
    return json;
  }*/

};
