const { EventEmitter } = require('events');

const WIDTH = 15;
const HEIGHT = 10;

const reactionMap = {
    '⬅️': (snakeHead, nextPos) => {
        let nextX = snakeHead.x - 1;
        if (nextX < 0) nextX = WIDTH - 1;
        nextPos.x = nextX;
    },
    '⬆️': (snakeHead, nextPos) => {
        let nextY = snakeHead.y - 1;
        if (nextY < 0) nextY = HEIGHT - 1;
        nextPos.y = nextY;
    },
    '⬇️': (snakeHead, nextPos) => {
        let nextY = snakeHead.y + 1;
        if (nextY >= HEIGHT) nextY = 0;
        nextPos.y = nextY;
    },
    '➡️': (snakeHead, nextPos) => {
        let nextX = snakeHead.x + 1;
        if (nextX >= WIDTH) nextX = 0;
        nextPos.x = nextX;
    }
};

class SnakeGame{

    constructor(message, options={}){
        if(!message) throw new Error('missing message param!');

        this.event = new EventEmitter();
        this.message = message;
        this.snakeLength = 1;
        this.score = 0;
        this.gameEmbed = null;
        this.inGame = false;
        this.snake = [{ x: 5, y: 5}];
        this.apple = { x: 1, y: 1 };
        this.gameBoard = [];

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                this.gameBoard[y * WIDTH + x] = "🟦";
            };
        };

        this.options = {
            title: 'Snake Game',
            color: 'RANDOM',
            gameOverTitle: 'Game Over',
            maxTime: 10000,
            ...options
        };
    };

    get board(){
        let str = "";

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                if (x == this.apple.x && y == this.apple.y) str += "🍎";

                let flag = true;

                for (let s = 0; s < this.snake.length; s++) {
                    if (x == this.snake[s].x && y == this.snake[s].y) {
                        str += "🟩";
                        flag = false;
                    };
                };

                if (flag) str += this.gameBoard[y * WIDTH + x];
            };

            str += "\n";
        };

        return str
    };

    reset(){
        this.inGame = true;
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
        this.inGame = false;

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

    filter(reaction, user) {
        return ['⬅️', '⬆️', '⬇️', '➡️', '❌'].includes(reaction.emoji.name) && user.id !== this.gameEmbed.author.id;
    };

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

    waitForReaction(){
        this.gameEmbed.awaitReactions(this.filter, { max: 1, time: this.options.maxTime, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
            const snakeHead = this.snake[0];
            const nextPos = { x: snakeHead.x, y: snakeHead.y };
            const emojiWork = reactionMap[reaction.emoji.name];

            if(emojiWork) emojiWork(snakeHead, nextPos);
            else return this.gameOver();

            reaction.users.remove(reaction.users.cache.filter(user => user.id !== this.gameEmbed.author.id).first().id).then(() => {
                if (this.isLocInSnake(nextPos)) return this.gameOver();
                this.snake.unshift(nextPos);
                if (this.snake.length > this.snakeLength) this.snake.pop();
                this.step();
            });
        })
        .catch(this.gameOver);
    };

    setTitle(title){
        this.options.title = title;
        return this;
    };

    setColor(color){
        this.options.color = color;
        return this;
    };

    setMaxTime(time){
        this.options.maxTime = time;
        return this;
    };

    setGameOverTitle(title){
        this.options.gameOverTitle = title;
        return this;
    };

    on(event, callback){
        this.event.on(event, callback);
        return this;
    };

};

module.exports = SnakeGame;