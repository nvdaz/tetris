import store from './store';
import { resetScore } from './store/gameSlice';
import Grid from './Grid';

class Board {
  public constructor(public grid: Grid) {
    store.dispatch(resetScore());
  }
}

export default Board;
