/* Help */
var helpHelp = [
  'secret_bot help',
  '`~help commands` - list of commands',
  '`~help emotes` - list of emotes',
  '`~help aliases` - list of aliases (basic commands)',
  'bot version: something',
  'contact secret_online if you\'re having problems'
];
var flipHelp = [
  'flip',
  'this command will flip any text upside down',
  '(not all characters work just yet. soon(tm))',
  'the flip command supports emote injection',
  'example usage:',
  '~flip example text',
  '~flip ~dance'
];
var linkHelp = [
  '`wiki`, `google`, `search`, and `lmgtfy`',
  'these commands simply link to a page',
  'search searches the subreddit for posts',
  'it performs no checks to see if the link is to a valid page or not.',
  'example usage:',
  '~wiki no man\'s sky',
  '~google ~lenny',
  '~lmgtfy no man\'s sky release date',
  '~search release date'
];
var latinHelp = [
  '`secret_latin`, `trk_latin`, `jaden_latin`, `alvv_latin`, `ohdear_latin`, and `ohfuck_latin`',
  'these commands will warp text',
  '`secret_latin` swaps the first two characters of words',
  '`trk_latin` removes all vowels and \'c\'s',
  '`jaden_latin` Puts Things In Title Case',
  '`alvv_latin` replaces a few words with \'alvv\'',
  '`ohdear_latin` does the other three in one go',
  '`ohfuck_latin` flips `ohdear_latin`'
];
var rollHelp = [
  '`roll`',
  'have you prayed to RNGesus lately?',
  'rolls dice for you. virtual dice',
  '[number of dice]d[number of dots on highest face]',
  'example usage:',
  '~roll 4d6',
  '~roll 3d20',
  '~roll 2d4 4d6 3d20'
];
var cbHelp = [
  '`cb`',
  'this bot has basic cleverbot functions',
  'they probably don\'t work, though',
  'example usage:',
  '~cb hello'
];
var returnHelp = [
  '`return`',
  'this isn\'t a function itself',
  'instead it will stop the bot from reading anything past that point',
  'example usage:',
  '~flip this text will be flipped ~return this text won\'t be output',
  '~say ~woo ~return ~woo (this will output `\\o/`, as the `~woo` after ~return is ignored)'
];
var breakHelp = [
  '`break`',
  'this isn\'t a normal function',
  '`~break` will stop the current command\'s processing,',
  'but unlike `~return`, the bot will continue along the line',
  'example usage:',
  '~flip this text will be flipped ~break this text won\'t be flipped',
];

/* Commands */
function evaluate(input) {
  var reply = [];
  // Evaluate input
  var f = new Function(input.processText(input));
  var result = f.call({});
  if (!(typeof result !== 'undefined' && result !== null)) {
    reply.push(result.toString());
  } else {
    reply.push('no return statement given');
  }
  if (reply.length)
    return reply;
}

function sayRaw(input) {
  var reply = [];
  reply.push(input.args.join(' '));
  if (reply.length)
    return reply;
}

function say(input) {
  var reply = [];
  reply.push(input.processText(input));
  if (reply.length)
    return reply;
}

function getSource(input) {
  var reply = [];
  if (args.length)
  // Link to a file
    reply.push('https://github.com/SecretOnline/NMS-irc-bot/blob/master/' + input.processText(input));
  else
  // Link to main page
    reply.push('https://github.com/SecretOnline/NMS-irc-bot/ ' + input.processText(input));
  if (reply.length)
    return reply;
}

function getWikiLink(input) {
  var reply = [];
  var url = 'https://en.wikipedia.org/wiki/';
  if (input.args.length > 0)
    url += toTitleCase(input.processText(input));
  else
    url += 'Main_Page';
  url = url.replace(/ /g, '_');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getYtLink(input) {
  var reply = [];
  var url = 'https://www.youtube.com/';
  if (input.args.length > 0)
    url += 'results?search_query=' + input.processText(input);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getGoogleLink(input) {
  var reply = [];
  var url = 'https://www.google.com/';
  if (input.args.length > 0)
    url += 'search?q=' + input.processText(input);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getLmgtfyLink(input) {
  var reply = [];
  var url = 'http://lmgtfy.com/';
  if (input.args.length > 0)
    url += '?q=' + input.processText(input);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getSearchLink(input) {
  var reply = [];
  var url = 'https://www.reddit.com/r/NoMansSkyTheGame/';
  if (input.args.length > 0)
    url += 'search?sort=new&restrict_sr=on&t=all&q=' + input.processText(input);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getInfoLink(input) {
  var reply = [];
  var url = 'https://secretonline.github.io/NMS-Info/';
  if (input.args.length > 0)
    url += '?search=' + input.processText(input);
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');
  reply.push(url);
  if (reply.length)
    return reply;
}

function getRelease(input) {
  var reply = [];

  var result = 'June™';

  if (input.args.length) {
    reply.push('Estimated release of ' + input.processText(input) + ':');
  } else
    reply.push('Estimated release of No Man\'s Sky: ');
  reply.push(result);

  if (reply.length)
    return reply;
}

function getInceptionNoise(input) {
  var reply = [];
  reply.push('http://inception.davepedu.com/inception.mp3');
  reply.push('warning: noise');
  if (reply.length)
    return reply;
}

function getFlip(input) {
  var reply = [];
  // Add to return array
  reply.push(flip(input.processText(input)));
  if (reply.length)
    return reply;
}

function getSecretText(input) {
  var reply = [];
  reply.push(getSecretLatin(input.processText(input)));
  if (reply.length)
    return reply;
}

function getTrkText(input) {
  var reply = [];
  reply.push(getTrkLatin(input.processText(input)));
  if (reply.length)
    return reply;
}

function getJadenText(input) {
  var reply = [];
  reply.push(toTitleCase(input.processText(input)));
  if (reply.length)
    return reply;
}

function getAlvvText(input) {
  var reply = [];
  reply.push(getAlvvLatin(input.processText(input)));
  //reply.push('nope');
  if (reply.length)
    return reply;
}

function getMessText(input) {
  var reply = [];
  reply.push(getSecretLatin(getTrkLatin(toTitleCase(input.processText(input)))));
  if (reply.length)
    return reply;
}

function getFuckText(input) {
  var reply = [];
  reply.push(flip(getSecretLatin(getTrkLatin(toTitleCase(input.processText(input))))));
  if (reply.length)
    return reply;
}

function getThanks(input) {
  var reply = [];
  var text = input.processText(input);
  if (text === '')
    if (input.from === 'secret_online')
      reply.push('yeah, yeah. you created me.');
    else
      reply.push('you\'re welcome.');
  else if (text === 'mr skeletal')
    reply.push('doot doot');
  else
    reply.push('thank you ' + text);
  if (reply.length)
    return reply;
}

function getPrayer(input) {
  var reply = [];
  reply.push('Our Murray who art in Guildford,');
  reply.push('procedural be thy name.');
  reply.push('Thy universe come, thy game be done,');
  reply.push('on Planet E3 as in Ethaedair.');
  reply.push('Give us this day our IGN First,');
  reply.push('and forgive our questions,');
  reply.push('as we forgive those who don\'t read the FAQ.');
  reply.push('Lead us not into release hype,');
  reply.push('but deliver us the game.');
  reply.push('For thine is Hello Games, the proc-gen, and the awards.');
  reply.push('A-space-goat.');
  if (reply.length)
    return reply;
}

function getBan(input) {
  var reply = [];
  if (input.args.length) {
    reply.push('BANNING ' + input.processText(input));
  } else
    reply.push('so, uh... you going to specify who to let the banhammer loose on?');
  if (reply.length)
    return reply;
}

function getTrain(input) {
  var reply = [];
  var text = input.processText(input);
  var train = '/|˳˳_˳˳|';
  var carriages = [
    '|˳˳_˳˳|',
    '[˳˳_˳˳]',
    '┐˳˳_˳˳┌',
    '(˳˳_˳˳)',
    '\\˳˳_˳˳/'
  ];

  for (var i = 0; i < text.length; i++) {
    var carriage = carriages[Math.floor(Math.random() * carriages.length)];
    var char = text.substring(i, i + 1);
    carriage.replace('_', char);
    train += carriage;
  }
  reply.push(train);

  if (reply.length)
    return reply;
}

function getCopyPasta(input) {
  var reply = [];
  reply.push(copyPasta + input.processText(input));
  if (reply.length)
    return reply;
}

function getRoll(input) {
  var reply = [];
  var retString = "";
  input.args.forEach(function(roll) {
    if (roll.match(/\d+d\d+/)) {
      var rSplit = roll.split('d');
      var fResult = 0;
      var rolls = "";
      for (var i = 1; i <= rSplit[0]; i++) {
        var result = Math.floor(Math.random() * rSplit[1]) + 1;
        fResult += result;
        rolls += result + '';
        if (i != rSplit[0])
          rolls += '+';
      }
      retString += fResult + ' (' + rolls + ') ';
    } else
      retString += 'bad roll ';
  });
  reply.push(retString);
  if (reply.length)
    return reply;
}

function getReturn(input) {
  var reply = [];
  reply.push('type `~help return` for proper usage');
  if (reply.length)
    return reply;
}

function getBreak(input) {
  var reply = [];
  reply.push('type `~help break` for proper usage');
  if (reply.length)
    return reply;
}

/**
 * Flipping
 */
function flip(aString) {
  var last = aString.length - 1;
  var result = new Array(aString.length);
  for (var i = last; i >= 0; --i) {
    var c = aString.charAt(i);
    var r = flipTable[c];
    result[last - i] = r !== undefined ? r : c;
  }
  return result.join('');
}
var flipTable = {
  a: '\u0250',
  b: 'q',
  c: '\u0254',
  d: 'p',
  e: '\u01DD',
  f: '\u025F',
  g: '\u0183',
  h: '\u0265',
  i: '\u0131',
  j: '\u027E',
  k: '\u029E',
  l: '\u05DF',
  m: '\u026F',
  n: 'u',
  r: '\u0279',
  t: '\u0287',
  v: '\u028C',
  w: '\u028D',
  y: '\u028E',
  '.': '\u02D9',
  '[': ']',
  '(': ')',
  '{': '}',
  '?': '\u00BF',
  '!': '\u00A1',
  "\'": ',',
  '<': '>',
  '_': '\u203E',
  '"': '\u201E',
  '\\': '\\',
  ';': '\u061B',
  '\u203F': '\u2040',
  '\u2045': '\u2046',
  '\u2234': '\u2235',
  'A': '∀',
  'B': '\u029A',
  'C': '\u0186',
  'D': '\u2C6D',
  'E': '\u018E',
  //'F': '',
  //'G': '',
  //'J': '',
  //'K': '',
  'L': '˥',
  'M': 'W',
  'P': '\u0500',
  //'Q': '',
  'R': '\u1D1A',
  'T': '\u2534',
  'U': '\u2229',
  'V': '\u039B',
  'Y': '\u03BB',
  '（': '）',
  '☜': '☞',
  '˳': '°',
  '⌐': '¬',
  '┌': '┘',
  '┐': '└',
  '͜': '͡',
  'ʕ': 'ʖ'
};
for (var i in flipTable) {
  flipTable[flipTable[i]] = i;
}

/* "Latin" */
function getAlvvLatin(string) {
  var words = string.split(' ');
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 3) {
      if (words[i].indexOf('ing') === words[i].length - 3)
        words[i] = 'alvving';
      else if (words[i].indexOf('ed') === words[i].length - 2)
        words[i] = 'alvved';
      else if (words[i].indexOf('er') === words[i].length - 2)
        words[i] = 'alvver';
      else if (words[i].indexOf('n\'t') === words[i].length - 3)
        words[i] = 'alvvn\'t';
      else if (words[i].indexOf('nt') === words[i].length - 2)
        words[i] = 'alvvnt';
      else if (words[i].indexOf('\'s') === words[i].length - 2)
        words[i] = 'alvv\'s';
      else if (words[i].indexOf('es') === words[i].length - 2)
        words[i] = 'alvves';
      else if (words[i].indexOf('s') === words[i].length - 1)
        words[i] = 'alvvs';
      else if (words[i].indexOf('y') === words[i].length - 1)
        words[i] = 'alvvy';
      else
        words[i] = 'alvv';
    }
  }
  return words.join(' ');
}

function getSecretLatin(string) {
  var words = string.split(' ');
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 2)
      words[i] = words[i].substring(1, 2) + words[i].substring(0, 1) + words[i].substring(2);
  }
  return words.join(' ');
}

function getTrkLatin(string) {
  var newString = string.replace(/[aeiouc]/gi, '');
  return newString;
}

/**
 * Quick title case
 */
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Big functions dictionary
var functions = {
  'eval': {
    f: evaluate,
    perm: 10
  },
  'say': {
    f: say,
    perm: 10
  },
  'raw': {
    f: sayRaw,
    perm: 10
  },
  'return': {
    f: getReturn,
    help: returnHelp,
    private: true
  },
  'break': {
    f: getBreak,
    help: breakHelp,
    private: true
  },
  'source': getSource,
  'train': getTrain,
  'flip': {
    f: getFlip,
    help: flipHelp
  },
  'wiki': {
    f: getWikiLink,
    help: linkHelp
  },
  'google': {
    f: getGoogleLink,
    help: linkHelp
  },
  'lmgtfy': {
    f: getLmgtfyLink,
    help: linkHelp
  },
  'search': {
    f: getSearchLink,
    help: linkHelp
  },
  'info': {
    f: getInfoLink,
    help: linkHelp
  },
  'release': getRelease,
  'inception': getInceptionNoise,
  'secret_latin': {
    f: getSecretText,
    help: latinHelp
  },
  'trk_latin': {
    f: getTrkText,
    help: latinHelp
  },
  'jaden_latin': {
    f: getJadenText,
    help: latinHelp
  },
  'alvv_latin': {
    f: getAlvvText,
    help: latinHelp
  },
  'ohdear_latin': {
    f: getMessText,
    help: latinHelp
  },
  'ohfuck_latin': {
    f: getFuckText,
    help: latinHelp
  },
  'thanks': getThanks,
  'prayer': getPrayer,
  'BANHAMMER': getBan,
  'roll': {
    f: getRoll,
    help: rollHelp
  }
};

module.exports = {
  commands: functions
};
