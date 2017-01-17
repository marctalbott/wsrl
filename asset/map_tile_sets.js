Game.MapTileSets = {
  caves1: {
    _width: 30,
    _height: 20,
    getMapTiles: function () {
      var mapTiles = Game.util.init2DArray(this._width,this._height,Game.Tile.nullTile);
      var generator = new ROT.Map.Cellular(this._width,this._height, {connected: true});
      generator.randomize(0.5);

      // repeated cellular automata process
      var totalIterations = 4;
      for (var i = 0; i < totalIterations; i++) {
        generator.create();
      }

      // run again then update map
      generator.connect(function(x,y,v) {
        if (v === 1) {
          mapTiles[x][y] = Game.Tile.floorTile;
        } else {
          mapTiles[x][y] = Game.Tile.wallTile;
        }
      }, 1);

      return mapTiles;
    }
  },

  desert1: {
    _width: 30,
    _height: 20,
    getMapTiles: function () {
      console.log("gen map tiles");
      var mapTiles = Game.util.init2DArray(this._width,this._height,Game.Tile.nullTile);
      var generator = new ROT.Map.Cellular(this._width,this._height);
      generator.randomize(0.62);

      // repeated cellular automata process
      var totalIterations = 4;
      for (var i = 0; i < totalIterations; i++) {
        generator.create();
      }

      // run again then update map
      generator.connect(function(x,y,v) {
        if (v === 1) {
          mapTiles[x][y] = Game.Tile.desertTile;
        } else {
          mapTiles[x][y] = Game.Tile.desertWallTile;
        }
      }, 1);
      console.log("finish generating map");
      return mapTiles;
    }
  }
};
