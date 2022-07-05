import { Controls } from "./Controls";
import { Sensor } from "./Sensor";
import { RoadBoarder } from "./Road";
import { polysIntersect } from "../utils/polysIntersect";

export class Car {
  private readonly controls: Controls;
  private readonly sensor: Sensor | undefined;

  private speed: number = 0;
  private angle: number = 0;

  private readonly acceleration: number = 0.2;
  private readonly friction: number = 0.05;
  private polygon: { x: number; y: number }[] = [];
  private damaged: boolean = false;

  constructor(
    private x: number,
    private y: number,
    private readonly width: number,
    private readonly height: number,
    controlType: "DUMMY" | "KEYS",
    private readonly maxSpeed: number = 3
  ) {
    if (controlType !== "DUMMY") {
      this.sensor = new Sensor(this);
    }
    this.controls = new Controls(controlType);
  }

  public draw(ctx: CanvasRenderingContext2D, color: string) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor) {
      this.sensor.draw(ctx);
    }
  }

  public update(roadBorders: RoadBoarder[], traffic: Car[]) {
    if (!this.damaged) {
      this.moveCar();
      this.polygon = this.createPolygon();
      this.damaged = this.assessDamage(roadBorders, traffic);
    }
    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
    }
  }

  private moveCar(): void {
    if (this.controls.up) {
      this.speed += this.acceleration;
    }
    if (this.controls.down) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  public getY(): number {
    return this.y;
  }

  public getX(): number {
    return this.x;
  }

  public getAngle(): number {
    return this.angle;
  }

  private createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });

    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  private assessDamage(roadBorders: RoadBoarder[], traffic: Car[]): boolean {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].getPolygon())) {
        return true;
      }
    }

    return false;
  }

  public getPolygon(): { x: number; y: number }[] {
    return this.polygon;
  }
}
