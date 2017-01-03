console.log("game.js has been loaded");

window.onload = function() {
  console.log("starting WSRL - window loaded");
  // Check if rot.js is supported
  if(!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
  } else {
    // Initialize the game
    Game.init();
    document.getElementById('wsrl-main-display').appendChild(Game.display.main.o.getContainer()); // puts display object in html
  }
};

// Hash
var Game = {
  display: {
    SPACING: 1.1,
    main: {
      w: 80,
      h: 24,
      o: null
    }
  },
  // key init, value function <-- dope!
  init: function() {
    console.log("game init");
    this.display.main.o = new ROT.Display(
      { width: this.display.main.w,
        height: this.display.main.h,
        spacing: Game.display.SPACING}
    );
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
    d.setOptions({bg: "#0a0"});
    for (var i = 0; i < 24; i++) {
      d.drawText(0,i,"%c{red}helloworld");
      d.drawText(10,i,"%c{blue}%b{white}helloworld");
      d.drawText(20,i,"%c{green}helloworld");
      d.drawText(30,i,"%c{yellow}helloworld");
      d.drawText(40,i,"%c{purple}helloworld");
      d.drawText(50,i,"%c{cyan}helloworld");
      d.drawText(60,i,"%c{orange}helloworld");
      d.drawText(70,i,"%c{gray}helloworld");
    }
  }
};
