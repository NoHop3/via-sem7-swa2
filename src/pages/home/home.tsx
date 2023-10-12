// src/pages/home/home.tsx
import React from 'react';
import { IHomeProps } from './home.props';
import { StyledHomeWrapper, StyledHomeTitle } from './home.styles';
import GameBoard from '../../components/board/gameboard';

function* stringGenerator() {
  const characters = ['A', 'B', 'C'];
  while (true) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    yield characters[randomIndex];
  }
}

export const _Home: React.FC<IHomeProps> = (props: IHomeProps) => {
  const { title } = props;

  const generator = stringGenerator(); // Create an instance of the generator

  return (
    <StyledHomeWrapper>
      <StyledHomeTitle>{title}</StyledHomeTitle>
      <GameBoard rows={3} cols={3} generator={generator} />
    </StyledHomeWrapper>
  );
};
