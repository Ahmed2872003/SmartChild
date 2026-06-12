import { SOUNDS } from '@/assets';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { Bug, Timer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const ReactionGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const bugCatchTest = data?.testsDescription?.find((test) => test.name === 'Bug Catch');
  const testDescription = bugCatchTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const initialTime = testDescription?.config?.initialTime || 20;
  const bugLifespan = testDescription?.config?.bugLifespan || 1000;

  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [totalSelections, setTotalSelections] = useState(0);
  const [bugId, setBugId] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const bugSizeClass = difficulty === 'easy' ? 'w-28 h-28' : difficulty === 'hard' ? 'w-12 h-12' : 'w-16 h-16';
  const bugIconSize = difficulty === 'easy' ? 56 : difficulty === 'hard' ? 24 : 32;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sumResponseTime, setSumResponseTime] = useState(0);

  const appearTimeRef = useRef(0);

  useEffect(() => {
    if (timeLeft <= 0 && isPlaying && !hasFinished) {
      setIsPlaying(false);
      setHasFinished(true);

      const totalBugsSpawned = Math.max(1, bugId);
      const pi = ((successfulHits / totalBugsSpawned) * 100).toFixed(1);

      const mrt = successfulHits === 0 ? '0' : (sumResponseTime / successfulHits).toFixed(0);
      onFinish(successfulHits * 10, {
        mrt,
        pi,
        rawData: {
          successfulHits: successfulHits,
          totalBugsSpawned: totalBugsSpawned,
          totalSelections: totalSelections,
          sumOfResponseTimesMs: sumResponseTime,
        },
      });
    }
  }, [timeLeft, isPlaying, totalSelections, successfulHits, sumResponseTime, onFinish, hasFinished]);

  useEffect(() => {
    if (timeLeft > 0 && isPlaying) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => moveTarget(), bugLifespan);
    return () => clearTimeout(timer);
  }, [bugId, isPlaying, bugLifespan]);

  const moveTarget = () => {
    setPosition({ top: `${Math.random() * 70 + 10}%`, left: `${Math.random() * 70 + 10}%` });
    appearTimeRef.current = Date.now();
    setBugId((prev) => prev + 1);
  };

  const handleStart = (e) => {
    e.stopPropagation();
    setTimeLeft(initialTime);
    setIsPlaying(true);
    moveTarget();
  };

  const handleContainerTap = () => {
    if (isPlaying && timeLeft > 0) setTotalSelections((t) => t + 1);
  };

  const handleBugTap = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isPlaying || timeLeft <= 0 || hasFinished) return;
    playSound(SOUNDS.click);

    if (appearTimeRef.current > 0) {
      const rt = Date.now() - appearTimeRef.current;
      if (rt > 0 && rt < 10000) {
        setSumResponseTime((prev) => prev + rt);
      }
      appearTimeRef.current = 0;
    }

    setTotalSelections((t) => t + 1);
    setSuccessfulHits((s) => s + 1);
    moveTarget();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  return (
    <div
      onPointerDown={handleContainerTap}
      className="flex flex-col items-center w-full h-[60vh] bg-white rounded-3xl border-4 border-dashed border-gray-200 relative overflow-hidden cursor-crosshair touch-none select-none [-webkit-tap-highlight-color:transparent]"
    >
      {!isPlaying && !hasFinished ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
          <button
            onClick={handleStart}
            className={`bg-yellow-400 text-gray-900 font-black text-2xl px-10 py-5 rounded-full shadow-sm hover:scale-105 transition-all animate-bounce select-none [-webkit-tap-highlight-color:transparent]`}
          >
            START!
          </button>
        </div>
      ) : (
        <div className="absolute top-4 left-4 bg-gray-100 px-4 py-2 rounded-full font-bold text-gray-600 flex items-center gap-2 z-10 pointer-events-none">
          <Timer size={18} /> {timeLeft}s
        </div>
      )}
      <button
        onPointerDown={handleBugTap}
        style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
        className={`absolute ${bugSizeClass} cursor-crosshai bg-[#ff5e5e] rounded-full flex items-center justify-center shadow-lg active:scale-75 transition-transform transform-gpu will-change-transform select-none [-webkit-tap-highlight-color:transparent]`}
      >
        <Bug size={bugIconSize} className="text-white pointer-events-none" />
      </button>
    </div>
  );
};
