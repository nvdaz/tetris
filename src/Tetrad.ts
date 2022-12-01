import pieces from "./assets/pieces.json";

class Tetrad {
  public static random(): Tetrad {
    return tetrads[Math.floor(Math.random() * tetrads.length)].clone();
  }

  public constructor(
    readonly parts: [number, number][],
    readonly color: string
  ) {}

  public get left() {
    let left = this.parts[0][0];

    for (const part of this.parts) {
      if (part[0] < left) left = part[0];
    }

    return left;
  }

  public get right() {
    let right = this.parts[0][0];

    for (const part of this.parts) {
      if (part[0] > right) right = part[0];
    }

    return right;
  }

  public get top() {
    let top = this.parts[0][1];

    for (const part of this.parts) {
      if (part[1] < top) top = part[1];
    }

    return top;
  }

  public get bottom() {
    let bottom = this.parts[0][1];

    for (const part of this.parts) {
      if (part[1] > bottom) bottom = part[1];
    }

    return bottom;
  }

  public get width() {
    return this.right - this.left + 1;
  }

  public get height() {
    return this.bottom - this.top + 1;
  }

  public isRotatable(): this is RotatableTetrad {
    return false;
  }

  public getTranslation(): [number, number] {
    const translation: [number, number] = [this.parts[0][0], this.parts[0][1]];

    for (const part of this.parts) {
      if (part[0] < translation[0]) translation[0] = part[0];
      if (part[1] < translation[1]) translation[1] = part[1];
    }

    return translation;
  }

  public clone() {
    return new Tetrad(structuredClone(this.parts), this.color);
  }
}

class RotatableTetrad extends Tetrad {
  public constructor(
    parts: [number, number][],
    color: string,
    readonly rotationsClockwise: [number, number][],
    readonly rotationsCounterClockwise: [number, number][]
  ) {
    super(parts, color);
  }

  public isRotatable(): this is RotatableTetrad {
    return true;
  }

  public clone() {
    return new RotatableTetrad(
      structuredClone(this.parts),
      this.color,
      this.rotationsClockwise,
      this.rotationsCounterClockwise
    );
  }
}

const tetrads: Tetrad[] = [];

for (const piece of pieces) {
  if (piece.rotatable) {
    tetrads.push(
      new RotatableTetrad(
        piece.parts,
        piece.color,
        piece.rotationsClockwise,
        piece.rotationsCounterClockwise
      )
    );
  } else {
    tetrads.push(new Tetrad(piece.parts, piece.color));
  }
}

export default Tetrad;
