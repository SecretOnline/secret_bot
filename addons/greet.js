var fs = require('fs');
var greetings;
try {
  greetings = JSON.parse(fs.readFileSync('data/greetings.json'));
} catch (e) {
  greetings = {};
  fs.writeFileSync('data/greetings.json', JSON.stringify(greetings, null, 2));
}

function getGreeting(input) {
  if (input.args.length === 1) {
    if (greetings[input.args[0]]) {
      return [greetings[input.args[0]]];
    } else {
      return ['no greeting for ' + input.args[0]];
    }
  } else if (input.args[0] === 'set') {
    var name = input.args[1];
    input.args.splice(0, 2);
    var str = input.args.join(' ');
    greetings[name] = str;

    fs.writeFileSync('data/greetings.json', JSON.stringify(greetings, null, 2));

    var reply = ['greeeting "' + str + '" added for ' + name];
    return reply;
  }
}

module.exports = {
  commands: {
    greet: getGreeting
  }
};
