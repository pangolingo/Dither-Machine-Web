import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { DEFAULT_COLOR_PALETTE, MAX_COLORS, MIN_COLORS } from "./App";
import { drawFancyGradient } from "./FancyGradient";
import {
  Color,
  Dimensions,
  DitherMode,
  DitherPatterns,
  hexToRgb,
  limitToRange,
  rgbToHex,
} from "./utils";

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
};

function getDitherOptions(): string[] {
  // if we convert an enum to an array, the array will include both keys and values
  // we need to only get the keys
  let options = Object.values(DitherPatterns) as string[];
  return options.slice(0, options.length / 2);
}

function ditherOptionToMode(option: string): DitherMode {
  switch (option) {
    case "Solid":
      return DitherMode.None;
    case "Bayer2":
      return DitherMode.Bayer2x2;
    case "Bayer4":
      return DitherMode.Bayer4x4;
    case "Bayer8":
      return DitherMode.Bayer8x8;
    case "Cluster4":
      return DitherMode.Cluster4x4;
    case "Cluster8":
      return DitherMode.Cluster8x8;
    default:
      throw new Error(`Unknown dither option ${option}`);
  }
}

function ditherModeToOption(mode: DitherMode): string {
  switch (mode) {
    case DitherMode.None:
      return "Solid";
    case DitherMode.Bayer2x2:
      return "Bayer2";
    case DitherMode.Bayer4x4:
      return "Bayer4";
    case DitherMode.Bayer8x8:
      return "Bayer8";
    case DitherMode.Cluster4x4:
      return "Cluster4";
    case DitherMode.Cluster8x8:
      return "Cluster8";
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
    console.log("new mode", value, mode);
    setDitherMode(mode);
  };

  const renderAngleControl = () => {
    return (
      <div>
        <label>
          Angle
          <input
            type="range"
            step={1}
            min={0}
            max={360}
            value={angle}
            onChange={onAngleChange}
          />
          <input type="text" readOnly value={angle} size={4} />
        </label>
      </div>
    );
  };

  const renderColorsControl = () => {
    return (
      <fieldset>
        <legend>Colors</legend>
        <label>
          Number of colors
          <input
            type="range"
            step={1}
            min={MIN_COLORS}
            max={MAX_COLORS}
            value={numColors}
            onChange={onNumColorsChange}
          />
          <input type="text" readOnly value={numColors} size={4} />
        </label>
        <div className="ColorPalette">
          {colorPalette.slice(0, numColors).map((color, i) => {
            return (
              <label key={i}>
                Color #{i + 1}
                <input
                  type="color"
                  value={rgbToHex(color)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onColorPaletteChange(i, e.target.value);
                  }}
                />
              </label>
            );
          })}
        </div>
        <button type="button" onClick={resetColors}>
          Reset colors to defaults
        </button>
      </fieldset>
    );
  };

  const renderStepsControl = () => {
    return (
      <div>
        <label>
          Steps
          <input
            type="range"
            step={1}
            min={stepLimits[0]}
            max={stepLimits[1]}
            value={steps}
            onChange={onStepsChange}
          />
          <input type="text" readOnly value={steps} size={4} />
        </label>
      </div>
    );
  };

  const renderCavasSizeControl = () => {
    return (
      <fieldset>
        <legend>Canvas size</legend>
        <label>
          Width
          <input
            type="number"
            step={10}
            min={10}
            value={localCanvasSize.width}
            onChange={onCanvasWidthChange}
          />
        </label>

        <label>
          Height
          <input
            type="number"
            step={10}
            min={10}
            value={localCanvasSize.height}
            onChange={onCanvasHeightChange}
          />
        </label>
      </fieldset>
    );
  };

  const renderScaleControl = () => {
    return (
      <div>
        <label>
          Scale
          <input
            type="range"
            step={1}
            min={1}
            max={16}
            value={scale}
            onChange={onScaleChange}
            list="scale-values"
          />
          <datalist id="scale-values">
            <option value="1"></option>
            <option value="2"></option>
            <option value="4"></option>
            <option value="8"></option>
            <option value="16"></option>
          </datalist>
          <input type="text" readOnly value={scale} size={4} />
        </label>
      </div>
    );
  };

  const renderDitherModeControl = () => {
    const options = getDitherOptions();
    const selected = ditherModeToOption(ditherMode);
    return (
      <div>
        <label>
          Dither pattern
          <select onChange={onChangeDitherPattern}>
            {options.map((option) => {
              return (
                <option
                  value={option}
                  key={option}
                  selected={option === selected}
                >
                  {option}
                </option>
              );
            })}
          </select>
        </label>
      </div>
    );
  };

  return (
    <div>
      {renderAngleControl()}
      {renderColorsControl()}
      {renderStepsControl()}
      {renderCavasSizeControl()}
      {renderScaleControl()}
      {renderDitherModeControl()}
    </div>
  );
};

export default Controls;
