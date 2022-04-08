export enum DitherMode {
  None,
  Bayer2x2,
  Bayer4x4,
  Bayer8x8,
  Cluster4x4,
  Cluster8x8,
}
export type Color = [number, number, number, number];
export class Point {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export function drawPixel(imageData: ImageData, point: Point, color: Color) {
  const i = pointToOffset(point, imageData.width);
  imageData.data[i] = color[0];
  imageData.data[i + 1] = color[1];
  imageData.data[i + 2] = color[2];
  imageData.data[i + 3] = color[3];
}


export function pointToOffset(point: Point, w: number) {
  // 4 offset because each pixel has 4 color bits
  // to get the y, proceed forward y rows
  // to get the x, proceed forward x pixels
  const x = point.x;
  const y = point.y;
  return y * (w * 4) + x * 4;
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// use this to limit a number to a fixed range
export function limitToRange(min: number, max: number, value: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}