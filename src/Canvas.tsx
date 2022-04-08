import { FC, useEffect, useRef } from "react";
import { drawFancyGradient } from "./FancyGradient";

type Props = {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
};

const Canvas: FC<Props> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d")!;
    const w = canvas.width;
    const h = canvas.height;
    draw(context, w, h);
  }, [draw]);

  return <canvas ref={canvasRef} width="300" height="300" />;
};

export default Canvas;
