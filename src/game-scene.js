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
  _track: null, _score: 0,
  _scoreDisp: null, _timeDisp: null,
  _remainTime: 0,
  update: function (dt) {
    if ((this._remainTime -= dt) <= 0) {
      this.endGame('Time up!');
    } else {
      this._timeDisp.setString(this._remainTime.toFixed(1).toString() + ' s');
    }
  },
  doStep: function (idx) {
    this._track.runAction(new cc.EaseSineOut(
      cc.moveBy(0.2, this._track.step())
    ));
    this._scoreDisp.setString(++this._score);
    this.scheduleUpdate();
  },
  endGame: function (message) {
    this.unscheduleUpdate();
    // Put the cover above everthing else but the return button & the transition cover
    this.addChild(new blast.Cover(message), 9998998);
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
    // Labels
    this._scoreDisp = new cc.LabelTTF('0', '', 54);
    this._scoreDisp.setColor(cc.color(0, 128, 255));
    this._scoreDisp.setAnchorPoint(cc.p(1, 1));
    this._scoreDisp.setPosition(cc.p(blast.vsize.width - 6, blast.vsize.height - 6));
    this.addChild(this._scoreDisp);
    this._timeDisp = new cc.LabelTTF('0.0 s', '', 40);
    this._timeDisp.setColor(cc.color(64, 255, 64));
    this._timeDisp.setAnchorPoint(cc.p(1, 1));
    this._timeDisp.setPosition(cc.p(blast.vsize.width - 6, blast.vsize.height - 66));
    this.addChild(this._timeDisp);
  }
});

blast.GameScene_Endless = blast.GameScene.extend({
  ctor: function () {
    this._super([{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}, {row: 2, col: -1}]);
    this._remainTime = 5;
    this._timeDisp.setString('20.0 s');
  }
});
