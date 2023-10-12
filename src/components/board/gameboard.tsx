// src/components/board/gameboard.tsx
import React from 'react';
import { Create, Piece, Position } from './functional/board';
import { StyledBoard } from './gameboard.styles';

interface GameBoardProps {
  rows: number;
  cols: number;
  generator: Generator<string>; // Adjust the generator type
}

const GameBoard: React.FC<GameBoardProps> = ({ rows, cols, generator }) => {
  const board = Create(generator, rows, cols);

  const handlePieceClick = (position: Position) => {
    console.log('Piece clicked:', Piece(board, position));
  };

  return (
    <StyledBoard>
      {board.pieces.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((piece, colIndex) => (
            <div
              className="board-piece"
              key={colIndex}
              onClick={() => {
                handlePieceClick({ row: rowIndex, col: colIndex });
              }}>
              <span>{piece?.value}</span> {/* Wrap the piece content with <span> */}
            </div>
          ))}
        </div>
      ))}
    </StyledBoard>
  );
};

export default GameBoard;
