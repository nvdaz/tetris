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
      return 'dropSoft';
    } else if (key === 'KeyX' || key === 'ArrowUp') {
      return 'rotateClockwise';
    } else if (key === 'KeyZ') {
      return 'rotateCounterClockwise';
    } else if (key === 'Space') {
      return 'drop';
    }
  }

  public getActions(): Action[] {
    const actions: Action[] = [];

    for (const key of this.keyboard.keysPressed) {
      const action = this.translateKey(key);
      if (action) actions.push(action);
    }

    return actions;
  }
}

export default Keybinds;
