import React, { useState, useEffect } from 'react';
import { Create, Position, CanMove, Move, Board } from './functional/board';
import { StyledBoard } from './gameboard.styles';

interface GameBoardProps {
  rows: number;
  cols: number;
  generator: Generator<string, void, unknown>;
}

const GameBoard: React.FC<GameBoardProps> = ({ rows, cols, generator }) => {
  const [board, setBoard] = useState<Board<string | IteratorResult<string, void>>>();
  const [selectedPiece, setSelectedPiece] = useState<Position | undefined>();
  const [pieceClasses, setPieceClasses] = useState<string[][]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const initialGenerator = generator.next();
    if (!initialGenerator.done) {
      const initialPieceClasses: string[][] = new Array(rows);
      for (let i = 0; i < rows; i++) {
        initialPieceClasses[i] = new Array(cols).fill('');
      }
      setPieceClasses(initialPieceClasses);
      setBoard(Create(generator, rows, cols));
    }
  }, [generator, rows, cols]);

  const handlePieceClick = (position: Position) => {
    if (selectedPiece) {
      if (position.row === selectedPiece.row && position.col === selectedPiece.col) {
        // Unselect the same piece
        setSelectedPiece(undefined);
      } else if (isAdjacent(selectedPiece, position)) {
        if (board) {
          const canSwap = CanMove(board, selectedPiece, position) && wouldCauseMatch(board, selectedPiece, position);
          if (canSwap) {
            Move(generator, board, selectedPiece, position);
            setBoard(board);
            setSelectedPiece(undefined);
          }
        }
      } else {
        // Select a new piece if it's not in proximity
        setSelectedPiece(position);
      }
    } else {
      // Select a piece when none is selected
      setSelectedPiece(position);
    }
  };

  function isAdjacent(position1: Position, position2: Position): boolean {
    // Check if two positions are adjacent (horizontally or vertically)
    const rowDiff = Math.abs(position1.row - position2.row);
    const colDiff = Math.abs(position1.col - position2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  }

  function wouldCauseMatch(board: Board<string | IteratorResult<string, void>>, from: Position, to: Position) {
    const testBoard = { ...board };
    const pieceAtFrom = testBoard.pieces[from.row][from.col];
    const pieceAtTo = testBoard.pieces[to.row][to.col];

    testBoard.pieces[from.row][from.col] = pieceAtTo;
    testBoard.pieces[to.row][to.col] = pieceAtFrom;

    return hasMatch(testBoard, from, to);
  }

  function hasMatch(board: Board<string | IteratorResult<string, void>>, from: Position, to: Position): boolean {
    const { row: fromRow, col: fromCol } = from;
    const { row: toRow, col: toCol } = to;

    // Check only the rows and columns affected by the swap
    const rowsToCheck = [fromRow, toRow];
    const colsToCheck = [fromCol, toCol];

    for (const row of rowsToCheck) {
      let consecutiveCount = 1;
      for (let col = 1; col < board.cols; col++) {
        if (
          (board.pieces[row][col] as IteratorResult<string, void>).value ===
          (board.pieces[row][col - 1] as IteratorResult<string, void>).value
        ) {
          consecutiveCount++;
        } else {
          consecutiveCount = 1;
        }
        if (consecutiveCount >= 3) {
          return true;
        }
      }
    }

    for (const col of colsToCheck) {
      let consecutiveCount = 1;
      for (let row = 1; row < board.rows; row++) {
        if (
          (board.pieces[row][col] as IteratorResult<string, void>).value ===
          (board.pieces[row - 1][col] as IteratorResult<string, void>).value
        ) {
          consecutiveCount++;
        } else {
          consecutiveCount = 1;
        }
        if (consecutiveCount >= 3) {
          return true;
        }
      }
    }

    return false;
  }

  function checkMatchesAndGenerateNewBoard(board: Board<string | IteratorResult<string, void>>) {
    const updatedBoard = { ...board };
    const updatedPieceClasses = [...pieceClasses];
    let hasMatches = false;

    function markMatchingPieces(
      consecutiveCount: number,
      startRow: number,
      endRow: number,
      col: number,
      direction: string,
    ) {
      for (let i = startRow; i <= endRow; i++) {
        if (direction === 'vertical') {
          updatedPieceClasses[i][col] = 'matching';
        } else {
          updatedPieceClasses[col][i] = 'matching';
        }
      }
      setScore(score + consecutiveCount * 10);
      hasMatches = true;
    }

    // Check for horizontal matches
    for (let row = 0; row < updatedBoard.rows; row++) {
      let consecutiveCount = 1;
      for (let col = 1; col < updatedBoard.cols; col++) {
        if (
          (updatedBoard.pieces[row][col] as IteratorResult<string, void>).value ===
          (updatedBoard.pieces[row][col - 1] as IteratorResult<string, void>).value
        ) {
          consecutiveCount++;
        } else {
          if (consecutiveCount >= 3) {
            markMatchingPieces(consecutiveCount, col - consecutiveCount, col - 1, row, 'horizontal');
          }
          consecutiveCount = 1;
        }
      }
      if (consecutiveCount >= 3) {
        markMatchingPieces(
          consecutiveCount,
          updatedBoard.cols - consecutiveCount,
          updatedBoard.cols - 1,
          row,
          'horizontal',
        );
      }
    }

    // Check for vertical matches
    for (let col = 0; col < updatedBoard.cols; col++) {
      let consecutiveCount = 1;
      for (let row = 1; row < updatedBoard.rows; row++) {
        if (
          (updatedBoard.pieces[row][col] as IteratorResult<string, void>).value ===
          (updatedBoard.pieces[row - 1][col] as IteratorResult<string, void>).value
        ) {
          consecutiveCount++;
        } else {
          if (consecutiveCount >= 3) {
            markMatchingPieces(consecutiveCount, row - consecutiveCount, row - 1, col, 'vertical');
          }
          consecutiveCount = 1;
        }
      }
      if (consecutiveCount >= 3) {
        markMatchingPieces(
          consecutiveCount,
          updatedBoard.rows - consecutiveCount,
          updatedBoard.rows - 1,
          col,
          'vertical',
        );
      }
    }

    // Remove marked pieces and shift others down
    for (let col = 0; col < updatedBoard.cols; col++) {
      for (let row = updatedBoard.rows - 1; row >= 0; row--) {
        if ((updatedPieceClasses[row][col] ?? '').includes('matching')) {
          for (let i = row; i > 0; i--) {
            updatedBoard.pieces[i][col] = updatedBoard.pieces[i - 1][col];
          }
          updatedBoard.pieces[0][col] = generateNewPiece();
        }
      }
    }

    if (hasMatches) {
      // Clear matching class after removing and shifting
      for (let col = 0; col < updatedBoard.cols; col++) {
        for (let row = updatedBoard.rows - 1; row >= 0; row--) {
          if ((updatedPieceClasses[row][col] ?? '').includes('matching')) {
            updatedPieceClasses[row][col] = '';
          }
        }
      }

      setPieceClasses(updatedPieceClasses);
      setBoard(updatedBoard);
    }
  }

  function generateNewPiece() {
    // Use your generator to generate the next random piece
    const result = generator.next();
    if (!result.done) {
      return result;
    } else {
      console.log('generator is done');
      return '';
    }
  }

  useEffect(() => {
    if (board) {
      const interval = setInterval(() => {
        checkMatchesAndGenerateNewBoard(board);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [board]);

  return (
    <>
      <h2>{score}</h2>
      <StyledBoard>
        {board?.pieces.map((row, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {row.map((piece, colIndex) => (
              <div
                className={`board-piece ${pieceClasses[rowIndex][colIndex] || ''} ${
                  selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'selected' : ''
                }`}
                key={colIndex}
                onClick={() => {
                  handlePieceClick({ row: rowIndex, col: colIndex });
                }}>
                <span>{(piece as IteratorResult<string, void>)?.value ?? ''}</span>
              </div>
            ))}
          </div>
        ))}
      </StyledBoard>
    </>
  );
};

export default GameBoard;
