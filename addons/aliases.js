var fs = require('fs');
var aliases = JSON.parse(fs.readFileSync('data/aliases.json'));

function changeAlias(input, success, error) {
  var reply = [];
  var comm = args.splice(0, 1)[0];
  var key = args.splice(0, 1)[0];
  if (comm === 'add') {
    var res = input.processText(args, obj);
    if (aliases[key])
      reply.push('alias already exists');
    else {
      aliases[key] = res;
      reply.push('alias \'' + key + '\' added');
    }
  } else if (comm === 'remove') {
    if (aliases[key]) {
      delete aliases[key];
      reply.push('alias \'' + key + '\' removed');
    } else
      reply.push('alias doesn\'t exist');
  }

  fs.writeFileSync('data/aliases.json', JSON.stringify(aliases, null, 2));

  return reply;
}

function findAlias(input) {
  var comm = input.args[0];
  var ret = [];
  if (aliases[comm]) {
    input.args.splice(0, 1);
    if (aliases[comm].indexOf('{args}') > -1)
      ret.push(aliases[comm].replace(/{args}/g, input.processText(input)));
    else
      ret.push(aliases[comm] + ' ' + input.processText(input));
  }
  if (ret.length) {
    return ret;
  }
}

module.exports = {
  commands: {
    alias: changeAlias
  },
  default: [findAlias]
};
