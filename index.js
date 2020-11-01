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
      * Snake game
      */

    SnakeGame: require('./src/SnakeGame'),

     /**
      * ConnectFour Discord game
      */

    ConnectFour: require('./src/ConnectFour'),

     /**
      * Minesweeper board gen
      */
    Minesweeper: require('./src/Minesweeper')

 };