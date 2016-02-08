/* jslint bitwise: true, node: true, esversion: 6 */
'use strict';

class Input {
  constructor(text, user) {
    if (!(text && user)) {
      throw new Error('invalid input');
    }

    this.u = user;
    this.t = text;
    this.a = text.split(' ');
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
    // TODO: The entire thing.
  });
}

module.exports = {
  getText: getText,
  Input: Input
};
