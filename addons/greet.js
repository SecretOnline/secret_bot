var fs = require('fs');

var greetings;

function getGreet(input) {
  if (greetings[input.text]) {
    return greetings[input.text];
  } else {
    throw new Error('no greeting for ' + input.text);
  }
}

greetings = JSON.parse(fs.readFileSync('data/greetings.json'));

module.exports = {
  commands: {
    greet: getGreet
  }
};
