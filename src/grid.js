const Cell = require('./cell.js')

/**
 * A 9x9 Sudoku grid.
 */
class Grid {

    /**
     * @param {number[]|string} grid An array or a string of 81 numbers representing the Sudoku grid.
     */
    constructor(grid) {
        let _grid = grid

        if (typeof grid === 'string') {
            if (grid.length !== 81) {
                throw new RangeError('grid must be 81 numbers long')
            } else {
                _grid = Grid.stringToArrayConversion(grid)
            }
        } else if (!(grid instanceof Array)) {
            throw new TypeError('grid must be an array')
        }

        
        if (grid.length !== 81) {
            throw new RangeError('grid must be 81 numbers long')
        }

        // Instanciate Cells for each number of the grid.
        this.cells = []
        for (let index = 0; index < (9 * 9); index++) {
            this.cells.push(new Cell(_grid[index]))
        }

        for (let index = 0; index < 9; index++) {
            let row = this.bucket(this.cells, index, this.bucketRow)
            let column = this.bucket(this.cells, index, this.bucketColumn)
            let subgrid = this.bucket(this.cells, index, this.bucketSubgrid)

            row.forEach(cell => {
                cell.row = row.reduce((siblings, sibling) => {
                    if (cell !== sibling) { siblings.push(sibling) }
                    return siblings;
                }, [])
            });

            column.forEach(cell => {
                cell.column = column.reduce((siblings, sibling) => {
                    if (cell !== sibling) { siblings.push(sibling) }
                    return siblings;
                }, [])
            });

            subgrid.forEach(cell => {
                cell.subgrid = subgrid.reduce((siblings, sibling) => {
                    if (cell !== sibling) { siblings.push(sibling) }
                    return siblings;
                }, [])
            });
        }
    }

    /**
     * @param {string} string All the numbers of the grid represented as a string of 81 characters.
     * @returns {number[]} An array of 81 numbers representing the Sudoku grid.
     */
    static stringToArrayConversion(string) {
        return (string.split('')).map(function (number) {
            let value = Number(number)
            return Number.isNaN(value) ? 0 : value
        })
    }

    /**
     * @returns {{ solved: boolean, iterations: number, sudoku: Cell[]}} The solved grid.
     */
    solve() {
        let solved = false
        let iterations = []

        while (!solved && iterations.length < 100) {
            solved = true
            iterations.push(this.cells.map(cell => new Cell(cell.value)))

            for (let index = 0; index < this.cells.length; index++) {
                let cell = this.cells[index]
                if (cell.has_value) { continue }

                cell.possibleValue()

                if (cell.possibleValues.length === 1) {
                    cell.value = cell.possibleValues[0]
                    continue
                }

                solved = false
            }
        }

        return {
            solved,
            iterations: iterations.length,
            steps: iterations,
            sudoku: this.cells
        }
    }

    bucket(grid_cells, bucket_index, strategy) {
        
        if (!(grid_cells instanceof Array)) { throw new TypeError('cells must be an array') }
        if (grid_cells.length !== 81) { throw new RangeError('cells must have a lenght of 81') }
        if (typeof bucket_index !== 'number') { throw new TypeError('bucket_index must be a number') }
        if (bucket_index < 0 || bucket_index > 8) { throw new RangeError('bucket_index must be a number between 0 and 8 included') }
        if (typeof strategy !== 'function') { throw new TypeError('strategy must be a function') }

        let getIndex = strategy;
        let bucketCells = []

        for (let index = 0; index < 9; index++) {
            bucketCells.push(grid_cells[getIndex(bucket_index, index)])
        }

        return bucketCells
    }

    /**
     * @returns {number} The next grid index for a row.
     */
    bucketRow(bucket_index, cell_index) {
        return (bucket_index * 9) + cell_index
    }

    /**
     * @returns {number} The next grid index for a column.
     */
    bucketColumn(bucket_index, cell_index) {
        return bucket_index + ((cell_index) * 9)
    }

    /**
     * @returns {number} The next grid index for a row.
     */
    bucketSubgrid(bucket_index, cell_index) { // 4, 2
        let index = Math.floor(bucket_index / 3) * 27
        index += bucket_index % 3 * 3
        index += Math.floor((cell_index) / 3) * 9
        index += (cell_index) % 3
        return index
    }

    static display(grid, end_of_line) {
        let output = []

        for (let index = 0; index < grid.length; index++) {
            if (index > 0 && index % 3 === 0) { output.push(' ') }
            if (index > 0 && index % 9 === 0) { output.push(end_of_line) }
            if (index > 0 && index % 27 === 0) { output.push(end_of_line) }
            output.push(grid[index], ' ')
        }

        return output.join('')
    }


}

module.exports = Grid
