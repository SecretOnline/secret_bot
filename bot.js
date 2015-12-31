var fs = require('fs');
var http = require('http');
var perms = require('./perms.js');
var help = require('./help.js');
// Set up modules
var commandHandlers = {};
var defautHandlers = [];
var addons = {};
// start http server

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
        function success(data, out) {
          if (!out) {
            out = {};
          }
          response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Server': 'secret_bot'
          });
          out.status = 'success';
          out.data = data;
          response.end(JSON.stringify(out));
        }
        /**
         * Callback if failed
         */
        function error(data, out) {
          if (!out) {
            out = {};
          }
          response.writeHead(400, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Server': 'secret_bot'
          });
          out.status = 'error';
          out.error = data;
          response.end(JSON.stringify(out));
        }

        var input = JSON.parse(reqBody);

        if (input.text) {
          input.args = input.text.split(' ');
        }
        if (!input.user) {
          input.user = 'no-user';
        }
        // Attach functions to input object
        input.processText = processText;
        input.getText = getText;
        // Let's go
        if (!input.type || input.type === 'text') {
          console.log(input.user + ': ' + input.args.join(' '));
          try {
            getText(input, success, error);
          } catch (e) {
            console.error(e);
            error([
              'error occured: ' + e.message,
              'this error has been logged'
            ]);
            //TODO: Actually log the error
          }
        } else if (input.type === 'greet') {
          input.args = ['~greet'].concat([input.user]);

          getText(input, function(out) {
            if (out[0] === 'no greeting for ' + input.args[0]) {
              error(['no greeting']);
            } else {
              success(out);
            }
          }, error);
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

// TODO: add greeting replier

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
startHTTPServ();

module.exports = {
  processText: processText
};
