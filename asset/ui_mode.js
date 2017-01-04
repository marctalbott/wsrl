Game.UIMode = {};
Game.UIMode.DEFAULT_COLOR_FG = "#fff";
Game.UIMode.DEFAULT_COLOR_BG = "#000";
Game.UIMode.DEFAULT_COLOR_STR = '%c{'+Game.UIMode.DEFAULT_COLOR_FG+'}%b{'+Game.UIMode.DEFAULT_COLOR_BG+'}';

Game.UIMode.gameStart = {
  enter: function() {
    console.log("entered gameStart");
    Game.Message.send("Welcome to WSRL");
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
      Game.switchUIMode(Game.UIMode.gamePlay);
    }
  }
};

Game.UIMode.gamePlay = {
  enter: function() {
    console.log("entered gamePlay");
    Game.Message.clear();
  },
  exit: function() {
    console.log("exited gamePlay");
  },
  render: function (display) {
    console.log("rendered gamePlay");

    display.drawText(5,5,"Press [Enter] to win, press [Esc] to lose.");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gamePlay");
    Game.Message.send("you pressed the '" + String.fromCharCode(inputData.charCode)+ "' key");
    if (inputType == 'keypress') {
      if (inputData.keyCode == 13) {
        Game.switchUIMode(Game.UIMode.gameWin);
      }
    } else if (inputType == 'keydown') {
      if (inputData.keyCode == 27) {
        Game.switchUIMode(Game.UIMode.gameLose);
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
    display.drawText(5,5,"Congratulations, hope you're proud of yourself.");
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
    display.drawText(5,5,"You're terrible.");
  },
  handleInput: function (inputType, inputData) {
    console.log("input for gameLose");
    if (inputData.key == "r") {
      Game.switchUIMode(Game.UIMode.gameStart);
    }
  }
};
