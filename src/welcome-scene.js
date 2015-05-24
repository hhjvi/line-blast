blast.WelcomeScene = cc.Scene.extend({
  enterLevels: function () {
    blast.pushSceneAnimated(new blast.LevelListScene());
  },
  enterEndless: function () {
    blast.pushSceneAnimated(new blast.GameScene_Endless());
  },
  ctor: function () {
    this._super();
    // The title
    var titleLabel = new cc.LabelTTF('Line Blast!', '', 58);
    titleLabel.setNormalizedPosition(cc.p(0.5, 0.8));
    this.addChild(titleLabel);
    // Acknowledgement
    var nginLabel = new cc.LabelTTF(res.engineAck, '', 20);
    nginLabel.setColor(res.engineLabelColour);
    nginLabel.setAnchorPoint(cc.p(0.5, 0));
    nginLabel.setNormalizedPosition(cc.p(0.5, 0));
    this.addChild(nginLabel);
    // Player's name
    var playerLabel = new cc.LabelTTF(
      blast.player.name + '\nLevels Score: 1000 / Rank 5\nEndless Score: 888 / Rank 4', '', 18);
    playerLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
    playerLabel.setAnchorPoint(cc.p(1, 1));
    playerLabel.setNormalizedPosition(cc.p(1, 0.7));
    this.addChild(playerLabel);
    // Level mode entry
    var levelLabel = new cc.LabelTTF(res.levelMode, '', 36);
    var levelBtn = new cc.MenuItemLabel(levelLabel, this.enterLevels, this);
    levelBtn.setNormalizedPosition(cc.p(0.5, 0.4));
    // Endless mode entry
    var endlessLabel = new cc.LabelTTF(res.endlessMode, '', 36);
    var endlessBtn = new cc.MenuItemLabel(endlessLabel, this.enterEndless, this);
    endlessBtn.setNormalizedPosition(cc.p(0.5, 0.25));
    var menu = new cc.Menu(levelBtn, endlessBtn);
    menu.setPosition(cc.p(0, 0));
    this.addChild(menu);
  }
});
