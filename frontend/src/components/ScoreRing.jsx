import React from 'react';

const ScoreRing = ({ score, size = 120, strokeWidth = 8, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Multi-color gradient based on score
  const getGradient = () => {
    if (score < 30) return ['#ef4444', '#f97316']; // Red to orange
    if (score < 60) return ['#f97316', '#eab308']; // Orange to yellow
    if (score < 80) return ['#eab308', '#22c55e']; // Yellow to green
    return ['#22c55e', '#10b981']; // Green shades
  };

  const [color1, color2] = getGradient();

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color1} />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${label})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}%</span>
        </div>
      </div>
      <span className="text-sm text-gray-400 mt-2">{label}</span>
    </div>
  );
};

export default ScoreRing;
