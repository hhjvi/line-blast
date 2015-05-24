// The draggable scroll view.
// CCUI's scroll view is *really* plump...
// TODO: Only supports children whose anchor points are exactly (0, 0)

blast.inRegion = function (p, info) {
  return p >= info.posY && p <= info.posY + info.height;
};

blast.Draggable = cc.Layer.extend({
  _heightY: 0, _startPosY: 0, _dragStartPos: null,
  _selectable: [], _selectedIdx: -1,
  ctor: function () {
    this._super();
    var _parent = this;
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function (touch, event) {
        _parent._heightY = _parent.getContentSize().height - blast.vsize.height;
        _parent._startPosY = _parent.getPosition().y;
        _parent._dragStartPos = touch.getLocation();
        var nodeSpacePosY = _parent.convertTouchToNodeSpace(touch).y;
        for (var i in _parent._selectable) {
          if (blast.inRegion(nodeSpacePosY, _parent._selectable[i])) {
            _parent._selectedIdx = i;
            _parent._selectable[i].node.activateSelect();
            break;
          }
        }
        return true;
      },
      onTouchMoved: function (touch, event) {
        if (_parent._selectedIdx !== -1
            && cc.pDistanceSQ(_parent._dragStartPos, touch.getLocation()) >= 10) {
          _parent._selectable[_parent._selectedIdx].node.deactivateSelect();
          _parent._selectedIdx = -1;
        }
        var newPosY = _parent._startPosY + touch.getLocation().y - _parent._dragStartPos.y;
        if (newPosY > 0) newPosY = 0;
        else if (newPosY < -_parent._heightY) newPosY = -_parent._heightY;
        _parent.setPositionY(newPosY);
      },
      onTouchEnded: function (touch, event) {
        // Often _selectedIdx is a string but -1 is set explicitly by our code, so === can work.
        if (_parent._selectedIdx !== -1) {
          _parent._selectable[_parent._selectedIdx].node.deactivateSelect();
          _parent._selectable[_parent._selectedIdx].node.activateClick();
          _parent._selectedIdx = -1;
        }
      }
    }, this);
  },
  initPosition: function () {
    if (this.getContentSize().height < blast.vsize.height)
      this.setContentSize(this.getContentSize().width, blast.vsize.height);
    this._heightY = this.getContentSize().height - blast.vsize.height;
    this.setPositionY(-this._heightY);
  },
  addSelectableChild: function (child) {
    this._selectable.push({
      node: child, posY: child.getPosition().y, height: child.getContentSize().height
    });
    this.addChild(child);
  }
});

var DLI_TitleFontSize = 36;
var DLI_SubtitleFontSize = 26;
var DLI_Height = 100;
blast.DraggableListItem = cc.LayerColor.extend({
  _callback: null, _target: null, _id: -1,
  _titleLabel: null, _subtitleLabel: null,
  ctor: function (id, title, subtitle, callback, target) {
    this._super(cc.color(0, 0, 0));
    this._id = id;
    this._callback = callback;
    this._target = target;
    // Show text
    this.setContentSize(cc.size(blast.vsize.width, DLI_Height));
    var titleLabel = new cc.LabelTTF(title, '', DLI_TitleFontSize);
    titleLabel.setAnchorPoint(cc.p(0, 0));
    titleLabel.setPosition(cc.p(6, DLI_SubtitleFontSize + 12));
    this.addChild(titleLabel);
    this._titleLabel = titleLabel;
    var subtitleLabel = new cc.LabelTTF(subtitle, '', DLI_SubtitleFontSize);
    subtitleLabel.setAnchorPoint(cc.p(0, 0));
    subtitleLabel.setPosition(cc.p(6, 6));
    this.addChild(subtitleLabel);
    this._subtitleLabel = subtitleLabel;
  },
  activateSelect: function () {
    this.runAction(cc.tintTo(0.2, 0, 0, 144));
  },
  deactivateSelect: function () {
    this.stopAllActions();
    this.runAction(cc.tintTo(0.2, 0, 0, 0));
  },
  activateClick: function () {
    if (this._callback) this._callback.call(this._target, this._id);
  },
  getTitleLabel: function () { return this._titleLabel; },
  getSubtitleLabel: function () { return this._subtitleLabel; }
});
