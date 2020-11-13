const { words, random } = require("./utils/index")
const { EventEmitter } = require('events');
const { endianness } = require("os");

class GuessGame {
    /**
    * GuessGame Game
    * @param {any} message Client Message
    * @param {object} options Your options
    * @example const GameCord = require('gamecord');
    * new GameCord.GuessGame(message)
        .setTitle('GuessTheWord')
        .setColor('#7298da')
        .setTime(20000) // Default is 30 secs
        .run() // Keep all your settings above and run it after all of your configuration!
    */
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
    
    /**
     * Run the Guess game
     * @example GuessGame.run()
     */
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
            let correct = true;
            this.message.channel.awaitMessages(filter, { max: 1, time: this.options.time, errors: ['time'] })
            .then(collected => {
                this.event.emit('response', collected, this);
                correct = true;
                this.end(correct, collected)
            })
            .catch(collected => {
                correct = false; 
                this.end(correct, collected)
            })
        })
    }

    /**
     * End event
     * @param {*} correct 
     * @param {*} collected 
     */
    end(correct, collected) {
        this.event.emit('end', this);
        this.message.channel.send({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: `**${correct ? `✅ | ${collected.first().author} got the correct answer!` : `❌ | Looks like nobody got the answer this time.`}**\n\n**The answer is ${this.item}**.`,
                timestamp: Date.now(),
            }
        })
    }

    /**
     * Event
     * @param {*} event 
     * @param {*} callback 
     */
    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

    /**
     * SetTitle of the embed
     * @param {*} title 
     */
    setTitle(title){
        this.options.title = title;
        return this;
    };

    /**
     * SetColor of the embed
     * @param {*} color 
     */
    setColor(color){
        this.options.color = color;
        return this;
    };
    
    /**
     * Set game time
     * @param {*} time 
     */
    setTime(time){
        this.options.time = time;
        return this;
    };
} 

module.exports = GuessGame
