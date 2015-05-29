var blast = {};

var EmptyScene = cc.Scene.extend({
  onEnter: function () {
    'use strict';
    this._super();
    cc.director.runScene(
      cc.TransitionFade.create(0.5, new blast.WelcomeScene(), res.transitionColour));
  }
});

// I'll make it from here!
blast.bootstrap = function() {
  'use strict';
  document.getElementById('game_canvas').attributes.removeNamedItem('height');
  cc.game.onStart = function() {
    cc.director.setDisplayStats(true);
    cc.view.adjustViewPort(true);
    if (cc.sys.isMobile) {
      cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.FIXED_WIDTH);
    } else {
      cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
    }
    cc.view.resizeWithBrowserSize(true);
    // resources were not large, so we just start running scenes directly
    cc.director.runScene(new EmptyScene());
    blast.vsize = cc.director.getVisibleSize();
  };
  cc.game.run('game_canvas');
};

////////// TIME-RELATED GLOBAL METHODS //////////
blast.delayCall = function (delay, func, target) {
  cc.director.getScheduler().schedule(func, target, delay * 99, 1, delay, !target.isRunning());
};

////////// SCENE-RELATED GLOBAL METHODS //////////
blast.pushSceneAnimated = function (nextScene, callback) {
  var curScene = cc.director.getRunningScene();
  var cover = new cc.LayerColor(res.transitionColour);
  cover.setOpacity(0);
  cover.runAction(cc.sequence(
    cc.fadeIn(res.transitionTime / 2), cc.callFunc((function (s) { return function () {
      cc.director.pushScene(s);
    }; })(nextScene)),
    cc.delayTime(0.2),
    cc.callFunc(callback || function () {}),
    cc.fadeOut(res.transitionTime / 2)  // This will be played after popping the next scene
  ));
  curScene.addChild(cover, 9999999);
  cover = new cc.LayerColor(res.transitionColour);
  cover.runAction(cc.fadeOut(res.transitionTime / 2));
  cover.setTag(233333);
  nextScene.addChild(cover, 9999999);
  var backBtn = new cc.MenuItemImage(res.backBtnImage, res.backBtnImageSel, function () {
    this.getChildByTag(233333).runAction(cc.sequence(
      cc.fadeIn(res.transitionTime / 2),
      cc.callFunc(function () { cc.director.popScene(); })
    ));
  }, nextScene);
  backBtn.setAnchorPoint(cc.p(0, 1));
  backBtn.setNormalizedPosition(cc.p(0, 1));
  var menu = new cc.Menu(backBtn);
  menu.setPosition(cc.p(0, 0));
  nextScene.addChild(menu, 9999998);
};

////////// DATA-RELATED GLOBAL CONSTANTS & METHODS //////////
blast.dirMap = {'U': 0, 'R': 1, 'D': 2, 'L': 3};
blast.rowInc = [1, 0, -1, 0];
blast.colInc = [0, 1, 0, -1];
blast.turn = [[0, 3, 1], [1, 0, 2], [2, 1, 3], [3, 2, 0]];
blast.levelDataToRoutes = function (ld) {
  var lastRow = 0, lastCol = 0;
  return ld.map(function (str) {
    var r = lastRow, c = lastCol, d, ret = [{row: r, col: c}];
    for (var i = 0; i < str.length; ++i) {
      d = blast.dirMap[str.charAt(i)];
      ret.push({
        row: r += blast.rowInc[d],
        col: c += blast.colInc[d]
      });
    }
    lastRow = r, lastCol = c;
    return ret;
  });
};

// Player data
blast.levelSummary = function (levelId) {
  if (levelId === blast.curPlayer.levelCount) return 'To be challenged';
  else return levelId > blast.curPlayer.levelCount ?
    'Locked' :
    'Best: ' + blast.curPlayer.scores[levelId + 1].toFixed(1) + ' s';
};
