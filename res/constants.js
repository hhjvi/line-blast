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
  // Levels 1~5 with tutorials
  {
    route: ['UUUUUUU'],
    tutorial: [
      {img: 'res/straight.png', pos: cc.p(0, 100), scale: 0.55},
      {img: 'res/straight.png', pos: cc.p(0, 200), scale: 0.55},
      {img: 'res/straight.png', pos: cc.p(0, 300), scale: 0.55},
      {text: 'Two buttons in the middle\nare for L.H. & R.H.', pos: cc.p(0, -60)}
    ]
  }, {
    route: ['UURR'],
    tutorial: [
      {img: 'res/straight.png', pos: cc.p(0, 100), scale: 0.55},
      {img: 'res/turn.png', pos: cc.p(15, 200), scale: 0.7, flipx: true},
      {img: 'res/straight.png', pos: cc.p(100, 200), scale: 0.55, rotation: 90},
      {text: 'Walk to that corner\nand turn right.', pos: cc.p(0, -50)}
    ]
  },
  {route: ['ULLDDDRR']},
  {
    route: ['RRUU'],
    tutorial: [
      {img: 'res/turn.png', pos: cc.p(200, 15), scale: 0.7, rotation: 90},
      {text: 'You don\'t always start\nfacing the top.', pos: cc.p(0, -50)}
    ]
  }, {
    route: ['LDRRUULL'],
    tutorial: [
      {text: 'Want a little challenge??', pos: cc.p(0, 133)}
    ]
  }
];

//-- Endless Mode --//
