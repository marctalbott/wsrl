Game.ItemGenerator = new Game.Generator('items', Game.Item);

Game.ItemGenerator.learn ({
  name: '_inventoryContainer',
  mixins: ["Container"]
});

Game.ItemGenerator.learn ({
  name: 'folder',
  chr: '📁',
  fg: '#aaa',
  mixins: []
});

Game.ItemGenerator.learn ({
  name: 'printer',
  chr: '🖨',
  fg: '#fff',
  mixins: []
});

Game.ItemGenerator.learn ({
  name: 'keyboard',
  chr: '⌨',
  fg: '#fff',
  mixins: []
});

Game.ItemGenerator.learn ({
  name: 'pen',
  chr: '🖊',
  fg: '#fff',
  mixins:[]
});

Game.ItemGenerator.learn ({
	name: 'desertDoor',
	chr: '/',
	fg: '#f4a460',
	mixins: ["doorMixin"]
})
