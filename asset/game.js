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

  }
};

// Hash
var Game = {

  _DISPLAY_SPACING: 1.1,
  display: {
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
  // key init, value function <-- dope!
  init: function() {
    console.log("game init");
    for (var display_key in this.display) {
      this.display[display_key].o = new ROT.Display(
        { width: this.display[display_key].w,
          height: this.display[display_key].h,
          spacing: Game._DISPLAY_SPACING }
      );
    }

    console.dir(this.display);

    this.renderMain();
  },

  getDisplay: function(displayId) {
    if (this.display.hasOwnProperty(displayId)) {
      return this.display[displayId].o;
    }
    return null;
  },

  renderMain: function() {
    var d = this.display.main.o;
    for (var i = 0; i < 24; i++) {
      d.drawText(0,i,"%c{red}mapdisplay");
      d.drawText(10,i,"%c{blue}%b{white}mapdisplay");
      d.drawText(20,i,"%c{green}mapdisplay");
      d.drawText(30,i,"%c{yellow}mapdisplay");
      d.drawText(40,i,"%c{purple}mapdisplay");
      d.drawText(50,i,"%c{cyan}mapdisplay");
      d.drawText(60,i,"%c{orange}mapdisplay");
      d.drawText(70,i,"%c{gray}mapdisplay");
    }
    var a = this.display.avatar.o;
    for (var i = 0; i < 24; i++) {
      a.drawText(0,i,"%c{gray}youravatar");
      a.drawText(10,i,"%c{pink}%b{white}youravatar");
    }
    var m = this.display.message.o;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 100; j+= 8) {
        m.drawText(j,i, "messages");
      }
    }
  }
};
