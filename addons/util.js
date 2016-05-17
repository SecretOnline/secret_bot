function getId(input) {
  return input.text.replace(/<@(\d+)>/g, '$1');
}

function randomPick(input) {
  var words = input.text.split(' ');
  return words[Math.floor(Math.random() * words.length)];
}

function getRange(input) {
  var ret = '';
  var a = Number.parseInt(input.args[0]);
  var b = Number.parseInt(input.args[1]);
  for (var i = a; i <= b; i++) {
    ret += i;
    if (i != b) {
      ret += ' ';
    }
  }
  return ret;
}

function reverse(input) {
  return input.args.reverse().join(' ');
}

function getGrep(input) {
  var rgx = new RegExp(input.args[0]);
  var results = [];
  input.args.shift();
  input.args.forEach(function(val) {
    if (rgx.test(val)) {
      results.push(val);
    }
  });
  return results;
}

function getMatch(input) {
  var rgx = new RegExp(input.args[0], 'g');
  input.args.shift();
  var testString = input.args.join(' ');
  var res = testString.match(rgx);
  return res.join(' ');
}

module.exports = {
  commands: {
    getid: {
      f: getId,
      perm: 1
    },
    random: randomPick,
    range: {
      f: getRange,
      perm: 5
    },
    grep: getGrep,
    match: getMatch,
    reverse: reverse
  }
};
