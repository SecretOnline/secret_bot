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

module.exports = {
  commands: {
    getid: {
      f: getId,
      perm: 5
    },
    random: randomPick,
    range: {
      f: getRange,
      perm: 5
    }
  }
};
