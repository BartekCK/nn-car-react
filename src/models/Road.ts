import { lerp } from "../utils/lerp";
import { End, Start } from "../types";

const INFINITY = 1000000;

export type RoadBoarder = [Start, End];

export class Road {
  private readonly left: number;
  private readonly right: number;
  private readonly top: number = -INFINITY;
  private readonly bottom: number = INFINITY;

  private readonly borders: RoadBoarder[];

  constructor(
    private x: number,
    private width: number,
    private laneCount: number = 3
  ) {
    this.left = x - width / 2;
    this.right = x + width / 2;

    const topLeft = { x: this.left, y: this.top };
    const topRight = { x: this.right, y: this.top };
    const bottomLeft = { x: this.left, y: this.bottom };
    const bottomRight = { x: this.right, y: this.bottom };

    this.borders = [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ];
  }

  public getLaneCenter(laneIndex: number) {
    const laneWidth = this.width / this.laneCount;
    return (
      this.left +
      laneWidth / 2 +
      Math.min(laneIndex, this.laneCount - 1) * laneWidth
    );
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    for (let i = 1; i <= this.laneCount - 1; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);

      ctx.setLineDash([20, 20]);

      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    });
  }

  public getBorders() {
    return this.borders;
  }
}
