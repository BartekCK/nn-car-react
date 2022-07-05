export class Controls {
  private _left: boolean = false;
  private _right: boolean = false;
  private _up: boolean = false;
  private _down: boolean = false;

  constructor(controlType: "DUMMY" | "KEYS") {
    switch (controlType) {
      case "DUMMY":
        this._up = true;
        break;
      case "KEYS":
        this.addKeyboardListeners();
        break;
    }
  }

  private addKeyboardListeners(): void {
    document.onkeydown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          this._left = true;
          break;
        case "ArrowUp":
          this._up = true;
          break;
        case "ArrowRight":
          this._right = true;
          break;
        case "ArrowDown":
          this._down = true;
          break;
      }
    };

    document.onkeyup = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          this._left = false;
          break;
        case "ArrowUp":
          this._up = false;
          break;
        case "ArrowRight":
          this._right = false;
          break;
        case "ArrowDown":
          this._down = false;
          break;
      }
    };
  }

  get left(): boolean {
    return this._left;
  }

  get right(): boolean {
    return this._right;
  }

  get up(): boolean {
    return this._up;
  }

  get down(): boolean {
    return this._down;
  }
}
