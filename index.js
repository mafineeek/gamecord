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
     HangmanGame: require('./src/Hangcord'),

     /**
      * All utils
      */
     utils: require('./utils/index')

 };