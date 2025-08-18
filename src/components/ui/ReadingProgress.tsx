'use client';

import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(Math.min(Math.max(scrollProgress, 0), 100));
    };

    const throttledUpdate = throttle(updateProgress, 16); // ~60fps
    window.addEventListener('scroll', throttledUpdate);
    updateProgress(); // Set initial progress

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
    };
  }, []);

  return (
    <>
      {/* Fixed progress bar at top */}
      <div className={`fixed top-0 left-0 w-full h-1 bg-gray-200 z-50 ${className}`}>
        <div
          className="h-full bg-hero-gradient transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating progress indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative w-12 h-12">
          {/* Background circle */}
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="transparent"
            />
          </svg>
          
          {/* Progress circle */}
          <svg className="absolute top-0 left-0 w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#progress-gradient)"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
              className="transition-all duration-100 ease-out"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {Math.round(progress)}
            </span>
          </div>
          
          {/* Background blur */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full -z-10 shadow-medium" />
        </div>
      </div>
    </>
  );
}

// Throttle function to limit scroll event frequency
function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}
