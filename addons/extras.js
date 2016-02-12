function getRespawn(input) {
  var reply = [];
  var resIndex = Math.floor(Math.random() * Object.keys(respawns).length);
  reply.push("\"" + respawns[resIndex].text + "\"");
  reply.push("- " + respawns[resIndex].src);
  if (reply.length)
    return reply;
}

function getMeme(input) {

  if (memes[input.text]) {
    return memes[input.text];
  } else {
    throw new Error('no meme named: ' + input.text);
  }
}

function getProcedural(input) {
  var text;

  if (input.text) {
    text = input.text;
  } else {
    text = procedural[Math.floor(Math.random() * procedural.length)];
  }

  return 'Every ' + text + ' procedural';
}

function getPrayer(input) {
  return prayer;
}

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

var prayer = [
  'Our Murray who art in Guildford,',
  'procedural be thy name.',
  'Thy universe come, thy game be done,',
  'on Planet E3 as in Ethaedair.',
  'Give us this day our IGN First,',
  'and forgive our questions,',
  'as we forgive those who don\'t read the FAQ.',
  'Lead us not into release hype,',
  'but deliver us the game.',
  'For thine is Hello Games, the proc-gen, and the awards.',
  'A-space-goat.'
];

module.exports = {
  commands: {
    meme: getMeme,
    procedural: getProcedural,
    respawn: getRespawn,
    prayer: getPrayer
  }
};
