class SudokuSolver {


  validate(puzzleString) {
    // Check for correct length
    if (!puzzleString || puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    // Check for valid characters (1-9 or .)
    if (/[^1-9.]/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    return { valid: true };
  }


  checkRowPlacement(puzzleString, row, column, value) {
    // row: 0-indexed
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleString[start + i] === value && i !== column) {
        return false;
      }
    }
    return true;
  }


  checkColPlacement(puzzleString, row, column, value) {
    // column: 0-indexed
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] === value && i !== row) {
        return false;
      }
    }
    return true;
  }


  checkRegionPlacement(puzzleString, row, column, value) {
    // Check if the value already exists at the specified row and column
    const idx = row * 9 + column;
    if (puzzleString[idx] === value) {
      return true;
    }

    // Find top-left of the 3x3 region
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = (startRow + r) * 9 + (startCol + c);
        if (puzzleString[idx] === value) {
          return false;
        }
      }
    }
    return true;
  }


  solve(puzzleString) {
    // Validate first
    const valid = this.validate(puzzleString);
    if (!valid.valid) return false;

    // Helper to find next empty cell
    const findEmpty = (str) => str.indexOf('.');

    const solveRecursive = (str) => {
      const idx = findEmpty(str);
      if (idx === -1) return str; // Solved
      const row = Math.floor(idx / 9);
      const col = idx % 9;
      for (let num = 1; num <= 9; num++) {
        const val = num.toString();
        if (
          this.checkRowPlacement(str, row, col, val) &&
          this.checkColPlacement(str, row, col, val) &&
          this.checkRegionPlacement(str, row, col, val)
        ) {
          const newStr = str.substring(0, idx) + val + str.substring(idx + 1);
          const solved = solveRecursive(newStr);
          if (solved) return solved;
        }
      }
      return false;
    };
    return solveRecursive(puzzleString);
  }
}

module.exports = SudokuSolver;

