import { SOUNDS } from '@/assets';
import { CATEGORICAL_SETS } from '@/constants/testData';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { useEffect, useState } from 'react';

export const OddOneOutGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const oddOneOutTest = data?.testsDescription?.find((test) => test.name === 'Odd One Out');
  const testDescription = oddOneOutTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const maxRounds = testDescription?.config?.maxRounds || 5;

  const [round, setRound] = useState(0);
  const [items, setItems] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(null);
  const [accumulatedTimeMs, setAccumulatedTimeMs] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const [reveal, setReveal] = useState({ show: false, clickedId: null });

  useEffect(() => {
    if (isLoading || round >= maxRounds) return;

    // 1. Grab the correct difficulty sets
    const diffSets = CATEGORICAL_SETS[difficulty] || CATEGORICAL_SETS.medium;

    // 2. Pick a random categorical rule for this round
    const selectedSet = diffSets[Math.floor(Math.random() * diffSets.length)];

    // 3. Shuffle the base category using .sort() and grab exactly 3 distinct items
    const shuffledBase = [...selectedSet.base].sort(() => Math.random() - 0.5);
    const chosenBaseItems = shuffledBase.slice(0, 3);

    // 4. Shuffle the odd category using .sort() and grab exactly 1 item
    const shuffledOdd = [...selectedSet.odd].sort(() => Math.random() - 0.5);
    const chosenOddItem = shuffledOdd[0];

    // 5. Assemble the un-shuffled board
    const newItems = chosenBaseItems.map((emoji) => ({
      emoji: emoji,
      isOdd: false,
    }));

    // Add the odd one out
    newItems.push({
      emoji: chosenOddItem,
      isOdd: true,
    });

    // 6. Shuffle the final board using .sort() and assign React keys (ids) dynamically
    const finalOptions = newItems
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        ...item,
        id: index,
      }));

    setItems(finalOptions);
  }, [round, difficulty, maxRounds, isLoading]);

  useEffect(() => {
    if (round >= maxRounds && !hasFinished && !isLoading) {
      setHasFinished(true);
      const timeTakenMs = accumulatedTimeMs;
      const ar = ((correctCount / maxRounds) * 100).toFixed(1);
      const art = (timeTakenMs / maxRounds).toFixed(1);
      onFinish(correctCount * 20, {
        ar,
        art,
        rawData: {
          correctIdentifications: correctCount,
          totalRounds: maxRounds,
          timeTakenMs: timeTakenMs,
        },
      });
    }
  }, [round, maxRounds, hasFinished, correctCount, onFinish, isLoading, accumulatedTimeMs]);

  useEffect(() => {
    if (!isLoading && round < maxRounds && !reveal.show) setRoundStartTime(Date.now());
  }, [round, reveal.show, isLoading, maxRounds]);

  const handleSelect = (id, isOdd) => {
    if (reveal.show || hasFinished) return;

    const timeSpentOnThisRound = Date.now() - roundStartTime;

    setAccumulatedTimeMs((prev) => prev + timeSpentOnThisRound);

    if (isOdd) {
      playSound(SOUNDS.match);
      setCorrectCount((c) => c + 1);
    } else {
      playSound(SOUNDS.wrong);
    }

    setReveal({ show: true, clickedId: id });

    setTimeout(
      () => {
        setRound((r) => r + 1);
        setReveal({ show: false, clickedId: null });
      },
      isOdd ? 800 : 1500,
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
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[60vh] select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-800">Find the Different One!</h2>
        <p className="text-gray-500 font-bold mt-1">
          Round {Math.min(round + 1, maxRounds)} of {maxRounds}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full p-4">
        {items.map((item) => {
          let btnClass =
            'bg-white aspect-square rounded-[2rem] shadow-sm border-b-8 border-gray-200 flex items-center justify-center transition-all text-6xl md:text-7xl select-none [-webkit-tap-highlight-color:transparent] ';

          if (reveal.show) {
            if (item.isOdd) {
              btnClass += 'ring-8 ring-green-400 bg-green-50 scale-105 border-b-0 translate-y-2 z-10 ';
            } else if (item.id === reveal.clickedId) {
              btnClass += 'ring-8 ring-red-400 bg-red-50 scale-95 border-b-0 translate-y-2 ';
            } else {
              btnClass += 'opacity-40 scale-95 border-b-0 translate-y-2 ';
            }
          } else {
            btnClass += 'hover:-translate-y-1 active:translate-y-2 active:border-b-0 ';
          }

          return (
            <button key={item.id} onClick={() => handleSelect(item.id, item.isOdd)} className={btnClass}>
              {item.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
};
