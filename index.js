/**
 * Main file
 */

 module.exports = {

     /**
      * Version of the package
      */
     version: require('./package.json').version,

     /**
      * Hangman game
      */
     HangmanGame: require('./src/Hangman'),

     /**
      * Make your guess game
      */
     GuessGame: require('./src/GuessGame'),

     /**
      * Snake Game
      */
     SnakeGame: require('./src/SnakeGame')

 };