var helps = {};

function getHelp(input) {

  function recursiveHelpSearch(args, helpContext) {
    try {
      var curr = args[0];
      if (args.length === 1) {
        if (Array.isArray(helpContext[curr])) {
          return helpContext[curr];
        } else {
          return helpContext[curr]._default;
        }
      } else {
        args.splice(0, 1);
        return recursiveHelpSearch(args, helpContext[curr]);
      }
    } catch (e) {
      console.log(e);
      console.log(e.stack);
      return ['help for ' + input.args.join(' ') + ' does not exist'];
    }
  }

  var title = ' - secret_bot help - ' + input.args.join(' ') + ' - ';
  var arr = recursiveHelpSearch(input.args, helps);

  if (arr[0] === null) {
    throw new Error('function that always returns an array did not return an array');
  } else {
    return [title].concat(arr);
  }
}

function registerHelp(commandName, help) {
  helps[commandName] = help;
}
var helpHelp = [
  'for now, there is no help',
  'bot version: 3.1.something.4',
  'contact secret_online if you\'re having problems'
];
module.exports = {
  commands: {
    help: {
      f: getHelp,
      help: helpHelp,
      private: true
    }
  },
  registerHelp: registerHelp
};
