import Behavior from './behaviors/Behavior';
import Board from './Board';
import Grid from './Grid';

class StandardGameMode implements GameMode {
  readonly grid: Grid;
  readonly board: Board;

  public constructor() {
    this.grid = new Grid(20, 10, 4);
    this.board = new Board(this.grid);
  }
}

export default StandardGameMode;
