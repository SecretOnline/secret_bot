function getUniverse(input, success, error) {
  var reply = [];
  reply.push('generating universe');
  var numEmotes = Math.floor(Math.random() * 3) + 2;
  for (var j = 0; j < numEmotes; j++)
    reply.push(emotes[Object.keys(emotes)[Math.floor(Math.random() * Object.keys(emotes).length)]]);
  reply.push('generation complete');
  if (reply.length)
    return reply;
}

function getRespawn(input, success, error) {
  var reply = [];
  var resIndex = Math.floor(Math.random() * Object.keys(respawns).length);
  reply.push("\"" + respawns[resIndex].text + "\"");
  reply.push("- " + respawns[resIndex].src);
  if (reply.length)
    return reply;
}

function getMeme(input, success, error) {
  var reply = [];
  if (input.args[0] && memes[input.args[0]]) {
    reply.push(memes[input.args[0]]);
  }
  if (reply.length)
    return reply;
}

function getProcedural(input, success, error) {
  var reply = [];
  var index = Math.floor(Math.random() * procedural.length);
  var text;

  if (input.args.length) {
    text = processText(input.args, obj);
  }

  if (!text)
    text = procedural[index];

  reply.push('Every ' + text + ' procedural');
  if (reply.length)
    return reply;
}

function getEmote(input) {
  var reply = [];
  var comm = input.args[0];
  if (emotes[comm]) {
    input.args.splice(0, 1);
    reply.push(emotes[comm] + ' ' + input.processText(input));
    return reply;
  }
}
var emotes = {
  'ayy': '☜(ﾟヮﾟ☜)',
  'converge': '(つ°ヮ°)つ',
  'coffee': '☕',
  'dance': '〜(^∇^〜）（〜^∇^)〜',
  'deal': '( •_•) ( •_•)>⌐■-■ (⌐■_■)',
  'DEAL': '( ಠ益ಠ) ( ಠ益ಠ)>⌐■-■ (⌐■益■)',
  'undeal': '(⌐■_■) ( •_•)>⌐■-■ ( •_•)',
  'derp': '◖|◔◡◉|◗',
  'disapprove': 'ಠ_ಠ',
  'disapprovedance': '┌( ಠ_ಠ)┘',
  'dongers': 'ヽ༼ຈل͜ຈ༽ﾉ',
  'dongers?': '┌༼◉ل͟◉༽┐',
  'dongersmob': 'ヽ༼ຈل͜ຈヽ༼ຈل͜ຈヽ༼ຈل͜ຈヽ༼ຈل͜ຈ༽ﾉل͜ຈ༽ﾉل͜ຈ༽ﾉل͜ຈ༽ﾉ',
  'dongersmoney': '[̲̅$̲̅(̲̅ヽ̲̅༼̲̅ຈ̲̅ل͜ຈ̲̅༽̲̅ﾉ̲̅)̲̅$̲̅]',
  'dongerswall': '┬┴┬┴┤ヽ༼ຈل͜├┬┴┬┴',
  'fliptable': '(╯°□°)╯︵ ┻━┻',
  'FLIPTABLE': '(ノಠ益ಠ)ノ彡┻━┻',
  'flipdouble': '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻',
  'unfliptable': '┬──┬ ノ(゜-゜ノ)',
  'UNFLIPTABLE': '┬──┬ ノ(゜益゜ノ)',
  'undisapprovetable': '┬──┬ ノ(ಠ_ಠノ)',
  'fliptable?': '┬──┬ ︵ /(.□. \\)',
  'flipflipper': '(╯°Д°）╯︵ /(.□ . \\)',
  'disapprovetable': '(╯ಠ_ಠ)╯︵ ┻━┻',
  'dongerstable': '༼ﾉຈل͜ຈ༽ﾉ︵ ┻━┻',
  'lennytable': '(╯ ͡° ͜ʖ ͡°)╯︵ ┻━┻',
  'wattable': '(╯ಠ▃ಠ)╯︵ ┻━┻',
  'fu': 'ಠ︵ಠ凸',
  'HYPETRAIN': '/|˳˳_˳˳|[˳˳H˳˳]┐˳˳Y˳˳┌(˳˳P˳˳)\\˳˳E˳˳/|˳˳!˳˳|',
  'lenny': '( ͡° ͜ʖ ͡°)',
  'lennymob': '( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ͡°) ͜ʖ ͡°)ʖ ͡°)ʖ ͡°)',
  'lennymoney': '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
  'lennywall': '┬┴┬┴┤( ͡° ͜ʖ├┬┴┬┴',
  'lennywink': '( ͡~ ͜ʖ ͡°)',
  'lenny?': '( ͠° ͟ʖ ͡°)',
  'nyan': '≈≈≈≈≈≈≈≈≈≈≈| ^･ω･^|',
  'orly': '﴾͡๏̯͡๏﴿ O\'RLY?',
  'rage': 'ლ(ಠ益ಠლ)',
  'robot': '╘[◉﹃◉]╕',
  'shrug': '¯\\_(ツ)_/¯',
  'squid': '<コ:彡',
  'throwglitter': '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
  'wat': 'ಠ▃ಠ',
  'whyy': 'щ(ಥДಥщ)',
  'woo': '\\o/',
  'whattheshrug': '﻿¯\\(ºдಠ)/¯',
  'zoidberg': '(\\/) (°,,°) (\\/)'
};

var respawns = [{
  text: 'There is a fullness and a calmness there which can only come from knowing pain.',
  src: 'Dan Simmons, Hyperion'
}];

var procedural = [
  'planet',
  'star',
  'solar system',
  'galaxy',
  'voxel',
  'animal',
  'plant',
  'bush',
  'tree',
  'ship',
  'mountain',
  'hill',
  'cave',
  'river',
  'ocean',
  'mountain',
  'weapon',
  'comment',
  'procedure',
  'release date',
  'tweet',
  'post',
  'article',
  'wallpaper',
  'fan art',
  '"Every x procedural"',
  'atom',
  'planet name convention',
  'theory',
  'extension',
  'space whale',
  'photoshop of Sean\'s face',
  'interview',
  'meme',
  'spoiler',
  'post flair',
  'comment generator',
  'Spotify playlist',
  'space goat',
  'subscriber',
  'IGN video',
  'photoshopped Steam page',
  'dream'
];

var memes = {
  'cage': 'http://i.imgur.com/5EBfpq3.png',
  'confess': 'http://i.imgur.com/BDRyxoG.jpg',
  'everywhere': 'http://i.imgur.com/9PyNjXc.png',
  'picard': 'http://i.imgur.com/CXra35Y.jpg',
  'doublepicard': 'http://i.imgur.com/vzyuVHI.png',
  'picardwhy': 'http://i.imgur.com/v4Ewvxz.png',
  'joker': 'http://i.imgur.com/sLJSLnF.png',
  'itshappening': 'http://i.imgur.com/7drHiqr.gif'
};

module.exports = {
  commands: {
    meme: getMeme,
    procedural: getProcedural,
    respawn: getRespawn,
    generate: getUniverse
  },
  default: [getEmote]
};
