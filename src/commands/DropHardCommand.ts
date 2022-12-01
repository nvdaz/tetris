import Board from '../Board';
import Player from '../Player';
import Command from './Command';

class DropHardCommand implements Command {
  public constructor(readonly player: Player, readonly board: Board) {}

  public execute(): void {
    let count = 0;
    while (!this.player.descend()) {
      count++;
    }
    this.player.lock();
  }
}

export default DropHardCommand;
