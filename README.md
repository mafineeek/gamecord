# Gamecord

Easy to make discord games for your bot by us!

# Installation

```bash
npm install gamecord
```

# Features
- Super easy to use 😀

# Examples

```js
// Install Gamecord
const GameCord = require('gamecord');

// Create Client
const { Client } = require('discord.js');
const client = new Client();

// Ready Event
client.on('ready', () => console.log('Bot is ready :D'));

// Message Event
client.on('message', message => {
    if(message.content == '!hangman'){

        new GameCord.HangmanGame(message)
        .setTitle('My Hangman')
        .setColor('#7298da')
        .setHint() // Only if you want a hint for your hangman!
        .on('end', game => {
            console.log(`${game.user.tag} ${game.win ? 'win' : 'lose'} the game!`)
        })
        .on('start', game => {
            console.log(`${game.message.author.tag} started a hangman game with word ${game.word}!`)
        })
        .run() // Keep all your settings above and run it after all of your configuration!

    }
});

// Login the bot
client.login(process.env.token);
```

# Picture
![1](/images/snake.png)

![2](/images/hangman.png)

# Authors
* **[1GPEX](https://github.com/1GPEX)** - *Original Idea*
* **[Science Spot](https://github.com/Scientific-Guy)** - *Make a options* 
