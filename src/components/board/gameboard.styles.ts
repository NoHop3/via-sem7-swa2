// src/components/board/gameboard.styles.ts
import styled from 'styled-components';

const highlightedPiece = {
  backgroundColor: 'yellow', // Customize the highlight color
};

export const StyledBoard = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 60px); /* Adjust the number of columns and piece size as needed */
  gap: 5px;
  background-color: #e0e0e0; /* Adjust the background color of the board */

  .board-row {
    display: flex;
    flex-direction: row;
  }

  .board-piece {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px; /* Adjust the width and height as needed */
    height: 60px;
    background-color: #ffffff; /* Adjust the background color of the pieces */
    cursor: pointer;
  }

  .selected {
    ${highlightedPiece};
  }
`;

