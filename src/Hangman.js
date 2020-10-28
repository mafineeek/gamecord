/**
 * Hangman Game
 */

const { EventEmitter } = require('events');
const { random, quiz, words } = require('./utils/index');

class HangmanGame{

    /**
     * Make your hangman game...
     * @param {any} message Client Message
     * @param {object} [options={}] options 
     * @example const GameCord = require('gamecord');
     * new GameCord.HangmanGame(message)
        .setTitle('My Hangman')
        .setColor('#7298da')
        .setTime(20000) // Default is 30 secs
        .setHint() // Only if you want a hint for your hangman!
        .on('end', game => console.log(`${game.user.tag} ${game.win ? 'win' : 'lose'} the game!`))
        .on('start', game => console.log(`${game.message.author.tag} started a hangman game with word ${game.word}!`))
        .run() // Keep all your settings above and run it after all of your configuration!
     */
    constructor(message, options={}){
        if(!message) throw new Error('message param is required');

        this.message = message;
        this.event = new EventEmitter();
        this.mistakes = 0;
        this.word = null;
        this.wordArray = [];
        this.embed = null;
        this.guessed = [];

        this.options = {
            title: 'Hangman',
            color: 'RANDOM',
            gameOverTitle: 'Game Over',
            hint: false,
            time: 300000,
            words,
            ...options
        };
    };

    /**
     * Get the hangman description
     * @example HangmanGame.description
     */
    get description(){
        return "```"
            + (this.mistakes > 0 ? "|‾‾‾‾‾‾|   \n|     " : " ")
            + (this.mistakes > 1 ? " |" : " ")
            + "   \n|     "
            + (this.mistakes > 2 ? " O" : " ")
            + "   \n|     "
            + (this.mistakes > 3 ? "/|\\" : " ")
            + "   \n|     "
            + (this.mistakes > 4 ? "/ \\" : " ")
            + "   \n|     \n|__________"
            + (this.options.hint ? `\n\n${this.hint.join(' ')}` : '')
            + "```\n"
    };

    /**
     * Hint gen
     */
    get hint(){
        return this.wordArray.map(x => this.guessed.includes(x) ? x : '_')
    }

    /**
     * Run the hangman game
     * @example HangmanGame.run()
     */
    run(){
        this.word = this.options.words[Math.floor(Math.random() * this.options.words.length)].toUpperCase();
        this.wordArray = this.word.split('');
        if(this.options.hint) for(let i = 0; i < 2; i++) this.guessed.push(random(this.wordArray));
        this.event.emit('start', this);

        this.message.channel.send({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: this.description,
                timestamp: Date.now(),
                footer: {
                    text: 'Type your guess below!'
                }
            }
        }).then(message => {
            this.embed = message;
            let win = true;

            this.message.channel.awaitMessages(
                m => {
                    if(m.author.id != this.message.author.id) return false;
                    this.guessed.push(m.content.toUpperCase());
                    if(!this.hint.includes('_')) return true;
                    if(!this.wordArray.includes(m.content.toUpperCase())) this.mistakes++;
                    if(this.mistakes == 6){
                        win = false;
                        return true;
                    };
                    this.edit();
                },
                { max: 1, time: this.options.time, errors: ['time'] }
            )
            .then(() => this.end(win)).catch(() => this.end(0));
        });
    };

    /**
     * Edits the embed
     */
    edit(){
        this.embed.edit({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: this.description,
                timestamp: Date.now(),
                footer: {
                    text: 'Type your guess below!'
                }
            }
        })
    }

    /**
     * Function to end the game
     * @param {boolean} win A boolean deciding if the user has won or not
     * @example HangmanGame.end(true)
     */
    end(win){
        this.embed.edit({
            embed: {
                title: this.options.gameOverTitle,
                color: this.options.color,
                description: `**${win ? 'You won!' : 'You lose!'}**\n**The Word:** ${this.word}`,
                timestamp: Date.now()
            }
        });

        this.event.emit('end', { win, ...this });
    };

    /**
     * Set title
     * @param {string} title Title to set
     */
    setTitle(title){
        this.options.title = title;
        return this;
    };

    /**
     * Set color
     * @param {string} color Custom color to set
     */
    setColor(color){
        this.options.color = color;
        return this;
    };

    /**
     * Set error time
     * @param {number} time Number to set for message collector
     */
    setTime(time){
        this.options.time = time;
        return this;
    };

    /**
     * Set game over title
     * @param {string} title Title to set for game over embed
     */
    setGameOverTitle(title){
        this.options.gameOverTitle = title;
        return this;
    };

    /**
     * Set your own custom words to ask as quiz
     * @param {any[]} words Words to set to quiz
     */
    setWords(words){
        if(!Array.isArray(words)) throw new Error('invalid set of words');
        this.options.words = words;
        return this;
    };

    /**
     * Push your custom words to the existence list
     * @param {any[]} words Words to push
     */
    pushWords(words){
        if(!Array.isArray(words)) throw new Error('invalid set of words');
        this.options.words = this.options.words.concat(words);
        return this;
    };

    /**
     * Will set hint settings to true
     */
    setHint(){
        this.options.hint = true;
        return this;
    };

    /**
     * Set function for the events
     * @param {string} event Evebt name
     * @param {any} callback Event Function
     */
    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

};

module.exports = HangmanGame