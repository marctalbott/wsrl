Game.ItemGenerator = new Game.Generator('items', Game.Item);

Game.ItemGenerator.learn ({
    name: 'folder',
    chr: '📁',
    fg: '#aaa'
//    itemMixins: []
});

Game.ItemGenerator.learn ({
	name: 'desertDoor',
	chr: '/',
	fg: '#f4a460'
//	itemMixins: []
})