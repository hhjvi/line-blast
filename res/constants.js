var res = res || {};
var cc = cc || {};

res.transitionTime = 1;
res.transitionColour = cc.color(0, 0, 0);
res.backBtnImage = 'res/back.png';
res.backBtnImageSel = 'res/back_sel.png';

res.engineAck = 'Powered by Cocos2d-JS v3.6';
res.engineLabelColour = cc.color(128, 128, 255);

res.levelMode = 'Levels';
res.endlessMode = 'Endless';

res.ctrlBtnImg = ['res/turn.png', 'res/straight.png', 'res/straight.png', 'res/turn.png'];

////////// LEVELS //////////
//-- Level Mode --//
res.levels = [
  // Levels 1~3 with tutorials
  {route: ['UURR']},
  {route: ['ULLDDDRR']},
  {route: ['RRUU']},
  {route: ['LDRRUULL']}
];

//-- Endless Mode --//
