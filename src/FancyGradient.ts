import { ColorDither } from "./DitherUtils";
import {
  DitherMode,
  degreesToRadians,
  Color,
  Point,
  drawPixel,
  limitToRange,
  DitherPatterns,
} from "./utils";

const SHOW_RAW_GRADIENT = false;

// fixed diether modes are the non-pattern modes
function isAFixedDitherMode(ditherMode: DitherMode): boolean {
  switch (ditherMode) {
    case DitherMode.None:
    case DitherMode.Bayer2x2:
    case DitherMode.Bayer4x4:
    case DitherMode.Bayer8x8:
      return true;
  }
  return false;
}

// build the ranges of colors
// basically categorize the points to color bands in the gradient
// each entry in this array will be the max in that color band
function buildColorRanges(numColors: number, ditherMode: DitherMode): number[] {
  // colorPercentage is how much of the gradient each color takes up
  // this could eventually be configurable
  // but for now we evenly space out the colors
  const colorPercentage = 1 / numColors;

  // colorAdd affects the dithering (somehow)
  let colorAdd = colorPercentage / (numColors - 1);
  if (ditherMode === DitherMode.None) {
    colorAdd = 0;
  }

  const colorRanges = [];
  let colorRange = 0;
  for (let i = 0; i < numColors; i++) {
    colorRange += colorPercentage + colorAdd;
    colorRanges[i] = colorRange;
  }
  return colorRanges;
}

export function drawFancyGradient(
  imageData: ImageData,
  width: number,
  height: number,
  angle: number,
  colors: Color[],
  ditherMode: DitherMode,
  // steps = the number of dithering steps between 2 gradient colors
  steps: number
) {
  const cos = Math.cos(degreesToRadians(angle));
  const sin = Math.sin(degreesToRadians(angle));

  const numColors = colors.length;
  const colorRanges = buildColorRanges(numColors, ditherMode);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // spatialpoint is the pixel we're at right now
      const spatialPoint = new Point(x, y);
      // this offset helps center the gradient so the angle rotates around
      // the middle of the screen
      // I don't understand how it works
      const offset = 0 - 0.5;
      const normX = spatialPoint.x / width + offset;
      const normY = spatialPoint.y / height + offset;
      const normalizedPoint = new Point(normX, normY);

      // I don't follow how this math works
      // but I think it's essentially doing some logic to figure out how far this point is away from the origin of the gradient
      const newX = normalizedPoint.x * cos + normalizedPoint.y * sin - offset;
      const newY = normalizedPoint.x * -sin + normalizedPoint.y * cos - offset;

      // dist is the gradient value (0 to 1) at the spot we're at right now
      let dist = newX;
      dist = limitToRange(0, 1, dist);

      // the base color of this pixel
      let pointBaseColor: number = 0;

      if (dist >= 1) {
        // if at the end of the gradient:

        if (ditherMode === DitherMode.None) {
          // the final color in the gradient
          pointBaseColor = numColors - 1;
        } else {
          // second to last color in the gradient
          pointBaseColor = numColors - 2;
        }
      } else {
        // figure out which color this pixel should be
        for (let k = 0; k < numColors; k++) {
          if (dist <= colorRanges[k]) {
            pointBaseColor = k;
            break;
          }
        }
      }

      let baseRange = pointBaseColor > 0 ? colorRanges[pointBaseColor - 1] : 0;
      let rangeSize = colorRanges[pointBaseColor] - baseRange;

      let n = (dist - baseRange) / rangeSize;

      const equalize = false; // equalize percentages is off
      if (equalize) {
        pointBaseColor = Math.floor(dist * (numColors - 1));
        n = dist * (numColors - 1) - pointBaseColor;
      }

      n = Math.floor(n * steps);
      n /= steps - 1;

      if (pointBaseColor >= numColors) {
        pointBaseColor = numColors - 1;
        n = 1;
      } else if (pointBaseColor < 0) {
        pointBaseColor = 0;
        n = 0;
      }

      const rotatePat = false;
      const tx = rotatePat ? newX * width : x;
      const ty = rotatePat ? newY * height : y;

      let dith: boolean;

      if (isAFixedDitherMode(ditherMode)) {
        switch (ditherMode) {
          case DitherMode.None:
            dith = false;
            break;
          case DitherMode.Bayer2x2:
            dith = ColorDither(DitherMode.Bayer2x2, tx, ty, n);
            break;
          case DitherMode.Bayer4x4:
            dith = ColorDither(DitherMode.Bayer4x4, tx, ty, n);
            break;
          case DitherMode.Bayer8x8:
            dith = ColorDither(DitherMode.Bayer8x8, tx, ty, n);
            break;
          default:
            return;
        }
      } else {
        // TODO:
        throw new Error("Unhandled ditehr pattern");
        // var pat = customPatterns[mode - (fixedModes + 1)];
        // dith = DitherUtils.ColorDither(pat.values, pat.width, pat.height, tx, ty, n);
      }

      if (SHOW_RAW_GRADIENT) {
        drawPixel(imageData, spatialPoint, [
          dist * 255,
          dist * 255,
          dist * 255,
          255,
        ]);
      } else {
        if (dith) {
          drawPixel(imageData, spatialPoint, colors[pointBaseColor + 1]);
        } else {
          drawPixel(imageData, spatialPoint, colors[pointBaseColor]);
        }
      }
    }
  }
}
