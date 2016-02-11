var delayHelp = [
  'this command delays the sending of output',
  'note: it does not delay the execution of the command'
];

function doDelay(input) {
  return new Promise(function(resolve, reject) {
    var n;
    try {
      n = Number.parseInt(input.args.splice(0, 1)[0]);
    } catch (e) {
      reject('unable to delay, must have number');
      return;
    }
    setTimeout(function() {
      resolve(input.args.join(' '));
    }, n);
  });
}

module.exports = {
  commands: {
    delay: {
      f: doDelay,
      help: delayHelp
    }
  }
};
