import clamp from '../clamp';
import { easeInOutQuad } from '../easing';
import Board from './Board';

class Renderer {
  private borderColor = 'black';
  public constructor(
    private board: Board,
    private ctx: CanvasRenderingContext2D
  ) {
    this.onUpdateColorPreference = this.onUpdateColorPreference.bind(this);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery.matches) {
      this.borderColor = 'white';
    }

    mediaQuery.onchange = this.onUpdateColorPreference;
  }

  private onUpdateColorPreference(event: MediaQueryListEvent) {
    if (event.matches) {
      this.borderColor = 'white';
    } else {
      this.borderColor = 'black';
    }
  }

  private draw() {
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    const tileSize = Math.min(
      width / this.board.columns,
      height / this.board.rows
    );

    const offset = (width - tileSize * 10) / 2;
    const border = clamp(1, tileSize * 0.04, 4);

    this.ctx.clearRect(0, 0, width, height);

    for (let col = 0; col < this.board.columns; col++) {
      for (let row = 0; row < this.board.rows; row++) {
        const tile = this.board.grid[row][col];
        if (tile) {
          this.ctx.fillStyle = tile;
          this.ctx.fillRect(
            offset + col * tileSize,
            row * tileSize,
            tileSize,
            tileSize
          );
        }
      }
    }

    for (const [x, y] of this.board.piece.parts) {
      this.ctx.fillStyle = this.board.piece.color;

      this.ctx.fillRect(
        offset + x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }

    for (let row = 0; row <= this.board.rows; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset, row * tileSize);
      this.ctx.lineTo(width - offset, row * tileSize);
      this.ctx.strokeStyle = this.borderColor;
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    for (let col = 0; col <= this.board.columns; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset + col * tileSize, 0);
      this.ctx.lineTo(offset + col * tileSize, height);
      this.ctx.strokeStyle = this.borderColor;
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    for (const [row, time] of this.board.removed) {
      this.ctx.fillStyle = 'white';
      this.ctx.globalAlpha = easeInOutQuad(time * 2);
      this.ctx.fillRect(
        offset,
        row * tileSize,
        tileSize * this.board.columns,
        tileSize
      );
      this.ctx.globalAlpha = 1;
    }

    for (const [{ col, row, w, h, parts }, time] of this.board.locked) {
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

      for (const [c, r] of parts) {
        this.ctx.fillRect(
          offset + c * tileSize,
          (row - gradientLength) * tileSize,
          tileSize,
          tileSize * (r - row + gradientLength + 1)
        );
      }
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

  public tick() {
    this.draw();
  }
}

export default Renderer;
