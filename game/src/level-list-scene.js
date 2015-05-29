var LLS_ItemTagStart = 147106;

blast.LevelListScene = cc.Scene.extend({
  _lister: null,
  enterLevel: function (levelId) {
    if (levelId > blast.curPlayer.levelCount) return;
    blast.pushSceneAnimated(new blast.GameScene_Level(levelId), (function (x) { return function () {
      x.refreshDisp();
    }; })(this));
  },
  refreshDisp: function () {
    var ct = res.levels.length;
    for (var i = 0; i < ct; ++i) {
      var s = this._lister.getChildByTag(LLS_ItemTagStart + i);
      var colour = i <= blast.curPlayer.levelCount ? cc.color.WHITE : cc.color(144, 144, 144);
      s.getTitleLabel().setColor(colour);
      s.getSubtitleLabel().setColor(colour);
      s.getSubtitleLabel().setString(blast.levelSummary(i));
    }
  },
  ctor: function () {
    this._super();
    var ct = res.levels.length;
    var lister = new blast.Draggable();
    // Item height: 100, group size: 5, top margin: 48
    lister.setContentSize(cc.size(blast.vsize.width, ct * 100 + 48));
    lister.setAnchorPoint(cc.p(0.5, 0));
    lister.setPosition(cc.p(blast.vsize.width * 0.5, 0));
    lister.initPosition();
    this.addChild(lister);
    this._lister = lister;
    var height = lister.getContentSize().height - 48;
    for (var i = 0; i < ct; ++i) {
      var s = new blast.DraggableListItem(
        i, 'Level ' + (i + 1).toString(), '', this.enterLevel, this);
      s.setAnchorPoint(cc.p(0, 0));
      s.setPosition(cc.p(-blast.vsize.width / 2, height - (i + 1) * 100));
      s.setTag(LLS_ItemTagStart + i);
      lister.addSelectableChild(s);
    }
    var hr = new cc.DrawNode();
    for (var i = 0; i < (ct - ct % 5) / 5; ++i)
      hr.drawSegment(
        cc.p(6 - blast.vsize.width * 0.5, (ct - i * 5 - 5) * 100),
        cc.p(blast.vsize.width * 0.5 - 6, (ct - i * 5 - 5) * 100),
        2, cc.color.WHITE);
    lister.addChild(hr);
    this.refreshDisp();
  }
});
