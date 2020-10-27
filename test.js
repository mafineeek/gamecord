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
            console.log(`${game.user.tag} ${game.win ? 'lost' : 'win'} the game!`)
        })
        .run()

    }
});

client.login('NzU3OTE3Mjc3MTY0MjczODIw.X2nXeA.NI6Z24CuZkkON8We1QEKA2DMN6Q');