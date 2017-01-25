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
			'walkedOn': function(evtData) {
				if( !this.attr._doorMixin_attr.hasBeenEntered ) {
					this.attr._doorMixin_attr.hasBeenEntered = true;
					var newMap = new Game.Map(evtData.mapName);
					Game.UI_Mode.gamePlay.setMap(newMap);
					this.setConnectTo(newMap.attr._id);
				} else {
					Game.UI_Mode.gamePlay.setMap( this.attr._doorMixin.connectTo );
				}
				Game.UIMode.enterDoor.setDoor(map.getItems(targetX, targetY)[0]);
     			Game.switchUIMode(Game.UIMode.enterDoor);
			}
		}
	},
	setConnectTo: function(mapId) {
		this.attr._doorMixin_attr.connectTo = mapId;
	}
}
