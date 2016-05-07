var fs = require('fs');
var perms = JSON.parse(fs.readFileSync('data/perms.json'));

fs.watch('data/perms.json', {}, (event, filename) => {
  if (event === 'change') {
    perms = JSON.parse(fs.readFileSync('data/perms.json'));
  }
});

function changePermLevel(input) {
  var ret;
  var user = input.args[0];
  var level = input.args[1];
  if (typeof level !== 'undefined') {
    perms[user] = level;
    ret = `set ${user}\'s permission level to ${level}`;
  }
  fs.writeFileSync('data/perms.json', JSON.stringify(perms, null, 2));

  return ret;
}

function getPermLevel(input) {
  var ret;
  var id = input.user.id || input.user;
  var level = retrievePermId(id);
  return `${user}\'s permission level is ${level}`;
}

function retrievePermId(id) {
  if (perms[id]) {
    return Math.max(0, perms[id]);
  } else {
    return 0;
  }
}

module.exports = {
  commands: {
    setperm: {
      f: changePermLevel,
      perm: 10
    },
    getperm: getPermLevel
  }
};
