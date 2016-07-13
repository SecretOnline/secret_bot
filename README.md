#This project has moved!

##You can now find it at [SecretOnline/bot](https://github.com/SecretOnline/bot)

#secret_bot

---

This project originally started as [NMS-irc-bot](https://github.com/SecretOnline/NMS-irc-bot), a chat bot for the #nomanssky IRC channel.

This version is a more general Node.js module, which allows you to use it with almost whatever project.

The bot takes commands, which are words prefixed with `~`, and gives a Promise that resolves when it has finished processing that command.

It features recursive command processing, so input such as `~woo ~party ~dance` will be fully processed.

``` js
var bot = require('secret_bot');
// ...
var input = new bot.Input('~say Hello World!', '<username>');
bot.getText(input).then(function(reply){
  // Do something with the reply
});
```

---

##Making addons

On its own, the bot does nothing. You need addons to make it actually respond to things. Addons can either be JSON files or another script.

JSON files contain a map of commands to strings. The command will be replaced with the given string. If teh string contains the substring `{args}` then all instances of `{args}` will be replaced with whatever follows the command.

``` json
{
  "command name":"string"
}
```

If an addon is a script, then commands will be loaded from a `commands` property of the module's `module.exports`. The commands property should be a map of command names to strings, functions, or objects.

* If the value is a string then it will behave exactly the same as if it were JSON.
* If it is a function, then the return value of the function is used.
  * However, if the function returns a Promise, then the bot will wait for the promise to resolve and use the value from that.
* Object values must have a `f` property which is the function to call. Its return value is treated the same as a function.
  * Objects can have optional parameters that define certain behaviours.
  * A `help` property should have an array of string attached, and the command `~help <command name>` will return that array.
  * A `perm` property should be given an integer value. If a user's permission level is lower than this number then they will not be allowed to execute the function, and the overall command will reject.

``` js
module.exports = {
  commands: {
    'command name': 'string/function/object'
  }
};
```
