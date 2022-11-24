import { KeyCode } from 'keyboardevent-codes';

class Keyboard {
  keysPressed: KeyCode[] = [];
  onKeyDownHandlers: ((key: KeyCode) => void)[] = [];
  onKeyUpHandlers: ((key: KeyCode) => void)[] = [];

  public constructor() {
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);

    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
  }

  public registerOnKeyDown(fn: (key: KeyCode) => void) {
    this.onKeyDownHandlers.push(fn);
  }

  public registerOnKeyUp(fn: (key: KeyCode) => void) {
    this.onKeyUpHandlers.push(fn);
  }

  private keyDown(event: KeyboardEvent): void {
    for (const fn of this.onKeyDownHandlers) fn.call(null, <KeyCode>event.code);
    if (!this.keysPressed.includes(<KeyCode>event.code))
      this.keysPressed.push(<KeyCode>event.code);
  }

  private keyUp(event: KeyboardEvent): void {
    this.keysPressed = this.keysPressed.filter((code) => event.code !== code);
    for (const fn of this.onKeyUpHandlers) fn.call(null, <KeyCode>event.code);
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
