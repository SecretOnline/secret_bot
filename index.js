/* jslint node: true, esversion: 6 */
'use strict';
var bot = require('./bot.js');
var Discord = require('discord.js');
var config = require('./config.json');

var discord = new Discord.Client();

bot.ready
  .catch((err) => {
    console.error('[ERR] Bot didn\'t start up properly :(');
    console.error(err);
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      discord.loginWithToken(config.discord.token, config.discord.email, config.discord.pass)
        .then(resolve);
    });
  })
  .catch((err) => {
    console.error('[ERR] Discord didn\'t start properly');
    console.error(err);
  })
  .then(() => {
    console.log('[INFO] Logged into Discord');
    discord.on('message', (message) => {
      if (message.author.id !== discord.user.id) {
        if (!message.content.match(/^\u200b/i)) {
          var text = message.content;
          console.log(text);

          // Test for raw user/channel mentions
          var match;
          var regex = /<([@#])(\d+)>/g;
          while ((match = regex.exec(text)) !== null) {
            try {
              if (match[1] === '@') {
                // Replace user
                var nick = message.channel.server.members.get('id', match[2]).username;
                text = text.replace(match[0], '@' + nick);
              } else if (match[1] === '#') {
                // replace channel
                var chan = message.channel.server.channels.get('id', match[2]).name;
                text = text.replace(match[0], '#' + chan);
              }
            } catch (e) {
              console.error('[ERROR]: Unable to perform replacement operation on ' + match[0]);
              console.error(e);
            }
          }

          // Send to bot
          if (text.charAt(0) === '~') {
            var inp = new bot.Input(text, message.author.name, false);
            var prom = bot.getText(inp);
            prom.then(function(res) {
              message.channel.send(res);
              console.log(res);
            }, function(err) {
              message.author.send(`**[error]**: ${err}`);
              console.log(err);
            });
          }
        }
      }
    });
  });
