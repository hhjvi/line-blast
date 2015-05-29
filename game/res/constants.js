var res = res || {};
var cc = cc || {};

res.fontFamily = 'Fira Sans';

res.transitionTime = 1;
res.transitionColour = cc.color(0, 0, 0);
res.backBtnImage = 'res/back.png';
res.backBtnImageSel = 'res/back_sel.png';

res.engineAck = 'Powered by Cocos2d-JS v3.6';
res.engineLabelColour = cc.color(128, 128, 255);

res.levelMode = '关卡';
res.endlessMode = '排行榜';

res.ctrlBtnImg = ['res/turn.png', 'res/straight.png', 'res/straight.png', 'res/turn.png'];

////////// LEVELS //////////
//-- Level Mode --//
res.levels = [
  // Levels 1~5 with tutorials
  {
    time: [15],
    route: ['UUUUUUU'],
    tutorial: [
      {img: 'res/straight.png', pos: cc.p(0, 100), scale: 0.55},
      {img: 'res/straight.png', pos: cc.p(0, 200), scale: 0.55},
      {img: 'res/straight.png', pos: cc.p(0, 300), scale: 0.55},
      {text: '中间的两个按钮\n分别是给左手和右手的。', pos: cc.p(0, -60)}
    ]
  }, {
    time: [15],
    route: ['UURR'],
    tutorial: [
      {img: 'res/straight.png', pos: cc.p(0, 100), scale: 0.55},
      {img: 'res/turn.png', pos: cc.p(15, 200), scale: 0.7, flipx: true},
      {img: 'res/straight.png', pos: cc.p(100, 200), scale: 0.55, rotation: 90},
      {text: '直走，右转。', pos: cc.p(0, -50)}
    ]
  },
  {time: [15], route: ['ULLDDDRR']},
  {
    time: [15],
    route: ['RRUU'],
    tutorial: [
      {img: 'res/turn.png', pos: cc.p(200, 15), scale: 0.7, rotation: 90},
      {text: '游戏开始时，你不一定是朝上的。', pos: cc.p(0, -50)}
    ]
  }, {
    time: [15],
    route: ['LDRRUULL'],
    tutorial: [
      {text: '挑战来了！', pos: cc.p(0, 133)}
    ]
  },
  // Levels 6~10: First wave of challenge
  {time: [10], route: ['LDLDLDLDLDLDLDLDLDLDLDLDLDLDLD']},
  {time: [10], route: ['URRRDRDDDLLLDLLDLDLUUUR']},
  // Levels 11~15: A peak at the sections
  {
    time: [15, 15],
    route: ['DDDRR', 'RRUUU'],
    tutorial: [
      {text: '近视的感觉如何？？', pos: cc.p(0, 40)}
    ]
  }, {
    time: [15, 15],
    route: ['URRRR', 'DRRRR']
  }, {
    time: [1, 0, 0, 15],
    route: ['R', 'U', 'U', 'LULLLLLLUU'],
    tutorial: [
      {text: '有时反射弧的长度还是很重要的。', pos: cc.p(0, -40)}
    ]
  },
  // Levels 16~20: Second wave of challenge
  {
    time: [15, 15],
    route: ['LUUURURRDLDDDDDRRU', 'L']
  },
  // Levels 21~25: A peek at the rotations
  {
    time: [20],
    route: ['RRRRURRDLDDD'],
    rotate: 10,
    tutorial: [
      {text: '天旋地转……', pos: cc.p(-20, -40)}
    ]
  }
];
