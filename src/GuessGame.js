const { words, random } = require("./utils/index")
const { EventEmitter } = require('events')

class GuessGame {
    constructor(message, options={}) {
        if(!message) throw new Error('missing message param');

        this.event = new EventEmitter();

        this.message = message

        this.item = null;

        this.wordArray = [];

        this.guessed = [];

        this.options = {
            title: 'GuessGame',
            color: 'RANDOM',
            time: 30000,
            ...options
        };
    }

    get hint(){
        return this.wordArray.map(x => this.guessed.includes(x) ? x : '_')
    }

    run() {
        this.item = random(words)
        this.wordArray = this.item.split('');
        for(let i = 0; i < 3; i++) this.guessed.push(random(this.wordArray));
        const filter = m => m.author.id === this.message.author.id && m.content === this.item;
        this.event.emit('start', this);
        this.message.channel.send({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: `\n\n${this.hint.join(' ')}`,
                timestamp: Date.now(),
                footer: {
                    text: 'Type your guess below!'
                }
            }
        }).then(() => {
            this.message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                this.event.emit('response', collected, this);
                this.message.channel.send(`✅ | ${collected.first().author} got the correct answer!`);
            })
            .catch(collected => {
                this.event.emit('end', this);
                this.message.channel.send(`❌ | Looks like nobody got the answer this time and the answer is ${this.item}.`)
            })
        })
    }

    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

    setTitle(title){
        this.options.title = title;
        return this;
    };

    setColor(color){
        this.options.color = color;
        return this;
    };

    setTime(time){
        this.options.time = time;
        return this;
    };
} 

module.exports = GuessGame
