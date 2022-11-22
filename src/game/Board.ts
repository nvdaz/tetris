import pieces from '../pieces.json';

export type Tile = string | null;

export type Piece = {
  color: string;
  parts: [number, number][];
};

class Board {
  grid: Tile[][];
  piece: Piece;
  next: number = 1;

  public constructor(readonly columns: number, readonly rows: number) {
    this.grid = [...Array(rows)].map((_) =>
      [...Array(columns)].map((_) => null)
    );
    this.newPiece();
  }

  private newPiece() {
    this.piece = structuredClone(pieces[Math.floor(Math.random() * 6)]);
  }

  public translate(dir: -1 | 1) {
    if (
      this.piece.parts.every(
        (p) =>
          p[0] + dir >= 0 &&
          p[0] + dir < 10 &&
          this.grid[p[1]][p[0] + dir] === null
      )
    ) {
      for (const part of this.piece.parts) {
        part[0] += dir;
      }
    }
  }

  public descend() {
    const shouldStick = this.piece.parts.some(
      (p) => p[1] + 1 >= 20 || this.grid[p[1] + 1][p[0]] !== null
    );

    if (shouldStick) {
      for (const part of this.piece.parts) {
        this.grid[part[1]][part[0]] = this.piece.color;
      }

      this.newPiece();
    } else {
      for (const part of this.piece.parts) {
        part[1] += 1;
      }
    }
  }

  public tick(delta: number) {
    this.next -= delta;
    if (this.next <= 0) {
      this.descend();
      this.next = 0.5;
    }
  }
}

export default Board;
