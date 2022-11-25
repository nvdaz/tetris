import { KeyCode } from 'keyboardevent-codes';
import Board from './Board';
import Keybinds from './Keybinds';
import Keyboard from './Keyboard';

export type Action =
  | 'translateLeft'
  | 'translateRight'
  | 'dropSoft'
  | 'rotateClockwise'
  | 'rotateCounterClockwise'
  | 'drop';

const COOLDOWN = 0.1;

class Controls {
  private cooldowns: Map<Action, number> = new Map();
  public constructor(private board: Board, private keybinds: Keybinds) {}

  public handle(action: Action) {
    let cooldown = 0;
    const multiplier = this.cooldowns.has(action) ? 1 : 2;
    if (action === 'translateLeft') {
      this.board.translate(-1);
      cooldown = 0.1;
    } else if (action === 'translateRight') {
      this.board.translate(1);
      cooldown = 0.1;
    } else if (action === 'dropSoft') {
      this.board.dropSoft();
      cooldown = 0.1;
    } else if (action === 'rotateClockwise') {
      this.board.rotateClockwise();
      cooldown = 0.2;
    } else if (action === 'rotateCounterClockwise') {
      this.board.rotateCounterClockwise();
      cooldown = 0.2;
    } else if (action === 'drop') {
      this.board.drop();
      cooldown = 0.5;
    }

    this.cooldowns.set(action, cooldown * multiplier);
  }

  public tick(delta: number) {
    const actions = this.keybinds.getActions();
    for (const [action, cooldown] of this.cooldowns) {
      if (!actions.includes(action)) {
        this.cooldowns.delete(action);
      } else if (cooldown - delta <= 0) {
        this.handle(action);
      } else {
        this.cooldowns.set(action, cooldown - delta);
      }
    }

    for (const action of actions) {
      if (!this.cooldowns.has(action)) {
        this.handle(action);
      }
    }
  }
}

export default Controls;
