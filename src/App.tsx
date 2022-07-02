import React from "react";
import "./App.css";
import { Car } from "./models/Car";
import { useAnimationFrame } from "./hooks/useAnimate";

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [car] = React.useState<Car>(new Car(100, 100, 30, 50));

  useAnimationFrame(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    const ctx: CanvasRenderingContext2D | null =
      canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    canvasRef.current.height = window.innerHeight;

    car.update();
    car.draw(ctx);
  });

  React.useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    canvasRef.current.width = 200;
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="myCanvas"></canvas>
    </>
  );
}

export default App;
