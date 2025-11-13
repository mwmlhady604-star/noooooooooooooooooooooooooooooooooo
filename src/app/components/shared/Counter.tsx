import React, { useState, useEffect } from 'react';

interface CounterProps {
  end: number;
  duration?: number;
  className?: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2000, className = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateCount);
      }
    };

    animationFrame = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className={`font-bold text-blue-600 ${className}`}>
      {count.toLocaleString()}
    </span>
  );
};

export default Counter;