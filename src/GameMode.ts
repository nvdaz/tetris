import Behavior from './behaviors/Behavior';
import Board from './Board';
import Grid from './Grid';

interface GameMode {
  readonly grid: Grid;
  readonly behaviors: Behavior[];
  readonly board: Board;
}
