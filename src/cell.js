const assert = require('assert')

/**
 * A cell representing the unit of a Sudoku grid.
 */
class Cell {

    constructor(value) {
        if (typeof value !== 'number') { throw new TypeError('Invalid number') }
        if (value < 0 || value > 9) { throw new RangeError() }

        this._value = value

        this.possibleValues = null
        if (value === 0) {
            this.possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        }

        this.row = null
        this.column = null
        this.subgrid = null
    }

    /**
     * @returns {number} Gets the cell's value.
     */
    get value() {
        return this._value
    }

    /**
     * @description Sets the cell's value.
     */
    set value(value) {
        if (typeof value !== 'number') { throw new TypeError('Invalid number') }
        if (value < 1 || value > 9) { throw new RangeError('value should be 1 - 9 ') }
        this._value = value
    }

    /**
     * @returns {number} Gets whether the cell has a value or not.
     */
    get has_value() {
        return this._value !== 0
    }

    /**
     * @description Reads all numbers in the row, column and subgrid to insert the possible values of a cell.
     * @returns {number[]} Gets the cell's possible values.
     */
    possibleValue() {
        if (this.has_value) { throw new Error('This cell has already a value') }

        this.row.forEach((cell)  => {
            return this.eliminate(cell)
        });
    
        this.column.forEach((cell)  => {
            return this.eliminate(cell)
        });

        this.subgrid.forEach((cell)  => {
            return this.eliminate(cell)
        });

        assert.strictEqual(this.possibleValues.length > 0, true)

        return this.possibleValues
    }

    eliminate(cell) {
        if (cell === this) { return }
        if (this.possibleValues.length === 0) { return }

        let cell_index = this.possibleValues.indexOf(cell.value)
        if (cell.has_value && cell_index !== -1) {
            this.possibleValues.splice(cell_index, 1)
        }
    }

}

module.exports = Cell
