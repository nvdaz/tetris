import pieces from '../pieces.json';

export type Tile = string | null;

type RotatablePiece = {
  color: string;
  parts: [number, number][];
  rotatable: true;
  center: [number, number][];
  rotation: number;
};

type StaticPiece = {
  color: string;
  parts: [number, number][];
  rotatable: false;
};

export type Piece = StaticPiece | RotatablePiece;

function isRotatable(piece: Piece): piece is RotatablePiece {
  return piece.rotatable;
}

class Board {
  grid: Tile[][];
  piece!: Piece;
  next: number = 1;
  removed: Record<number, number> = {};

  public constructor(readonly columns: number, readonly rows: number) {
    this.grid = [...Array(rows)].map((_) =>
      [...Array(columns)].map((_) => null)
    );
    this.newPiece();
  }

  private newPiece() {
    const piece = structuredClone(pieces[Math.floor(Math.random() * 7)]);

    for (const part of piece.parts) {
      part[0] += Math.floor((this.columns - piece.width) / 2);
    }
    this.piece = piece;
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

  public rotate() {
    if (!isRotatable(this.piece)) return;

    const newParts: [number, number][] = [];
    const center = this.piece.center[this.piece.rotation];
    let point = [this.piece.parts[0][0], this.piece.parts[0][1]];

    for (const part of this.piece.parts) {
      if (part[0] < point[0]) {
        point[0] = part[0];
      }
      if (part[1] < point[1]) {
        point[1] = part[1];
      }
    }

    for (const part of this.piece.parts) {
      const direction = this.piece.rotation % 2 ? 1 : -1;
      newParts.push([
        -(part[1] - point[1] - center[1] * direction) + point[0],
        part[0] - point[0] - center[0] * direction + point[1],
      ]);
    }

    if (!newParts.every((p) => this.grid[p[1]][p[0]] === null)) return;

    this.piece.parts = newParts;

    this.piece.rotation = (this.piece.rotation + 1) % this.piece.center.length;
  }

  public descend() {
    const shouldStick = this.piece.parts.some(
      (p) => p[1] + 1 >= 20 || this.grid[p[1] + 1][p[0]] !== null
    );

    if (shouldStick) {
      for (const part of this.piece.parts) {
        this.grid[part[1]][part[0]] = this.piece.color;
      }

      for (let i = 0; i < this.rows; i++) {
        if (this.grid[i].every((t) => t !== null)) {
          this.grid.splice(i, 1);
          this.grid.unshift([...Array(this.columns)].map((_) => null));
          this.removed[i] = 0.5;
        }
      }

      this.newPiece();
    } else {
      for (const part of this.piece.parts) {
        part[1] += 1;
      }
    }

    return shouldStick;
  }

  public drop() {
    let shouldStick;
    while (!(shouldStick = this.descend())) {}
  }

  public tick(delta: number) {
    for (const key of Object.keys(this.removed)) {
      this.removed[key] -= delta;
      if (this.removed[key] <= 0) {
        delete this.removed[key];
      }
    }
    this.next -= delta;
    if (this.next <= 0) {
      this.descend();
      this.next = 1;
    }
  }
}

export default Board;
