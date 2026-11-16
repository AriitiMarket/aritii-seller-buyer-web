import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  DoughnutController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController,
  BarController,
  DoughnutController
);

const SafeChart = ({ type, data, options, height = 300, className = '' }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Destroy any pre-existing chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Also check for any chart attached to the canvas (React 19 strict mode double-mount)
    const existing = ChartJS.getChart(canvas);
    if (existing) existing.destroy();

    chartRef.current = new ChartJS(canvas, { type, data, options });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  // Re-create chart when type, data, or options change
  }, [type, data, options]);

  return (
    <div className={className} style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default React.memo(SafeChart);
