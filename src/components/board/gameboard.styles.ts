// src/components/board/gameboard.styles.ts
import styled from 'styled-components';
import { Box } from '@mui/material';

export const StyledBoard = styled(Box)`
  display: grid;
  gap: 5px;
  background-color: ${({ theme }) => theme.palette.background};
  border-radius: 1rem;
  padding: 1rem;
  border: 8px solid ${({ theme }) => theme.palette.primary.main};

  .board-row {
    display: flex;
    flex-direction: row;
  }

  .board-piece.matchCombo3 {
    background-color: ${({ theme }) => theme.palette.secondary.main};
  }
  .board-piece.matchCombo4 {
    background-color: ${({ theme }) => theme.palette.divider};
  }
  .board-piece.matchCombo5 {
    background-color: ${({ theme }) => theme.palette.text.secondary};
  }

  .board-piece {
    margin: 8px;
    color: ${({ theme }) => theme.palette.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    cursor: pointer;
    border: 8px solid ${({ theme }) => theme.palette.primary.main};
    transition: background-color 0.5s ease-in-out;
    border-radius: 1rem;
  }

  .selected {
    background-color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`;
