import Board from '../Board';
import Player from '../Player';

class DropSoftCommand implements Command {
  public constructor(readonly player: Player, readonly board: Board) {}

  public execute(dx: number): void {
    this.player.descend();
  }
}

export default DropSoftCommand;
