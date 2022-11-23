import { KeyCode } from 'keyboardevent-codes';
import Controls, { Action } from './Controls';
import Keyboard from './Keyboard';

class Keybinds {
  public constructor(private keyboard: Keyboard) {}

  private translateKey(key: KeyCode): Action | undefined {
    if (key === 'KeyA' || key === 'ArrowLeft') {
      return 'translateLeft';
    } else if (key === 'KeyD' || key === 'ArrowRight') {
      return 'translateRight';
    } else if (key === 'KeyS' || key === 'ArrowDown') {
      return 'descend';
    } else if (key === 'KeyX' || key === 'ArrowUp') {
      return 'rotateClockwise';
    } else if (key === 'KeyZ') {
      return 'rotateCounterClockwise';
    }
    if (key === 'Space') {
      return 'drop';
    }
  }

  public getActions(): Action[] {
    const actions = [];

    for (const key of this.keyboard.keysPressed) {
      const action = this.translateKey(key);
      if (action) actions.push(action);
    }

    return actions;
  }
}

export default Keybinds;
