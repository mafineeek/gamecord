const { EventEmitter } = require('events');

const WIDTH = 7;
const HEIGHT = 7;
const gameBoard = [];

const reactions = { "1️⃣": 1, "2️⃣": 2, "3️⃣": 3, "4️⃣": 4, "5️⃣": 5, "6️⃣": 6, "7️⃣": 7 }

class Connect4{
    constructor(message, options={}) {
        if(!message) throw new Error('missing message param!')
        
        this.message = message;
        this.gameEmbed = null;
        this.inGame = false;
        this.redTurn = true;
        this.event = new EventEmitter();

        this.options = {
            title: 'Connect4',
            color: 'RANDOM',
            gameOverTitle: 'Game Over',
            ...options
        };
    }
    gameBoardToString() {
        let str = "| . 1 | . 2 | 3 | . 4 | . 5 | 6 | . 7 |\n"
        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                str += "|" + gameBoard[y * WIDTH + x];
            }
            str += "|\n";
        }
        return str;
    }

    run(){
        if (this.inGame)
            return;

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                gameBoard[y * WIDTH + x] = "⚪";
            }
        }

        this.inGame = true;

        this.message.channel.send({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: this.gameBoardToString(),
                timestamp: Date.now(),
                fields: [
                    { name: 'Turn:', value: this.getChipFromTurn(), inline: false}
                ]
            }
        }).then(emsg => {
            this.gameEmbed = emsg;
            Object.keys(reactions).forEach(reaction => {
                this.gameEmbed.react(reaction);
            });

            this.waitForReaction();
        })
    }

    step() {
        this.redTurn = !this.redTurn;
        this.gameEmbed.edit({
            embed: {
                title: this.options.title,
                color: this.options.color,
                description: this.gameBoardToString(),
                fields: [
                    { name: 'Turn:', value: this.getChipFromTurn(), inline: false}
                ],
                timestamp: Date.now()
            }
        });

        this.waitForReaction();
    }

    gameOver(winner) {
        this.inGame = false;
        this.gameEmbed.edit({
            embed: {
                title: this.options.gameOverTitle,
                color: this.options.color,
                description: this.getWinnerText(winner),
                timestamp: Date.now
            }
        });

        this.gameEmbed.reactions.removeAll();
    }

    filter(reaction, user) {
        return Object.keys(reactions).includes(reaction.emoji.name) && user.id !== this.gameEmbed.author.id;
    }

    waitForReaction() {
        this.gameEmbed.awaitReactions((reaction, user) => this.filter(reaction, user), { max: 1, time: 300000, errors: ['time'] })
            .then(collected => {
                const reaction = collected.first();
                const column = reactions[reaction.emoji.name] - 1;
                let placedX = -1;
                let placedY = -1;

                for (let y = HEIGHT - 1; y >= 0; y--) {
                    const chip = gameBoard[column + (y * WIDTH)];
                    if (chip === "⚪") {
                        gameBoard[column + (y * WIDTH)] = this.getChipFromTurn();
                        placedX = column;
                        placedY = y;
                        break;
                    }
                }

                reaction.users.remove(reaction.users.cache.filter(user => user.id !== this.gameEmbed.author.id).first().id).then(() => {
                    if (placedY == 0)
                        this.gameEmbed.reactions.cache.get(reaction.emoji.name).remove();
                        
                    if (this.hasWon(placedX, placedY)) {
                        this.gameOver(this.getChipFromTurn());
                    }
                    else if (this.isBoardFull()) {
                        this.gameOver("tie");
                    }
                    else {
                        this.step();
                    }
                });
            })
            .catch(collected => {
                this.gameOver("timeout");
            });
    }

    getChipFromTurn() {
        return this.redTurn ? "🔴" : "🟡";
    }

    hasWon(placedX, placedY) {
        const chip = this.getChipFromTurn();

        //Horizontal Check
        const y = placedY * WIDTH;
        for (var i = Math.max(0, placedX - 3); i <= placedX; i++) {
            var adj = i + y;
            if (i + 3 < WIDTH) {
                if (gameBoard[adj] === chip && gameBoard[adj + 1] === chip && gameBoard[adj + 2] === chip && gameBoard[adj + 3] === chip)
                    return true;
            }
        }

        //Verticle Check
        for (var i = Math.max(0, placedY - 3); i <= placedY; i++) {
            var adj = placedX + (i * WIDTH);
            if (i + 3 < HEIGHT) {
                if (gameBoard[adj] === chip && gameBoard[adj + WIDTH] === chip && gameBoard[adj + (2 * WIDTH)] === chip && gameBoard[adj + (3 * WIDTH)] === chip)
                    return true;
            }
        }

        //Ascending Diag
        for (var i = -3; i <= 0; i++) {
            var adjX = placedX + i;
            var adjY = placedY + i;
            var adj = adjX + (adjY * WIDTH);
            if (adjX + 3 < WIDTH && adjY + 3 < HEIGHT) {
                if (gameBoard[adj] === chip && gameBoard[adj + WIDTH + 1] === chip && gameBoard[adj + (2 * WIDTH) + 2] === chip && gameBoard[adj + (3 * WIDTH) + 3] === chip)
                    return true;
            }
        }

        //Descending Diag
        for (var i = -3; i <= 0; i++) {
            var adjX = placedX + i;
            var adjY = placedY - i;
            var adj = adjX + (adjY * WIDTH);
            if (adjX + 3 < WIDTH && adjY - 3 >= 0) {
                if (gameBoard[adj] === chip && gameBoard[adj - WIDTH + 1] === chip && gameBoard[adj - (2 * WIDTH) + 2] === chip && gameBoard[adj - (3 * WIDTH) + 3] === chip)
                    return true;
            }
        }

        return false;
    }

    isBoardFull() {
        for (let y = 0; y < HEIGHT; y++)
            for (let x = 0; x < WIDTH; x++)
                if (gameBoard[y * WIDTH + x] === "⚪")
                    return false;
        return true;
    }

    getWinnerText(winner) {
        if (winner === "🔴" || winner === "🟡")
            return winner + " Has Won!";
        else if (winner == "tie")
            return "It was a tie!";
        else if (winner == "timeout")
            return "The game went unfinished :(";
    }

    setTitle(title){
        this.options.title = title;
        return this;
    };

    setColor(color){
        this.options.color = color;
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
}

module.exports = Connect4;