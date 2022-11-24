import React, { useCallback, useState } from 'react';
import GameOverScreen from './screens/GameOver';
import PlayGameScreen from './screens/PlayGame';
import TitleScreen from './screens/Title';

type Page = 'title' | 'play' | 'gameOver';

function GameContainer() {
  const [page, setPage] = useState<Page>('title');

  const onStart = useCallback(() => setPage('play'), []);
  const onGameOver = useCallback(() => setPage('gameOver'), []);

  return (
    <>
      {page === 'title' && <TitleScreen onStart={onStart} />}
      {page === 'play' && <PlayGameScreen onGameOver={onGameOver} />}
      {page === 'gameOver' && <GameOverScreen onStart={onStart} />}
    </>
  );
}

export default GameContainer;
