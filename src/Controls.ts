import Board from './Board';
import DropHardCommand from './commands/DropHardCommand';
import DropSoftCommand from './commands/DropSoftCommand';
import MoveCommand from './commands/MoveCommand';
import RotateClockwiseCommand from './commands/RotateClockwiseCommand';
import RotateCounterClockwiseCommand from './commands/RotateCounterClockwiseCommand';
import Keybinds from './Keybinds';
import Keyboard from './Keyboard';
import Player from './Player';

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
  public constructor(
    private player: Player,
    private board: Board,
    private keybinds: Keybinds
  ) {}

  public handle(action: Action) {
    let cooldown = 0;
    const multiplier = this.cooldowns.has(action) ? 1 : 2;
    if (action === 'translateLeft') {
      new MoveCommand(this.player, this.board).execute(-1);
      cooldown = 0.1;
    } else if (action === 'translateRight') {
      new MoveCommand(this.player, this.board).execute(1);
      cooldown = 0.1;
    } else if (action === 'dropSoft') {
      new DropSoftCommand(this.player, this.board).execute();
      cooldown = 0.1;
    } else if (action === 'rotateClockwise') {
      new RotateClockwiseCommand(this.player, this.board).execute();
      cooldown = 0.2;
    } else if (action === 'rotateCounterClockwise') {
      new RotateCounterClockwiseCommand(this.player, this.board).execute();
      cooldown = 0.2;
    } else if (action === 'drop') {
      new DropHardCommand(this.player, this.board).execute();
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
