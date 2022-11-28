import Board from './Board';
import Controls from './Controls';
import Grid from './Grid';
import Keybinds from './Keybinds';
import Keyboard from './Keyboard';
import Player from './Player';
import Renderer from './Renderer';
import StandardGameMode from './StandardGameMode';

class Game {
  private keyboard: Keyboard;
  private player: Player;
  private gameMode: StandardGameMode;
  private controls: Controls;
  private keybinds: Keybinds;
  private renderer: Renderer;

  private previouslyElapsed = 0;
  private frameRequestId?: number;

  public constructor() {
    this.keyboard = new Keyboard();
    this.gameMode = new StandardGameMode();
    this.player = new Player(this.gameMode.board);
    this.keybinds = new Keybinds(this.keyboard);
    this.controls = new Controls(
      this.player,
      this.gameMode.board,
      this.keybinds
    );
    this.renderer = new Renderer(this.gameMode.grid, this.player);

    this.tick = this.tick.bind(this);
  }

  private tick(elapsed: number): void {
    if (!this.frameRequestId) return;

    const delta = Math.min((elapsed - this.previouslyElapsed) / 1000, 0.25);
    this.previouslyElapsed = elapsed;

    this.controls.tick(delta);
    this.player.tick(delta);
    this.renderer.tick(delta);

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
