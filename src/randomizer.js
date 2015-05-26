// Random route generator
// Random-related functions
function ran_int(range) {
  return Math.floor(Math.random() * range);
}
function ran_shuffle(array) {
  for (var i = 1; i < array.length; ++i) {
    var j = ran_int(i);
    var t = array[i]; array[i] = array[j]; array[j] = t;
  }
  for (var i = 1; i < array.length; ++i) {
    var j = ran_int(i);
    var t = array[i]; array[i] = array[j]; array[j] = t;
  }
  return array;
}

// Position-related functions
// Prototypes are not used since we don't need toString() calls frequently.
function pos(row, col) {
  return { row: row, col: col };
}
function pos_hash(pos) {
  return (pos.row << 12) + pos.col;
}
function pos_tostring(pos) {
  return '(' + pos.row + ', ' + pos.col + ')';
}

// By order: up, right, down, left
var directions = [pos(1, 0), pos(0, 1), pos(-1, 0), pos(0, -1)];
directions.reverse_move = [2, 3, 0, 1];

ran_path_mark = {};     // The 'visited' array.
ran_path_ret = [];      // Stores the path in the reversed order.
ran_path_len = 0;
ran_path_turn_prob = 0;
// Generates a random path using the depth-first search method.
// Doesn't need much explanation since it's an ordinary DFS function.
function ran_path_dfs(depth, last_move, p) {
  if (depth === ran_path_len) return true;

  var order = ran_shuffle([0, 1, 2, 3]);
  if (Math.random() >= ran_path_turn_prob) order.unshift(last_move);
  for (var i in order) if (order[i] !== directions.reverse_move[last_move]) {
    var pp = pos(p.row + directions[order[i]].row, p.col + directions[order[i]].col);
    if (!ran_path_mark[pos_hash(pp)]) {
      ran_path_mark[pos_hash(pp)] = true;
      if (ran_path_dfs(depth + 1, order[i], pp)) {
        // Push to the reversed path.
        // The array needs to be reversed because the recursive method
        // puts all elements to the array in the reverse order.
        ran_path_ret.push(pp);
        return true;
      } else ran_path_mark[pos_hash(pp)] = false;
    }
  }
  return false;
}
function ran_path(len, turn_prob) {
  ran_path_mark = {};
  ran_path_ret = [];
  ran_path_len = len;
  ran_path_turn_prob = turn_prob;

  ran_path_mark[pos_hash(pos(0, 0))] = true;
  ran_path_dfs(0, 0, pos(0, 0));

  // Reverse the whole array to get the generated path.
  return ran_path_ret.reverse();
}

blast.randomRoutes = function (lengths) {
  var ret = [], totLen = 0;
  for (var i = 0; i < lengths.length; ++i) totLen += lengths[i];
  var route = ran_path(totLen, 0.35), curLen = 0;
  for (var i = 0; i < lengths.length; ++i) {
    ret.push(route.slice(curLen, curLen + lengths[i]));
    curLen += lengths[i];
  }
  ret[0].unshift(pos(0, 0));
  for (var i = 1; i < lengths.length; ++i)
    ret[i].unshift(ret[i - 1][ret[i - 1].length - 1]);
  return ret;
};
