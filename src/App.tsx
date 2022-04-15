import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./Canvas";
import { drawFancyGradient } from "./FancyGradient";
import Controls from "./Controls";
import { Color, Dimensions, DitherMode } from "./utils";

const DEFAULT_CANVAS_DIMENSIONS = new Dimensions(512, 512);
const DEFAULT_DRAWING_SCALE = 4;
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
  const [canvasSize, setCanvasSize] = useState({
    ...DEFAULT_CANVAS_DIMENSIONS,
  });
  const [angle, setAngle] = useState(0);
  const [scale, setScale] = useState(DEFAULT_DRAWING_SCALE);
  const [colors, setColors] = useState<Color[]>(
    DEFAULT_COLORS.slice(0, DEFAULT_NUM_COLORS)
  );
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [imageData, setImageData] = useState("");

  const drawingSize = new Dimensions(
    canvasSize.width / scale,
    canvasSize.height / scale
  );

  const draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.imageSmoothingEnabled = false;
    const imageData = ctx.createImageData(
      drawingSize.width,
      drawingSize.height
    );
    drawFancyGradient(
      imageData,
      drawingSize.width,
      drawingSize.height,
      angle,
      colors,
      DEFAULT_DITHER_MODE,
      steps
    );
    ctx.putImageData(imageData, 0, 0);

    // now upscale our image!
    // https://stackoverflow.com/questions/51387989/change-image-size-with-ctx-putimagedata
    ctx.globalCompositeOperation = "copy";
    ctx.drawImage(
      ctx.canvas,
      0,
      0,
      drawingSize.width,
      drawingSize.height, // grab the ImageData part
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height // scale it
    );

    // now export the image for downloading
    const imageDataUrl = ctx.canvas.toDataURL("image/png");
    setImageData(imageDataUrl);
  };

  const downloadFilename = `${Date.now()}-dither.png`;

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
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        scale={scale}
        setScale={setScale}
      />
      <div>
        <a download={downloadFilename} href={imageData}>
          Download
        </a>
      </div>
      <Canvas draw={draw} canvasSize={canvasSize} />
    </div>
  );
}

export default App;
