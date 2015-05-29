blast.sort = function (a, bigger) {
  var i, j, t;
  for (i = 0; i < a.length - 1; ++i)
    for (j = i + 1; j < a.length; ++j)
      if (bigger(a[j], a[i])) {
        t = a[i]; a[i] = a[j]; a[j] = t;
      }
};

var ldbdSorter = function (a, b) {
  return (a.levelct === b.levelct) ? (a.time < b.time) : (a.levelct > b.levelct);
};

blast.LeaderboardScene = cc.Scene.extend({
  ctor: function () {
    this._super();
    // Sort the players' scores.
    var data = [], i, j, totTime;
    for (i = 0; i < blast.players.length; ++i) {
      totTime = 0;
      for (j = 1; j <= blast.players[i].levelCount; ++j)
        totTime += blast.players[i].scores[j];
      data[i] = {id: i, levelct: blast.players[i].levelCount, time: totTime};
    }
    blast.sort(data, ldbdSorter);
    console.log(data);
    this.initDisp(data);
  },
  initDisp: function (data) {
    var ct = 20, dragHeight = ct * 42 + 48;
    if (ct > blast.players.length) ct = blast.players.length;
    var drag = new blast.Draggable();
    drag.setContentSize(cc.size(blast.vsize.width, dragHeight));
    drag.setAnchorPoint(cc.p(0.5, 0));
    drag.setPosition(cc.p(0, 0));
    drag.initPosition();
    this.addChild(drag);
    for (var i = 0; i < ct; ++i) {
      var l1 = new cc.LabelTTF((i + 1).toString(), res.fontFamily, 30);
      l1.setAnchorPoint(cc.p(0, 1));
      l1.setPosition(cc.p(6, dragHeight - 48 - i * 42));
      drag.addChild(l1);
      var l2 = new cc.LabelTTF(blast.players[data[i].id].name, res.fontFamily, 30);
      l2.setAnchorPoint(cc.p(0.5, 1));
      l2.setPosition(cc.p(blast.vsize.width * 0.4, dragHeight - 48 - i * 42));
      drag.addChild(l2);
      var l3 = new cc.LabelTTF(data[i].levelct + '关/' + data[i].time.toFixed(1) + 's', res.fontFamily, 18);
      l3.setAnchorPoint(cc.p(1, 1));
      l3.setPosition(cc.p(blast.vsize.width - 6, dragHeight - 48 - i * 42));
      drag.addChild(l3);
    }
  }
});
