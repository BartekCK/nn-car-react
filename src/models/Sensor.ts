import { Car } from "./Car";
import { lerp } from "../utils/lerp";
import { RoadBoarder } from "./Road";
import { getIntersection } from "../utils/getIntersection";
import { End, Start } from "../types";

export type Ray = [Start, End];

export class Sensor {
  private readonly rayCount = 5;
  private readonly rayLength = 150;
  private readonly raySpread = Math.PI / 2;

  private rays: Ray[] = [];
  private readings: any[] = [];

  constructor(private readonly car: Car) {}

  public update(roadBorders: RoadBoarder[]) {
    this.castRays();

    this.readings = [];
    this.rays.forEach((ray) => {
      const closest = this.getReading(ray, roadBorders);
      this.readings.push(closest);
    });
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.rayCount; i++) {
      let end: End = this.rays[i][1];

      if (this.readings[i]) {
        end = this.readings[i];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  private castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          // @ts-ignore
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.getAngle();

      const start = { x: this.car.getX(), y: this.car.getY() };
      const end = {
        x: this.car.getX() - Math.sin(rayAngle) * this.rayLength,
        y: this.car.getY() - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  private getReading(ray: Ray, roadBorders: RoadBoarder[]): number | null {
    let touches: any = [];

    roadBorders.forEach((border) => {
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);

      if (touch) {
        touches.push(touch);
      }
    });

    if (touches.length === 0) {
      return null;
    }

    const offsets = touches.map((e: any) => e.offset);
    const minOffset = Math.min(...offsets);
    return touches.find((e: any) => e.offset === minOffset);
  }
}
