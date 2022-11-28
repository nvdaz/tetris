import { Observable, Subject } from 'rxjs';
import ActivePiece from './ActivePiece';
import Board from './Board';
import Tetrad from './Tetrad';

export type TetradLockEvent = {
  type: 'lock';
  tetrad: Tetrad;
};

export function isTetradLockEvent(
  event: PlayerEvent
): event is TetradLockEvent {
  return event.type === 'lock';
}

export type RowClearEvent = {
  type: 'clear';
  rows: number[];
};

export function isRowClearEvent(event: PlayerEvent): event is RowClearEvent {
  return event.type === 'clear';
}

type PlayerEvent = TetradLockEvent | RowClearEvent;

class Player {
  private eventEmitter = new Subject<PlayerEvent>();
  private descendTime = 1;
  private lockTime: number | null = null;
  public activePiece: ActivePiece;

  constructor(private board: Board) {
    this.activePiece = ActivePiece.random();
  }

  public get eventEmitter$(): Observable<PlayerEvent> {
    return this.eventEmitter.asObservable();
  }

  public descend() {
    const shouldLock = this.activePiece.tetrad.parts.some(
      (p) => !this.board.grid.isAvailable([p[1] + 1, p[0]])
    );

    if (shouldLock) {
      if (this.lockTime === null) this.lockTime = 0.1;
    } else {
      for (const part of this.activePiece.tetrad.parts) part[1]++;
    }

    this.descendTime = 1;
    return shouldLock;
  }

  private isRowFull(row: number) {
    for (const [, , tile] of this.board.grid.row(row)) {
      if (tile === null) return false;
    }

    return true;
  }

  public lock() {
    const shouldLock = this.activePiece.tetrad.parts.some(
      (p) => !this.board.grid.isAvailable([p[1] + 1, p[0]])
    );
    if (!shouldLock) {
      return;
    }

    this.board.grid.addPiece(
      this.activePiece.tetrad.parts.map(([col, row]) => [row, col]),
      this.activePiece.tetrad.color
    );
    this.eventEmitter.next({
      type: 'lock',
      tetrad: this.activePiece.tetrad.clone(),
    });
    this.activePiece = ActivePiece.random();

    let rows = [];
    for (let row = 0; row < this.board.grid.rows; row++) {
      if (this.isRowFull(row)) {
        this.board.grid.removeRow(row);
        rows.push(row);
      }
    }

    this.eventEmitter.next({
      type: 'clear',
      rows,
    });
  }

  public tick(delta: number) {
    this.descendTime -= delta;

    if (this.descendTime <= 0) {
      this.descend();
      this.descendTime = 1;
    }

    if (this.lockTime !== null) {
      this.lockTime -= delta;

      if (this.lockTime <= 0) {
        this.lock();
        this.lockTime = null;
      }
    }
  }
}

export default Player;
