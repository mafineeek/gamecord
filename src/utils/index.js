const random = arr => arr[Math.floor(Math.random() * arr.length)];

module.exports = {
    words: require('./words.json'),
    quiz: word => word.split('').map(x => random([true, false]) ? '_' : x).join(''),
    random
};