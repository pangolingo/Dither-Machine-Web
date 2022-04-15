import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { DEFAULT_COLORS, MAX_COLORS, MIN_COLORS } from "./App";
import { drawFancyGradient } from "./FancyGradient";
import { Color, Dimensions, DitherMode, limitToRange } from "./utils";

type Props = {
  angle: number;
  setAngle: (angle: number) => void;
  colors: Color[];
  setColors: (colors: Color[]) => void;
  steps: number;
  setSteps: (steps: number) => void;
  ditherMode: DitherMode;
  canvasSize: Dimensions;
  setCanvasSize: (size: Dimensions) => void;
  scale: number;
  setScale: (scale: number) => void;
};

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
  colors,
  setColors,
  steps,
  setSteps,
  ditherMode,
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

    if (newNumColors === colors.length) {
      return;
    }
    if (newNumColors < colors.length) {
      const newColors = colors.slice(0, newNumColors);
      setColors(newColors);
      return;
    }

    // const existingColors = [...colors];
    const otherNewColors = DEFAULT_COLORS.slice(colors.length, newNumColors);
    setColors([...colors, ...otherNewColors]);
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
            value={colors.length}
            onChange={onNumColorsChange}
          />
          <input type="text" readOnly value={colors.length} size={4} />
        </label>
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

  return (
    <div>
      {renderAngleControl()}
      {renderColorsControl()}
      {renderStepsControl()}
      {renderCavasSizeControl()}
      {renderScaleControl()}
    </div>
  );
};

export default Controls;
