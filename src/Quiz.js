const { quiz, random } = require("./utils/index")
const { EventEmitter } = require('events')

class Quiz {
    constructor(message, options={}) {

        if(!message) throw new Error('missing message param');

        this.event = new EventEmitter();

        this.message = message

        this.options = {
            title: 'Quiz',
            color: 'RANDOM',
            time: 30000,
            ...options
        };
    }

    run() {
        const item = random(quiz)
        const filter = response => {
	        return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        };
        this.event.emit('start', this);
        this.message.channel.send({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: item.question,
                timestamp: Date.now(),
                footer: {
                    text: 'Type your guess below!'
                }
            }
        }).then(() => {
            this.message.channel.awaitMessages(filter, { max: 1, time: this.options.time, errors: ['time'] })
            .then(collected => {
                this.event.emit('response', collected, this);
                this.message.channel.send(`✅ | ${collected.first().author} got the correct answer!`);
            })
            .catch(collected => {
                this.event.emit('end', this);
                this.message.channel.send("❌ | Looks like nobody got the answer this time.")
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

module.exports = Quiz