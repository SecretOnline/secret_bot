/* jslint bitwise: true, node: true, esversion: 6 */
'use strict';
var fs = require('fs');

var help = require('./help.js');

var commands = {};

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
        var ext = name.split('.').pop();
        var mod, obj, keys;
        if (ext === 'json') {
          try {
            obj = require.main.require(name);
          } catch (e) {
            console.error('error while require-ing ' + name + '. continuing');
            console.error(e);
            console.error(e.stack);
            res2();
            return;
          }

          keys = Object.keys(obj);
          keys.forEach(function(key) {
            commands[key] = obj[key];
          });

          console.log('loaded ' + name);
          res2();
        } else if (ext === 'js') {
          try {
            mod = require.main.require(name);
          } catch (e) {
            console.error('error while require-ing ' + name + '. continuing');
            console.error(e);
            console.error(e.stack);
            res2();
            return;
          }
          obj = mod.commands;
          keys = Object.keys(obj);
          keys.forEach(function(key) {
            commands[key] = obj[key];

            if (typeof obj[key] === 'object') {
              if (obj[key].help) {
                help.registerHelp(key, obj[key].help);
              }
            }
          });
          res2();

          console.log('loaded ' + name);
        } else {
          console.log('ignoring ' + name);
          res2();
        }

        commands.help = help.commands.help;
        help.registerHelp('help', help.commands.help.help);
      });
    }

    commands = {};

    fs.readdir('./addons/', function(err, data) {
      if (err) {
        reject(err);
        return;
      }

      var proms = [];
      data.forEach(function(item) {
        proms.push(loadAddon(item));
      });

      Promise.all(proms).then(resolve, function(err) {
        reject(err);
      });
    });
  });
}

function getText(input) {
  return new Promise(function(resolve, reject) {
    if (input.args.length === 0) {
      resolve('');
      return;
    }
    var comm = input.args.shift();
    var nextInput;
    if (input.args.length === 0) {
      nextInput = new Input([], input.user);
    } else {
      nextInput = new Input(input.args.join(' '), input.user);
    }
    var afterProm = getText(nextInput);
    afterProm.then(function(next) {
      var out = '';
      if (comm.charAt(0) === '~') {
        comm = comm.slice(1);
        if (commands[comm]) {
          if (typeof commands[comm] === 'string') {
            if (commands[comm].match(/\{args\}/)) {
              out = commands[comm].replace(/\{args\}/g, next);
            } else {
              out = commands[comm] + ' ' + next;
            }
          } else if (typeof commands[comm] === 'function') {
            out = commands[comm](new Input(next, input.user));
            if (out instanceof Promise) {
              out.then(function(result) {
                resolve(result);
              });
              return;
            }
          } else if (typeof commands[comm] === 'object') {
            out = commands[comm].f(new Input(next, input.user));
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
          out = comm + ' ' + next;
        } else {
          out = comm;
        }
      }

      resolve(out);
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
