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

function getCopypasta(input) {
  return copypasta;
}

function getIsItJuneYet(input) {
  return (new Date().getUTCMonth() === 5) ? `YES! Get hyped, ${input.user}` : `no, be patient ${input.user}`;
}

function getVote(input) {
  return `${input.user} voted to ${input.text}`;
}

var respawns = [{
  text: 'There is a fullness and a calmness there which can only come from knowing pain.',
  src: 'Dan Simmons, Hyperion',
}, {
  text: 'The Gods do not protect fools. Fools are protected by more capable fools.',
  src: 'Larry Niven'
}, {
  text: 'How inappropriate to call this planet \'Earth\' when it is clearly \'Ocean\'.',
  src: 'Arthur C. Clarke'
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
  '```',
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
  'A-space-goat.',
  '```'
];

var copypasta = [
  '```',
  'What did you just say about me? I\'ll have you know I graduated top of my class in the NoManNauts, and I\'ve been involved in numerous secret raids on Hello Games, and I have over 300 confirmed planet sightings. I am trained in space-goat warfare and I\'m the top pilot in the entirety /r/NoMansSkyTheGame. You are nothing to me but just another goat. I will wipe you out with proc-gen tech the likes of which has never been seen before in this system, mark my words. You think you can get away with saying that to me in this post? Think again. As we speak I am contacting my secret network of sentinels across the galaxy and your ship is being traced right now so you better prepare for the storm. The storm that wipes out the pathetic little thing you call Ictaloris Hyphus. You\'re dead, kid. I can warp anywhere, anytime, and I can kill you in over 18 quintillion ways, and thats just with my multitool. Not only am I extensively trained in multitool combat, but I have access to the entire arsenal of the Malevolent Force and I will use it to its full extent to wipe your E3 Fish off the face of the universe. If only you could have known what unholy retribution your little clever comment was about to bring down upon you, maybe you would have held your tongue. But you couldn\'t, you didn\'t, and now you\'re paying the price. I will fire plasma grenades all over you and you will explode in it. You\'re dead, space-goat.',
  '```'
];

module.exports = {
  commands: {
    meme: getMeme,
    procedural: getProcedural,
    copypasta: {
      f: getCopypasta,
      perm: 1
    },
    respawn: getRespawn,
    prayer: {
      f: getPrayer,
      perm: 1
    },
    isitjuneyet: getIsItJuneYet,
    vote: getVote
  }
};
