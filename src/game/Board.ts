import pieces from '../pieces.json';

export type Tile = string | null;

type RotatablePiece = {
  color:string;
  parts: [number, number][];
  rotatable: true;
  center: [number, number][];
  rotation: number;
}

type StaticPiece = {
  color:string;
  parts:[number,number];
  rotatable: false;
}

export type Piece = StaticPiece | RotatablePiece;

function isRotatable(piece: Piece): piece is RotatablePiece {
  return piece.rotatable;
}

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

  public rotate() {
    if (!isRotatable(this.piece)) return;
    const center = this.piece.center[this.piece.rotation];
    let point = [this.piece.parts[0][0], this.piece.parts[0][1]];
    console.log(this.piece.rotation,center);
    for (const part of this.piece.parts) {
      if (part[0] < point[0]) {
        point[0] = part[0];
      }
      if (part[1] < point[1]) {
        point[1] = part[1];
      }

    }

    for (const part of this.piece.parts) {
      let k = part[0];
      const direction = this.piece.rotation % 2 ? 1 : - 1;
      part[0] = -(part[1] - point[1] - center[1] * direction) + point[0];
      part[1] = k - point[0] - center[0] * direction + point[1];
    }

    this.piece.rotation = (this.piece.rotation + 1) % this.piece.center.length
    console.log(this.piece.rotation);
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
      //this.descend();
      this.next = 0.5;
    }
  }
}

export default Board;
