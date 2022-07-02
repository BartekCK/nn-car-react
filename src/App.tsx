import React from "react";
import "./App.css";
import { Car } from "./models/Car";
import { useAnimationFrame } from "./hooks/useAnimate";
import { Road } from "./models/Road";

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const roadRef = React.useRef<Road | null>(null);
  const carRef = React.useRef<Car | null>(null);

  useAnimationFrame(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }
    const road = roadRef.current;
    const car = carRef.current;

    if (!car || !road) {
      return;
    }

    const ctx: CanvasRenderingContext2D | null =
      canvasRef.current.getContext("2d");
    if (!ctx) {
      return;
    }

    car.update(road.getBorders());

    canvasRef.current.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.getY() + canvasRef.current.height * 0.7);

    road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
  });

  React.useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    canvasRef.current.width = 200;

    roadRef.current = new Road(
      canvasRef.current.width / 2,
      canvasRef.current.width * 0.9,
      3
    );
    carRef.current = new Car(roadRef.current.getLaneCenter(1), 100, 30, 50);
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="myCanvas"></canvas>
    </>
  );
}

export default App;
