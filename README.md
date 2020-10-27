# Gamecord
Make your create any game in discord eazy

# Installation

```bash
npm install gamecord
```

# Features
- Super easy to use 😀


# Examples

```js
// Install Gamecord
const GameCord = require('./index');

// Discord Login
const { Client } = require('discord.js');
const client = new Client();

client.on('ready', () => console.log('Bot is ready :D'));

client.on('message', message => {
    if(message.content == '!hangman'){

        new GameCord.HangmanGame(message)
        .setTitle('My Hangman')
        .setColor('#7298da')
        .on('end', game => {
            console.log(`${game.user.tag} ${game.win ? 'win' : 'lose'} the game!`)
        })
        .run()

    }
});

client.login(process.env.token);
```

# Picture
![1](/images/snake.png)

![2](/images/hangman.png)

# Authors
* **[1GPEX](https://github.com/1GPEX)** - *Original Idea*
* **[Science Spot](https://github.com/Scientific-Guy)** - *Make a options* 
