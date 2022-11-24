import React from 'react';
import classNames from './Title.module.scss';

type TitleScreenProps = {
  onStart: () => void;
};

function TitleScreen({ onStart }: TitleScreenProps) {
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
