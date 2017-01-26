Game.Symbol = function(template) {
  template = template || {};
  if (!('attr' in this)) {
    this.attr = {};
  }
  this.attr._char = template.chr || ' ';
  this.attr._fg = template.fg || Game.UIMode.DEFAULT_COLOR_FG;
  this.attr._bg = template.bg || Game.UIMode.DEFAULT_COLOR_BG;
  this.attr._maskedFg = template.maskedFg || '#444';
  this.attr._maskedBg = template.maskedBg || '#000';
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

Game.Symbol.prototype.draw = function(display, dispX, dispY, isMasked) {
  // var foreg = foreground || this.attr._fg;
  // var backg = background || this.attr._bg;
  // display.draw(dispX, dispY, this.attr._char, foreg, backg );
  // console.log("drawing");
  if (isMasked) {
    display.draw(dispX, dispY, this.attr._char, this.attr._maskedFg, this.attr._maskedBg);
  } else {
    display.draw(dispX, dispY, this.attr._char, this.attr._fg, this.attr._bg);
  }
};

Game.Symbol.prototype.getColorDesignator = function(){
  return '%c{'+this.attr._fg+'}%b{'+this.attr._bg+'}';
};

Game.Symbol.prototype.getRepresentation = function() {
  return '%c{' + this.attr._fg + '}%b{' + this.attr._bg + '}' + this.attr._char;
};


Game.Symbol.NULL_SYMBOL = new Game.Symbol();
Game.Symbol.AVATAR = new Game.Symbol({chr: '@', fg:'#dda'});
Game.Symbol.FUNGUS = new Game.Symbol({chr: 'f', fg: '#228b22'});
Game.Symbol.ITEM_PILE = new Game.Symbol( { chr: '&', fg: '#dcc'});
