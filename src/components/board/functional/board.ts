// Define a generator interface with a 'next' method to generate values
export interface Generator<T> {
  next: () => T;
}

// Define a position interface to represent row and column coordinates
export interface Position {
  row: number;
  col: number;
}

// Define a match interface to represent a matched element and its positions
export interface Match<T> {
  matched: T;
  positions: Position[];
}

// Define a board interface to represent a game board
export interface Board<T> {
  rows: number; // Number of rows on the board
  cols: number; // Number of columns on the board
  pieces: Array<Array<T | undefined>>; // 2D array representing board pieces
  generator: Generator<T>; // Generator for creating pieces
  positions: Position[]; // Array of all possible positions on the board
}

// Define an effect interface to represent a game effect involving matched elements and a new board
export interface Effect<T> {
  match: Match<T>; // Matched elements and their positions
  newBoard: Board<T>; // New game board after the effect
}

// Define a move result interface to represent the result of a game move
export interface MoveResult<T> {
  board: Board<T>; // Updated game board
  effects: Array<Effect<T>>; // Array of effects caused by the move
}

// Create a new game board with the specified generator, number of rows, and number of columns
export function Create<T>(generator: Generator<T>, rows: number, cols: number): Board<T> {
  const pieces: T[][] = [];

  // Generate pieces for each row and column
  for (let row = 0; row < rows; row++) {
    const rowPieces: T[] = [];
    for (let col = 0; col < cols; col++) {
      rowPieces.push(generator.next());
    }
    console.log(rowPieces, 'rowPieces');
    console.log(pieces, 'pieces');
    pieces.push(rowPieces);
  }

  // Initialize and return the board
  return {
    generator,
    rows,
    cols,
    pieces,
    // Generate an array of all possible positions on the board
    positions: Array.from({ length: rows * cols }, (_, i) => ({ row: Math.floor(i / cols), col: i % cols })),
  };
}

// Get the piece at the specified position on the board
export function Piece<T>(board: Board<T>, p: Position): T | undefined {
  // Check if the position is valid and return the piece if it exists, otherwise return undefined
  const piece = board.pieces[p.row]?.[p.col];
  return piece !== undefined ? piece : undefined;
}

// Check if a move from the 'first' position to the 'second' position is valid on the board
export function CanMove<T>(board: Board<T>, first: Position, second: Position): boolean {
  // Check if the positions are outside the board boundaries
  if (first.row < 0 || first.row >= board.rows || first.col < 0 || first.col >= board.cols) {
    return false;
  }
  if (second.row < 0 || second.row >= board.rows || second.col < 0 || second.col >= board.cols) {
    return false;
  }

  // Check if the positions are the same or diagonal (invalid moves)
  if (first.row === second.row && first.col === second.col) {
    return false;
  }
  if (first.row !== second.row && first.col !== second.col) {
    return false;
  }

  // Check if the positions are adjacent horizontally or vertically (valid moves)
  if (first.row === second.row) {
    if (first.col + 1 === second.col || first.col - 1 === second.col) {
      return true;
    }
  }
  if (first.col === second.col) {
    if (first.row + 1 === second.row || first.row - 1 === second.row) {
      return true;
    }
  }

  // Default to false for any other cases
  return false;
}

// Perform a move on the board from the 'first' position to the 'second' position
export function Move<T>(generator: Generator<T>, board: Board<T>, first: Position, second: Position): MoveResult<T> {
  const effects: Array<Effect<T>> = [];
  // Create a new board to represent the updated game state
  const newBoard = Create(generator, board.rows, board.cols);

  // Iterate through each row and column to update the board state
  for (let row = 0; row < board.rows; row++) {
    newBoard.pieces[row] = [];
    for (let col = 0; col < board.cols; col++) {
      if (row === first.row && col === first.col) {
        // Move the piece from the 'first' position to the 'second' position
        newBoard.pieces[row][col] = Piece(board, second);
      } else if (row === second.row && col === second.col) {
        // Move the piece from the 'second' position to the 'first' position
        newBoard.pieces[row][col] = Piece(board, first);
      } else {
        // Copy the piece from the original board to the new board
        newBoard.pieces[row][col] = Piece(board, { row, col });
      }
    }
  }

  // Return the updated board and an empty effects array (no effects in this simplified example)
  return {
    board: newBoard,
    effects,
  };
}
