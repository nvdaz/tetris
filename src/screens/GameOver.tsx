import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectScore, setGameStatus } from '../store/gameSlice';
import classNames from './GameOver.module.scss';

function GameOverScreen() {
  const dispatch = useAppDispatch();
  const score = useAppSelector(selectScore);
  const onStart = useCallback(() => dispatch(setGameStatus('play')), []);

  return (
    <div className={classNames.gameOverScreen}>
      <h1 className={classNames.title}>GAME OVER</h1>
      <h2 className={classNames.game}>TETRIS {import.meta.env.VERSION}</h2>
      <h2 className={classNames.score}>Score: {score}</h2>
      <button className={classNames.play} onClick={onStart}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default GameOverScreen;
