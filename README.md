# Gamecord

Easy to make discord games for your bot by us!

# Installation

```bash
npm install gamecord
```

[![NPM](https://nodei.co/npm/gamecord.png)](https://nodei.co/npm/gamecord/)


# Features
- Super easy to use 😀

# Quick Example

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
        .setTime(20000) // Default is 30 secs
        .on('end', game => console.log(`${game.user.tag} ${game.win ? 'win' : 'lose'} the game!`))
        .on('start', game => console.log(`${game.message.author.tag} started a hangman game with word ${game.word}!`))
        .run() // Keep all your settings above and run it after all of your configuration!

    }else if(message.content == '!snake'){

        new GameCord.SnakeGame(message)
        .setTitle('My snake')
        .setColor('#7298da')
        .setMaxTime(60000) // Always better to set max time because the default one is just 5s
        .on('end', game => console.log(`${game.message.author.tag}'s snake game score was ${game.score}`)) // Start event also exists
        .run()

    }
});

// Login the bot
client.login(process.env.token);
```

# Quick Methods

- `Minesweeper({ width: number, height: number })`

Will return a grid of minesweeper using discord spoiler tag...

```js
message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('My Minesweeper')
    .setColor('#7298da')
    .setDescription(GameCord.Minesweeper()) // By default minesweeper method takes 8x8 grid
    .setTimestamp()
)
```

# Samples
![1](/images/snake.png)

![2](/images/hangman.png)

![3](/images/mine.png)

# Authors
* **[1GPEX](https://github.com/1GPEX)** - *Original Idea & Make snake,connect4 ganes*
* **[Science Spot](https://github.com/Scientific-Guy)** - *Make a options & hangman,snake,minesweeper games* 

# Applicable Games
- Hangman (Not Finish)
- Snake
- Minesweeper
- ConnectFour
- Quiz
- GuessGame

### [Discord](https://discord.gg/hw7XPxz) - *Join discord server for help*
