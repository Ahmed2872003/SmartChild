import { SOUNDS } from '@/assets';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { Circle, Heart, Square, Star, Triangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ColorGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const colorTest = data?.testsDescription?.find((test) => test.name === 'Colors Identification');
  const testDescription = colorTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const numRounds = testDescription?.config?.numRounds || 6;

  const SHAPES = [
    { id: 'heart', Icon: Heart },
    { id: 'star', Icon: Star },
    { id: 'circle', Icon: Circle },
    { id: 'square', Icon: Square },
    { id: 'triangle', Icon: Triangle },
  ];

  const COLOR_VARIANTS = {
    Red: [
      { bg: '#fee2e2', fg: '#dc2626' },
      { bg: '#fca5a5', fg: '#ef4444' },
      { bg: '#f87171', fg: '#ef4444' },
    ],
    Green: [
      { bg: '#dcfce7', fg: '#16a34a' },
      { bg: '#86efac', fg: '#22c55e' },
      { bg: '#4ade80', fg: '#22c55e' },
    ],
    Blue: [
      { bg: '#dbeafe', fg: '#2563eb' },
      { bg: '#93c5fd', fg: '#3b82f6' },
      { bg: '#60a5fa', fg: '#3b82f6' },
    ],
  };

  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [reveal, setReveal] = useState({ show: false, clickedId: null });

  const [totalSelections, setTotalSelections] = useState(0);
  const [correctIdentifications, setCorrectIdentifications] = useState(0);
  const [colorStats, setColorStats] = useState({
    Red: { prompts: 0, hits: 0 },
    Green: { prompts: 0, hits: 0 },
    Blue: { prompts: 0, hits: 0 },
  });

  useEffect(() => {
    if (isLoading) return;

    let pool = [];
    if (difficulty === 'easy') {
      pool = [
        { color: 'Red', diff: 0 },
        { color: 'Green', diff: 0 },
        { color: 'Blue', diff: 0 },
        { color: 'Red', diff: 0 },
      ].sort(() => Math.random() - 0.5);
    } else if (difficulty === 'hard') {
      pool = [
        { color: 'Red', diff: 2 },
        { color: 'Green', diff: 2 },
        { color: 'Blue', diff: 2 },
        { color: 'Red', diff: 2 },
        { color: 'Green', diff: 2 },
        { color: 'Blue', diff: 2 },
        { color: 'Red', diff: 2 },
        { color: 'Green', diff: 2 },
      ].sort(() => Math.random() - 0.5);
    } else {
      pool = [
        { color: 'Red', diff: 1 },
        { color: 'Red', diff: 2 },
        { color: 'Green', diff: 1 },
        { color: 'Green', diff: 2 },
        { color: 'Blue', diff: 1 },
        { color: 'Blue', diff: 2 },
      ].sort(() => Math.random() - 0.5);
    }

    if (pool.length > numRounds) pool = pool.slice(0, numRounds);
    else if (pool.length < numRounds) {
      while (pool.length < numRounds) pool.push({ color: ['Red', 'Green', 'Blue'][pool.length % 3], diff: 0 });
    }

    const generatedRounds = pool.map((item) => {
      const targetShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const options = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, 4);
      if (!options.find((o) => o.id === targetShape.id)) {
        options[0] = targetShape;
        options.sort(() => Math.random() - 0.5);
      }
      return {
        color: item.color,
        diff: item.diff,
        variant: COLOR_VARIANTS[item.color][item.diff],
        targetShape,
        options,
      };
    });
    setRounds(generatedRounds);
  }, [difficulty, numRounds, isLoading]);

  const handleOptionClick = (shapeId) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const roundData = rounds[currentRound];
    const isCorrect = shapeId === roundData.targetShape.id;

    if (isCorrect) {
      playSound(SOUNDS.match);
    } else {
      playSound(SOUNDS.wrong);
    }

    const finalSelections = totalSelections + 1;
    setTotalSelections(finalSelections);

    const newColorStats = {
      ...colorStats,
      [roundData.color]: {
        prompts: colorStats[roundData.color].prompts + 1,
        hits: isCorrect ? colorStats[roundData.color].hits + 1 : colorStats[roundData.color].hits,
      },
    };
    setColorStats(newColorStats);

    const finalCorrect = isCorrect ? correctIdentifications + 1 : correctIdentifications;
    if (isCorrect) setCorrectIdentifications(finalCorrect);

    setReveal({ show: true, clickedId: shapeId });

    setTimeout(
      () => {
        if (currentRound + 1 >= rounds.length) {
          const ar = ((finalCorrect / finalSelections) * 100).toFixed(1);
          const redProfile =
            newColorStats.Red.prompts === 0
              ? '0.0'
              : ((newColorStats.Red.hits / newColorStats.Red.prompts) * 100).toFixed(1);
          const greenProfile =
            newColorStats.Green.prompts === 0
              ? '0.0'
              : ((newColorStats.Green.hits / newColorStats.Green.prompts) * 100).toFixed(1);
          const blueProfile =
            newColorStats.Blue.prompts === 0
              ? '0.0'
              : ((newColorStats.Blue.hits / newColorStats.Blue.prompts) * 100).toFixed(1);

          onFinish(finalCorrect * 10, {
            ar,
            redProfile,
            greenProfile,
            blueProfile,
            rawData: {
              correctIdentifications: finalCorrect,
              totalSelections: finalSelections,
              ...newColorStats,
            },
          });
        } else {
          setCurrentRound((curr) => curr + 1);
          setReveal({ show: false, clickedId: null });
          setIsTransitioning(false);
        }
      },
      isCorrect ? 800 : 1500,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  if (rounds.length === 0) return null;
  const roundData = rounds[currentRound];
  const TargetIcon = roundData.targetShape.Icon;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative h-[70vh] select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">Find the hidden shape!</h2>
        <p className="text-gray-500 font-bold text-sm">
          Round {currentRound + 1} of {rounds.length}
        </p>
      </div>
      <div
        className={`relative w-full max-w-[250px] aspect-square rounded-[3rem] flex items-center justify-center shadow-inner mb-8 transition-colors duration-500 select-none overflow-hidden`}
        style={{ backgroundColor: roundData.variant.bg }}
      >
        <TargetIcon
          size={difficulty === 'hard' ? 90 : 120}
          style={{ color: roundData.variant.fg, opacity: roundData.diff === 2 ? 0.8 : 1 }}
          className="transition-colors duration-500 pointer-events-none relative z-0 transform-gpu will-change-transform"
          fill="currentColor"
        />
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-all duration-500 transform-gpu"
          style={{
            backgroundImage: `radial-gradient(${difficulty === 'hard' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'} 4px, transparent 4px)`,
            backgroundSize: difficulty === 'easy' ? '30px 30px' : difficulty === 'hard' ? '12px 12px' : '16px 16px',
          }}
        ></div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full touch-none select-none px-4">
        {roundData.options.map((opt) => {
          let btnClass =
            'bg-white p-6 rounded-3xl shadow-sm border-b-4 border-gray-200 transition-all transform-gpu will-change-transform flex justify-center items-center select-none [-webkit-tap-highlight-color:transparent] ';
          if (reveal.show) {
            if (opt.id === roundData.targetShape.id) {
              btnClass += 'ring-4 ring-green-400 bg-green-50 scale-105 border-b-0 translate-y-1 z-10 ';
            } else if (opt.id === reveal.clickedId) {
              btnClass += 'ring-4 ring-red-400 bg-red-50 scale-95 border-b-0 translate-y-1 ';
            } else {
              btnClass += 'opacity-40 scale-95 border-b-0 translate-y-1 ';
            }
          } else {
            btnClass += 'hover:-translate-y-1 active:translate-y-0 active:border-b-0 ';
          }

          return (
            <button key={opt.id} onPointerDown={() => handleOptionClick(opt.id)} className={btnClass}>
              <opt.Icon
                size={40}
                className={`${reveal.show && opt.id === roundData.targetShape.id ? 'text-green-500' : 'text-gray-400'} pointer-events-none transition-colors`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
