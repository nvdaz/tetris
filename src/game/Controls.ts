import Board from './Board';
import Keyboard from './Keyboard';

const COOLDOWN = 0.1;

class Controls {
  private cooldown = 0;
  public constructor(private keyboard: Keyboard, private board: Board) {}

  public tick(delta: number) {
    this.cooldown -= delta;
    if (this.cooldown > 0) return;

    if (this.keyboard.isKeyPressed('KeyA')) {
      this.board.translate(-1);
      this.cooldown = COOLDOWN;
    }
    if (this.keyboard.isKeyPressed('KeyD')) {
      this.board.translate(1);
      this.cooldown = COOLDOWN;
    }
    if (this.keyboard.isKeyPressed('KeyS')) {
      this.board.descend();
      this.cooldown = COOLDOWN;
    }
  }
}

export default Controls;
