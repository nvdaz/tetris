import Board from '../Board';
import Player from '../Player';
import Command from './Command';

class MoveCommand implements Command {
  public constructor(readonly player: Player, readonly board: Board) {}

  public execute(dx: number): void {
    const tetrad = this.player.activePiece.tetrad;
    if (
      !tetrad.parts.every((p) => this.board.grid.isAvailable([p[1], p[0] + dx]))
    ) {
      return;
    }

    for (const part of tetrad.parts) {
      part[0] += dx;
    }
  }
}

export default MoveCommand;
