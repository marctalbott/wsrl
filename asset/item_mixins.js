Game.ItemMixin = {};


Game.ItemMixin.Container = {
  META: {
    mixinName: 'Container',
    mixinGroup: 'Container',
    stateNamespace: '_Container_attr',
    stateModel:  {
      itemIds: [],
      capacity: 1
    },
    init: function (template) {
      this.attr._Container_attr.itemIds = template.itemIds || [];
      this.attr._Container_attr.capacity = template.capacity || 1;
    }
  },

  getCapacity: function () {
    return this.attr._Container_attr.capacity;
  },

  setCapacity: function (cap) {
    this.attr._Container_attr.capacity = cap;
  },

  hasSpace: function () {
    return this.attr._Container_attr.capacity > this.attr._Container_attr.itemIds.length;
    // NOTE: early dev stuff here! simple placeholder functionality....
    return this.attr._Container_attr.itemId === '';
  },
  addItems: function (items_or_ids) {
    var addItemStatus = {
      numItemsAdded:0,
      numItemsNotAdded:items_or_ids.length
    };
    if (items_or_ids.length < 1) {
      return addItemStatus;
    }

    for (var i = 0; i < items_or_ids.length; i++) {
      if (! this.hasSpace()) {
        if (i === 0) {
          return addItemStatus;
        } else {
          return addItemStatus;
        }
      }
      var itemId = items_or_ids[i];
      if (typeof itemId !== 'string') {
        itemId = itemId.getId();
      }
      this._forceAddItemId(itemId);
      addItemStatus.numItemsAdded++;
      addItemStatus.numItemsNotAdded--;
    }

    return addItemStatus;
  },
  _forceAddItemId: function (itemId) {
    // NOTE: early dev stuff here! simple placeholder functionality....
    this.attr._Container_attr.itemIds.push(itemId);
  },
  getItemIds: function () {
    return this.attr._Container_attr.itemIds;
  },
  extractItems: function (ids_or_idxs) {
    // NOTE: early dev stuff here! simple placeholder functionality....
    // var ret = [this.attr._Container_attr.itemId];
    // this.attr._Container_attr.itemId = '';
    // return ret;

    var idsOnly = JSON.parse(JSON.stringify(ids_or_idxs));
    for (var i = 0; i < idsOnly.length; i++) {
      if (!isNaN(idsOnly[i])) {
        idsOnly[i] = this.attr._Container_attr.itemIds[idsOnly[i]];
      }
    }
    var ret = [];
    while (idsOnly.length > 0) {
      var curId = idsOnly.shift();
      var idIdx = this.attr._Container_attr.itemIds.indexOf(curId);
      if (idIdx > -1) {
        this.attr._Container_attr.itemIds.splice(idIdx,1);
        ret.push(Game.DATASTORE.ITEM[curId]);
      }
    }
    return ret;
  }
};

Game.ItemMixin.doorMixin = {
	META: {
		mixinName: "doorMixin",
		group: "doors",
		stateNamespace: "_doorMixin_attr",
		stateModel: {
			connectTo: null,
			hasBeenEntered: false
		},
// 		init: function( template ) {
// 			this.attr._doorMixin_attr.connectTo = template.connectTo || null;
// //		this.attr._doorMixin_attr.connectFrom = template.connectFrom || null;
// 		},
		listeners: {
			'walkedOn': function(evtData) {
				if( !this.attr._doorMixin_attr.hasBeenEntered ) {
					this.hasBeenEntered();
					var newMap = new Game.Map(evtData.mapName);
					newMap.populateMap(evtData.mapName, evtData.oldMap);
					this.setConnectTo(newMap.attr._id);
					Game.UIMode.gamePlay.setMap(newMap);
				} else {
					Game.UIMode.gamePlay.setMap( Game.DATASTORE.MAP[this.attr._doorMixin_attr.connectTo] );
				}
//				console.dir( this.getMap() );

				Game.UIMode.enterDoor.setDoor(this.getMap().getItems(evtData.targetX, evtData.targetY)[0]);

     			Game.switchUIMode('enterDoor');

			}
		}
	},
	setConnectTo: function(mapId) {
		this.attr._doorMixin_attr.connectTo = mapId;
	},
	hasBeenEntered: function() {
		this.attr._doorMixin_attr.hasBeenEntered = true;
	}
};
