import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import classNames from './App.module.scss';
import GameCanvas from './game';

function App() {
  const gameContainer = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(150);

  const resizeGame = useCallback(() => {
    if (gameContainer.current) {
      setWidth(gameContainer.current.clientWidth);
      setHeight(gameContainer.current.clientHeight);
    }
  }, [gameContainer]);

  useLayoutEffect(() => {
    resizeGame();

    window.addEventListener('resize', resizeGame);

    return () => window.removeEventListener('resize', resizeGame);
  }, [gameContainer]);

  return (
    <div className={classNames.app}>
      <div ref={gameContainer} className={classNames.game}>
        <GameCanvas width={width} height={height}></GameCanvas>
      </div>
      <div className={classNames.hud}>
        <h1>TETRIS</h1>
        <h3>{import.meta.env.VERSION}</h3>
      </div>
    </div>
  );
}

export default App;
