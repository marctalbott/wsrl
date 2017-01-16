Game.Message = {
  // _curMessage: '',
  // _messages: [],
  attr: {
    freshMessages: [],
    staleMessages: [],
    archivedMessages: [],
    archiveMessageLimit: 150
  },

  render: function(display) {
    display.clear();
    var dispRowMax = display._options.height - 1;
    var dispColMax = display._options.width - 2;
    var dispRow = 0;
    var freshIndex = 0;
    var staleIndex = 0;

    for (freshIndex = 0; freshIndex < this.attr.freshMessages.length && dispRow < dispRowMax; freshIndex++) {

      dispRow += display.drawText(1, dispRow, '%c{#fff}%b{#000}' + this.attr.freshMessages[freshIndex] + '%c{}%b{}', 79);
    }

    for (staleIndex = 0; staleIndex < this.attr.staleMessages.length && dispRow < dispRowMax; staleIndex++) {

      dispRow += display.drawText(1, dispRow, '%c{#aaa}%b{#000}' + this.attr.staleMessages[staleIndex] + '%c{}%b{}', 79);
    }
  },

  ageMessages: function(lastStaleMessageIndex) {
    if (this.attr.staleMessages.length > 5) {
      console.log("archive oldest stale message");
      this.attr.archivedMessages.unshift(this.attr.staleMessages.pop());
    }

    while (this.attr.staleMessages.length > 5) {
      console.log("archive all messages that weren't displayed");
      this.attr.archivedMessages.unshift(this.attr.staleMessages.pop());
    }

    while (this.attr.archivedMessages.length > this.attr.archiveMessageLimit) {
      console.log("dump archived messages that are too old");
      this.attr.archivedMessages.pop();
    }

    while (this.attr.freshMessages.length > 0) {
      console.log("fresh messages gone stale");
      this.attr.staleMessages.unshift(this.attr.freshMessages.pop());
    }


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
  },

  getArchives: function() {
    return this.attr.archivedMessages;
  },

  getArchiveMessageLimit: function() {
    return this.attr.archiveMessageLimit;
  },

  setArchiveMessageLimit: function(n) {
    this.attr.archiveMessageLimit = n;
  }
};
