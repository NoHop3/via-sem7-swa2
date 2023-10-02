import { describe, it, expect } from '@jest/globals';
import { Generator, Create, Piece, CanMove, Move } from '../src/components/board/functional/board';

// Define a generator for testing purposes
class CyclicGenerator implements Generator<string> {
  readonly sequence: string;
  private index: number;

  constructor(sequence: string) {
    this.sequence = sequence;
    this.index = 0;
  }

  next(): string {
    const n = this.sequence.charAt(this.index);
    this.index = (this.index + 1) % this.sequence.length;
    return n;
  }
}

// Describe the test suite for the 'Board' module
describe('Board', () => {
  // Test suite for the 'Create' function
  describe('Initial board', () => {
    const generator = new CyclicGenerator('ABC');
    const board = Create(generator, 2, 3); // Create a 2x3 board with the generator

    it('has the given rows', () => {
      expect(board.rows).toEqual(2); // Check if the number of rows matches the expected value
    });

    it('has the given cols', () => {
      expect(board.cols).toEqual(3); // Check if the number of columns matches the expected value
    });

    it('has row * col positions', () => {
      const positions = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ];
      expect(board.positions).toEqual(positions); // Check if the positions array matches the expected positions
    });

    it('contains the generated elements', () => {
      // Check if the pieces at specific positions match the expected values
      expect(Piece(board, { row: 0, col: 0 })).toEqual('A');
      expect(Piece(board, { row: 1, col: 1 })).toEqual('B');
      expect(Piece(board, { row: 0, col: 1 })).toEqual('B');
      expect(Piece(board, { row: 1, col: 0 })).toEqual('A');
      expect(Piece(board, { row: 0, col: 2 })).toEqual('C');
      expect(Piece(board, { row: 1, col: 2 })).toEqual('C');
    });

    it('is undefined outside of the board', () => {
      // Check if pieces outside of the board are undefined
      expect(Piece(board, { row: 0, col: -1 })).toBeUndefined();
      expect(Piece(board, { row: -1, col: 0 })).toBeUndefined();
      expect(Piece(board, { row: 0, col: 3 })).toBeUndefined();
      expect(Piece(board, { row: 2, col: 3 })).toBeUndefined();
    });
  });

  // Test suite for the 'CanMove' function
  describe('CanMove', () => {
    const generator = new CyclicGenerator('ABC');
    const board = Create(generator, 2, 3);

    it('is false for same position', () => {
      // Check if CanMove returns false for the same position
      expect(CanMove(board, { row: 0, col: 0 }, { row: 0, col: 0 })).toBeFalsy();
    });

    it('is false for diagonal positions', () => {
      // Check if CanMove returns false for diagonal positions
      expect(CanMove(board, { row: 0, col: 0 }, { row: 1, col: 1 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: 1, col: -1 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: -1, col: 1 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: -1, col: -1 })).toBeFalsy();
    });

    it('is true for adjacent positions', () => {
      // Check if CanMove returns true for adjacent positions
      expect(CanMove(board, { row: 0, col: 0 }, { row: 0, col: 1 })).toBeTruthy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: 1, col: 0 })).toBeTruthy();
      expect(CanMove(board, { row: 1, col: 1 }, { row: 0, col: 1 })).toBeTruthy();
      expect(CanMove(board, { row: 1, col: 1 }, { row: 1, col: 0 })).toBeTruthy();
    });

    it('is false for positions outside of the board', () => {
      // Check if CanMove returns false for positions outside of the board
      expect(CanMove(board, { row: 0, col: 0 }, { row: 0, col: -1 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: -1, col: 0 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: 0, col: 3 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: 2, col: 0 })).toBeFalsy();
      expect(CanMove(board, { row: -1, col: 0 }, { row: 2, col: 3 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: -1 }, { row: 2, col: 3 })).toBeFalsy();
    });

    it('is false for positions that are not adjacent', () => {
      // Check if CanMove returns false for positions that are not adjacent
      expect(CanMove(board, { row: 0, col: 0 }, { row: 0, col: 2 })).toBeFalsy();
      expect(CanMove(board, { row: 0, col: 0 }, { row: 2, col: 0 })).toBeFalsy();
      expect(CanMove(board, { row: 1, col: 1 }, { row: 0, col: 2 })).toBeFalsy();
      expect(CanMove(board, { row: 1, col: 1 }, { row: 2, col: 0 })).toBeFalsy();
    });
  });

  // Test suite for the 'Move' function
  describe('Move', () => {
    it('moves pieces correctly', () => {
      const generator = new CyclicGenerator('AB');
      const board = Create(generator, 2, 3);
      const initialPiece = Piece(board, { row: 0, col: 0 });
      const targetPiece = Piece(board, { row: 0, col: 1 });

      const result = Move(generator, board, { row: 0, col: 0 }, { row: 0, col: 1 });

      // Check if the pieces are moved correctly
      expect(Piece(result.board, { row: 0, col: 0 })).toEqual(targetPiece);
      expect(Piece(result.board, { row: 0, col: 1 })).toEqual(initialPiece);
    });

    it('returns a new board object', () => {
      const generator = new CyclicGenerator('AB');
      const board = Create(generator, 2, 3);

      const result = Move(generator, board, { row: 0, col: 0 }, { row: 0, col: 1 });

      // Check if the result contains a new board object
      expect(result.board).not.toBe(board); // Ensure it's a new object
    });

    it('returns a new board with the same dimensions', () => {
      const generator = new CyclicGenerator('AB');
      const board = Create(generator, 2, 3);

      const result = Move(generator, board, { row: 0, col: 0 }, { row: 0, col: 1 });

      // Check if the result contains a new board with the same dimensions
      expect(result.board.rows).toEqual(board.rows);
      expect(result.board.cols).toEqual(board.cols);
    });

    it('returns a new board with the same generator', () => {
      const generator = new CyclicGenerator('AB');
      const board = Create(generator, 2, 3);

      const result = Move(generator, board, { row: 0, col: 0 }, { row: 0, col: 1 });

      // Check if the result contains a new board with the same generator
      expect(result.board.generator).toBe(board.generator);
    });

    it('returns a new board with the same positions', () => {
      const generator = new CyclicGenerator('AB');
      const board = Create(generator, 2, 3);

      const result = Move(generator, board, { row: 0, col: 0 }, { row: 0, col: 1 });

      // Check if the result contains a new board with the same positions
      expect(result.board.positions).toEqual(board.positions);
    });
  });
});
