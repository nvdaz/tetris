import React, { useCallback, useState } from 'react';
import { useAppSelector } from './hooks';
import GameOverScreen from './screens/GameOver';
import PlayGameScreen from './screens/PlayGame';
import TitleScreen from './screens/Title';
import { selectGameStatus } from './store/gameSlice';

function GameContainer() {
  const status = useAppSelector(selectGameStatus);

  return (
    <>
      {status === 'title' && <TitleScreen />}
      {status === 'play' && <PlayGameScreen />}
      {status === 'gameOver' && <GameOverScreen />}
    </>
  );
}

export default GameContainer;
