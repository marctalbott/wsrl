Game.KeyBinding = {
  _availableBindings: ['vim', 'numpad', 'waxd'],
  _curBindingKey: '',
  _currentBindingLookup: {},
  // useKeyBinding: function(bindingSetName) {
  //   bindingSetName = bindingSetName || 'laptop-based';
  //   for (var i = 0; i < this._availableBindings.length; i++) {
  //     var bset = this._availableBindings[i];
  //     if (Game.KeyBinding.BindingSet[bset]._NAME == bindingSetName) {
  //       this._curBindings = Game.KeyBinding.BindingSet[bset];
  //       this._curBindingKey = bset;
  //       this._curBindingKeyIndex = i;
  //       break;
  //     }
  //   }
  //   this.calcBindingLookups();
  // },
  setKeyBinding: function (bindingSetKey) {
    this._curBindingKey = bindingSetKey || 'vim';
    this.calcBindingLookups();
  },

  getKeyBinding: function () {
    return this._curBindingKey;
  },

  swapToNextKeyBinding: function () {
    var nextBindingIndex = this._availableBindings.indexOf(this._curBindingKey);
    if (nextBindingIndex < 0) { return; } // can only swap to next if the current is in the 'available' list - prevents swapping away from special sets like 'persist'
    nextBindingIndex++;
    if (nextBindingIndex >= this._availableBindings.length) {
      nextBindingIndex = 0;
    }
    this.setKeyBinding(this._availableBindings[nextBindingIndex]);
    Game.Message.ageMessages();
    this.informPlayer();
  },

  informPlayer: function () {
    Game.Message.send('using '+this._curBindingKey+' key bindings');
    Game.renderMessage();
  },


  calcBindingLookups: function() {
    console.log('calcBindingLookups for ');
    console.dir(this._curBindingKey);
    this._currentBindingLookup = {
      keydown: {
        nometa: {},
        ctrlshift: {},
        shift: {},
        ctrl: {}
      },
      keypress: {
        nometa: {},
        ctrlshift: {},
        shift: {},
        ctrl: {}
      }
    };
    for (var actionLookupKey in this.Action) {
      if (this.Action.hasOwnProperty(actionLookupKey)) {
        var bindingInfo = this.Action[actionLookupKey][this._curBindingKey] || this.Action[actionLookupKey].all;
        if (bindingInfo) {
          var metaKey = 'nometa';
          if (bindingInfo.inputMetaCtrl && bindingInfo.inputMetaShift) {
            metaKey = 'ctrlshift';
          } else if (bindingInfo.inputMetaShift) {
            metaKey = 'shift';
          } else if (bindingInfo.inputMetaCtrl) {
            metaKey = 'ctrl';
          }

          this._currentBindingLookup[bindingInfo.inputType][metaKey][bindingInfo.inputMatch] = {
            actionKey: actionLookupKey,
            boundLabel: bindingInfo.label,
            binding: bindingInfo,
            action: Game.KeyBinding.Action[actionLookupKey]
          };
        }
      }
    }
  },

  getInputBinding: function (inputType, inputData) {
    var metaKey = 'nometa';
    if (inputData.ctrlKey && inputData.shiftKey) {
      metaKey = 'ctrlshift';
    } else if (inputData.shiftKey) {
      metaKey = 'shift';
    } else if (inputData.ctrlKey) {
      metaKey = 'ctrl';
    }

    var bindingKey = inputData.keyCode;
    if (inputType === 'keypress') {
      bindingKey = String.fromCharCode(inputData.charCode);
    }
    console.log("meta " +metaKey);
    console.log("bindingkey " +bindingKey);
    console.log("inputtype " +inputType);
    console.log("inputtypetype " +inputType.type);

    //console.log("bindingLookup");
//    console.log(this._currentBindingLookup[inputType][metaKey]);
  //  console.log(inputData);
    // console.log(_currentBindingLookup);
    // console.log(inputType);
    // console.log(this._currentBindingLookup);
    // console.log (this._currentBindingLookup);
    console.dir(this._currentBindingLookup);
    return this._currentBindingLookup[inputType.type][metaKey][bindingKey] || false;
  },

  getLabelForAction: function (actionLookupKey) {
    var bindingInfo = this.Action[actionLookupKey][this._curBindingKey] || this.Action[actionLookupKey].all;
    if (bindingInfo) {
      return bindingInfo.label;
    }
    return '';
  },

  // Action: {
  //
  //   CANCEL          : {action_group:'meta' ,guid :Game.util.uniqueId() ,ordering:1 ,short:'cancel'   ,long:'cancel/close the current action/screen'}       ,
  //   CHANGE_BINDINGS : {action_group:'meta' ,guid :Game.util.uniqueId() ,ordering:1 ,short:'controls' ,long:'change which keys do which commands'}          ,
  //   //HELP            : {action_group:'meta' ,guid :Game.util.uniqueId() ,ordering:1 ,short:'help'     ,long:'show command keys and and action description'} ,
  //   WIN             : {action_group:'meta', guid :Game.util.uniqueId() ,ordering:1 ,short:'win'      ,long:'win the game'}                                 ,
  //
  //   PERSISTENCE      : {action_group:'meta'    ,guid:Game.util.uniqueId() ,ordering:2 ,short:'games'    ,long :'save or load or restart'}     ,
  //   PERSISTENCE_SAVE : {action_group:'persist' ,guid:Game.util.uniqueId() ,ordering:2.1 ,short:'save'     ,long :'save the current game'}       ,
  //   PERSISTENCE_LOAD : {action_group:'persist' ,guid:Game.util.uniqueId() ,ordering:2.2 ,short:'restore'  ,long :'restore from the saved game'} ,
  //   PERSISTENCE_NEW  : {action_group:'persist' ,guid:Game.util.uniqueId() ,ordering:2.3 ,short:'new game' ,long :'start a new game'}            ,
  //
  //   MOVE_UL   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally up and to the left'}    ,
  //   MOVE_U    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight up'}                      ,
  //   MOVE_UR   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally up and to the right'}   ,
  //   MOVE_L    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight left'}                    ,
  //   MOVE_WAIT : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move nowhere - wait one turn'}          ,
  //   MOVE_R    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight right'}                   ,
  //   MOVE_DL   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally down and to the left'}  ,
  //   MOVE_D    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight down'}                    ,
  //   MOVE_DR   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally down and to the right'} ,
  // }
  Action: {
    PERSISTENCE      : {action_group:'meta'    ,guid:Game.util.uniqueId() ,ordering:2 ,short:'games'    ,long :'save or load or restart',
      all: {label:'='     ,inputMatch:'='      ,inputType:'keypress' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    PERSISTENCE_SAVE : {action_group:'persist' ,guid:Game.util.uniqueId() ,ordering:2.1 ,short:'save'     ,long :'save the current game',
      persist: {label:'S' ,inputMatch:ROT.VK_S ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false}
    },
    PERSISTENCE_LOAD : {action_group:'persist' ,guid:Game.util.uniqueId() ,ordering:2.2 ,short:'restore'  ,long :'restore from the saved game',
      persist: {label:'L' ,inputMatch:ROT.VK_L ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false}
    },
    PERSISTENCE_NEW  : {action_group:'persist' ,guid:Game.util.uniqueId() ,ordering:2.3 ,short:'new game' ,long :'start a new game',
      persist: {label:'N' ,inputMatch:ROT.VK_N ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false}
    },

    MOVE_UL   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally up and to the left',
      numpad: {label:'7' ,inputMatch:ROT.VK_NUMPAD7 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'y' ,inputMatch:ROT.VK_Y       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'q' ,inputMatch:ROT.VK_Q       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_U    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight up',
      numpad: {label:'8' ,inputMatch:ROT.VK_NUMPAD8 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'k' ,inputMatch:ROT.VK_K       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'w' ,inputMatch:ROT.VK_W       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_UR   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally up and to the right',
      numpad: {label:'9' ,inputMatch:ROT.VK_NUMPAD9 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'u' ,inputMatch:ROT.VK_U      ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'e' ,inputMatch:ROT.VK_E       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_L    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight left',
      numpad: {label:'4' ,inputMatch:ROT.VK_NUMPAD4 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'h' ,inputMatch:ROT.VK_H       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'a' ,inputMatch:ROT.VK_A       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_WAIT : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move nowhere - wait one turn',
      numpad: {label:'5' ,inputMatch:ROT.VK_NUMPAD5 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'.' ,inputMatch:ROT.VK_PERIOD       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'s' ,inputMatch:ROT.VK_S       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_R    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight right',
      numpad: {label:'6' ,inputMatch:ROT.VK_NUMPAD6 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'l' ,inputMatch:ROT.VK_L       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'d' ,inputMatch:ROT.VK_D       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_DL   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally down and to the left',
      numpad: {label:'1' ,inputMatch:ROT.VK_NUMPAD1 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'b' ,inputMatch:ROT.VK_B       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'z' ,inputMatch:ROT.VK_Z       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_D    : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move straight down',
      numpad: {label:'2' ,inputMatch:ROT.VK_NUMPAD2 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'j' ,inputMatch:ROT.VK_J       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'x' ,inputMatch:ROT.VK_X       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    MOVE_DR   : {action_group:'movement' ,guid:Game.util.uniqueId() ,ordering:3 ,short:'move' ,long :'move diagonally down and to the right',
      numpad: {label:'3' ,inputMatch:ROT.VK_NUMPAD3 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim  : {label:'n' ,inputMatch:ROT.VK_N       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false},
      waxd  : {label:'c' ,inputMatch:ROT.VK_C       ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },

    PICKUP : {action_group:'inventory' ,guid:Game.util.uniqueId() ,ordering:5.1 ,short:'get'  ,long :'get / pickup one or more items in the current space' ,
      numpad: {label:'g' ,inputMatch:ROT.VK_G ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      vim: {label:'g' ,inputMatch:ROT.VK_G ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false} ,
      waxd  : {label:'g' ,inputMatch:ROT.VK_G ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
    },
    DROP   : {action_group:'inventory' ,guid:Game.util.uniqueId() ,ordering:5.2 ,short:'drop' ,long :'drop one or more items in the current space'         ,
      numpad: {label:'D' ,inputMatch:ROT.VK_D ,inputType:'keydown' ,inputMetaShift:true  ,inputMetaCtrl:false} ,
      vim: {label:'D' ,inputMatch:ROT.VK_D ,inputType:'keydown' ,inputMetaShift:true  ,inputMetaCtrl:false} ,
      waxd  : {label:'D' ,inputMatch:ROT.VK_D ,inputType:'keydown' ,inputMetaShift:true  ,inputMetaCtrl:false}
    },

   //HELP action definition goes here
   HELP : {action_group:'meta' ,guid :Game.util.uniqueId() ,ordering:1 ,short:'help' ,long:'show which keys do which commands',
     all: {label:'?'     ,inputMatch:ROT.VK_SLASH      ,inputType:'keydown' ,inputMetaShift:true ,inputMetaCtrl:false}
   },
   CHANGE_BINDINGS : {action_group:'meta' ,guid :Game.util.uniqueId() ,ordering:1 ,short:'controls' ,long:'change which keys do which commands',
     all: {label:'\\'  ,inputMatch:ROT.VK_BACK_SLASH ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
   },
   CANCEL          : {action_group:'meta' ,guid :Game.util.uniqueId() ,ordering:1 ,short:'cancel'   ,long:'cancel/close the current action/screen',
     all: {label:'Esc' ,inputMatch:ROT.VK_ESCAPE     ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false}
   }
 }
};
// Game.KeyBinding.BindingSet = {};
// //
// // //-----------------------------------------------------------------------------
// //
// // Game.KeyBinding.BindingSet.numpad = {};
// // Game.KeyBinding.BindingSet.numpad._NAME = 'numpad-based';
// //
// // Game.KeyBinding.BindingSet.numpad.CANCEL          = {label:'Esc' ,inputMatch:ROT.VK_ESCAPE     ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.CHANGE_BINDINGS = {label:'\\'  ,inputMatch:ROT.VK_BACK_SLASH ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.WIN             = {label:'Enter',inputMatch:ROT.VK_ENTER     ,inputType:'keypress',inputMetaShift:false ,inputMetaCtrl:false};
// //
// //
// // Game.KeyBinding.BindingSet.numpad.PERSISTENCE      = {label:'='       ,inputMatch:'='      ,inputType:'keypress' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.PERSISTENCE_SAVE = {label:'shift-s' ,inputMatch:ROT.VK_S ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.PERSISTENCE_LOAD = {label:'shift-l' ,inputMatch:ROT.VK_L ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.PERSISTENCE_NEW  = {label:'shift-n' ,inputMatch:ROT.VK_N ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false};
// //
// // Game.KeyBinding.BindingSet.numpad.MOVE_UL   = {label:'7' ,inputMatch:ROT.VK_NUMPAD7 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_U    = {label:'8' ,inputMatch:ROT.VK_NUMPAD8 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_UR   = {label:'9' ,inputMatch:ROT.VK_NUMPAD9 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_L    = {label:'4' ,inputMatch:ROT.VK_NUMPAD4 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_WAIT = {label:'5' ,inputMatch:ROT.VK_NUMPAD5 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_R    = {label:'6' ,inputMatch:ROT.VK_NUMPAD6 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_DL   = {label:'1' ,inputMatch:ROT.VK_NUMPAD1 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_D    = {label:'2' ,inputMatch:ROT.VK_NUMPAD2 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// // Game.KeyBinding.BindingSet.numpad.MOVE_DR   = {label:'3' ,inputMatch:ROT.VK_NUMPAD3 ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
//
// Game.KeyBinding.BindingSet.laptop = {};
// Game.KeyBinding.BindingSet.laptop._NAME = 'laptop-based';
//
// Game.KeyBinding.BindingSet.laptop.CANCEL          = {label:'Esc' ,inputMatch:ROT.VK_ESCAPE     ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.CHANGE_BINDINGS = {label:'\\'  ,inputMatch:ROT.VK_BACK_SLASH ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.WIN             = {label:'Enter',inputMatch:ROT.VK_ENTER     ,inputType:'keypress',inputMetaShift:false ,inputMetaCtrl:false};
//
// Game.KeyBinding.BindingSet.laptop.PERSISTENCE      = {label:'='       ,inputMatch:'='      ,inputType:'keypress' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.PERSISTENCE_SAVE = {label:'shift-s' ,inputMatch:ROT.VK_S ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.PERSISTENCE_LOAD = {label:'shift-l' ,inputMatch:ROT.VK_L ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.PERSISTENCE_NEW  = {label:'shift-n' ,inputMatch:ROT.VK_N ,inputType:'keydown'  ,inputMetaShift:true  ,inputMetaCtrl:false};
//
// Game.KeyBinding.BindingSet.laptop.MOVE_UL   = {label:'y' ,inputMatch:ROT.VK_Y ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_U    = {label:'k' ,inputMatch:ROT.VK_K ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_UR   = {label:'u' ,inputMatch:ROT.VK_U ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_L    = {label:'h' ,inputMatch:ROT.VK_H ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_WAIT = {label:'.' ,inputMatch:ROT.VK_PERIOD ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_R    = {label:'l' ,inputMatch:ROT.VK_L ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_DL   = {label:'b' ,inputMatch:ROT.VK_B ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_D    = {label:'j' ,inputMatch:ROT.VK_J ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.MOVE_DR   = {label:'n' ,inputMatch:ROT.VK_N ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
//
// Game.KeyBinding.BindingSet.laptop.PICKUP   = {label:'g' ,inputMatch:ROT.VK_G ,inputType:'keydown' ,inputMetaShift:false ,inputMetaCtrl:false};
// Game.KeyBinding.BindingSet.laptop.DROP   = {label:'D' ,inputMatch:ROT.VK_D ,inputType:'keydown' ,inputMetaShift:true ,inputMetaCtrl:false};
