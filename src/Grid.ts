import { Observable, Subject } from 'rxjs';

export type Tile = string | null;
export type Coordinate = [number, number];
export type DefiniteCoordinate = [...Coordinate, Tile];

class Grid {
  private readonly _tiles: Tile[][];

  public constructor(
    readonly rows: number,
    readonly cols: number,
    readonly buffer: number
  ) {
    this._tiles = [...Array(rows)].map((_) =>
      [...Array(cols)].map((_) => null)
    );
  }

  public get(coord: Coordinate): Tile {
    return this._tiles[coord[0]][coord[1]];
  }

  private set(coord: Coordinate, color: string): void {
    this._tiles[coord[0]][coord[1]] = color;
  }

  public addPiece(coords: Coordinate[], color: string): void {
    for (const coord of coords) {
      this.set(coord, color);
    }
  }

  public removeRow(row: number): void {
    this._tiles.splice(row, 1);
    this._tiles.unshift([...Array(this.cols)].map(() => null));
  }

  public isWithinBounds(coord: Coordinate): boolean {
    return (
      coord[0] >= 0 &&
      coord[1] >= 0 &&
      coord[0] < this.rows &&
      coord[1] < this.cols
    );
  }

  public isAvailable(coord: Coordinate): boolean {
    return this.isWithinBounds(coord) && this.get(coord) === null;
  }

  public *row(row: number): IterableIterator<DefiniteCoordinate> {
    for (let col = 0; col < this.cols; col++) {
      yield [row, col, this.get([row, col])];
    }
  }

  public *tiles(): IterableIterator<DefiniteCoordinate> {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        yield [row, col, this.get([row, col])];
      }
    }
  }
}

export default Grid;
