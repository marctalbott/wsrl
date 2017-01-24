Game.ItemGenerator = new Game.Generator('items', Game.Item);

Game.ItemGenerator.learn ({
    name: 'folder',
    chr: '📁',
    fg: '#aaa'
//    itemMixins: []
});

Game.ItemGenerator.learn ({
	name: 'door',
	chr: '&',
	fg: '#f4a460'
//	itemMixins: []
})