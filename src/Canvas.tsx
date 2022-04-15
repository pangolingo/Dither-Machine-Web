import { FC, useEffect, useRef } from "react";
import { drawFancyGradient } from "./FancyGradient";
import { Dimensions } from "./utils";

type Props = {
  draw: (ctx: CanvasRenderingContext2D) => void;
  canvasSize: Dimensions;
};

const Canvas: FC<Props> = ({ draw, canvasSize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d")!;
    draw(ctx);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
    />
  );
};

export default Canvas;
