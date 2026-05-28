'use client';

import { cn } from './cn';
import { useCallback, useEffect, useRef, useState } from 'react';

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;

  maxOpacity?: number;
}

type RgbColor = [number, number, number];

const COLOR_TRANSITION_DURATION_MS = 300;

function colorToRgb(color: string): RgbColor | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [red, green, blue] = Array.from(ctx.getImageData(0, 0, 1, 1).data);
  return [red, green, blue];
}

function rgbToRgba([red, green, blue]: RgbColor, alpha: number) {
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function interpolateColor(from: RgbColor, to: RgbColor, progress: number) {
  return [
    Math.round(from[0] + (to[0] - from[0]) * progress),
    Math.round(from[1] + (to[1] - from[1]) * progress),
    Math.round(from[2] + (to[2] - from[2]) * progress),
  ] as RgbColor;
}

export const FlickeringGrid = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  width,
  height,
  className,
  maxOpacity = 0.3,
}: FlickeringGridProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const displayedColorRef = useRef<RgbColor>([0, 0, 0]);
  const transitionFromColorRef = useRef<RgbColor>([0, 0, 0]);
  const transitionToColorRef = useRef<RgbColor>([0, 0, 0]);
  const colorInitializedRef = useRef(false);
  const transitionStartRef = useRef<number | null>(null);

  useEffect(() => {
    const nextColor = colorToRgb(color);
    if (!nextColor) {
      return;
    }

    if (!colorInitializedRef.current) {
      displayedColorRef.current = nextColor;
      transitionFromColorRef.current = nextColor;
      transitionToColorRef.current = nextColor;
      colorInitializedRef.current = true;
      return;
    }

    transitionFromColorRef.current = displayedColorRef.current;
    transitionToColorRef.current = nextColor;
    transitionStartRef.current = performance.now();
  }, [color]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const opacity = squares[i * rows + j];
          ctx.fillStyle = rgbToRgba(displayedColorRef.current, opacity);
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          );
        }
      }
    },
    [squareSize, gridGap],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!(canvas && container)) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width ?? container.clientWidth;
      const newHeight = height ?? container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) {
        return;
      }

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const transitionStart = transitionStartRef.current;
      if (transitionStart !== null) {
        const progress = Math.min(
          (time - transitionStart) / COLOR_TRANSITION_DURATION_MS,
          1,
        );
        displayedColorRef.current = interpolateColor(
          transitionFromColorRef.current,
          transitionToColorRef.current,
          progress,
        );

        if (progress >= 1) {
          transitionStartRef.current = null;
          transitionFromColorRef.current = transitionToColorRef.current;
        }
      }

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn('w-full h-full', className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export default FlickeringGrid;
