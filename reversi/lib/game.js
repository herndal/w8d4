const readline = require("readline");
const Piece = require("./piece.js");
const Board = require("./board.js");

/**
 * Sets up the game with a board and the first player to play a turn.
 */
function Game () {
  this.board = new Board();
  this.turn = "black";
};

/**
 * Flips the current turn to the opposite color.
 */
Game.prototype._flipTurn = function () {
  this.turn = (this.turn == "black") ? "white" : "black";
};

// Dreaded global state!
let rlInterface;

/**
 * Creates a readline interface and starts the run loop.
 */
Game.prototype.play = function () {
  rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  this.runLoop(function () {
    rlInterface.close();
    rlInterface = null;
  });
};

/**
 * Gets the next move from the current player and
 * attempts to make the play.
 */
Game.prototype.playTurn = function (callback) {
  this.board.print();

  let pos = undefined;

  if (this.turn === "black") {
    rlInterface.question(
      `${this.turn}, where do you want to move?`,
      handleResponse.bind(this)
    );


  function handleResponse(answer) {
    const pos = JSON.parse(answer);
    if (!this.board.validMove(pos, this.turn)) {
      console.log("Invalid move!");
      this.playTurn(callback);
      return;
    }
    
    } else { 
      this.board.placePiece(pos, this.turn);
      this._flipTurn();
      callback();
    }
  }
};


Game.prototype.computerTurn = function (board) {
  moves = board.validMoves("white")
  let maxMove = moves[0];
  let maxSum = 0;

  for (let i = 0; i < moves.length; i++) {
    let sum = 0;
    for (let j = 0; j < Board.DIRS.length; j++) {
      sum += board._positionsToFlip(moves[i] "white", Board.DIRS[j]).length;

      if (sum > maxSum) {
        maxSum = sum;
        maxMove = moves[i];
      }
    }
  }

  return maxMove;
}





/**
 * Continues game play, switching turns, until the game is over.
 */
Game.prototype.runLoop = function (overCallback) {
  if (this.board.isOver()) {
    console.log("The game is over!");
    overCallback();
  } else if (!this.board.hasMove(this.turn)) {
    console.log(`${this.turn} has no move!`);
    this._flipTurn();
    this.runLoop();
  } else {
    this.playTurn(this.runLoop.bind(this, overCallback));
  }
};

module.exports = Game;
