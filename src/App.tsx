import { useState } from 'react';
import Canvas from './Canvas';
import { drawFancyGradient } from './FancyGradient';
import Controls from './Controls';
import { Color, Dimensions, DitherMode, GradientType, Point } from './utils';

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
export const DEFAULT_GRADIENT_TYPE = GradientType.Linear;
export const DEFAULT_RADIAL_GRADIENT_POSITION = new Point(0.5, 0.5);
export const DEFAULT_RADIAL_GRADIENT_SCALE = 0.5;

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
  const [rotatePattern, setRotatePattern] = useState(false);
  const [gradientType, setGradientType] = useState(DEFAULT_GRADIENT_TYPE);
  const [radialGradientPosition, setRadialGradientPosition] = useState(
    DEFAULT_RADIAL_GRADIENT_POSITION
  );
  const [radialGradientScale, setRadialGradientScale] = useState(
    DEFAULT_RADIAL_GRADIENT_SCALE
  );

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
      steps,
      rotatePattern,
      gradientType,
      radialGradientPosition,
      radialGradientScale
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
        <header>
          <h1 className="mb-1 text-4xl font-bold">Dither Machine</h1>
          <p className="mb-2">
            A port of{' '}
            <a
              href="https://lunarlabs.itch.io/dither-machine"
              className="underline font-bold"
            >
              Dither Machine by Lunar Labs
            </a>
          </p>
          <p className="mb-8">
            Dither Machine is a tool to help you generate dithering
            automatically, instead of doing it by hand, which can be a tedious
            task.
          </p>
        </header>
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
          rotatePattern={rotatePattern}
          setRotatePattern={setRotatePattern}
          gradientType={gradientType}
          setGradientType={setGradientType}
          radialGradientPosition={radialGradientPosition}
          setRadialGradientPosition={setRadialGradientPosition}
          radialGradientScale={radialGradientScale}
          setRadialGradientScale={setRadialGradientScale}
        />
        <footer className="mt-12">
          <a
            href="https://github.com/pangolingo/dither-machine-web"
            className="block underline font-bold"
          >
            <svg
              viewBox="0 0 16 16"
              className="w-5 h-5 inline-block"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <span className="align-middle ml-2">Check it out on Github</span>
          </a>
        </footer>
      </div>
      <div className="p-4">
        <Canvas draw={draw} canvasSize={canvasSize} />
      </div>
    </div>
  );
}

export default App;
