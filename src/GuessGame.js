const utils = require('./utils/index');
const possibleWords = utils.words;
const { EventEmitter } = require('events')

class GuessGame{

    constructor(message, options={}){
        if(!message) throw new Error('missing message param');

        this.options = {
            word: utils.random(possibleWords).toLowerCase(),
            max: 1,
            time: 2000,
            ...options
        };

        this.message = message;
        this.winners = [];
        this.event = new EventEmitter();
        this.run();
    };

    run(){
        message.channel.awaitMessages( 
            m => !m.author.bot && m.content.toLowerCase() == emoji.name.toLowerCase(),
           { max: this.options.max, time: this.options.time, errors: ['time', 'max'] }
        )
        .then(collected => {
            this.winners.push(collected.first());
            this.event.emit('response', collected);
        })
        .catch(err => {
            this.event.emit('end', {
                message: this.message,
                winners: this.winners
            })
        })
    };

    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

};

module.exports = GuessGame;