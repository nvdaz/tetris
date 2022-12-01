import Tetrad from "./Tetrad";

class ActivePiece {
  translation: [number, number] = [0, 0];
  rotation: number = 0;
  lockTime: number | null = null;

  public constructor(readonly tetrad: Tetrad) {}

  public static random(): ActivePiece {
    return new ActivePiece(Tetrad.random());
  }
}

export default ActivePiece;
