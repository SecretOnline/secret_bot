/* jslint bitwise: true, node: true, esversion: 6 */
'use strict';
var fs = require('fs');

var commands = {
  test: 'test successful',
  test2: function() {
    return 'other test successful';
  },
  test3: function() {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve('test promise successful');
      }, 1000);
    });
  }
};

class Input {
  constructor(text, user) {
    if (!(text && user)) {
      throw new Error('invalid input');
    }

    if (Array.isArray(text)) {
      this.a = text;
      this.t = text.join(' ');
    } else {
      this.t = text;
      this.a = text.split(' ');
    }

    this.u = user;
  }

  get args() {
    return this.a;
  }

  get text() {
    return this.t;
  }

  get user() {
    if (this.u instanceof Object) {
      return this.u.name;
    } else {
      return this.u;
    }
  }
}

function reloadAddons() {
  return new Promise(function(resolve, reject) {
    /**
     * Loads a single addon
     */
    function loadAddon(name) {
      return new Promise(function(res2, rej2) {
        name = './addons/' + name;
        if (name.split('.').pop() === 'json') {
          fs.readFile(name, function(err, data) {
            if (err) {
              rej2(err);
              return;
            }

            var obj = JSON.parse(data);
            var keys = Object.keys(obj);
            keys.forEach(function(key) {
              commands[key] = obj[key];
            });

            res2();
          });
        } else {
          res2();
        }
      });
    }

    commands = {};

    fs.readdir('./addons/', function(err, data) {
      if (err) {
        console.error(err);
        console.error(err.stack);
        reject(err);
        return;
      }

      var proms = [];
      data.forEach(function(item) {
        proms.push(loadAddon(item));
      });

      Promise.all(proms).then(function() {
        resolve();
      }, function(e) {
        console.error('failed');
        console.error(e);
        console.error(e.stack);
      });
    });
  });
}

function getText(input) {
  return new Promise(function(resolve, reject) {
    if (input.args.length === 0) {
      resolve('');
    }

    var comm = input.args.shift();
    var afterProm = getText(input);
    afterProm.then(function(next) {
      var out = '';
      if (comm.charAt(0) === '~') {
        comm = comm.slice(1);
        if (commands[comm]) {
          if (typeof commands[comm] === 'string') {
            out = commands[comm];
          } else if (typeof commands[comm] === 'function') {
            out = commands[comm]();
            if (out instanceof Promise) {
              out.then(function(result) {
                resolve(result);
              });
              return;
            }
          }
          // } else if (aliases[comm]) {

        } else {
          reject(new Error('no command ' + comm));
          return;
        }
      } else {
        if (next) {
          out = comm;
        } else {
          out = comm;
        }
      }

      if (next) {
        resolve(out + ' ' + next);
      } else {
        resolve(out);
      }
    });
  });
}

// function aliasChange(input) {
//   var reply = [];
//   var comm = input.args.splice(0, 1)[0];
//   var key = input.args.splice(0, 1)[0];
//   if (comm === 'add') {
//     var res = input.processText(input);
//     if (aliases[key])
//       reply.push('alias already exists');
//     else {
//       aliases[key] = res;
//       reply.push('alias \'' + key + '\' added');
//     }
//   } else if (comm === 'remove') {
//     if (aliases[key]) {
//       delete aliases[key];
//       reply.push('alias \'' + key + '\' removed');
//     } else
//       reply.push('alias doesn\'t exist');
//   }
//
//   fs.writeFileSync('data/aliases.json', JSON.stringify(aliases, null, 2));
//
//   return reply;
// }

var ready = reloadAddons();

module.exports = {
  getText: getText,
  Input: Input,
  ready: ready
};
