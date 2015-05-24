blast.GameScene = cc.Scene.extend({
  _track: null,
  ctor: function (route) {
    this._super();
    // Create the track
    this._track = new blast.Track(route);
    this._track.setPosition(cc.p(blast.vsize.width * 0.5, blast.vsize.height * 0.5));
    this.addChild(this._track);
  }
});

blast.GameScene_Endless = blast.GameScene.extend({
  ctor: function () {
    this._super([{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}, {row: 2, col: -1}]);
  }
});
