const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {

    const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solvedPuzzle = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
    const invalidCharPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..X..';
    const shortPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3.';

    setup(() => {
        solver = new Solver();
    });

    test('Logic handles a valid puzzle string of 81 characters', () => {
        const result = solver.validate(validPuzzle);
        assert.isTrue(result.valid);
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        const result = solver.validate(invalidCharPuzzle);
        assert.isFalse(result.valid);
        assert.equal(result.error, 'Invalid characters in puzzle');
    });

    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        const result = solver.validate(shortPuzzle);
        assert.isFalse(result.valid);
        assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    });

    test('Logic handles a valid row placement', () => {
        // Place 3 at row 0, col 1 (should be valid)
        assert.isTrue(solver.checkRowPlacement(validPuzzle, 0, 1, '3'));
    });

    test('Logic handles an invalid row placement', () => {
        // Place 1 at row 0, col 1 (1 already in row)
        assert.isFalse(solver.checkRowPlacement(validPuzzle, 0, 1, '1'));
    });

    test('Logic handles a valid column placement', () => {
        // Place 9 at row 0, col 0 (should be valid)
        assert.isTrue(solver.checkColPlacement(validPuzzle, 0, 0, '9'));
    });

    test('Logic handles an invalid column placement', () => {
        // Place 1 at row 1, col 0 (1 already in col)
        assert.isFalse(solver.checkColPlacement(validPuzzle, 1, 0, '1'));
    });

    test('Logic handles a valid region (3x3 grid) placement', () => {
        // Place 1 at row 2, col 3 (should be valid)
        assert.isTrue(solver.checkRegionPlacement(validPuzzle, 2, 3, '1'));
    });

    test('Logic handles an invalid region (3x3 grid) placement', () => {
        // Place 9 at row 1, col 1 (9 already in region)
        assert.isFalse(solver.checkRegionPlacement(validPuzzle, 1, 1, '9'));
    });

    test('Valid puzzle strings pass the solver', () => {
        const solution = solver.solve(validPuzzle);
        assert.isString(solution);
        assert.equal(solution.length, 81);
    });

    test('Invalid puzzle strings fail the solver', () => {
        assert.isFalse(solver.solve(shortPuzzle));
        assert.isFalse(solver.solve(invalidCharPuzzle));
    });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
        const solution = solver.solve(validPuzzle);
        assert.equal(solution, solvedPuzzle);
    });

});
