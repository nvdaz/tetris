import { KeyCode } from 'keyboardevent-codes';
import Board from './Board';
import Keyboard from './Keyboard';

export type Action =
  | 'translateLeft'
  | 'translateRight'
  | 'descend'
  | 'rotateClockwise'
  | 'drop';

const COOLDOWN = 0.1;

class Controls {
  private cooldown: Partial<Record<Action, number>> = {};
  public constructor(private board: Board) {}

  public handle(action: Action) {
    if (action === 'translateLeft') {
      this.board.translate(-1);
      this.cooldown[action] = 0.1;
    } else if (action === 'translateRight') {
      this.board.translate(1);
      this.cooldown[action] = 0.1;
    } else if (action === 'descend') {
      this.board.descend();
      this.cooldown[action] = 0.1;
    } else if (action === 'rotateClockwise') {
      this.board.rotate();
      this.cooldown[action] = 0.2;
    } else if (action === 'drop') {
      this.board.drop();
      this.cooldown[action] = 0.5;
    }
  }

  public endHandle(action: Action) {
    delete this.cooldown[action];
  }

  public tick(delta: number) {
    for (const action of Object.keys(this.cooldown) as ReadonlyArray<Action>) {
      this.cooldown[action]! -= delta;
      if (this.cooldown[action]! <= 0) {
        this.handle(action);
      }
    }
  }
}

export default Controls;
