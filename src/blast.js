var blast = {};

var EmptyScene = cc.Scene.extend({
  onEnter: function () {
    'use strict';
    this._super();
    cc.director.runScene(cc.TransitionFade.create(0.5, new blast.WelcomeScene(), cc.color(0, 0, 0)));
  }
});

// I'll make it from here!
window.onload = function() {
  'use strict';
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
  };
  cc.game.run('game_canvas');
};
