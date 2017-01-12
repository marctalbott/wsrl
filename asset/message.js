Game.Message = {
  // _curMessage: '',
  // _messages: [],
  attr: {
    freshMessages: [],
    staleMessages: [],
    archivedMessages: [],
    archiveMessageCount: 150
  },

  render: function(display) {
    display.clear();
    var dispRowMax = display._options.height - 1;
    var dispColMax = display._options.width - 2;
    var dispRow = 0;
    var freshIndex = 0;
    var staleIndex = 0;

    for (freshIndex = 0; freshIndex < this.attr.freshMessages.length && dispRow < dispRowMax; freshIndex++) {
      /*console.log("FRESH");
      console.log(this.attr.freshMessages);
      console.log("freshindex:" + freshIndex);
      console.log("dispRow:" + dispRow);*/
      dispRow += display.drawText(1, dispRow, '%c{#fff}%b{#000}' + this.attr.freshMessages[freshIndex] + '%c{}%b{}', 79);
    }

    for (staleIndex = 0; staleIndex < this.attr.staleMessages.length && dispRow < dispRowMax; staleIndex++) {
/*      console.log("STALE");
      console.log(this.attr.staleMessages);
      console.log("staleindex:" + staleIndex);
      console.log("disprow: " + dispRow);*/
      dispRow += display.drawText(1, dispRow, '%c{#aaa}%b{#000}' + this.attr.staleMessages[staleIndex] + '%c{}%b{}', 79);
    }

    if (this.attr.staleMessages.length > 0) {
      console.log("archive oldest stale message");
      this.attr.archivedMessages.unshift(this.attr.staleMessages.pop());
    }

    while (this.attr.staleMessages.length > staleIndex) {
      console.log("archive all messages that weren't displayed");
      this.attr.archivedMessages.unshift(this.attr.staleMessages.pop());
    }

    while (this.attr.archivedMessages.length > this.attr.archiveMessageCount) {
      console.log("dump archived messages that are too old");
      this.attr.archivedMessages.pop();
    }

    while (this.attr.freshMessages.length > 0) {
      console.log("fresh messages gone stale");
      this.attr.staleMessages.unshift(this.attr.freshMessages.pop());
    }


    /*if (this.attr.staleMessages) {
      console.log("STALE2");
      console.log(this.attr.staleMessages);
    }
    console.log("ARCHIVED");
    console.log(this.attr.archivedMessages);*/

    // for(i = _messages.length - 1; i > _messages.length - 7; i--) {
    //   display.drawText(1, count, this._messages[i], '#fff', '#000');
    //   count--;
    // }

    // display.drawText(1,7,this._curMessage,'#fff','#000');
  },

  send: function(msg) {
    // this._curMessage = msg;
    this.attr.freshMessages.push(msg);
  },

  clear: function() {
    // this._curMessage = '';
    this.attr.freshMessages = [];
    this.attr.staleMessages = [];
  }
};
