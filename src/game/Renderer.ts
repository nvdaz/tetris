import clamp from '../clamp';
import Board from './Board';

const BORDER_COLOR = 'black';

class Renderer {
  public constructor(
    private board: Board,
    private ctx: CanvasRenderingContext2D
  ) {}

  private draw() {
    const width = this.ctx.canvas.width;
    const height = this.ctx.canvas.height;
    const tileSize = Math.min(
      width / this.board.rows,
      height / this.board.columns
    );
    const offset = (width - tileSize * 10) / 2;
    const border = clamp(1, tileSize * 0.04, 4);

    this.ctx.clearRect(0, 0, width, height);

    for (let col = 0; col < this.board.columns; col++) {
      for (let row = 0; row < this.board.rows; row++) {
        if (this.board.grid[row][col]) {
          this.ctx.fillStyle = this.board.grid[row][col];
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
      this.ctx.strokeStyle = BORDER_COLOR;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }

    for (let col = 0; col <= this.board.columns; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset + col * tileSize, 0);
      this.ctx.lineTo(offset + col * tileSize, height);
      this.ctx.strokeStyle = BORDER_COLOR;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }

    this.ctx.beginPath();
    this.ctx.moveTo(offset - border, border);
    this.ctx.lineTo(width - offset, border);
    this.ctx.lineTo(width - offset, height - border);
    this.ctx.lineTo(offset, height - border);
    this.ctx.lineTo(offset, border);
    this.ctx.strokeStyle = BORDER_COLOR;
    this.ctx.lineWidth = border * 2;
    this.ctx.stroke();
  }

  public tick() {
    this.draw();
  }
}

export default Renderer;
