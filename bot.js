/* jslint bitwise: true, node: true, esversion: 6 */
'use strict';

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

/**
 * Preocesses the input and resolves to an output
 * @param {Input} input An Input object to process
 * @return {Promise} A promise that rejects on invalid input, and resolves once input is processed
 */
function getText(input) {
  return new Promise(function(resolve, reject) {
    // For now, reject unless command at front
    console.log('input: ' + input.text);
    if (input.text.charAt(0) !== '~') {
      reject();
      return;
    }

    var prom = processPart(input);
    prom.then(function(res) {
      resolve(res);
    }, reject);
  });
}

function processPart(input) {
  return new Promise(function(resolve, reject) {
    if (input.args.length === 0) {
      resolve('');
    }

    var comm = input.args.shift();
    var afterProm = processPart(input);
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

module.exports = {
  getText: getText,
  Input: Input
};
