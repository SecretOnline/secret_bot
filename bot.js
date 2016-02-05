/* jslint bitwise: true, node: true */
/* global Promise */
'use strict';
var fs = require('fs');
var perms = require('./perms.js');
var help = require('./help.js');
// Set up modules
var commandHandlers = {};
var defautHandlers = [];
var addons = {};

function loadAddons() {
  function loadAO(addon) {
    // Register commands
    if (addon.commands) {
      var comms = Object.keys(addon.commands);
      comms.forEach(function(item) {
        commandHandlers[item] = addon.commands[item];
        if (typeof commandHandlers[item] === 'object') {
          if (commandHandlers[item].help) {
            help.registerHelp(item, commandHandlers[item].help);
          }
        }
      });
    }
    // Register default handlers
    if (addon.default) {
      addon.default.forEach(function(item) {
        defautHandlers.push(item);
      });
    }
  }

  // List all files in addons directory
  console.info('loading addons');
  fs.readdir('./addons', function(e, files) {
    if (e) {
      console.err('unable to find addons directory. exiting');
      process.exit(1);
    } else {
      // Try load each file in the directory
      files.forEach(function(file) {
        var addon;
        try {
          addon = require('./addons/' + file);
        } catch (e) {
          console.warn('file ' + file + ' is not a node module or contains errors');
          console.error(e.message);
          console.warn('either fix, or remove');
          return;
        }
        loadAO(addon);
        console.info('loaded ' + file);
      });
    }
  });
  loadAO(perms);
  loadAO(help);
}

function getText(input) {
  return new Promise(function(resolve, reject) {
    if (!input.user) {
      reject(new Error('no user specified'));
    }

    var out = {};
    var perm = perms.getPermLevel(input.user, input.key);
    var replyPromise;

    if (typeof handler === 'object') {
      if (handler.perm) {
        if (permLevel < handler.perm) {
          reject(new Error('insufficient permission'));
          return;
        }
      }
    }

function getText(input, success, error) {
  var reply = [];
  var extraProperties = {};

  if (input.args) {
    input.args[0] = input.args[0].substring(1);
    var handler = commandHandlers[input.args[0]];
    if (handler) {
      // Do perms stuff here
      if (input.user) {
        var permLevel = perms.getPermLevel(input.user, input.key);
        if (typeof handler === 'object') {
          if (handler.perm) {
            if (permLevel < handler.perm) {
              error(['insufficient permission level']);
            }
          }
        }
      } else {
        if (typeof handler === 'object') {
          if (handler.perm) {
            if (0 < handler.perm) {
              error(['insufficient permission level']);
            }
          }
        }
      }
      input.args.splice(0, 1);
      var result;
      if (typeof handler === 'function') {
        result = handler(input);
      } else if (typeof handler === 'object') {
        result = handler.f(input);
        if (handler.private) {
          extraProperties.private = true;
        }
      }
      if (result) {
        reply = result;
      }
    } else {
      var res;
      defautHandlers.forEach(function(h) {
        if (!res) {
          res = h(input);
        }
      });
      if (res) {
        reply = res;
      }
    }
  }

  if (reply.length) {
    success(reply, extraProperties);
  } else {
    error(['command ' + input.args[0] + ' does not exist']);
  }
}

function processText(input) {
  if (input.args.length === 0) {
    return '';
  }

  var words = input.args;
  var str = '';

  var retIndex = words.indexOf('~return');
  if (retIndex > -1) {
    words.splice(retIndex);
  }

  var breakIndex = words.indexOf('~break');
  if (breakIndex > -1) {

    var second = words.splice(breakIndex + 1, words.length); // second arg doesn't matter, as it'll just take all the end elements
    words.splice(breakIndex, 1);

    input.args = words;
    var part1 = processText(input);
    input.args = second;
    var part2 = processText(input);
    str = part1 + ' ' + part2;

    return str;
  }

  for (var i = 0; i < words.length; i++) {
    // Add a space between words
    if (i > 0)
      str += ' ';
    // If it's a command
    if (words[i].charAt(0) === '~' || words[i].charAt(0) === '`') {
      // Split into new arguments
      var oldArgs = words;
      input.args = words.splice(i);
      // Get the result, and add it on
      var temp = getText(input);
      console.log(typeof temp);
      var newString = temp.join(' ');
      //var newString = getText(input).join(' ');
      input.args = words;
      str += newString;
      break;
    } else
    // Just add the string
      str += words[i];
  }

  return str;
}

loadAddons();

module.exports = {
  processText: processText
};
