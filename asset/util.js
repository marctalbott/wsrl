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
  }
};

Game.util.randomString( )
