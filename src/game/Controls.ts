import { KeyCode } from 'keyboardevent-codes';
import Board from './Board';
import Keyboard from './Keyboard';

const COOLDOWN = 0.1;

class Controls {
  private cooldown: Partial<Record<KeyCode, number>> = {};
  public constructor(private keyboard: Keyboard, private board: Board) {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.keyboard.registerOnKeyDown(this.onKeyDown);
    this.keyboard.registerOnKeyUp(this.onKeyUp);
  }

  private handle(key: KeyCode) {
    if (key === 'KeyA') {
      this.board.translate(-1);
      this.cooldown[key] = 0.1;
    }
    if (key === 'KeyD') {
      this.board.translate(1);
      console.log('tr');
      this.cooldown[key] = 0.1;
    }
    if (key === 'KeyS') {
      this.board.descend();
      this.cooldown[key] = 0.1;
    }
    if (key === 'KeyR') {
      this.board.rotate();
      this.cooldown[key] = 0.25;
    }
    if (key === 'Space') {
      this.board.drop();
      this.cooldown[key] = 0.5;
    }
  }

  private onKeyDown(key: KeyCode) {
    if (key in this.cooldown) {
      return;
    }

    this.handle(key);
  }

  private onKeyUp(key: KeyCode) {
    console.log('up', key);
    if (key in this.cooldown) {
      delete this.cooldown[key];
    }
  }

  public tick(delta: number) {
    for (const key of Object.keys(this.cooldown) as ReadonlyArray<KeyCode>) {
      this.cooldown[key]! -= delta;
      if (this.cooldown[key]! <= 0) {
        this.handle(key);
      }
    }
  }
}

export default Controls;
