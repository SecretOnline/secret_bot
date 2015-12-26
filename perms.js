var fs = require('fs');
var perms = JSON.parse(fs.readFileSync('data/perms.json'));
var keys = JSON.parse(fs.readFileSync('data/keys.json'));

function changePermLevel(input) {
  var reply = [];
  var user = args.splice(0, 1)[0];
  var level = args.splice(0, 1)[0];
  if (level === 0) {
    delete perms[user];
  } else {
    perms[user] = level;
  }
  fs.writeFileSync('data/perms.json', JSON.stringify(perms, null, 2));

  return reply;
}

function getPermLevel(user, key) {
  if (perms[user]) {
    if (keys[key]) {
      return Math.min(perms[user], keys[key]);
    } else {
      return Math.min(perms[user], 5);
    }
  } else {
    return 0;
  }
}

module.exports = {
  commands: {
    perms: {
      f: changePermLevel,
      perm: 10
    }
  },
  getPermLevel: getPermLevel
};
