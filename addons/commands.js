/* Help */
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

function say(input) {
  return input.text;
}

function getWho(input) {
  return input.user + ' ' + input.text;
}

function exec(input) {
  throw `no. bad ${input.user}. eval is evil`;
  // var f = new Function(input.text);
  // return f();
}

function getSource(input) {
  if (input.text) {
    // Link to a file
    return 'https://github.com/SecretOnline/secret_bot/blob/master/' + input.text;
  } else {
    return 'https://github.com/SecretOnline/secret_bot/';
  }
}

function getWikiLink(input) {
  var url = 'https://en.wikipedia.org/wiki/';
  if (input.text)
    url += toTitleCase(input.text);
  else
    url += 'Main_Page';
  url = url.replace(/ /g, '_');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');

  return url;
}

function getYtLink(input) {
  var url = 'https://www.youtube.com/';
  if (input.text)
    url += 'results?search_query=' + input.text;
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');

  return url;
}

function getGoogleLink(input) {
  var url = 'https://www.google.com/';
  if (input.text)
    url += 'search?q=' + input.text;
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');

  return url;
}

function getLmgtfyLink(input) {
  var url = 'http://lmgtfy.com/';
  if (input.text)
    url += '?q=' + input.text;
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');

  return url;
}

function getSearchLink(input) {
  var url = 'https://www.reddit.com/r/NoMansSkyTheGame/';
  if (input.text)
    url += 'search?sort=new&restrict_sr=on&t=all&q=' + input.text;
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');

  return url;
}

function getInfoLink(input) {
  var url = 'https://repo.nmsdb.info/';
  if (input.text)
    url += '?search=' + input.text;
  url = url.replace(/ /g, '+');
  url = encodeURI(url);
  url = url.replace(/'/g, '%27');

  return url;
}

function getRelease(input) {
  var reply = [];

  var result = 'June™';

  if (input.text) {
    reply.push('Estimated release of ' + input.text + ':');
  } else
    reply.push('Estimated release of No Man\'s Sky: ');
  reply.push(result);

  return reply;
}

function getInceptionNoise(input) {
  return [
    'http://inception.davepedu.com/inception.mp3',
    'warning: noise'
  ];
}

function getSecretText(input) {
  return getSecretLatin(input.text);
}

function getTrkText(input) {
  return getTrkLatin(input.text);
}

function getJadenText(input) {
  return toTitleCase(input.text);
}

function getAlvvText(input) {
  return getAlvvLatin(input.text);
}

function getMessText(input) {
  return getSecretLatin(getTrkLatin(toTitleCase(input.text)));
}

function getThanks(input) {
  if (input.text === '')
    if (input.user === 'secret_online')
      return 'yeah, yeah. you created me.';
    else
      return 'you\'re welcome.';
  else if (input.text === 'mr skeletal')
    return 'doot doot';
  else
    return 'thank you ' + input.text;
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
  return retString;
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
  'say': {
    f: say,
    perm: 5
  },
  'source': getSource,
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
  'thanks': getThanks,
  'roll': {
    f: getRoll,
    help: rollHelp
  },
  'eval': {
    f: exec,
    perm: 10
  },
  'who': getWho,
  'me': getWho
};

module.exports = {
  commands: functions
};
