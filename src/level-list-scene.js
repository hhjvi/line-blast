blast.LevelListScene = cc.Scene.extend({
  ctor: function () {
    this._super();
    var lister = new blast.Draggable();
    lister.setContentSize(cc.size(blast.vsize.width, 1000));
    lister.setAnchorPoint(cc.p(0.5, 0));
    lister.initPosition();
    this.addChild(lister);
    for (var i = 0; i <= 10; ++i) {
      var s = new cc.Sprite('res/back.png');
      s.setNormalizedPosition(cc.p(0.5 + i * 0.05, i * 0.1));
      s.setFlippedX(true);
      lister.addChild(s);
    }
  }
});
