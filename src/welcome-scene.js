blast.enableTapToStart = function (target, next_scene) {
  cc.eventManager.addListener({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    onTouchBegan: function (touch, event) {
      cc.director.runScene(new cc.TransitionFade(1, next_scene, cc.color(0, 0, 0)));
      return true;
    }
  }, target);
};

blast.WelcomeScene = cc.Scene.extend({
  showTapToStart: function (label) {
    label.runAction(cc.sequence(
      cc.delayTime(1), cc.fadeIn(1.2 * 255 / 192),
      cc.callFunc(function () {
        label.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(1.2, 192), cc.fadeTo(1.2, 255))));
      })
    ));
  },
  onEnter: function () {
    this._super();
    blast.enableTapToStart(this, new cc.Scene());
    // The title
    var titleLabel = new cc.LabelTTF('Line Blast!', '', 58);
    titleLabel.setNormalizedPosition(cc.p(0.5, 0.8));
    this.addChild(titleLabel);
    var tapLabel = new cc.LabelTTF('Tap to start', '', 36);
    tapLabel.setNormalizedPosition(cc.p(0.5, 0.4));
    tapLabel.setOpacity(0);
    this.addChild(tapLabel);
    this.showTapToStart(tapLabel);
  }
});
