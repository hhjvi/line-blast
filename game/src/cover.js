// The cover layer which is displayed at the end of a level or an endless game
// Because nothing lasts forever (doctor, actor, laywer or singer, ... :P)

blast.Cover = cc.LayerColor.extend({
  ctor: function (message) {
    this._super(cc.color(0, 0, 0, 192));
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function () { return true; }
    }, this);
  }
});
