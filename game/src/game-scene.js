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

var penaltyTime = 3.0;

blast.GameScene = cc.Scene.extend({
  _routes: [], _tracks: [], _pastTracks: [], _baseTrack: null, _place: 0, _score: 0,
  _times: [],
  _rotate: false, _rotation: 0,
  _scoreDisp: null, _timeDisp: null,
  _remainTime: 0, _elapsedTime: 0,
  _lastDir: -1,
  update: function (dt) {
    this._elapsedTime += dt;
    if ((this._remainTime -= dt) <= 0) {
      this.endGame('Time up!');
    } else {
      this._timeDisp.setString(this._remainTime.toFixed(1) + ' s');
    }
    if (this._rotate &&
        this.actionManager.numberOfRunningActionsInTarget(this._baseTrack) === 0) {
      var angle = this._rotation += this._rotate * dt;
      this._baseTrack.setRotation(angle);
      this._baseTrack.setPosition(cc.pSub(
        cc.p(blast.vsize.width * 0.5, blast.vsize.height * 0.5),
        cc.pRotateByAngle(
          blast.rowcolToNodePos(this._routes[0][this._place]),
          cc.p(0, 0), -angle / 180.0 * Math.PI
        )
      ));
    }
  },
  doStep: function (idx) {
    var iii = 0;
    if (idx === 0) iii = 1;
    else if (idx === 3) iii = 2;
    var newDir = blast.turn[this._lastDir][iii];
    if (blast.rowInc[newDir] + this._routes[0][this._place].row !== this._routes[0][this._place + 1].row
       || blast.colInc[newDir] + this._routes[0][this._place].col !== this._routes[0][this._place + 1].col) {
      this._elapsedTime += penaltyTime;
      this._timeDisp.setString((this._remainTime -= penaltyTime).toFixed(1) + ' s');
      return;
    }
    this._lastDir = newDir;
    if (++this._place >= this._routes[0].length) return;  // Ignore invalid moves
    this._tracks[0].step();
    var action = new cc.EaseSineOut(cc.moveTo(0.2, cc.pSub(
      cc.p(blast.vsize.width * 0.5, blast.vsize.height * 0.5),
      cc.pRotateByAngle(
        blast.rowcolToNodePos(this._routes[0][this._place]),
        cc.p(0, 0), -this._rotation / 180.0 * Math.PI
      )
    )));
    if (this._place >= this._routes[0].length - 1) {
      action = new cc.EaseSineOut(cc.sequence(
        action,
        cc.callFunc((function (x) { return function () {
          // Finished a section of the route!
          x._routes.shift();
          x._pastTracks.push(x._tracks.shift());
          x._place = 0;
          if (x._routes.length === 0) x.finishRoute();
          else {
            x._tracks[0].setVisible(true);
            x._remainTime += x._times.shift();
          }
        }; })(this))
      ));
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
  ctor: function (routes, rotate) {
    this._super();
    if (rotate) this._rotate = rotate;
    // Create the control buttons
    for (var i = 0; i < 4; ++i) {
      var btn = blast.ctrlBtn(i, this.doStep, this);
      this.addChild(btn);
    }
    // Labels
    this._scoreDisp = new cc.LabelTTF('0', res.fontFamily, 54);
    this._scoreDisp.setColor(cc.color(0, 128, 255));
    this._scoreDisp.setAnchorPoint(cc.p(1, 1));
    this._scoreDisp.setPosition(cc.p(blast.vsize.width - 6, blast.vsize.height - 6));
    this.addChild(this._scoreDisp);
    this._timeDisp = new cc.LabelTTF('0.0 s', res.fontFamily, 40);
    this._timeDisp.setColor(cc.color(64, 255, 64));
    this._timeDisp.setAnchorPoint(cc.p(1, 1));
    this._timeDisp.setPosition(cc.p(blast.vsize.width - 6, blast.vsize.height - 66));
    this.addChild(this._timeDisp);
    // Create the track
    if (routes) this.initRoutes(routes);
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
      var t = new blast.Track(routes[i]);
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
    // Initialize the direction
    var drow = routes[0][1].row - routes[0][0].row,
        dcol = routes[0][1].col - routes[0][0].col;
    for (var i = 0; i < 4; ++i)
      if (blast.rowInc[i] === drow && blast.colInc[i] === dcol) break;
    this._lastDir = i;
  }
});

blast.GameScene_Level = blast.GameScene.extend({
  _levelId: -1,
  finishRoute: function () {
    this.endGame('Congratulations!!');  // <-- SAO?
    if (blast.curPlayer.levelCount < this._levelId + 1) {
      blast.curPlayer.levelCount = this._levelId + 1;
      blast.curPlayer.scores[this._levelId + 1] = 1 << 30;
    }
    var score = this._elapsedTime;
    if (blast.curPlayer.scores[this._levelId + 1] > score)
      blast.curPlayer.scores[this._levelId + 1] = score;
    blast.callPHP('op=4&id=' + blast.curPlayerID.toString() + '&lv=' + (this._levelId + 1).toString() + '&step=' + this._score.toString() + '&time=' + this._elapsedTime.toFixed(2));
  },
  ctor: function (levelId) {
    var levelData = res.levels[levelId];
    this._super(blast.levelDataToRoutes(levelData.route), levelData.rotate);
    this._remainTime = levelData.time[0];
    this._times = levelData.time.slice(1);
    this._timeDisp.setString(this._remainTime + '.0 s');
    this._levelId = levelId;
    // The undercover
    var uc = new cc.LayerColor(cc.color(128, 128, 48, 128));
    uc.setContentSize(cc.size(blast.vsize.width, blast.vsize.height * 0.4));
    uc.setPosition(cc.p(0, 0));
    uc.setOpacity(0);
    this.addChild(uc, 1096);
    uc.setCascadeOpacityEnabled(false);
    uc.runAction(cc.sequence(
      cc.delayTime(0.5), cc.fadeTo(0.7, 128),
      cc.delayTime(2), cc.fadeOut(0.7), cc.removeSelf()));
    // Show the level number
    var lvnumLabel = new cc.LabelTTF('Level ' + levelId, res.fontFamily, 40);
    lvnumLabel.setColor(cc.color(255, 255, 64));
    lvnumLabel.setAnchorPoint(cc.p(1, 1));
    lvnumLabel.setPosition(cc.p(blast.vsize.width - 18, blast.vsize.height * 0.382));
    lvnumLabel.setOpacity(0);
    uc.addChild(lvnumLabel);
    lvnumLabel.runAction(cc.sequence(
      cc.delayTime(0.5), cc.fadeIn(0.7),
      cc.delayTime(2), cc.fadeOut(0.7), cc.removeSelf()));
    // Show the records
    var recordStr = 'Global best: ' + blast.leaderboard.levelScores[this._levelId].toFixed(1) + ' s';
    if (this._levelId < blast.curPlayer.levelCount) {
      recordStr = 'Personal best: ' + blast.curPlayer.scores[this._levelId + 1].toFixed(1)
        + ' s' + '\n' + recordStr;
    }
    var recordLabel = new cc.LabelTTF(recordStr, res.fontFamily, 20);
    recordLabel.setColor(cc.color(255, 255, 64));
    recordLabel.setAnchorPoint(cc.p(1, 1));
    recordLabel.setNormalizedPosition(cc.p(1, 0));
    recordLabel.setOpacity(0);
    lvnumLabel.addChild(recordLabel);
    recordLabel.runAction(cc.sequence(
      cc.delayTime(0.8), cc.fadeIn(0.7),
      cc.delayTime(1.7), cc.fadeOut(0.7), cc.removeSelf()));
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
          node = new cc.LabelTTF(c.text, res.fontFamily, c.fontsize || 24);
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
  _wave: 0,
  finishRoute: function () {
    var waveData = res.challenges[this._wave++];
    this._remainTime = waveData.time[0];
    this._times = waveData.time.slice(1);
    this._timeDisp.setString(this._remainTime.toString() + '.0 s');
    this.initRoutes(blast.randomRoutes(waveData.length));
  },
  ctor: function () {
    this._super();
    this._remainTime = 0;
    this.finishRoute();
  }
});
