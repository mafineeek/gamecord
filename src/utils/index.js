const { load } = require("../..");

const random = arr => arr[Math.floor(Math.random() * arr.length)];

module.exports = {
    emoji: require("./emoji.json"),
    words: require("./words.json"),
    quiz: require("./quiz.json"),
    random
}