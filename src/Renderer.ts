import clamp from './util/clamp';
import { easeInOutQuad } from './util/easing';
import { assert } from './util/assert';
import Grid from './Grid';
import Board from './Board';
import Player, {
  isRowClearEvent,
  isTetradLockEvent,
  RowClearEvent,
  TetradLockEvent,
} from './Player';
import Tetrad from './Tetrad';
import { filter } from 'rxjs';

class Renderer {
  private borderColor = 'black';
  private ctx?: CanvasRenderingContext2D;
  private recentLocks = new Map<Tetrad, number>();
  private recentClears = new Map<number, number>();

  public constructor(private grid: Grid, private player: Player) {
    this.onUpdateColorPreference = this.onUpdateColorPreference.bind(this);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery.matches) {
      this.borderColor = 'white';
    }

    mediaQuery.onchange = this.onUpdateColorPreference;

    this.onTetradLock = this.onTetradLock.bind(this);
    player.eventEmitter$
      .pipe(filter(isTetradLockEvent))
      .subscribe(this.onTetradLock);

    this.onRowClear = this.onRowClear.bind(this);
    player.eventEmitter$
      .pipe(filter(isRowClearEvent))
      .subscribe(this.onRowClear);
  }

  private onTetradLock(event: TetradLockEvent) {
    this.recentLocks.set(event.tetrad, 0.5);
  }

  private onRowClear(event: RowClearEvent) {
    for (const row of event.rows) this.recentClears.set(row, 0.5);
  }

  private onUpdateColorPreference(event: MediaQueryListEvent) {
    if (event.matches) {
      this.borderColor = 'white';
    } else {
      this.borderColor = 'black';
    }
  }

  private draw() {
    assert(this.ctx);
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    const tileSize = Math.min(width / this.grid.cols, height / this.grid.rows);

    const offset = (width - tileSize * 10) / 2;
    const border = clamp(1, tileSize * 0.04, 4);

    this.ctx.clearRect(0, 0, width, height);

    for (const [row, col, color] of this.grid.tiles()) {
      if (color !== null) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
          offset + col * tileSize,
          row * tileSize,
          tileSize,
          tileSize
        );
      }
    }

    for (const [x, y] of this.player.activePiece.tetrad.parts) {
      this.ctx.fillStyle = this.player.activePiece.tetrad.color;
      this.ctx.fillRect(
        offset + x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }

    for (let row = 0; row <= this.grid.rows; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset, row * tileSize);
      this.ctx.lineTo(width - offset, row * tileSize);
      this.ctx.strokeStyle = this.borderColor;
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    for (let col = 0; col <= this.grid.cols; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset + col * tileSize, 0);
      this.ctx.lineTo(offset + col * tileSize, height);
      this.ctx.strokeStyle = this.borderColor;
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    for (const [row, time] of this.recentClears) {
      this.ctx.fillStyle = 'white';
      this.ctx.globalAlpha = easeInOutQuad(time * 2);
      this.ctx.fillRect(
        offset,
        row * tileSize,
        tileSize * this.grid.cols,
        tileSize
      );
      this.ctx.globalAlpha = 1;
    }

    for (const [tetrad, time] of this.recentLocks) {
      const col = tetrad.left;
      const row = tetrad.top;
      const w = tetrad.width;
      const h = tetrad.height;

      const bottomParts: [number, number][] = [];

      for (let r = row + h - 1; r >= row; r--) {
        if (bottomParts.length === w) break;
        for (const piece of tetrad.parts) {
          if (piece[1] === r && !bottomParts.some((p) => piece[0] === p[0])) {
            bottomParts.push(piece);
          }
        }
      }

      const gradientLength = 2;
      const gradient = this.ctx.createLinearGradient(
        0,
        (row - h - gradientLength) * tileSize,
        0,
        row * tileSize
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      gradient.addColorStop(
        1,
        `rgba(255, 255, 255, ${easeInOutQuad(time * 4) / 4})`
      );
      this.ctx.fillStyle = gradient;

      for (const [c, r] of bottomParts) {
        this.ctx.fillRect(
          offset + c * tileSize,
          (row - gradientLength) * tileSize,
          tileSize,
          tileSize * (r - row + gradientLength + 1)
        );
      }

      this.ctx.fillStyle = 'black';
    }

    this.ctx.beginPath();
    this.ctx.moveTo(offset - border, border);
    this.ctx.lineTo(width - offset, border);
    this.ctx.lineTo(width - offset, height - border);
    this.ctx.lineTo(offset, height - border);
    this.ctx.lineTo(offset, border);
    this.ctx.strokeStyle = this.borderColor;
    this.ctx.lineWidth = border * 2;
    this.ctx.stroke();
  }

  public setRenderingContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public hasRenderingContext(): boolean {
    return !!this.ctx;
  }

  public tick(delta: number) {
    this.draw();

    for (const [tetrad, time] of this.recentLocks) {
      if (time <= 0) {
        this.recentLocks.delete(tetrad);
      } else {
        this.recentLocks.set(tetrad, time - delta);
      }
    }

    for (const [row, time] of this.recentClears) {
      if (time <= 0) {
        this.recentClears.delete(row);
      } else {
        this.recentClears.set(row, time - delta);
      }
    }
  }
}

export default Renderer;
