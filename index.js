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
      * Hangman game
      */
    HangmanGame: load('Hangman'),

     /**
      * Snake game
      */

    SnakeGame: load('SnakeGame'),

     /**
      * ConnectFour Discord game
      */

    ConnectFour: load('ConnectFour'),

    /**
     *  GuessGame
     */
    GuessGame: load("GuessGame"),

    /**
     * Quiz
     */
    Quiz: load("Quiz")

 };