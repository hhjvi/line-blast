blast.LevelListScene = cc.Scene.extend({
  ctor: function () {
    this._super();
    var lister = new blast.Draggable();
    lister.setContentSize(cc.size(blast.vsize.width, 1000));
    lister.setAnchorPoint(cc.p(0.5, 0));
    lister.setPosition(cc.p(blast.vsize.width * 0.5, 0));
    lister.initPosition();
    this.addChild(lister);
    for (var i = 0; i < 10; ++i) {
      var s = new blast.DraggableListItem('Item ' + i, 'Lorem ipsum dolor sit amet');
      s.setAnchorPoint(cc.p(0, 0));
      s.setPosition(cc.p(-blast.vsize.width / 2, i * 100));
      lister.addSelectableChild(s);
    }
  }
});
