import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { assert } from './assert';
import Game from './Game';

type GameCanvasProps = {
  width: number;
  height: number;
};

function GameCanvas({ width, height }: GameCanvasProps) {
  const [game, setGame] = useState<Game>();
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      setGame((game) => {
        if (game) {
          return game;
        }

        assert(canvas.current);
        const context = canvas.current.getContext('2d');
        assert(context);

        return new Game(context);
      });
    }
  }, [canvas.current]);

  useEffect(() => {
    if (game) {
      game.run();
      return () => game.stop();
    }
  }, [game]);

  return <canvas width={width} height={height} ref={canvas}></canvas>;
}

export default GameCanvas;
