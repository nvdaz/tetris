import Board from './Board';
import Controls from './Controls';
import Keyboard from './Keyboard';
import Renderer from './Renderer';

class Game {
  private keyboard: Keyboard;
  private board: Board;
  private controls: Controls;
  private renderer: Renderer;

  private previouslyElapsed = 0;
  private frameRequestId?: number;

  public constructor(ctx: CanvasRenderingContext2D) {
    this.keyboard = new Keyboard();
    this.board = new Board(10, 20);
    this.controls = new Controls(this.keyboard, this.board);
    this.renderer = new Renderer(this.board, ctx);

    this.tick = this.tick.bind(this);
  }

  private tick(elapsed: number): void {
    if (!this.frameRequestId) return;
    this.frameRequestId = window.requestAnimationFrame(this.tick);

    const delta = Math.min((elapsed - this.previouslyElapsed) / 1000, 0.25);
    this.previouslyElapsed = elapsed;

    this.controls.tick(delta);
    this.board.tick(delta);
    this.renderer.tick();
  }

  public run() {
    this.frameRequestId = window.requestAnimationFrame(this.tick);
  }

  public stop() {
    if (this.frameRequestId) window.cancelAnimationFrame(this.frameRequestId);
    this.keyboard.destroy();
  }
}

export default Game;
