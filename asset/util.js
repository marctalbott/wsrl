Game.util = {
  init2DArray: function(xdim, ydim, initVal) {
    var a = [];
    for (var x = 0; x < xdim; x++) {
      a[x] = [];
      for (var y = 0; y < ydim; y++) {
        a[x][y] = initVal;
      }
    }
    return a;
  }
};
