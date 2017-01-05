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

  init: function() {
    this._game = this;
    console.log("game init");

    Game.setRandomSeed(5 + Math.floor(ROT.RNG.getUniform()*100000));

    for (var display_key in this._display) {
      this._display[display_key].o = new ROT.Display(
        { width: this._display[display_key].w,
          height: this._display[display_key].h,
          spacing: Game._DISPLAY_SPACING }
      );
    }
    // console.dir(this.display);

    this.renderAll();
  },

  getRandomSeed: function() {
    return this._randomSeed;
  },

  setRandomSeed: function(s) {
    this._randomSeed = s;
    console.log("using random seed "+this._randomSeed);
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

    // var d = this.display.main.o;
    // for (var i = 0; i < 24; i++) {
    //   d.drawText(0,i,"%c{red}mapdisplay");
    //   d.drawText(10,i,"%c{blue}%b{white}mapdisplay");
    //   d.drawText(20,i,"%c{green}mapdisplay");
    //   d.drawText(30,i,"%c{yellow}mapdisplay");
    //   d.drawText(40,i,"%c{purple}mapdisplay");
    //   d.drawText(50,i,"%c{cyan}mapdisplay");
    //   d.drawText(60,i,"%c{orange}mapdisplay");
    //   d.drawText(70,i,"%c{gray}mapdisplay");
    // }
  },

  renderAvatar: function() {
    this.getDisplay("avatar").drawText(1,1,"avatar display");
  },

  renderMessage: function() {
    Game.Message.render(this.getDisplay("message"));
  },

  eventHandler: function(eventType, evt) {
    if(this._curUIMode) {
      this._curUIMode.handleInput(eventType, evt);
      this.renderAll();
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
    this._curUIMode.enter();
    // render new mode
    this.renderAll();
  }

};
