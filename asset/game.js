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
        height: this.display.main.h }
    );

    for (var i = 0; i < 24; i++) {
      this.display.main.o.drawText(0,i,"%c{red}helloworld");
      this.display.main.o.drawText(10,i,"%c{blue}%b{white}helloworld");
      this.display.main.o.drawText(20,i,"%c{green}helloworld");
      this.display.main.o.drawText(30,i,"%c{yellow}helloworld");
      this.display.main.o.drawText(40,i,"%c{purple}helloworld");
      this.display.main.o.drawText(50,i,"%c{cyan}helloworld");
      this.display.main.o.drawText(60,i,"%c{orange}helloworld");
      this.display.main.o.drawText(70,i,"%c{gray}helloworld");
    }
  }
};
