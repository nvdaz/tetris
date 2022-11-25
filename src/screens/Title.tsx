import React, { useCallback } from 'react';
import { useAppDispatch } from '../hooks';
import { setGameStatus } from '../store/gameSlice';
import classNames from './Title.module.scss';

function TitleScreen() {
  const dispatch = useAppDispatch();

  const onStart = useCallback(() => dispatch(setGameStatus('play')),[dispatch]);

  return (
    <div className={classNames.titleScreen}>
      <h1 className={classNames.title}>TETRIS</h1>
      <h2 className={classNames.version}>{import.meta.env.VERSION}</h2>
      <button className={classNames.play} onClick={onStart}>
        PLAY
      </button>
    </div>
  );
}

export default TitleScreen;
