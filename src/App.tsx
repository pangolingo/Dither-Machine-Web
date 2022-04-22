import { useState } from 'react';
import Canvas from './Canvas';
import { drawFancyGradient } from './FancyGradient';
import Controls from './Controls';
import { Color, Dimensions, DitherMode } from './utils';

const DEFAULT_CANVAS_DIMENSIONS = new Dimensions(512, 512);
const DEFAULT_DRAWING_SCALE = 4;
export const DEFAULT_COLOR_PALETTE: Color[] = [
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
export const MAX_COLORS = DEFAULT_COLOR_PALETTE.length;
export const MIN_COLORS = 2;
export const DEFAULT_ANGLE = 70;
export const DEFAULT_STEPS = 5;
export const DEFAULT_DITHER_MODE = DitherMode.Bayer8x8;

function App() {
  const [canvasSize, setCanvasSize] = useState({
    ...DEFAULT_CANVAS_DIMENSIONS,
  });
  const [angle, setAngle] = useState(DEFAULT_ANGLE);
  const [scale, setScale] = useState(DEFAULT_DRAWING_SCALE);
  const [colorPalette, setColorPalette] = useState<Color[]>(
    DEFAULT_COLOR_PALETTE
  );
  const [numColors, setNumColors] = useState(DEFAULT_NUM_COLORS);
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [imageData, setImageData] = useState('');
  const [ditherMode, setDitherMode] = useState(DEFAULT_DITHER_MODE);

  const drawingSize = new Dimensions(
    canvasSize.width / scale,
    canvasSize.height / scale
  );

  const colors = colorPalette.slice(0, numColors);

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
      ditherMode,
      steps
    );
    ctx.putImageData(imageData, 0, 0);

    // now upscale our image!
    // https://stackoverflow.com/questions/51387989/change-image-size-with-ctx-putimagedata
    ctx.globalCompositeOperation = 'copy';
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
    const imageDataUrl = ctx.canvas.toDataURL('image/png');
    setImageData(imageDataUrl);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="p-4 w-[30%] min-w-[400px]">
        <h1 className="mb-1 text-4xl font-bold">Dither Machine</h1>
        <p className="mb-8">
          A port of{' '}
          <a
            href="https://lunarlabs.itch.io/dither-machine"
            className="underline font-bold"
          >
            Dither Machine by Lunar Labs
          </a>
        </p>
        <Controls
          setAngle={setAngle}
          angle={angle}
          numColors={numColors}
          setNumColors={setNumColors}
          colorPalette={colorPalette}
          setColorPalette={setColorPalette}
          steps={steps}
          setSteps={setSteps}
          ditherMode={ditherMode}
          setDitherMode={setDitherMode}
          canvasSize={canvasSize}
          setCanvasSize={setCanvasSize}
          scale={scale}
          setScale={setScale}
          imageData={imageData}
        />
      </div>
      <div className="p-4">
        <Canvas draw={draw} canvasSize={canvasSize} />
      </div>
    </div>
  );
}

export default App;
