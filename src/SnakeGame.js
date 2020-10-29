/**
 * SnakeGame Gen
 */
const { EventEmitter } = require('events');

const WIDTH = 15;
const HEIGHT = 10;

class SnakeGame{
    /**
    * Snakegame gen
    * @param {any} message Client Message
    * @param {object} options Your options
    * @example const GameCord = require('gamecord');
    * new GameCord.SnakeGame(message)
        .setTitle('My Snake')
        .setColor('#7298da')
        .setTime(20000) // Default is 30 secs
        .run() // Keep all your settings above and run it after all of your configuration!
    */

    constructor(message, options={}){
        if(!message) throw new Error('missing message param!');

        this.event = new EventEmitter();
        this.message = message;
        this.snakeLength = 1;
        this.score = 0;
        this.gameEmbed = null;
        this.snake = [{ x: 5, y: 5}];
        this.apple = { x: 1, y: 1 };
        this.gameBoard = [];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                this.gameBoard[y * WIDTH + x] = "🟦";
            }
        }

        this.options = {
            title: 'Snake Game',
            color: 'RANDOM',
            gameOverTitle: 'Game Over',
            maxTime: 10000,
            ...options
        };
    };

    /**
     * Get the snake board
     * @example SnakeGame.board
     */
    get board(){
        let { apple, gameBoard } = this
        let str = ""
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (x == apple.x && y == apple.y) {
                    str += "🍎";
                    continue;
                }

                let flag = true;
                for (let s = 0; s < this.snake.length; s++) {
                    if (x == this.snake[s].x && y == this.snake[s].y) {
                        str += "🟩";
                        flag = false;
                    }
                }

                if (flag)
                    str += gameBoard[y * WIDTH + x];
            }
            str += "\n";
        }
        return str;
    };

    reset(){
        this.score = 0;
        this.snakeLength = 1;
        this.snake = [{ x: 5, y: 5 }];
    };

    react(){
        this.gameEmbed.react('⬅️');
        this.gameEmbed.react('⬆️');
        this.gameEmbed.react('⬇️');
        this.gameEmbed.react('➡️');
        this.gameEmbed.react('❌');
    };

    run(){
        this.reset();
        this.newAppleLoc();
        this.event.emit('start', this);

        this.message.channel.send({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: this.board,
                timestamp: Date.now()
            }
        }).then(message => {
            this.gameEmbed = message;
            this.react();
            this.waitForReaction();
        })
    };

    gameOver(){

        this.gameEmbed.edit({
            embed: {
                title: this.options.gameOverTitle,
                color: this.options.color,
                description: `**Score:** ${this.score}`,
                timestamp: Date.now()
            }
        });

        this.gameEmbed.reactions.removeAll()
        this.event.emit('end', this);
    };

    step(){
        if (this.apple.x == this.snake[0].x && this.apple.y == this.snake[0].y) {
            this.score += 1;
            this.snakeLength++;
            this.newAppleLoc();
        };

        this.gameEmbed.edit({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: this.board,
                timestamp: Date.now()
            }
        });

        this.waitForReaction();
    };

    /**
     * 
     * @param {*} reaction 
     * @param {*} user 
     */
    filter(reaction, user) {
        return ['⬅️', '⬆️', '⬇️', '➡️', '❌'].includes(reaction.emoji.name) && user.id !== this.gameEmbed.author.id;
    }

    /**
     * 
     * @param {*} pos 
     */
    isLocInSnake(pos) {
        return this.snake.find(sPos => sPos.x == pos.x && sPos.y == pos.y);
    };

    newAppleLoc() {
        let newApplePos = { x: 0, y: 0 };
        do {
            newApplePos = { x: parseInt(Math.random() * WIDTH), y: parseInt(Math.random() * HEIGHT) };
        } while (this.isLocInSnake(newApplePos))

        this.apple.x = newApplePos.x;
        this.apple.y = newApplePos.y;
    };

    waitForReaction() {
        this.gameEmbed.awaitReactions((reaction, user) => this.filter(reaction, user), { max: 1, time: this.options.maxTime, errors: ['time'] })
            .then(collected => {

                const reaction = collected.first();

                const snakeHead = this.snake[0];
                const nextPos = { x: snakeHead.x, y: snakeHead.y };

                if (reaction.emoji.name === '⬅️') {
                    let nextX = snakeHead.x - 1;
                    if (nextX < 0)
                        nextX = WIDTH - 1;
                    nextPos.x = nextX;
                } else if (reaction.emoji.name === '⬆️') {
                    let nextY = snakeHead.y - 1;
                    if (nextY < 0)
                        nextY = HEIGHT - 1;
                    nextPos.y = nextY;
                } else if (reaction.emoji.name === '⬇️') {
                    let nextY = snakeHead.y + 1;
                    if (nextY >= HEIGHT)
                        nextY = 0;
                    nextPos.y = nextY;
                } else if (reaction.emoji.name === '➡️') {
                    let nextX = snakeHead.x + 1;
                    if (nextX >= WIDTH)
                        nextX = 0;
                    nextPos.x = nextX;
                } else if (reaction.emoji.name === '❌') {
                    this.gameOver();
                }

                reaction.users.remove(reaction.users.cache.filter(user => user.id !== this.gameEmbed.author.id).first().id).then(() => {
                    if (this.isLocInSnake(nextPos)) {
                        this.gameOver();
                    }
                    else {
                        this.snake.unshift(nextPos);
                        if (this.snake.length > this.snakeLength)
                            this.snake.pop();

                        this.step();
                    }
                });
            })
            .catch(collected => {
                this.gameOver();
            });
    }

    /**
     * 
     * @param {*} title 
     */
    setTitle(title){
        this.options.title = title;
        return this;
    };

    /**
     * 
     * @param {*} color 
     */
    setColor(color){
        this.options.color = color;
        return this;
    };

    /**
     * 
     * @param {*} time 
     */
    setMaxTime(time){
        this.options.maxTime = time;
        return this;
    };

    /**
     * 
     * @param {*} title 
     */
    setGameOverTitle(title){
        this.options.gameOverTitle = title;
        return this;
    };

    /**
     * 
     * @param {*} event 
     * @param {*} callback 
     */
    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

};

module.exports = SnakeGame;