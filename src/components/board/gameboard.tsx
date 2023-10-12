import React, { useState, useEffect } from 'react';
import { Create, Position, CanMove, Move, Board } from './functional/board';
import { StyledBoard } from './gameboard.styles';

interface GameBoardProps {
  rows: number;
  cols: number;
  generator: Generator<string, void, unknown>;
}

const GameBoard: React.FC<GameBoardProps> = ({ rows, cols, generator }) => {
  const [board, setBoard] = useState<Board<string | IteratorResult<string, void>> | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);

  useEffect(() => {
    const initialGenerator = generator.next();
    if (!initialGenerator.done) {
      setBoard(Create(generator, rows, cols));
    }
  }, [generator, rows, cols]);

  const handlePieceClick = (position: Position) => {
    if (board && selectedPiece) {
      if (CanMove(board, selectedPiece, position)) {
        const moveResult = Move(generator, board, selectedPiece, position);
        const newBoard = moveResult.board;

        // Implement the logic to remove matches and generate new pieces here
        // Update the newBoard accordingly

        setBoard(newBoard);
        setSelectedPiece(null);
      } else {
        setSelectedPiece(position);
      }
    } else {
      setSelectedPiece(position);
    }
  };

  useEffect(() => {
    if (board) {
      const interval = setInterval(() => {
        // Implement checks for matches and generate new pieces
        const updatedBoard = { ...board }; // Replace with your logic
        setBoard(updatedBoard);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [board]);

  return (
    <StyledBoard>
      {board?.pieces.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((piece, colIndex) => (
            <div
              className={`board-piece ${
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
  );
};

export default GameBoard;
