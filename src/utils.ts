export enum DitherMode {
  None,
  Bayer2x2,
  Bayer4x4,
  Bayer8x8,
  Cluster4x4,
  Cluster8x8,
}

export enum DitherPatterns {
  Solid,
  Bayer2,
  Bayer4,
  Bayer8,
  Cluster4,
  Cluster8,
  // Chain,
  // Circles,
  // Chess,
  // Commas,
  // Crosses,
  // Curls,
  // Dots,
  // Feathers,
  // Fur,
  // Grid,
  // Hair,
  // Halftone,
  // Lines,
  // Machine,
  // Maze,
  // Metal,
  // Scales,
  // Stripes,
  // Swirls,
  // Rocky,
  // Tiles,
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

export class Dimensions {
  width: number;
  height: number;
  constructor(width = 0, height = 0) {
    this.width = width;
    this.height = height;
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

export function rgbToHex(color: Color): string {
  const [r, g, b] = color;
  let rStr = r.toString(16);
  let gStr = g.toString(16);
  let bStr = b.toString(16);

  if (rStr.length == 1) rStr = "0" + rStr;
  if (gStr.length == 1) gStr = "0" + gStr;
  if (bStr.length == 1) bStr = "0" + bStr;

  return "#" + rStr + gStr + bStr;
}

export function hexToRgb(hex: string): Color {
  let r: string;
  let g: string;
  let b: string;

  // 3 digits
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];

    // 6 digits
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  } else {
    throw new Error(`Unexpected hex length ${hex}`);
  }

  // return "rgb(" + +r + "," + +g + "," + +b + ")";
  const rNum = parseInt(r, 16);
  const gNum = parseInt(g, 16);
  const bNum = parseInt(b, 16);
  return [rNum, gNum, bNum, 255];
}
