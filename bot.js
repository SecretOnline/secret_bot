/* jslint bitwise: true, node: true, esversion: 6 */
'use strict';

var modules = new Map();

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
    if (input.text.chatAt(0) !== '~') {
      reject();
      return;
    }

    var prom = processPart(input);
    prom.then(function(res) {
      resolve(res);
    }, function(err) {
      reject(err);
    });
  });
}

function processPart(input) {
  return new Promise(function(resolve, reject) {
  });
}

module.exports = {
  getText: getText,
  Input: Input
};
