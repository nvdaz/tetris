import Board from '../Board';
import Player from '../Player';
import Command from './Command';

class DropSoftCommand implements Command {
  public constructor(readonly player: Player, readonly board: Board) {}

  public execute(): void {
    this.player.descend();
  }
}

export default DropSoftCommand;
