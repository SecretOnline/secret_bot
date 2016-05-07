/* jslint node: true, esversion: 6 */
'use strict';
var bot = require('./bot.js');
var perms = require('./perms.js');
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

          // Send to bot
          var rgx = /^~/;
          // var rgx = /^(?:<@177875572880310273>|~)/;
          if (text.match(rgx)) {
            var usrObj = {
              name: message.author.name,
              id: message.author.id
            };
            var perm = perms.get(usrObj);
            var inp = new bot.Input(text, usrObj, perm);
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
