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

type PlayGameScreenProps = {
  onGameOver: () => void;
};

function PlayGameScreen({ onGameOver }: PlayGameScreenProps) {
  const [game, setGame] = useState<Game>();
  const gameContainer = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
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

  useEffect(() => {
    if (canvas.current) {
      setGame((game) => {
        if (game) {
          return game;
        }

        assert(canvas.current);
        const context = canvas.current.getContext('2d');
        assert(context);

        return new Game(context, onGameOver);
      });
    }
  }, [canvas.current]);

  useEffect(() => {
    if (game) {
      game.run();
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
          <h3 className={classNames.title}>TETRIS</h3>
          <h4 className={classNames.version}>{import.meta.env.VERSION}</h4>
        </div>
      </div>
    </div>
  );
}

export default PlayGameScreen;
