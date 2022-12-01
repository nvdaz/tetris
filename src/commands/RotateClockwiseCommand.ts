import Board from '../Board';
import Player from '../Player';
import Command from './Command';

class RotateClockwiseCommand implements Command {
  public constructor(readonly player: Player, readonly board: Board) {}

  public execute(): void {
    const tetrad = this.player.activePiece.tetrad;
    const rotation = this.player.activePiece.rotation;
    if (!tetrad.isRotatable()) {
      return;
    }

    const parts: [number, number][] = [];
    const center = tetrad.rotationsClockwise[rotation];
    const direction = rotation % 2 ? 1 : -1; //TODO:remove

    const translation = tetrad.getTranslation();

    for (const part of tetrad.parts) {
      parts.push([
        part[1] - translation[1] - center[1] * direction + translation[0],
        -(part[0] - translation[0] - center[0] * direction) + translation[1],
      ]);
    }

    if (!parts.every((p) => this.board.grid.isAvailable([p[1], p[0]]))) {
      return;
    }

    tetrad.parts = parts;
    this.player.activePiece.rotation =
      (rotation + 1) % tetrad.rotationsClockwise.length;
  }
}

export default RotateClockwiseCommand;
