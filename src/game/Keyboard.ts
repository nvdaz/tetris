import { KeyCode } from 'keyboardevent-codes';

class Keyboard {
  keysPressed: KeyCode[] = [];

  public constructor() {
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);

    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
  }

  private keyDown(event: KeyboardEvent): void {
    if (!this.keysPressed.includes(<KeyCode>event.code))
      this.keysPressed.push(<KeyCode>event.code);
  }

  private keyUp(event: KeyboardEvent): void {
    this.keysPressed = this.keysPressed.filter((code) => event.code !== code);
  }

  public isKeyPressed(code: KeyCode): boolean {
    return this.keysPressed.includes(code);
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
  }
}

export default Keyboard;
