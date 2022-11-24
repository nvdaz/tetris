import React from 'react';
import classNames from './GameOver.module.scss';

type GameOverScreenProps = {
  onStart: () => void;
};

function GameOverScreen({ onStart }: GameOverScreenProps) {
  return (
    <div className={classNames.gameOverScreen}>
      <h1 className={classNames.title}>GAME OVER</h1>
      <h2 className={classNames.game}>TETRIS {import.meta.env.VERSION}</h2>
      <button className={classNames.play} onClick={onStart}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default GameOverScreen;
