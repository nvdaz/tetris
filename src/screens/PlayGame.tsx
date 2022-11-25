import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { assert } from '../util/assert';
import Game from '../Game';
import classNames from './PlayGame.module.scss';
import { useAppSelector } from '../hooks';
import { selectScore } from '../store/gameSlice';

function PlayGameScreen() {
  const [game, setGame] = useState<Game>();
  const gameContainer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState<number>(300);
  const [height, setHeight] = useState<number>(150);
  const score = useAppSelector(selectScore);

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

  useEffect(() => {
    setGame(new Game());
  }, []);

  useEffect(() => {
    if (canvas.current && game) {
      const ctx = canvas.current.getContext('2d');
      assert(ctx);
      game.setRenderingContext(ctx);
    }
  }, [canvas.current, game]);

  useEffect(() => {
    if (game) {
      game.queueRun();
      return () => game.stop();
    }
  }, [game]);

  return (
    <div className={classNames.container}>
      <div className={classNames.gameContainer} ref={gameContainer}>
        <canvas width={width} height={height} ref={canvas}></canvas>
      </div>
      <div className={classNames.hudContainer}>
        <div className={classNames.titleContainer}>
          <h2 className={classNames.title}>TETRIS</h2>
          <p className={classNames.version}>{import.meta.env.VERSION}</p>
          <h3>Score</h3>
          <p>{score}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayGameScreen;
