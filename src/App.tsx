import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Canvas";
import { drawFancyGradient } from "./FancyGradient";
import Controls from "./Controls";
import { Color, DitherMode } from "./utils";

export const CANVAS_SIZE = 512;
export const DRAWING_SIZE = 128;
export const DEFAULT_COLORS: Color[] = [
  // https://colorhunt.co/palette/ff6b6bffd93d6bcb774d96ff
  [255, 107, 107, 255],
  [255, 217, 61, 255],
  [107, 203, 119, 255],
  [77, 150, 255, 255],

  // MORE
  // https://colorhunt.co/palette/f0ece3dfd3c3c7b198a68dad
  [240, 236, 227, 255],
  [223, 211, 195, 255],
  [199, 177, 152, 255],
  [166, 141, 173, 255],
];
export const DEFAULT_NUM_COLORS = 4;
export const MAX_COLORS = 8;
export const MIN_COLORS = 2;
export const DEFAULT_STEPS = 3;
export const DEFAULT_DITHER_MODE = DitherMode.Bayer8x8;

function App() {
  const [angle, setAngle] = useState(0);
  const [colors, setColors] = useState<Color[]>(
    DEFAULT_COLORS.slice(0, DEFAULT_NUM_COLORS)
  );
  const [steps, setSteps] = useState(DEFAULT_STEPS);

  const draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.imageSmoothingEnabled = false;
    const imageData = ctx.createImageData(DRAWING_SIZE, DRAWING_SIZE);
    drawFancyGradient(
      imageData,
      DRAWING_SIZE,
      DRAWING_SIZE,
      angle,
      colors,
      DEFAULT_DITHER_MODE,
      steps
    );
    ctx.putImageData(imageData, 0, 0);

    // now upscale our image!
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(
      ctx.canvas,
      0,
      0,
      DRAWING_SIZE,
      DRAWING_SIZE, // grab the ImageData part
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height // scale it
    );
  };

  return (
    <div className="App">
      <Controls
        setAngle={setAngle}
        angle={angle}
        colors={colors}
        setColors={setColors}
        steps={steps}
        setSteps={setSteps}
        ditherMode={DEFAULT_DITHER_MODE}
      />
      <Canvas draw={draw} />
    </div>
  );
}

export default App;
