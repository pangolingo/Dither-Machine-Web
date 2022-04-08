import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Canvas";
import { drawFancyGradient } from "./FancyGradient";
import Controls from "./Controls";
import { Color } from "./utils";

export const DEFAULT_COLORS = [
  // red
  [255, 0, 0, 255],
  // green
  [0, 255, 0, 255],
  // blue
  [0, 0, 255, 255],
  // yellow
  [255, 255, 0, 255],

  // MORE
  [99, 58, 52, 255],
  [24, 23, 28, 255],
  [161, 35, 18, 255],
  [125, 132, 113, 255],
];
export const DEFAULT_NUM_COLORS = 4;
export const MAX_COLORS = 8;
export const MIN_COLORS = 2;

function App() {
  const [angle, setAngle] = useState(0);
  const [colors, setColors] = useState<Color[]>(
    DEFAULT_COLORS.slice(0, DEFAULT_NUM_COLORS)
  );

  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void => {
    const imageData = ctx.createImageData(width, height);
    drawFancyGradient(imageData, width, height, angle, colors);
    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="App">
      <Controls
        setAngle={setAngle}
        angle={angle}
        colors={colors}
        setColors={setColors}
      />
      <Canvas draw={draw} />
    </div>
  );
}

export default App;
