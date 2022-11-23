import pieces from '../pieces.json';
import { assert } from './assert';

export type Tile = string | null;

type RotatablePiece = {
  color: string;
  parts: [number, number][];
  width: number;
  rotatable: true;
  rotationsClockwise: [number, number][];
  rotationsCounterClockwise: [number, number][];
  rotation: number;
};

type StaticPiece = {
  color: string;
  parts: [number, number][];
  width: number;
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
  removed: Map<number, number> = new Map();

  public constructor(readonly columns: number, readonly rows: number) {
    this.grid = [...Array(rows)].map((_) =>
      [...Array(columns)].map((_) => null)
    );
    this.newPiece();
  }

  private newPiece() {
    this.piece = structuredClone(
      pieces[Math.floor(Math.random() * 7)]
    ) as unknown as Piece;

    for (const part of this.piece.parts) {
      part[0] += Math.floor((this.columns - this.piece.width) / 2);
    }
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

  public rotateClockwise() {
    if (!isRotatable(this.piece)) return;

    const newParts: [number, number][] = [];
    const center = this.piece.rotationsClockwise[this.piece.rotation];
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
        part[1] - point[1] - center[1] * direction + point[0],
        -(part[0] - point[0] - center[0] * direction) + point[1],
      ]);
    }

    if (
      !newParts.every(
        (p) => p[1] >= 0 && p[1] < this.rows && this.grid[p[1]][p[0]] === null
      )
    )
      return;

    this.piece.parts = newParts;

    this.piece.rotation =
      (this.piece.rotation + 1) % this.piece.rotationsClockwise.length;
  }

  public rotateCounterClockwise() {
    if (!isRotatable(this.piece)) return;

    const newParts: [number, number][] = [];
    const center = this.piece.rotationsCounterClockwise[this.piece.rotation];
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

    if (
      !newParts.every(
        (p) => p[1] >= 0 && p[1] < this.rows && this.grid[p[1]][p[0]] === null
      )
    )
      return;

    this.piece.parts = newParts;

    this.piece.rotation =
      this.piece.rotation === 0
        ? this.piece.rotationsClockwise.length - 1
        : this.piece.rotation - 1;
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
          this.removed.set(i, 0.5);
        }
      }

      this.newPiece();
    } else {
      for (const part of this.piece.parts) {
        part[1] += 1;
      }
    }

    this.next = 1;
    return shouldStick;
  }

  public drop() {
    let shouldStick;
    while (!(shouldStick = this.descend())) {}
  }

  public tick(delta: number) {
    this.removed.forEach((time, key, removed) => {
      const newTime = time - delta;
      if (newTime <= 0) {
        removed.delete(key);
      } else {
        removed.set(key, newTime);
      }
    });
    this.next -= delta;
    if (this.next <= 0) {
      this.descend();
      this.next = 1;
    }
  }
}

export default Board;
