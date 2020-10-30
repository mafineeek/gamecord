const random = arr => arr[Math.floor(Math.random() * arr.length)];

module.exports.emoji = require("./emoji.json")
module.exports.random = random;
module.exports.words = require('./words.json');