// The scene which the main gameplay is shown
blast.ctrlBtn = function(idx, callback, target) {
  var item = new cc.MenuItemImage(
    res.ctrlBtnImg[idx], res.ctrlBtnImg[idx],
    function() { callback.call(target, idx); }
  );
  item.setAnchorPoint(cc.p(0, 0));
  item.setPosition(cc.p(blast.vsize.width / 4 * idx, 0));
  if (idx >= 2) {
    item.getNormalImage().setFlippedX(true);
    item.getSelectedImage().setFlippedX(true);
  }
  var menu = new cc.Menu(item);
  menu.setPosition(cc.p(0, 0));
  return menu;
};

blast.GameScene = cc.Scene.extend({
  _track: null,
  doStep: function (idx) {
    this._track.runAction(new cc.EaseSineOut(
      cc.moveBy(0.2, this._track.step())
    ));
  },
  ctor: function (route) {
    this._super();
    // Create the track
    this._track = new blast.Track(route);
    this._track.setPosition(cc.p(blast.vsize.width * 0.5, blast.vsize.height * 0.5));
    this.addChild(this._track);
    // Create the control buttons
    for (var i = 0; i < 4; ++i) {
      var btn = blast.ctrlBtn(i, this.doStep, this);
      this.addChild(btn);
    }
  }
});

blast.GameScene_Endless = blast.GameScene.extend({
  ctor: function () {
    this._super([{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}, {row: 2, col: -1}]);
  }
});
