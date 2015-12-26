var fs = require('fs');
var http = require('http');
var perms = require('./perms.js');
// Set up modules
var commandHandlers = {};
var defautHandlers = [];
var addons = {};
// start http server

function loadAddons() {
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
          console.warn('either fix, or remove');
          return;
        }
        console.info('loaded ' + file);
        // Register commands
        if (addon.commands) {
          var comms = Object.keys(addon.commands);
          comms.forEach(function(item) {
            commandHandlers[item] = addon.commands[item];
          });
        }
        // Register default handlers
        if (addon.default) {
          addon.default.forEach(function(item) {
            defautHandlers.push(item);
          });
        }
      });
    }
  });
}

function startHTTPServ() {
  httpServer = http.createServer(function(request, response) {
    if (request.method === 'POST') {
      // Get POST body
      var reqBody = '';

      request.on('data', function(data) {
        reqBody += data;
      }).on('end', function() {
        /**
         * Callback if success
         */
        function success(data) {
          response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Server': 'secret_bot'
          });
          response.end(JSON.stringify(data));
        }
        /**
         * Callback if failed
         */
        function error(data) {
          response.writeHead(400, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Server': 'secret_bot'
          });
          response.end(JSON.stringify(data));
        }

        var input = JSON.parse(reqBody);
        // Attach functions to input object
        input.processText = processText;
        input.getText = getText;
        // Let's go
        try {
          getText(input, success, error);
        } catch (e) {
          console.error('error encountered while processing ' + reqBody);
          console.error(e);
          error([e.toString()]);
        }
      });
    } else {
      response.writeHead(405, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Server': 'secret_bot'
      });
      response.end(JSON.stringify(['requests must use POST']));
    }
  }).listen(25567, '127.0.0.1');
  console.log('Server running at http://127.0.0.1:25567/');
}

function getText(input, success, error) {
  var reply = [];

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
              if (error) {
                error(['insufficient permission level']);
              } else {
                return ['insufficient permission level'];
              }
            }
          }
        }
      } else {
        if (typeof handler === 'object') {
          if (handler.perm) {
            if (0 < handler.perm) {
              if (error) {
                error(['insufficient permission level']);
              } else {
                return ['insufficient permission level'];
              }
            }
          }
        }
      }
      input.args.splice(0, 1);
      var result;
      if (typeof handler === 'function') {
        result = handler(input, success, error);
      } else if (typeof handler === 'object') {
        result = handler.f(input, success, error);
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
      } else {
        error(['command ' + input.args[0] + ' does not exist']);
      }
    }
  }

  if (success) {
    if (reply.length) {
      success(reply);
    }
  } else {
    return reply;
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
startHTTPServ();

module.exports = {
  processText: processText
};