Game.ItemMixin = {};

Game.ItemMixin.doorMixin = {
	META: {
		mixinName: "doorMixin",
		group: "doors",
		stateNamespace: "_doorMixin_attr",
		stateModel: {
			connectTo: null,
			hasBeenEntered: false
		},
		init: function( template ) {
		this.attr._doorMixin_attr.connectTo = template.connectTo || null;
//		this.attr._doorMixin_attr.connectFrom = template.connectFrom || null;
		},
		listeners: {
			'changeMaps': function(evtData) {
				if( !hasBeenEntered ) {
					hasBeenEntered = true;
					var newMap = new Game.Map('desert1');
					Game.UI_Mode.gamePlay.setMap(newMap);
					connectTo = Game.DATASTORE.MAP[newMap.attr._id];
				} else {
					Game.UI_Mode.gamePlay.setMap( connectTo );
				}
			}
		}
	}
}
