import { SOUNDS } from '@/assets';
import { COLORED_ITEMS } from '@/constants/testData';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { useEffect, useState } from 'react';

export const ColorSortingGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const colorSortTest = data?.testsDescription?.find((test) => test.name === 'Color Sorting');
  const testDescription = colorSortTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const maxRounds = testDescription?.config?.maxRounds || 9;

  const BINS = [
    { id: 'Red', color: 'bg-red-500' },
    { id: 'Green', color: 'bg-green-500' },
    { id: 'Blue', color: 'bg-blue-500' },
  ];

  const [round, setRound] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);

  const [reveal, setReveal] = useState({ show: false, clickedId: null });

  const [totalSelections, setTotalSelections] = useState(0);
  const [correctIdentifications, setCorrectIdentifications] = useState(0);
  const [stats, setStats] = useState({
    Red: { prompts: 0, hits: 0 },
    Green: { prompts: 0, hits: 0 },
    Blue: { prompts: 0, hits: 0 },
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const redItems = [...COLORED_ITEMS.Red].sort(() => Math.random() - 0.5);
    const greenItems = [...COLORED_ITEMS.Green].sort(() => Math.random() - 0.5);
    const blueItems = [...COLORED_ITEMS.Blue].sort(() => Math.random() - 0.5);

    let pool = [];
    for (let i = 0; i < maxRounds; i++) {
      const color = ['Red', 'Green', 'Blue'][i % 3];
      let item;
      if (color === 'Red') item = redItems.pop();
      if (color === 'Green') item = greenItems.pop();
      if (color === 'Blue') item = blueItems.pop();

      pool.push({ colorId: color, emoji: item });
    }

    pool.sort(() => Math.random() - 0.5);
    setSchedule(pool);
  }, [maxRounds, difficulty, isLoading]);

  useEffect(() => {
    if (round < maxRounds && schedule.length > 0) {
      setCurrentItem(schedule[round]);
    }
  }, [round, schedule, maxRounds]);

  useEffect(() => {
    if (round >= maxRounds && schedule.length > 0 && !hasFinished && !isLoading) {
      setHasFinished(true);
      const ar = totalSelections === 0 ? '0.0' : ((correctIdentifications / totalSelections) * 100).toFixed(1);
      const redProfile = stats.Red.prompts === 0 ? '0.0' : ((stats.Red.hits / stats.Red.prompts) * 100).toFixed(1);
      const greenProfile =
        stats.Green.prompts === 0 ? '0.0' : ((stats.Green.hits / stats.Green.prompts) * 100).toFixed(1);
      const blueProfile = stats.Blue.prompts === 0 ? '0.0' : ((stats.Blue.hits / stats.Blue.prompts) * 100).toFixed(1);
      onFinish(correctIdentifications * 10, {
        ar,
        redProfile,
        greenProfile,
        blueProfile,
        rawData: {
          correctIdentifications: correctIdentifications,
          totalSelections: totalSelections,
          ...stats,
        },
      });
    }
  }, [round, maxRounds, schedule, hasFinished, totalSelections, correctIdentifications, stats, onFinish, isLoading]);

  const handleBinTap = (binId) => {
    if (!currentItem || isTransitioning || round >= maxRounds || hasFinished) return;

    setIsTransitioning(true);
    setTotalSelections((s) => s + 1);

    const isCorrect = binId === currentItem.colorId;
    if (isCorrect) {
      playSound(SOUNDS.match);
    } else {
      playSound(SOUNDS.wrong);
    }

    if (isCorrect) setCorrectIdentifications((c) => c + 1);

    setStats((prev) => ({
      ...prev,
      [currentItem.colorId]: {
        prompts: prev[currentItem.colorId].prompts + 1,
        hits: isCorrect ? prev[currentItem.colorId].hits + 1 : prev[currentItem.colorId].hits,
      },
    }));

    setReveal({ show: true, clickedId: binId });

    setTimeout(
      () => {
        setCurrentItem(null);
        setRound((r) => r + 1);
        setReveal({ show: false, clickedId: null });
        setIsTransitioning(false);
      },
      isCorrect ? 500 : 1500,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-md mx-auto h-[65vh] select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mt-4">
        <h2 className="text-2xl font-black text-gray-800">Sort by Color!</h2>
        <p className="text-gray-500 font-bold mt-1">
          Round {Math.min(round + 1, maxRounds)} of {maxRounds}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        {currentItem ? (
          <div className="animate-in fade-in zoom-in duration-300">
            <span className="text-[100px] md:text-[120px] leading-none drop-shadow-md select-none block transform-gpu will-change-transform">
              {currentItem.emoji}
            </span>
          </div>
        ) : (
          <div className="h-[120px]" />
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 w-full mb-4 px-4">
        {BINS.map((bin) => {
          let btnClass = `${bin.color} h-32 rounded-t-[2rem] shadow-inner flex items-center justify-center transition-all select-none [-webkit-tap-highlight-color:transparent] `;
          if (reveal.show) {
            if (bin.id === currentItem?.colorId) {
              btnClass += 'ring-8 ring-green-400 brightness-110 z-10 border-b-0 translate-y-2 ';
            } else if (bin.id === reveal.clickedId) {
              btnClass += 'ring-8 ring-red-400 border-b-0 translate-y-2 brightness-75 ';
            } else {
              btnClass += 'opacity-50 border-b-0 translate-y-2 ';
            }
          } else {
            btnClass += 'border-b-8 border-gray-900/20 hover:opacity-90 active:translate-y-2 ';
          }

          return (
            <button key={bin.id} onPointerDown={() => handleBinTap(bin.id)} className={btnClass}>
              <span className="text-white font-black uppercase tracking-wider">{bin.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
