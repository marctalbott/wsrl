Game.MapTileSets = {
  caves1: {
    _width: 30,
    _height: 20,
    _wallTile: Game.Tile.wallTile,
    _floorTile: Game.Tile.floorTile,
    _masked: true,

    getMapTiles: function () {
      var wallTile = this._wallTile;
      var floorTile = this._floorTile;
      var mapTiles = Game.util.init2DArray(this._width + 1,this._height + 1,Game.Tile.nullTile);
      var generator = new ROT.Map.Cellular(this._width,this._height, {connected: true});
      generator.randomize(0.5);

      // repeated cellular automata process
      var totalIterations = 4;
      for (var i = 0; i < totalIterations; i++) {
        generator.create();
      }

      for (var i = 0; i < this._width; i++) {
        mapTiles[i][0] = wallTile;
      }
      for (var i = 0; i < this._height; i++) {
        mapTiles[0][i] = wallTile;
      }
      // run again then update map
      generator.connect(function(x,y,v) {
        if (v === 1) {
          mapTiles[x+1][y+1] = floorTile;
        } else {
          mapTiles[x+1][y+1] = wallTile;
        }
      }, 1);

      return mapTiles;
    }
  },

  desert1: {
    _width: 50,
    _height: 50,
    _wallTile: Game.Tile.desertWallTile,
    _floorTile: Game.Tile.desertTile,
    _masked: true,
    getMapTiles: function () {
      var wallTile = this._wallTile;
      var floorTile = this._floorTile;
      console.log("gen map tiles");
      var mapTiles = Game.util.init2DArray(this._width + 1,this._height + 1,Game.Tile.nullTile);
      var generator = new ROT.Map.Cellular(this._width,this._height);
      generator.randomize(0.62);

      // repeated cellular automata process
      var totalIterations = 4;
      for (var i = 0; i < totalIterations; i++) {
        generator.create();
      }

      for (var i = 0; i < this._width; i++) {
        mapTiles[i][0] = wallTile;
      }
      for (var i = 0; i < this._height; i++) {
        mapTiles[0][i] = wallTile;
      }
      // run again then update map
      generator.connect(function(x,y,v) {
        if (v === 1) {
          mapTiles[x+1][y+1] = floorTile;
        } else {
          mapTiles[x+1][y+1] = wallTile;
        }
      }, 1);
      console.log("finish generating map");
      return mapTiles;
    }
  },


  office: {
    _width: 15,
    _height: 20,
    _wallTile: Game.Tile.wallTile,
    _floorTile: Game.Tile.floorTile,
    _masked: false,
    getMapTiles: function() {
      var wallTile = this._wallTile;
      var floorTile = this._floorTile;
      //var mapTiles = [];
      var mapTiles = Game.util.init2DArray(this._width+1, this._height+1, Game.Tile.wallTile);

      for( var i=1; i<this._width; i++ ) {
        for( var j=1; j<this._height; j++ ) {
           mapTiles[i][j] = Game.Tile.floorTile;
        }
      }

      return mapTiles;

    },
    isMasked: function(){
      return this._masked;
    }
  }
};
