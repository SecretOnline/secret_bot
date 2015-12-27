var fs = require('fs');

var trivia;
try {
  trivia = JSON.parse(fs.readFileSync('data/trivia.json'));
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
    timeout = setTimeout(function() {
      currQuestion = null;
    }, 10000);
    return [
      'question will be skipped in 10 seconds',
      'use `~trivia unskip` to cancel'
    ];
  } else if (input.args[0] === 'unskip') {
    if (timeout) {
      clearTimeout(timeout);
      return ['no longer skipping question'];
    } else {
      return ['nothing to unskip'];
    }
  }
}

function answer(input) {
  function success(input) {
    var newPoints = Number.parseInt(currQuestion.p) || 5;
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
            if (ans.toLowerCase() === currQuestion.a.toLowerCase()) {
              return success(input);
            }
          }
        });
        if (!ans) {
          return failure(input);
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
  return [
    'wait, who would even think of doing such a thing?',
    'oh, you. that\'s who'
  ];
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
  _default: [''],
  answer: ['']
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
      perm: 9
    }
  }
};