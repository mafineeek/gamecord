const utils = require('./utils/index');
const possibleWords = utils.words;
const { EventEmitter } = require('events')

class GuessGame{

    constructor(message, options={}){
        if(!message) throw new Error('missing message param');

        this.options = {
            word: utils.random(possibleWords).toLowerCase(),
            max: 1,
            time: 8000,
            ...options
        };

        this.message = message;
        this.winners = [];
        this.event = new EventEmitter();
        this.run();
    };

    run(){
        this.message.channel.awaitMessages( 
            m => !m.author.bot && m.content.toLowerCase() == this.options.word.toLowerCase(),
           { max: this.options.max, time: this.options.time, errors: ['time', 'max'] }
        )
        .then(collected => {
            console.log(collected)
            this.winners.push(collected.first());
            this.event.emit('response', collected, this);
        })
        .catch(err => {
            this.event.emit('end', this);
        });
    };

    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

    setWord(word){
        this.options.word = word;
        return this;
    };

    setMax(max){
        this.options.max = max;
        return this;
    };

    setTime(time){
        this.options.time = time;
        return this;
    };

};

module.exports = GuessGame;