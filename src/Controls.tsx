import { ChangeEvent, FC, useEffect, useRef } from "react";
import { DEFAULT_COLORS, MAX_COLORS, MIN_COLORS } from "./App";
import { drawFancyGradient } from "./FancyGradient";
import { Color, DitherMode, limitToRange } from "./utils";

type Props = {
  angle: number;
  setAngle: (angle: number) => void;
  colors: Color[];
  setColors: (colors: Color[]) => void;
  steps: number;
  setSteps: (steps: number) => void;
  ditherMode: DitherMode;
};

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
}) => {
  const stepLimits = getStepsLimits(ditherMode);

  const onAngleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newAngle = parseInt(e.target.value, 10);
    newAngle = limitToRange(0, 360, newAngle);
    setAngle(newAngle);
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

  return (
    <div>
      {renderAngleControl()}
      {renderColorsControl()}
      {renderStepsControl()}
    </div>
  );
};

export default Controls;
