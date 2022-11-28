import Board from '../Board';
import Player from '../Player';

class DropHardCommand implements Command {
  public constructor(readonly player: Player, readonly board: Board) {}

  public execute(dx: number): void {
    let count = 0;
    while (!this.player.descend()) {
      count++;
    }
    this.player.lock();
  }
}

export default DropHardCommand;
