import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { DEFAULT_COLOR_PALETTE, MAX_COLORS, MIN_COLORS } from './App';
import {
  Color,
  Dimensions,
  DitherMode,
  DitherPatterns,
  GradientType,
  hexToRgb,
  limitToRange,
  Point,
  rgbToHex,
} from './utils';

type Props = {
  angle: number;
  setAngle: (angle: number) => void;
  colorPalette: Color[];
  setColorPalette: (colors: Color[]) => void;
  numColors: number;
  setNumColors: (n: number) => void;
  steps: number;
  setSteps: (steps: number) => void;
  ditherMode: DitherMode;
  setDitherMode: (mode: DitherMode) => void;
  canvasSize: Dimensions;
  setCanvasSize: (size: Dimensions) => void;
  scale: number;
  setScale: (scale: number) => void;
  imageData: string;
  rotatePattern: boolean;
  setRotatePattern: (rotate: boolean) => void;
  gradientType: GradientType;
  setGradientType: (type: GradientType) => void;
  radialGradientPosition: Point;
  setRadialGradientPosition: (position: Point) => void;
  radialGradientScale: number;
  setRadialGradientScale: (scale: number) => void;
};

function enumToStrings(enumToConvert: any): string[] {
  // if we convert an enum to an array, the array will include both keys and values
  // we need to only get the keys
  let options = Object.values(enumToConvert) as string[];
  return options.slice(0, options.length / 2);
}

function gradientTypeOptionToType(option: string): GradientType {
  switch (option) {
    case 'Linear':
      return GradientType.Linear;
    case 'Radial':
      return GradientType.Radial;
    default:
      throw new Error(`Unknown gradient type option ${option}`);
  }
}

function gradientTypeToOption(type: GradientType): string {
  switch (type) {
    case GradientType.Linear:
      return 'Linear';
    case GradientType.Radial:
      return 'Radial';
    default:
      throw new Error(`Unknown gradient type ${type}`);
  }
}

function ditherOptionToMode(option: string): DitherMode {
  switch (option) {
    case 'Solid':
      return DitherMode.None;
    case 'Bayer2':
      return DitherMode.Bayer2x2;
    case 'Bayer4':
      return DitherMode.Bayer4x4;
    case 'Bayer8':
      return DitherMode.Bayer8x8;
    case 'Cluster4':
      return DitherMode.Cluster4x4;
    case 'Cluster8':
      return DitherMode.Cluster8x8;
    default:
      throw new Error(`Unknown dither option ${option}`);
  }
}

function ditherModeToOption(mode: DitherMode): string {
  switch (mode) {
    case DitherMode.None:
      return 'Solid';
    case DitherMode.Bayer2x2:
      return 'Bayer2';
    case DitherMode.Bayer4x4:
      return 'Bayer4';
    case DitherMode.Bayer8x8:
      return 'Bayer8';
    case DitherMode.Cluster4x4:
      return 'Cluster4';
    case DitherMode.Cluster8x8:
      return 'Cluster8';
    default:
      throw new Error(`Unknown dither mode ${mode}`);
  }
}

function nearestNunberInArray(num: number, arr: number[]): number {
  return arr.reduce((prev, curr) =>
    Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev
  );
}

// get the minimum and maximum number of dithering steps
function getStepsLimits(ditherMode: DitherMode): [number, number] {
  let minSteps: number;
  let maxSteps: number;
  switch (ditherMode) {
    case DitherMode.Bayer2x2:
      minSteps = 3;
      maxSteps = 5;
      break;
    case DitherMode.Bayer4x4:
      minSteps = 3;
      maxSteps = 9;
      break;
    case DitherMode.Bayer8x8:
      minSteps = 3;
      maxSteps = 17;
      break;
    default:
      minSteps = 3;
      maxSteps = 17;
      break;
  }
  return [minSteps, maxSteps];
}

const Controls: FC<Props> = ({
  angle,
  setAngle,
  colorPalette,
  setColorPalette,
  numColors,
  setNumColors,
  steps,
  setSteps,
  ditherMode,
  setDitherMode,
  canvasSize,
  setCanvasSize,
  scale,
  setScale,
  imageData,
  rotatePattern,
  setRotatePattern,
  gradientType,
  setGradientType,
  radialGradientPosition,
  setRadialGradientPosition,
  radialGradientScale,
  setRadialGradientScale,
}) => {
  const stepLimits = getStepsLimits(ditherMode);
  // we track local dimensions separately because sometimes a user might enter
  // an invalid size while typing out a larger number
  const [localCanvasSize, setLocalCanvasSize] = useState(canvasSize);

  const onAngleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newAngle = parseInt(e.target.value, 10);
    newAngle = limitToRange(0, 360, newAngle);
    setAngle(newAngle);
  };

  const onScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newScale = parseInt(e.target.value, 10);
    newScale = limitToRange(1, 16, newScale);
    const possibleValues = [1, 2, 4, 8, 16];
    newScale = nearestNunberInArray(newScale, possibleValues);
    setScale(newScale);
  };

  const onNumColorsChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newNumColors = parseInt(e.target.value, 10);
    newNumColors = limitToRange(MIN_COLORS, MAX_COLORS, newNumColors);

    if (newNumColors === numColors) {
      return;
    }
    setNumColors(newNumColors);
  };

  const onStepsChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newSteps = parseInt(e.target.value, 10);
    newSteps = limitToRange(stepLimits[0], stepLimits[1], newSteps);
    setSteps(newSteps);
  };

  const isValidCanvasSize = (num: number): boolean => {
    return num > 16;
  };

  const onRadialGradientPositionChange = (
    xStr: string | null,
    yStr: string | null
  ): void => {
    const x = xStr == null ? radialGradientPosition.x : parseFloat(xStr);
    const y = yStr == null ? radialGradientPosition.y : parseFloat(yStr);
    setRadialGradientPosition(new Point(x, y));
  };

  const onRadialGradientScaleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const scale = parseFloat(e.target.value);
    setRadialGradientScale(scale);
  };

  const onCanvasWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newSize = parseInt(e.target.value, 10);
    if (Number.isNaN(newSize)) {
      newSize = 0;
    }
    setLocalCanvasSize({
      width: newSize,
      height: localCanvasSize.height,
    });

    if (!isValidCanvasSize(newSize)) {
      return;
    }
    setCanvasSize({
      width: newSize,
      height: canvasSize.height,
    });
  };

  const onCanvasHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newSize = parseInt(e.target.value, 10);
    if (Number.isNaN(newSize)) {
      newSize = 0;
    }
    setLocalCanvasSize({
      width: localCanvasSize.width,
      height: newSize,
    });

    if (!isValidCanvasSize(newSize)) {
      return;
    }
    setCanvasSize({
      width: canvasSize.width,
      height: newSize,
    });
  };

  const onColorPaletteChange = (colorIndex: number, newHexColor: string) => {
    const newColor = hexToRgb(newHexColor);
    const newColorPalette = [...colorPalette];
    newColorPalette[colorIndex] = newColor;
    setColorPalette(newColorPalette);
  };

  const resetColors = () => {
    setColorPalette(DEFAULT_COLOR_PALETTE);
  };

  const onChangeDitherPattern = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const mode = ditherOptionToMode(value);
    setDitherMode(mode);
  };

  const onChangeGradientType = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const type = gradientTypeOptionToType(value);
    setGradientType(type);
  };

  const renderLinearGradientControls = () => {
    return (
      <div className="grid grid-cols-[150px_auto_100px] mb-4 gap-2">
        <label htmlFor="c-angle" className="block">
          Gradient angle
        </label>
        <input
          id="c-angle"
          type="range"
          step={1}
          min={0}
          max={360}
          value={angle}
          onChange={onAngleChange}
        />
        <div>
          <input
            type="text"
            readOnly
            value={angle}
            size={4}
            className="bg-slate-900 px-2 py-1"
          />
        </div>
      </div>
    );
  };

  const renderColorsControl = () => {
    return (
      <div className="mb-5">
        <div className="grid grid-cols-[150px_auto_100px] mb-5 gap-2">
          <label className="block" htmlFor="c-num-colors">
            Number of colors
          </label>
          <input
            type="range"
            step={1}
            min={MIN_COLORS}
            max={MAX_COLORS}
            value={numColors}
            onChange={onNumColorsChange}
            id="c-num-colors"
          />
          <div>
            <input
              type="text"
              readOnly
              value={numColors}
              size={4}
              className="bg-slate-900 px-2 py-1"
            />
          </div>
        </div>

        <fieldset className="">
          <legend className="sr-only">Colors</legend>
          <div className="flex mb-2 flex-wrap">
            {colorPalette.slice(0, numColors).map((color, i) => {
              return (
                <div key={i}>
                  <label className="sr-only" htmlFor={`c-color-${i}`}>
                    Color #{i + 1}
                  </label>
                  <input
                    id={`c-color-id`}
                    type="color"
                    value={rgbToHex(color)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onColorPaletteChange(i, e.target.value);
                    }}
                    className="bg-slate-900"
                  />
                </div>
              );
            })}
          </div>
          <div>
            <button
              type="button"
              onClick={resetColors}
              className="inline-flex items-center px-2 py-2 border border-transparent text-base leading-4 rounded-md shadow-sm text-white bg-slate-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Reset colors to defaults
            </button>
          </div>
        </fieldset>
      </div>
    );
  };

  const renderGradientTypeControl = () => {
    const options = enumToStrings(GradientType);
    const selected = gradientTypeToOption(gradientType);
    return (
      <div>
        <div className="grid grid-cols-[150px_auto_100px] mb-5 gap-2">
          <label htmlFor="c-gradient-type">Gradient type</label>
          <select
            onChange={onChangeGradientType}
            className="bg-slate-900 px-2 py-1"
            id="c-gradient-type"
            value={selected}
          >
            {options.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  };

  const renderRadialGradientControls = () => {
    return (
      <div>
        <div className="grid grid-cols-[150px_auto_100px] mb-4 gap-2">
          <label htmlFor="c-radial-gradient-x" className="block">
            Gradient center X
          </label>
          <input
            id="c-radial-gradient-x"
            type="range"
            step={0.1}
            min={-0.5}
            max={1.5}
            value={radialGradientPosition.x}
            onChange={(e) =>
              onRadialGradientPositionChange(e.target.value, null)
            }
          />
          <div>
            <input
              type="text"
              readOnly
              value={radialGradientPosition.x}
              size={4}
              className="bg-slate-900 px-2 py-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-[150px_auto_100px] mb-4 gap-2">
          <label htmlFor="c-radial-gradient-y" className="block">
            Gradient center Y
          </label>
          <input
            id="c-radial-gradient-y"
            type="range"
            step={0.1}
            min={-0.5}
            max={1.5}
            value={radialGradientPosition.y}
            onChange={(e) =>
              onRadialGradientPositionChange(null, e.target.value)
            }
          />
          <div>
            <input
              type="text"
              readOnly
              value={radialGradientPosition.y}
              size={4}
              className="bg-slate-900 px-2 py-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-[150px_auto_100px] mb-4 gap-2">
          <label htmlFor="c-radial-gradient-scale" className="block">
            Gradient scale
          </label>
          <input
            id="c-radial-gradient-scale"
            type="range"
            step={0.1}
            min={0.1}
            max={2}
            value={radialGradientScale}
            onChange={onRadialGradientScaleChange}
          />
          <div>
            <input
              type="text"
              readOnly
              value={radialGradientScale}
              size={4}
              className="bg-slate-900 px-2 py-1"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderStepsControl = () => {
    return (
      <div className="grid grid-cols-[150px_auto_100px] mb-5 gap-2">
        <label className="" htmlFor="c-num-steps">
          Steps
        </label>
        <input
          type="range"
          step={1}
          min={stepLimits[0]}
          max={stepLimits[1]}
          value={steps}
          onChange={onStepsChange}
          id="c-num-steps"
        />
        <div>
          <input
            type="text"
            readOnly
            value={steps}
            size={4}
            className="bg-slate-900 px-2 py-1"
          />
        </div>
      </div>
    );
  };

  const renderCavasSizeControl = () => {
    return (
      <fieldset>
        <legend className="sr-only">Canvas size</legend>
        <div className="grid grid-cols-[150px_auto] mb-5 gap-2">
          <label htmlFor="c-width">Width</label>
          <div>
            <input
              type="number"
              step={10}
              min={10}
              value={localCanvasSize.width}
              onChange={onCanvasWidthChange}
              className="bg-slate-900 px-2 py-1 w-[5em]"
              size={4}
              id="c-width"
            />
          </div>
        </div>
        <div className="grid grid-cols-[150px_auto] mb-5 gap-2">
          <label htmlFor="c-height">Height</label>
          <div>
            <input
              type="number"
              step={10}
              min={10}
              value={localCanvasSize.height}
              onChange={onCanvasHeightChange}
              className="bg-slate-900 px-2 py-1 w-[5em]"
              size={4}
              id="c-height"
            />
          </div>
        </div>
      </fieldset>
    );
  };

  const renderScaleControl = () => {
    return (
      <div className="grid grid-cols-[150px_auto_100px] mb-5 gap-2">
        <label htmlFor="c-scale">Scale</label>
        <input
          type="range"
          step={1}
          min={1}
          max={16}
          value={scale}
          onChange={onScaleChange}
          list="c-scale-values"
          id="c-scale"
        />
        <div>
          <datalist id="c-scale-values">
            <option value="1"></option>
            <option value="2"></option>
            <option value="4"></option>
            <option value="8"></option>
            <option value="16"></option>
          </datalist>
          <input
            type="text"
            readOnly
            value={scale}
            size={4}
            className="bg-slate-900 px-2 py-1"
          />
        </div>
      </div>
    );
  };

  const renderDitherModeControl = () => {
    const options = enumToStrings(DitherPatterns);
    const selected = ditherModeToOption(ditherMode);
    return (
      <div>
        <div className="grid grid-cols-[150px_auto_100px] mb-5 gap-2">
          <label htmlFor="c-dither-pattern">Dither pattern</label>
          <select
            onChange={onChangeDitherPattern}
            className="bg-slate-900 px-2 py-1"
            id="c-dither-pattern"
            value={selected}
          >
            {options.map((option) => {
              return (
                <option value={option} key={option}>
                  {option}
                </option>
              );
            })}
          </select>
        </div>
        <div className="grid grid-cols-[150px_auto_100px] mb-5 gap-2">
          <label htmlFor="c-rotate-pattern">Rotate pattern</label>
          <div>
            <input
              type="checkbox"
              checked={rotatePattern}
              onChange={(e) => setRotatePattern(e.target.checked)}
              id="c-rotate-pattern"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderDownloadControl = () => {
    const downloadFilename = `${Date.now()}-dither.png`;
    return (
      <div>
        <a
          download={downloadFilename}
          href={imageData}
          className="inline-flex items-center px-2 py-2 border border-transparent text-base leading-4 rounded-md shadow-sm text-white bg-slate-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
        >
          Download
        </a>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-8">
      <fieldset>
        <legend className="font-bold border-b-2 mb-4 block">Gradient</legend>
        {renderGradientTypeControl()}
        {renderStepsControl()}
        {renderColorsControl()}
        {gradientType === GradientType.Linear && renderLinearGradientControls()}
        {gradientType === GradientType.Radial && renderRadialGradientControls()}
      </fieldset>
      <fieldset>
        <legend className="font-bold border-b-2 mb-4 block">Dither</legend>
        {renderDitherModeControl()}
      </fieldset>
      <fieldset>
        <legend className="font-bold border-b-2 mb-4 block">Canvas</legend>
        {renderCavasSizeControl()}
        {renderScaleControl()}
        {renderDownloadControl()}
      </fieldset>
    </div>
  );
};

export default Controls;
