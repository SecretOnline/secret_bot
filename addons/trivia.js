var fs = require('fs');

var trivia;
try {
  trivia = JSON.parse(fs.readFileSync('data/trivia.json'));
  console.log('[trivia] loaded ' + trivia.length + ' questions');
} catch (e) {
  throw new Error('no trivia questions. please create \'data/trivia.json\'');
}
var points;
try {
  points = JSON.parse(fs.readFileSync('data/points.json'));
} catch (e) {
  points = {};
  savePoints();
}
var currQuestion;
var timeout;
var skipUser;

function getTrivia(input) {
  // Redirect '~trivia answer' to answer function
  if (input.args[0] === 'answer') {
    input.args.splice(0, 1);
    return answer(input);
  } else if (input.args[0] === 'status') {
    if (currQuestion) {
      if (timeout) {
        return ['the current question is being skipped'];
      } else {
        return [
          'there is currently a question running:',
          currQuestion.q
        ];
      }
    } else {
      return [
        'there is no question right now',
        trivia.length + ' questions loaded',
        'type `~trivia start` to get one'
      ];
    }
  } else if (input.args[0] === 'start') {
    if (currQuestion) {
      return [
        'there is already a question:',
        currQuestion.q
      ];
    } else {
      newQuestion();
      return [
        currQuestion.q,
        'reward: ' + currQuestion.points + ' points'
      ];
    }
  } else if (input.args[0] === 'skip') {
    if (skipUser) {
      if (skipUser !== input.user) {
        currQuestion = null;
        newQuestion();
        return [
          currQuestion.q,
          'reward: ' + currQuestion.points + ' points'
        ];
      } else {
        return 'nice try, ' + input.user;
      }
    } else {
      return [
        'skip requested',
        'another user must `~trivia skip` to confirm'
      ];
    }
  } else if (input.args[0] === 'reload') {
    try {
      trivia = JSON.parse(fs.readFileSync('data/trivia.json'));
    } catch (e) {
      return 'unable to reload trivia. please check the file';
    }
    return 'loaded ' + trivia.length + ' questions';
  }
}

function getPoints(input) {
  if (input.args.length) {
    var name = input.args.join(' ');
    if (points[name]) {
      return name + ' has ' + points[name] + ' points';
    } else {
      return name + ' hasn\'t got any points';
    }
  } else {
    var keys = Object.keys(points);
    keys.sort(function(a, b) {
      return points[a] - points[b];
    });
    var ret = [];
    ret.push('top 5 scores');
    for (var i = 0; i < Math.min(keys.length, 5); i++) {
      ret.push((i + 1) + '. ' + keys[0] + ': ' + points[keys[0]]);
    }
    return ret;
  }
}

function answer(input) {
  function success(input) {
    var newPoints = Number.parseInt(currQuestion.points) || 5;
    if (!points[input.user.toLowerCase()]) {
      points[input.user.toLowerCase()] = 0;
    }
    points[input.user.toLowerCase()] += newPoints;
    savePoints();
    var guesses = currQuestion.guesses;
    currQuestion = null;
    return [
      input.user + ' guessed correctly!',
      'they have been awarded ' + newPoints + ' points',
      'it took ' + guesses + ' guesses to get this one right'
    ];
  }

  function failure(input) {
    return [
      'incorrect guess, ' + input.user
    ];
  }

  // Must have a user defined
  if (input.user) {
    if (currQuestion) {
      currQuestion.guesses++;
      var ans = input.args.join(' ');
      if (typeof currQuestion.a === 'string') {
        if (ans.toLowerCase() === currQuestion.a.toLowerCase()) {
          return success(input);
        } else {
          return failure(input);
        }
      } else if (Array.isArray(currQuestion.a)) {
        var ansFound = false;
        currQuestion.a.forEach(function(item) {
          if (!ansFound) {
            if (ans.toLowerCase() === item.toLowerCase()) {
              ansFound = success(input);
            }
          }
        });
        if (!ansFound) {
          return failure(input);
        } else {
          return ansFound;
        }
      }
    } else {
      return ['there is no active question. '];
    }
  } else {
    return ['answer attempt ignored; no user given'];
  }
}

function cheat(input) {
  if (input.user) {
    points[input.user]--;
    savePoints();
    newQuestion();
    return [
      'wait, cheating? who would even think of doing such a thing?',
      'oh, ' + input.user + '. that\'s who',
      'a new question has been picked:',
      currQuestion.q
    ];
  }
}

function savePoints() {
  fs.writeFileSync('data/points.json', JSON.stringify(points, null, 2));
}

function newQuestion() {
  currQuestion = {};
  var index = Math.floor(Math.random() * trivia.length);
  currQuestion.q = trivia[index].q;
  currQuestion.a = trivia[index].a;
  currQuestion.points = trivia[index].points || 5;
  currQuestion.guesses = 0;
  currQuestion.startTime = Date.now();
}

var triviaHelp = {
  _default: [
    'trivia for secret_bot',
    'type `~trivia start` to start a new round',
    'meaningless points will be awarded for correct answers',
    '`~trivia skip` can be used to skip a question'
  ],
  answer: [
    'answers the trivia question',
    'can be used by typing either `~trivia answer` or `~a`'
  ]
};

module.exports = {
  commands: {
    a: {
      f: answer,
      help: triviaHelp.answer
    },
    t: {
      f: getTrivia,
      help: triviaHelp
    },
    trivia: {
      f: getTrivia,
      help: triviaHelp
    },
    cheat: {
      f: cheat,
      perm: 4
    },
    points: getPoints
  }
};
