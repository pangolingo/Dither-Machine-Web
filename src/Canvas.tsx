import { FC, useEffect, useRef } from "react";
import { CANVAS_SIZE, DRAWING_SIZE } from "./App";
import { drawFancyGradient } from "./FancyGradient";

type Props = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

const Canvas: FC<Props> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d")!;
    draw(ctx);
  }, [draw]);

  return <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} />;
};

export default Canvas;
