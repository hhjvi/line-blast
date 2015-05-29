var blast = blast || {};
var levelct = 25;

blast.callPHP = function (params) {
  var r = new XMLHttpRequest();
  r.open('GET', 'http://cg-u4.cn.gp/lb/lbs.php?' + params, true);
  r.send();
};

// Load online data
var r = new XMLHttpRequest();
r.open('GET', 'http://cg-u4.cn.gp/lb/data.php', false);
r.send();
document.body.removeChild(document.getElementById('loading_text'));
document.getElementById('login_area').attributes.removeNamedItem('display');
var s = r.responseText.split('\n'), i = -1, j, k;
var players = [];
while (s[++i] != '') {
  players[i] = {name: s[i], email: '', scores: []};
}
j = i + 1;
while (s[++i] != '') {
  players[i - j].email = s[i];
}
k = i;
for (i = 0; i < players.length; ++i)
  for (j = 0; j < levelct; ++j)
    players[i].scores[j] = parseFloat(s[++k]);
blast.players = players;

// Boots the game.
function bootstrap() {
  document.body.removeChild(document.getElementById('login_area'));
  // Preprocessing
  for (var i = 0; i < blast.players.length; ++i)
    if (blast.players[i].scores[1] === 998998) {
      blast.players[i].levelCount = 0;
    } else {
      var j = 1;
      while (blast.players[i].scores[j] !== 998998) ++j;
      blast.players[i].levelCount = j - 1;
    }
  blast.curPlayer = blast.players[blast.curPlayerID];
  ldbd = [];
  for (var i = 0; i < levelct; ++i) ldbd[i] = 1 << 30;
  for (var i = 0; i < levelct; ++i)
    for (var j = 0; j < players.length; ++j)
      if (players[j].scores[i + 1] < ldbd[i])
        ldbd[i] = players[j].scores[i + 1];
  blast.leaderboard = {levelScores: ldbd};
  blast.bootstrap();
}

// Called when the 'Go!' button is clicked
function login() {
  var name = document.getElementById('ipt_name').value;
  var playerID = -1;
  for (var i = 0; i < blast.players.length; ++i) {
    if (blast.players[i].name === name) { playerID = i; break; }
  }
  if (playerID === -1) {
    var email = document.getElementById('ipt_email').value;
    if (email === '') {
      // Call on to register.
      document.getElementById('ipt_email').style.display = '';
      alert('请填写电子邮件以便后续联系\n(如果不想被联系到就随便写吧……)');
    } else {
      // Register here
      var p = {name: name, email: email, scores: [0]};
      for (j = 1; j < levelct; ++j) p.scores[j] = 998998;
      blast.players.push(p);
      blast.callPHP('op=1&name=' + encodeURI(name) + '&email=' + encodeURI(email));
      blast.curPlayerID = blast.players.length - 1;
      bootstrap();
    }
  } else {
    // Log in.
    blast.curPlayerID = playerID;
    blast.callPHP('op=2&id=' + playerID.toString());
    bootstrap();
  }
}
