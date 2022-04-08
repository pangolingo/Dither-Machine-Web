import { ChangeEvent, FC, useEffect, useRef } from "react";
import { DEFAULT_COLORS, MAX_COLORS, MIN_COLORS } from "./App";
import { drawFancyGradient } from "./FancyGradient";
import { Color, limitToRange } from "./utils";

type Props = {
  angle: number;
  setAngle: (angle: number) => void;
  colors: Color[];
  setColors: (colors: Color[]) => void;
};

const Controls: FC<Props> = ({ angle, setAngle, colors, setColors }) => {
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

  return (
    <div>
      {renderAngleControl()}
      {renderColorsControl()}
    </div>
  );
};

export default Controls;
