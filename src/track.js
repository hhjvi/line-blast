// The track, which displays a part of the map.
blast.stepLen = 100;
blast.rowcolToNodePos = function (e) { return cc.p(e.row * blast.stepLen, e.col * blast.stepLen); };

blast.Track = cc.DrawNode.extend({
  _blankColour: cc.color.WHITE,
  _passedColour: cc.color(0, 128, 255),
  _route: [], _curLoc: 0,
  ctor: function (route, blankColour, passedColour) {
    this._super();
    this._route = route.map(blast.rowcolToNodePos);
    blankColour && (this._blankColour = blankColour);
    passedColour && (this._passedColour = passedColour);
    for (var i = 1; i < route.length; ++i) {
      this.drawDot(this._route[i], 10, this._blankColour);
      this.drawSegment(this._route[i - 1], this._route[i], 5, this._blankColour);
    }
  },
  // Moves one step forward.
  // That's one small step for a man, one giant leap for mankind. No, no, that's not the restroom OMG
  // http://www.phrases.org.uk/meanings/324100.html
  step: function () {
    ++this._curLoc;
    this.clear();
    for (var i = this._curLoc + 1; i < this._route.length; ++i) {
      this.drawDot(this._route[i], 10, this._blankColour);
      this.drawSegment(this._route[i - 1], this._route[i], 5, this._blankColour);
    }
    for (var i = 1; i <= this._curLoc; ++i) {
      this.drawDot(this._route[i], 10, this._passedColour);
      this.drawSegment(this._route[i - 1], this._route[i], 5, this._passedColour);
    }
    return cc.pSub(this._route[this._curLoc - 1], this._route[this._curLoc]);
  }
});
