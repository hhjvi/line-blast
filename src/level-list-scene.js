blast.LevelListScene = cc.Scene.extend({
  enterLevel: function (levelId) {
    blast.pushSceneAnimated(new blast.GameScene_Level(levelId));
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
    for (var i = 0; i < res.levels.length; ++i) {
      var s = new blast.DraggableListItem(
        ct - i - 1, 'Level ' + (ct - i).toString(), 'Lorem ipsum dolor sit amet',
        this.enterLevel, this);
      s.setAnchorPoint(cc.p(0, 0));
      s.setPosition(cc.p(-blast.vsize.width / 2, i * 100));
      lister.addSelectableChild(s);
    }
    var hr = new cc.DrawNode();
    for (var i = 0; i < (ct - ct % 5) / 5; ++i)
      hr.drawSegment(
        cc.p(6 - blast.vsize.width * 0.5, (ct - i * 5 - 5) * 100),
        cc.p(blast.vsize.width * 0.5 - 6, (ct - i * 5 - 5) * 100),
        2, cc.color.WHITE);
    lister.addChild(hr);
  }
});
