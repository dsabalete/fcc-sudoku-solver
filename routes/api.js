'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Check for missing required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Validate puzzle string
      const puzzleValidation = solver.validate(puzzle);
      if (!puzzleValidation.valid) {
        return res.json({ error: puzzleValidation.error });
      }

      // Validate coordinate format (A1-I9)
      const coordinateRegex = /^[A-I][1-9]$/;
      if (!coordinateRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Validate value (1-9)
      const valueRegex = /^[1-9]$/;
      if (!valueRegex.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Convert coordinate to row and column (0-indexed)
      const row = coordinate.charCodeAt(0) - 65; // A=0, B=1, etc.
      const col = parseInt(coordinate[1]) - 1; // 1=0, 2=1, etc.

      // Check if the placement is valid
      const conflicts = [];

      if (!solver.checkRowPlacement(puzzle, row, col, value)) {
        conflicts.push('row');
      }

      if (!solver.checkColPlacement(puzzle, row, col, value)) {
        conflicts.push('column');
      }

      if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({
          valid: false,
          conflict: conflicts
        });
      } else {
        return res.json({
          valid: true
        });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      // Check for missing puzzle field
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      // Validate puzzle string
      const puzzleValidation = solver.validate(puzzle);
      if (!puzzleValidation.valid) {
        return res.json({ error: puzzleValidation.error });
      }

      // Attempt to solve the puzzle
      const solution = solver.solve(puzzle);

      if (solution) {
        return res.json({ solution: solution });
      } else {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
    });
};
