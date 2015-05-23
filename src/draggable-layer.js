// The draggable scroll view.
// CCUI's scroll view is *really* plump...

blast.Draggable = cc.Layer.extend({
  _heightY: 0, _startPosY: 0, _dragStartY: 0,
  ctor: function () {
    this._super();
    var _parent = this;
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function (touch, event) {
        _parent._heightY = _parent.getContentSize().height - blast.vsize.height;
        _parent._startPosY = _parent.getPosition().y;
        _parent._dragStartY = touch.getLocation().y;
        return true;
      },
      onTouchMoved: function (touch, event) {
        var newPosY = _parent._startPosY + touch.getLocation().y - _parent._dragStartY;
        if (newPosY > 0) newPosY = 0;
        else if (newPosY < -_parent._heightY) newPosY = -_parent._heightY;
        _parent.setPositionY(newPosY);
      }
    }, this);
  },
  initPosition: function () {
    if (this.getContentSize().height < blast.vsize.height)
      this.setContentSize(this.getContentSize().width, blast.vsize.height);
    this._heightY = this.getContentSize().height - blast.vsize.height;
    this.setPositionY(-this._heightY);
  }
});
