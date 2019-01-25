const Grid = require('./src/grid.js');
const saperater = '\n'; 

const sampleInput = '002908010700060500009500007041026050087000340060480190100005200008040005070602800';
//const sampleInput = '100489006730000040000001295007120600500703008006095700914600000020000037800512004';
//const sampleInput = '000600400700003600000091080000000000050180003000306045040200060903000000020000100';


let grid = new Grid(sampleInput)


let unsolved_grid = Grid.stringToArrayConversion(sampleInput);
unsolved_grid = unsolved_grid.map(function (value) { return value === 0 ? '.' : value });


console.log('**** Sample *****')
console.log(Grid.display(unsolved_grid, saperater), saperater);


let result = grid.solve()
result.sudoku = result.sudoku.map(function (cell) { return cell.value });

console.log('**** Final Result ****')
console.log(Grid.display(result.sudoku, saperater), saperater);


