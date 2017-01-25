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

    var bindEventToScreen = function(eventType) {
      window.addEventListener(eventType, function(evt){
        Game.eventHandler(eventType, evt);
      });
    };

    //Bind Keyboard events
    bindEventToScreen('keypress');
    bindEventToScreen('keydown');

    Game.switchUIMode(Game.UIMode.gameStart);
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

    Game.KeyBinding.useKeyBinding();
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

  renderAll: function() {
    this.renderMain();
    this.renderAvatar();
    this.renderMessage();
  },

  renderMain: function() {
    this.getDisplay("main").clear();
    if(this._curUIMode) {
      this._curUIMode.render(this.getDisplay("main"));
    }
  },

  renderAvatar: function() {
    this.getDisplay("avatar").clear();
    if (this._curUIMode === null) {
      return;
    }
    if (this._curUIMode.hasOwnProperty('renderAvatarInfo')) {
      this._curUIMode.renderAvatarInfo(this.getDisplay("avatar"));
    }

  },

  renderMessage: function() {
    Game.Message.render(this.getDisplay("message"));
  },

  eventHandler: function(eventType, evt) {
    if(this._curUIMode) {
      this._curUIMode.handleInput(eventType, evt);
      // this.renderAll();
    }
  },

  switchUIMode: function(newMode) {
    // handle exit for old mode
    if(this._curUIMode) {
      this._curUIMode.exit();
    }
    // set new mode
    this._curUIMode = newMode;
    // handle enter for new mode
    console.dir( this._curUIMode );
//     if( this._curUIMode.JSON_KEY == 'UIMode_gamePlay' ) {
// //      console.
//        this._curUIMode.enter(this._curUIMode.attr._mapName);
//     } else {
      this._curUIMode.enter();
    //}
    // render new mode
    this.renderAll();
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
