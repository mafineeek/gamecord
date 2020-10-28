const random = require('./utils/index').random;

/**
 * Minesweeper board gen
 * @param {any} [options={}] Your options
 */
module.exports = (options={}) => {
    const width = options.width || 8;
    const height = options.height || 8;

    let board = [];

    for(let i = 0; i < height; i++){
        for(let i = 0; i < width; i++){
            board.push(`||${random(['💥', ':one:', ':one:', ':two:', ':three:'])}||`);
        };
        board.push('\n');
    };

    return board.join(' ')
};