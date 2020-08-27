let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */

function _makeGrid () {
    const grid = [];

    for (let i = 0; i < 8; i++) {
      let row = new Array(8);
      grid.push(row);
    }

    grid[3][4] = new Piece("black");
    grid[4][3] = new Piece("black");
    grid[3][3] = new Piece("white");
    grid[4][4] = new Piece("white");

    return grid;
}

// function createMap(columnCount, rowCount) {
//   const map = [];
//   for (let x = 0; x < columnCount; x++) {
//     map[x] = []; // set up inner array
//     for (let y = 0; y < rowCount; y++) {
//       addCell(map, x, y);
//     }
//   }
//   return map;
// }




/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
    let [a, b] = pos;
    return (((a <= 7 && a >= 0) && (b <= 7 && b >= 0)) ? true : false);
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
    if (!this.isValidPos(pos)) {
      throw new Error("Not valid pos!");
    };
    
    let [x, y] = pos;
    return this.grid[x][y];
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
    let piece = this.getPiece(pos);
    return (piece instanceof Piece) && (piece.color === color);
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
    let piece = this.getPiece(pos);
    return (piece instanceof Piece);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip = []) {
    //base cases: return empty array 

    //helper functions: isOccupied, isMine, isValidPos

    let [x, y] = pos;
    let [a, b] = dir;
    let nextPos = [x + a, y + b];

    if (!this.isValidPos(nextPos) || !this.isOccupied(nextPos)) {
        return [];
    }

    let mine = this.isMine(nextPos, color);

    if (mine) {
        return ( piecesToFlip);
    }

    piecesToFlip.push(nextPos);

  return this._positionsToFlip(nextPos, color, dir, piecesToFlip);

    //recursive step: add current position to function called with incremented position
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) {
    return false;
  }
  
  for (let i = 0; i < Board.DIRS.length; i++) {
    let possibleFlips = this._positionsToFlip(pos, color, Board.DIRS[i])
    if (possibleFlips.length > 0) {
      return true;
    }
  }

  return false;
}
//  let flips = Board.DIRS.map((dir) => this._positionsToFlip(pos, color, dir));
//  return (flips.flat().length > 0);//

/* Adds a new piece of the given color to the given position, flipping the
   * color of any pieces that are eligible for flipping.
   *
   * Throws an error if the position represents an invalid move.
*/

Board.prototype.placePiece = function (pos, color) {
    if (!this.validMove(pos, color)) {
        throw new Error("Invalid Move");
    };

    //place piece on grid
    [a, b] = pos;
    this.grid[a][b] = new Piece(color);

    //flip all pieces of other color
    for (let i = 0; i < Board.DIRS.length; i++) {
        let possibleFlips = this._positionsToFlip(pos, color, Board.DIRS[i]);

    //   while (possibleFlips.length > 0) {
    //     let flipPos = possibleFlips.pop();
    //     this.getPiece(flipPos).flip(); 
    //   };
    
      for(let j = 0; j < possibleFlips.length; j++) {
        this.getPiece(possibleFlips[j]).flip();
      };
    };
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {

    //get all positions that are valid move
    moves = [];
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (this.validMove([i, j], color)) {
                moves.push([i, j]);
            }
        }
    }
  return moves;
};


/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
    return (this.validMoves(color).length > 0);
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!this.hasMove("white") && (!this.hasMove("black")));
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
//   chars = this.grid.map(row => {
//     row.map(ele => { 
//       (ele instanceof Piece ? ele.toString() : " ");
//     })
//   });
//   chars.map(row => console.log(row.join(" | ")))
    print = [];
    print.push([" 0   1   2   3   4   5   6   7   "]);
    for (let i = 0; i < 8; i++) {
      let row = `${i} `;
        for (let j = 0; j < 8; j++) {
            pos = [i, j];
            row += (this.grid[i][j] instanceof Piece) ? `[${this.getPiece(pos)}] ` : "[ ] ";
        }
        row += "|"
        print.push(row);
    }
    
    console.log(print);
};



module.exports = Board;
