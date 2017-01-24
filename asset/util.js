Game.util = {

  randomString: function( len ) {
    var charSource = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    var res = '';
    for( var i=0; i<len; i++ ) {
      res += charSource.random();
    }

    return res;
  },

  init2DArray: function(xdim, ydim, initVal) {
    var a = [];
    for (var x = 0; x < xdim; x++) {
      a[x] = [];
      for (var y = 0; y < ydim; y++) {
        a[x][y] = initVal;
      }
    }
    return a;
  },

  randomInt: function(min, max) {
    var range = max - min;
    var offset = Math.floor(ROT.RNG.getUniform()*(range+1));
    return offset+min;
  },

  ID_SEQUENCE: 0,

  uniqueId: function () {
    Game.util.ID_SEQUENCE++;
    return Date.now() + '-' + Game.util.ID_SEQUENCE + '-' + Game.util.randomString(24);
  },

  positionsAdjacentTo: function (pos) {
    var adjPos = [];
    for (var dx = -1; dx <= 1; dx++) {
      for (var dy = -1; dy <= 1; dy++) {
        if (dx !== 0 && dy !== 0) {
           adjPos.push({x:pos.x+dx,y:pos.y+dy});
          }
        }
      }
    return adjPos;
  },
  compactBooleanArray_or: function(ar) {
    if( !ar ) { return false; }
    var ret = false;
    for( var i=0; i<ar.length; i++ ) {
      ret = ret || ar[i];
    }
    return ret;
  }
};
