import Board from './Board';
import Controls from './Controls';
import Keybinds from './Keybinds';
import Keyboard from './Keyboard';
import Renderer from './Renderer';

class Game {
  private keyboard: Keyboard;
  private board: Board;
  private controls: Controls;
  private keybinds: Keybinds;
  private renderer: Renderer;

  private previouslyElapsed = 0;
  private frameRequestId?: number;

  public constructor() {
    this.keyboard = new Keyboard();
    this.board = new Board(10, 20);
    this.keybinds = new Keybinds(this.keyboard);
    this.controls = new Controls(this.board, this.keybinds);
    this.renderer = new Renderer(this.board);

    this.tick = this.tick.bind(this);
  }

  private tick(elapsed: number): void {
    if (!this.frameRequestId) return;

    const delta = Math.min((elapsed - this.previouslyElapsed) / 1000, 0.25);
    this.previouslyElapsed = elapsed;

    this.controls.tick(delta);
    this.board.tick(delta);
    this.renderer.tick();

    this.frameRequestId = window.requestAnimationFrame(this.tick);
  }

  public setRenderingContext(ctx: CanvasRenderingContext2D) {
    this.renderer.setRenderingContext(ctx);
  }

  public queueRun() {
    if (!this.renderer.hasRenderingContext()) {
      setTimeout(() => this.queueRun(), 50);
      return;
    }

    this.run();
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
