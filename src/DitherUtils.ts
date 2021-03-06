import { DitherMode } from "./utils";

const Bayer2x2 = [0.25, 0.75, 1.0, 0.5];
const Bayer4x4 = [
  0.03125, 0.53125, 0.15625, 0.65625, 0.78125, 0.28125, 0.90625, 0.40625,
  0.21875, 0.71875, 0.09375, 0.59375, 0.96875, 0.46875, 0.84375, 0.34375,
];

const Cluster4x4 = [
  0.8125, 0.375, 0.4375, 0.875, 0.3125, 0.0625, 0.125, 0.5, 0.75, 0.25, 0.1875,
  0.5625, 1, 0.6875, 0.625, 0.9375,
];

const Bayer8x8 = [
  0.015625, 0.515625, 0.140625, 0.640625, 0.046875, 0.546875, 0.171875,
  0.671875, 0.765625, 0.265625, 0.890625, 0.390625, 0.796875, 0.296875,
  0.921875, 0.421875, 0.203125, 0.703125, 0.078125, 0.578125, 0.234375,
  0.734375, 0.109375, 0.609375, 0.953125, 0.453125, 0.828125, 0.328125,
  0.984375, 0.484375, 0.859375, 0.359375, 0.0625, 0.5625, 0.1875, 0.6875,
  0.03125, 0.53125, 0.15625, 0.65625, 0.8125, 0.3125, 0.9375, 0.4375, 0.78125,
  0.28125, 0.90625, 0.40625, 0.25, 0.75, 0.125, 0.625, 0.21875, 0.71875,
  0.09375, 0.59375, 1, 0.5, 0.875, 0.375, 0.96875, 0.46875, 0.84375, 0.34375,
];

const Cluster8x8 = [
  0.390625, 0.171875, 0.203125, 0.421875, 0.5625, 0.75, 0.78125, 0.59375,
  0.140625, 0.015625, 0.046875, 0.234375, 0.71875, 0.9375, 0.96875, 0.8125,
  0.359375, 0.109375, 0.078125, 0.265625, 0.6875, 0.90625, 1, 0.84375, 0.484375,
  0.328125, 0.296875, 0.453125, 0.53125, 0.65625, 0.875, 0.625, 0.546875,
  0.734375, 0.765625, 0.578125, 0.40625, 0.1875, 0.21875, 0.4375, 0.703125,
  0.921875, 0.953125, 0.796875, 0.15625, 0.03125, 0.0625, 0.25, 0.671875,
  0.890625, 0.984375, 0.828125, 0.375, 0.125, 0.09375, 0.28125, 0.515625,
  0.640625, 0.859375, 0.609375, 0.5, 0.34375, 0.3125, 0.46875,
];

// the bitwise & is a fancy way of doing a modulus operation
// it only works if the divisor is a power of 2
// this does a bitwise shift (<<) to move down columns - another fancy trick
// so basically we're doing a modulus operation to convert the x/y value to a spot in the array
// x is the array "row" value and y is the array "column" value
// (even though the array doesn't really have columns, we can pretend it's an NxN array)
function getLimit(ditherMode: DitherMode, x: number, y: number) {
  switch (ditherMode) {
    case DitherMode.Bayer2x2:
      return Bayer2x2[((y & 1) << 1) + (x & 1)];
    case DitherMode.Bayer4x4:
      return Bayer4x4[((y & 3) << 2) + (x & 3)];
    case DitherMode.Bayer8x8:
      return Bayer8x8[((y & 7) << 3) + (x & 7)];
    case DitherMode.Cluster4x4:
      return Cluster4x4[((y & 3) << 2) + (x & 3)];
    case DitherMode.Cluster8x8:
      return Cluster8x8[((y & 7) << 3) + (x & 7)];
    default:
      return 1;
  }
}

// if the value is less than the dither mask value, we use the base color
// otherwise we use the alternate color
export function ColorDither(
  ditherMode: DitherMode,
  x: number,
  y: number,
  value: number
): boolean {
  const limit = getLimit(ditherMode, x, y);
  return value >= limit;
}
