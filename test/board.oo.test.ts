import { describe, it, expect } from '@jest/globals';
import { Generator, Board, Position } from '../src/components/board/object-oriented/board';

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

// Describe the test suite for the 'Board' class
describe('Board', () => {
  // Test suite for the 'constructor' method
  describe('constructor', () => {
    const generator = new CyclicGenerator('ABC');
    const rows = 2;
    const cols = 3;
    const board = new Board(generator, rows, cols);

    it('initializes rows and cols correctly', () => {
      expect(board.rows).toEqual(rows); // Check if the number of rows matches the expected value
      expect(board.cols).toEqual(cols); // Check if the number of columns matches the expected value
    });

    it('initializes pieces correctly', () => {
      // Check if the pieces at specific positions match the expected values
      expect(board.piece({ row: 0, col: 0 })).toEqual('A');
      expect(board.piece({ row: 1, col: 1 })).toEqual('B');
      expect(board.piece({ row: 0, col: 1 })).toEqual('B');
      expect(board.piece({ row: 1, col: 0 })).toEqual('A');
      expect(board.piece({ row: 0, col: 2 })).toEqual('C');
      expect(board.piece({ row: 1, col: 2 })).toEqual('C');
    });

    it('initializes positions correctly', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ];
      expect(board.positions).toEqual(positions); // Check if the positions array matches the expected positions
    });

    it('initializes listeners as an empty array', () => {
      expect(board.listeners).toEqual([]); // Check if the listeners array is initially empty
    });
  });

  // Test suite for the 'addListener' method
  describe('addListener', () => {
    it('adds a listener correctly', () => {
      const generator = new CyclicGenerator('ABC');
      const board = new Board(generator, 2, 3);
      const listener = { onMove: jest.fn() };

      board.addListener(listener);

      expect(board.listeners).toContain(listener); // Check if the listener is added to the listeners array
    });

    it('emits a move event to all listeners', () => {
      const generator = new CyclicGenerator('ABC');
      const board = new Board(generator, 2, 3);
      const listener = { onMove: jest.fn() };

      board.addListener(listener);
      board.move({ row: 0, col: 0 }, { row: 0, col: 1 });

      expect(listener.onMove).toHaveBeenCalledWith(expect.anything()); // Check if the listener is called with an eventType
    });
  });

  // Test suite for the 'piece' method
  describe('piece', () => {
    const generator = new CyclicGenerator('ABC');
    const board = new Board(generator, 2, 3);

    it('returns the correct piece at a valid position', () => {
      // Check if the 'piece' method returns the correct piece at a valid position
      expect(board.piece({ row: 0, col: 0 })).toEqual('A');
      expect(board.piece({ row: 1, col: 1 })).toEqual('B');
      expect(board.piece({ row: 0, col: 1 })).toEqual('B');
      expect(board.piece({ row: 1, col: 0 })).toEqual('A');
      expect(board.piece({ row: 0, col: 2 })).toEqual('C');
      expect(board.piece({ row: 1, col: 2 })).toEqual('C');
    });

    it('returns undefined for positions outside of the board', () => {
      // Check if the 'piece' method returns undefined for positions outside of the board
      expect(board.piece({ row: 0, col: -1 })).toBeUndefined();
      expect(board.piece({ row: -1, col: 0 })).toBeUndefined();
      expect(board.piece({ row: 0, col: 3 })).toBeUndefined();
      expect(board.piece({ row: 2, col: 3 })).toBeUndefined();
    });
  });

  // Test suite for the 'canMove' method
  describe('canMove', () => {
    const generator = new CyclicGenerator('ABC');
    const board = new Board(generator, 2, 3);

    it('returns false for the same position', () => {
      // Check if 'canMove' returns false for the same position
      expect(board.canMove({ row: 0, col: 0 }, { row: 0, col: 0 })).toBeFalsy();
    });

    it('returns false for diagonal positions', () => {
      // Check if 'canMove' returns false for diagonal positions
      expect(board.canMove({ row: 0, col: 0 }, { row: 1, col: 1 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: 1, col: -1 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: -1, col: 1 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: -1, col: -1 })).toBeFalsy();
    });

    it('returns true for adjacent positions', () => {
      // Check if 'canMove' returns true for adjacent positions
      expect(board.canMove({ row: 0, col: 0 }, { row: 0, col: 1 })).toBeTruthy();
      expect(board.canMove({ row: 0, col: 0 }, { row: 1, col: 0 })).toBeTruthy();
      expect(board.canMove({ row: 1, col: 1 }, { row: 0, col: 1 })).toBeTruthy();
      expect(board.canMove({ row: 1, col: 1 }, { row: 1, col: 0 })).toBeTruthy();
    });

    it('returns false for positions outside of the board', () => {
      // Check if 'canMove' returns false for positions outside of the board
      expect(board.canMove({ row: 0, col: 0 }, { row: 0, col: -1 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: -1, col: 0 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: 0, col: 3 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: 2, col: 0 })).toBeFalsy();
      expect(board.canMove({ row: -1, col: 0 }, { row: 2, col: 3 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: -1 }, { row: 2, col: 3 })).toBeFalsy();
    });

    it('returns false for positions that are not adjacent', () => {
      // Check if 'canMove' returns false for positions that are not adjacent
      expect(board.canMove({ row: 0, col: 0 }, { row: 0, col: 2 })).toBeFalsy();
      expect(board.canMove({ row: 0, col: 0 }, { row: 2, col: 0 })).toBeFalsy();
      expect(board.canMove({ row: 1, col: 1 }, { row: 0, col: 2 })).toBeFalsy();
      expect(board.canMove({ row: 1, col: 1 }, { row: 2, col: 0 })).toBeFalsy();
    });
  });

  // Test suite for the 'move' method
  describe('move', () => {
    it('moves pieces correctly', () => {
      const generator = new CyclicGenerator('AB');
      const board = new Board(generator, 2, 3);
      const initialPiece = board.piece({ row: 0, col: 0 });
      const targetPiece = board.piece({ row: 0, col: 1 });

      board.move({ row: 0, col: 0 }, { row: 0, col: 1 });

      // Check if the pieces are moved correctly
      expect(board.piece({ row: 0, col: 0 })).toEqual(targetPiece);
      expect(board.piece({ row: 0, col: 1 })).toEqual(initialPiece);
    });

    it('does not move pieces for invalid moves', () => {
      const generator = new CyclicGenerator('AB');
      const board = new Board(generator, 2, 3);
      const initialPieces = board.pieces.map((row) => [...row]);

      board.move({ row: 0, col: 0 }, { row: 1, col: 1 });

      // Check if the pieces remain the same after an invalid move
      expect(board.pieces).toEqual(initialPieces);
    });

    // Add more test scenarios for 'move' as needed
  });

  // Add more test suites for other methods of the 'Board' class as needed
});
