const random = require('./utils/index').random;

module.exports = (options={}) => {
    const width = options.width || 8;
    const height = options.height || 8;

    let board = [];

    for(let i = 0; i < height; i++){
        let section = [];
        for(let i = 0; i < width; i++){
            section.push(`||${random(['💥', ':one:', ':one:', ':two:', ':three:'])}||`);
        };
        board.push(section.join(' '));
    };

    return board.join('\n')
};