/**
 * Main file
 */

function load(moduleName) {
  try {
      return require(`./src/${moduleName}`);
  } catch(e) {
      return null;
  }
}

 module.exports = {

     /**
      * Version of the package
      */
    version: load('../package.json').version,

     /**
      * Hangman Game
      */
    HangmanGame: load('Hangman'),

     /**
      * Snake Game
      */

    SnakeGame: load('SnakeGame'),

     /**
      * ConnectFour Game
      */

    ConnectFour: load('ConnectFour'),

    /**
     *  GuessGame
     */
    GuessGame: load("GuessGame"),

    /**
     * Quiz Game
     */
    Quiz: load("Quiz")

 };