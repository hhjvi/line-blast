<?php

header('Access-Control-Allow-Origin: *');
date_default_timezone_set('Asia/Shanghai');

$levelct = 4;
$levelscr = array();
$players = array();
$emails = array();

$op = $_GET['op'];
// Write log
$flog = fopen('log.txt', 'a');
fputs($flog, date('Y-m-d-H-i-s') . ' ');
// Read data
$fdat = fopen('data.txt', 'r');
$i = 0;
while (($s = trim(fgets($fdat))) != '') {
  $players[$i++] = $s;
}
$i = 0;
while (($s = trim(fgets($fdat))) != '') {
  $emails[$i++] = $s;
}
for ($i = 0; $i < count($players); $i++) {
  $levelscr[$i] = array();
  for ($j = 0; $j < $levelct; $j++) {
    fscanf($fdat, '%f', $levelscr[$i][$j]);
  }
}
fclose($fdat);

if ($op == 1) { // Register
  $newid = count($players);
  $name = $_GET['name'];
  $email = $_GET['email'];
  fprintf($flog, 'REGISTER %d %s %s', $newid, $name, $email);
  $players[$newid] = $name;
  $emails[$newid] = $email;
  $levelscr[$newid] = array();
  $levelscr[$newid][0] = 0;
  for ($j = 1; $j < $levelct; $j++) $levelscr[$newid][$j] = 998998;
} else if ($op == 2) {  // Log in
  fprintf($flog, 'LOGIN %d', $_GET['id']);
} else if ($op == 3 || $op == 4) {  // Level game
  $id = $_GET['id'];
  $lv = $_GET['lv'];
  $step = $_GET['step'];
  $time = $_GET['time'];
  fprintf($flog, 'LEVEL %d %d %d %.2f', $id, $lv, $step, $time);
  if ($op == 4 && $levelscr[$id][$lv] > $time)
    $levelscr[$id][$lv] = $time;
} else if ($op == 5) {  // Endless game
  $id = $_GET['id'];
  $step = $_GET['step'];
  fprintf($flog, 'ENDLESS %d %d', $id, $step);
  if ($levelscr[$id][0] < $step)
    $levelscr[$id][0] = $step;
}

fputs($flog, "\n");
fclose($flog);
// Write data
$fdat = fopen('data.txt', 'w');
for ($i = 0; $i < count($players); $i++)
  fputs($fdat, $players[$i] . "\n");
fputs($fdat, "\n");
for ($i = 0; $i < count($emails); $i++)
  fputs($fdat, $emails[$i] . "\n");
fputs($fdat, "\n");
for ($i = 0; $i < count($players); $i++) {
  for ($j = 0; $j < $levelct; $j++) {
    fprintf($fdat, "%.2f\n", $levelscr[$i][$j]);
  }
}
fputs($fdat, "\n");
fclose($fdat);

?>
