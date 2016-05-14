var fs = require('fs');

var queue = [];
var list = [];
var channel;




function refreshFiles(input) {
  return new Promise(function(resolve, reject) {
    fs.readFile('data/audio.json', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        list = JSON.parse(data);
      } catch (e) {
        reject(e);
        return;
      }

      resolve(`loaded ${list.length} songs`);
    });
  });
}

function setChannel(chan) {
  channel = chan;
}

module.exports = {
  commands: {
    next: getNext,
    reloadmusic: {
      f: refreshFiles,
      perm: 9
    }
  },
  setChannel: setChannel
};
