Game.Symbol = function(properties) {
  properties = properties || {};
  if (!('attr' in this)) {
    this.attr = {};
  }
  this.attr._char = properties.chr || ' ';
  this.attr._fg = properties.fg || Game.UIMode.DEFAULT_COLOR_FG;
  this.attr._bg = properties.bg || Game.UIMode.DEFAULT_COLOR_BG;
  // this.attr = {
  //   _char: chr,
  //   _fg: fg||Game.UIMode.DEFAULT_COLOR_FG,
  //   _bg: bg||Game.UIMode.DEFAULT_COLOR_BG
  // };
  // same as ^^^
  // this.char = chr;
  // this.fg = fg;
  // this.bg = bg;
};

// Objects of type symbol inherit all of these prototype methods
Game.Symbol.prototype.getChar = function() {
  return this.attr._char;
};

Game.Symbol.prototype.getFg = function() {
  return this.attr._fg;
};

Game.Symbol.prototype.getBg = function() {
  return this.attr._bg;
};

Game.Symbol.prototype.draw = function(display, dispX, dispY) {
  display.draw(dispX, dispY, this.attr._char, this.attr._fg, this.attr._bg);
};

Game.Symbol.NULL_SYMBOL = new Game.Symbol();
Game.Symbol.AVATAR = new Game.Symbol({chr: '@', fg:'#dda'});
