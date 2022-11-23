import { KeyCode } from 'keyboardevent-codes';
import Controls, { Action } from './Controls';
import Keyboard from './Keyboard';

class Keybinds {
  public constructor(private keyboard: Keyboard, private controls: Controls) {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.keyboard.registerOnKeyDown(this.onKeyDown);
    this.keyboard.registerOnKeyUp(this.onKeyUp);
  }

  private translateKey(key: KeyCode): Action | undefined {
    if (key === 'KeyA' || key === 'ArrowLeft') {
      return 'translateLeft';
    } else if (key === 'KeyD' || key === 'ArrowRight') {
      return 'translateRight';
    } else if (key === 'KeyS' || key === 'ArrowDown') {
      return 'descend';
    } else if (key === 'KeyR' || key === 'ArrowUp') {
      return 'rotateClockwise';
    } else if (key === 'Space') {
      return 'drop';
    }
  }

  private handle(key: KeyCode) {
    const action = this.translateKey(key);

    if (action) {
      this.controls.handle(action);
    }
  }

  private endHandle(key: KeyCode) {
    const action = this.translateKey(key);

    if (action) {
      this.controls.endHandle(action);
    }
  }

  private onKeyDown(key: KeyCode) {
    this.handle(key);
  }

  private onKeyUp(key: KeyCode) {
    this.endHandle(key);
  }
}

export default Keybinds;
