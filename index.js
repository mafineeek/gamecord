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
      * Snake game
      */

     SnakeGame: require('./src/SnakeGame'),

     /**
      * Minesweeper board gen
      */
     Minesweeper: require('./src/Minesweeper'),

     /**
      * Connect4 Game
      */
     Connect4: require("./src/Connect4")

 };