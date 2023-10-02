/* eslint-disable @typescript-eslint/array-type */
export type EventType = EventTypeMove | EventTypeOther;

export type EventTypeMove = 'move';
export type EventTypeOther = 'other';

export interface Generator<T> {
  next: () => T;
}

export interface Position {
  row: number;
  col: number;
}

export interface Match<T> {
  matched: T;
  positions: Position[];
}

export class Board<T> {
  readonly rows: number;
  readonly cols: number;
  readonly pieces: Array<Array<T | undefined>>;
  readonly generator: Generator<T>;
  readonly positions: Position[];
  readonly listeners: BoardListener<EventType>[] = [];

  constructor(generator: Generator<T>, rows: number, cols: number) {
    this.generator = generator;
    this.rows = rows;
    this.cols = cols;
    this.pieces = [];
    this.positions = [];

    // Generate pieces for each row and column
    for (let row = 0; row < this.rows; row++) {
      const rowPieces: T[] = [];
      for (let col = 0; col < this.cols; col++) {
        rowPieces.push(this.generator.next());
      }
      this.pieces.push(rowPieces);
    }

    // Generate an array of all possible positions on the board
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.positions.push({ row: i, col: j });
      }
    }
  }

  // Add a listener to the board
  addListener(listener: BoardListener<EventType>): void {
    this.listeners.push(listener);
  }

  // Emit a move event to all listeners
  private emitMoveEvent(eventType: EventType): void {
    const event = new BoardEvent<EventType>(eventType);
    for (const listener of this.listeners) {
      listener.onMove(event);
    }
  }

  // Get the piece at the specified position on the board
  piece(p: Position): T | undefined {
    const piece = this.pieces[p.row]?.[p.col];
    return piece !== undefined ? piece : undefined;
  }

  // Check if a move from the 'first' position to the 'second' position is valid on the board
  canMove(first: Position, second: Position): boolean {
    // Check if the positions are outside the board boundaries
    if (first.row < 0 || first.row >= this.rows || first.col < 0 || first.col >= this.cols) {
      return false;
    }
    if (second.row < 0 || second.row >= this.rows || second.col < 0 || second.col >= this.cols) {
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
  move(first: Position, second: Position): void {
    // Check if the move is valid
    if (!this.canMove(first, second)) {
      return;
    }

    // Swap the pieces at the 'first' and 'second' positions
    const temp = this.pieces[first.row][first.col];
    this.pieces[first.row][first.col] = this.pieces[second.row][second.col];
    this.pieces[second.row][second.col] = temp;

    // Emit a move event to all listeners
    this.emitMoveEvent('move' as EventTypeMove);
  }
}

// Define a board event class
export class BoardEvent<EventType> {
  readonly eventType: EventType;

  constructor(eventType: EventType) {
    this.eventType = eventType;
  }
}

// Define a board listener interface
export interface BoardListener<EventType> {
  onMove: (event: BoardEvent<EventType>) => void;
}
