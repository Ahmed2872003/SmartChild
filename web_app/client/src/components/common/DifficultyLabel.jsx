const DifficultyLabel = ({ x, y, difficulty }) => {
  if (!difficulty) return null;

  const text = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  const getColor = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  return (
    <text x={x} y={y} fontSize="7" fill={getColor(difficulty)} textAnchor="middle" fontWeight="900" letterSpacing="0.5">
      {text}
    </text>
  );
};

const DifficultyBadge = ({ difficulty, className = '' }) => {
  if (!difficulty) return null;

  const text = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  const getColorClass = (level) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'text-[#22c55e]'; // Green
      case 'medium':
        return 'text-[#f59e0b]'; // Amber/Orange
      case 'hard':
        return 'text-[#ef4444]'; // Red
      default:
        return 'text-[#9ca3af]'; // Gray
    }
  };

  return <span className={`font-black tracking-wider ${getColorClass(difficulty)} ${className}`}>{text}</span>;
};

export { DifficultyLabel, DifficultyBadge };
