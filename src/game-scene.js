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
  _routes: [], _tracks: [], _pastTracks: [], _baseTrack: null, _place: 0, _score: 0,
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
    var action;
    if (++this._place >= this._routes[0].length - 1) {
      if (this._place >= this._routes[0].length) return;  // Ignore invalid moves
      action = new cc.EaseSineOut(cc.sequence(
        cc.moveBy(0.2, this._tracks[0].step()),
        cc.callFunc((function (x) { return function () {
          // Finished a section of the route!
          x._routes.shift();
          x._pastTracks.push(x._tracks.shift());
          x._place = 0;
          if (x._routes.length === 0) x.finishRoute();
          else x._tracks[0].setVisible(true);
        }; })(this))
      ));
    } else {
      action = new cc.EaseSineOut(cc.moveBy(0.2, this._tracks[0].step()));
    }
    this._baseTrack.runAction(action);
    this._scoreDisp.setString(++this._score);
    this.scheduleUpdate();
  },
  endGame: function (message) {
    this.unscheduleUpdate();
    // Put the cover above everthing else but the return button & the transition cover
    this.addChild(new blast.Cover(message), 9998998);
  },
  finishRoute: function () {
  },
  ctor: function (routes) {
    this._super();
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
    // Create the track
    this.initRoutes(routes);
  },
  initRoutes: function (routes) {
    if (this._tracks.length >= 0)
      for (var i in this._tracks) this._tracks[i].removeFromParent();
    if (this._pastTracks.length >= 0)
      for (var i in this._pastTracks) this._pastTracks[i].removeFromParent();
    this._routes = routes;
    this._place = 0;
    this._tracks = [];
    this._pastTracks = [];
    for (var i in routes) {
      var t = new blast.Track(routes[i]);;
      if (i == 0) {
        this._baseTrack = t;
        t.setPosition(cc.p(blast.vsize.width * 0.5, blast.vsize.height * 0.5));
        this.addChild(t);
      } else {
        t.setVisible(false);
        t.setPosition(cc.p(0, 0));
        this._baseTrack.addChild(t);
      }
      this._tracks.push(t);
    }
  }
});

blast.GameScene_Level = blast.GameScene.extend({
  _levelId: -1,
  finishRoute: function () {
    this.endGame('Congratulations!!');  // <-- SAO?
    if (blast.player.levelCount < this._levelId + 1) {
      blast.player.levelCount = this._levelId + 1;
      blast.player.levelScores[this._levelId] = 0;
    }
    var score = 18906416;
    if (blast.player.levelScores[this._levelId] < score)
      blast.player.levelScores[this._levelId] = score;
  },
  ctor: function (levelId) {
    this._super(blast.levelDataToRoutes(res.levels[levelId].route));
    this._remainTime = 10;
    this._timeDisp.setString('10.0 s');
    this._levelId = levelId;
    // Show the level number
    var lvnumLabel = new cc.LabelTTF('Level ' + levelId, '', 40);
    lvnumLabel.setAnchorPoint(cc.p(1, 1));
    lvnumLabel.setPosition(cc.p(blast.vsize.width - 18, blast.vsize.height * 0.382));
    this.addChild(lvnumLabel);
    lvnumLabel.runAction(cc.sequence(cc.delayTime(1.5), cc.fadeOut(0.7), cc.removeSelf()));
    // Load the tutorials
    // http://blog.sina.com.cn/s/blog_672111bd0100repo.html
    if (res.levels[levelId].tutorial) {
      var i = res.levels[levelId].tutorial.length;
      do {
        var c = res.levels[levelId].tutorial[--i];
        var node;
        if (c.img) {
          // An image
          node = new cc.Sprite(c.img);
          node.setFlippedX(c.flipx);
        } else if (c.text) {
          // A text label
          node = new cc.LabelTTF(c.text, '', c.fontsize || 24);
        } else continue;
        node.setScale(c.scale || 1);
        node.setRotation(c.rotation || 0);
        node.setPosition(c.pos);
        this._baseTrack.addChild(node);
      } while (i);
    }
  }
});

blast.GameScene_Endless = blast.GameScene.extend({
  finishRoute: function () {
    this._remainTime += 5;
    this.initRoutes([[{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}, {row: 2, col: 1}]]);
  },
  ctor: function () {
    this._super([[{row: 0, col: 0}, {row: 1, col: 0}, {row: 2, col: 0}, {row: 2, col: -1}]]);
    this._remainTime = 5;
    this._timeDisp.setString('5.0 s');
  }
});
