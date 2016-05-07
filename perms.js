var fs = require('fs');
var perms = JSON.parse(fs.readFileSync('data/perms.json'));

fs.watch('data/perms.json', {}, (event, filename) => {
  if (event === 'change') {
    perms = JSON.parse(fs.readFileSync('data/perms.json'));
    console.log('reloaded permissions');
  }
});

function getPermLevel(user) {
  var id = user.id || user;
  if (perms[id]) {
    console.log(perms[id]);
    return Math.max(0, perms[id]);
  } else {
    return 0;
  }
}

module.exports = {
  get: getPermLevel
};
