import { SOUNDS } from '@/assets';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { useEffect, useRef, useState } from 'react';

export const LightReactionGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const lightReactionTest = data?.testsDescription?.find((test) => test.name === 'Light Reaction');
  const testDescription = lightReactionTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const totalRounds = testDescription?.config?.totalRounds || 8;

  const [lightState, setLightState] = useState('red');
  const [currentRound, setCurrentRound] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const [totalSelections, setTotalSelections] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [sumResponseTime, setSumResponseTime] = useState(0);

  const appearTimeRef = useRef(0);
  const cycleTimerRef = useRef(null);

  useEffect(() => {
    if (currentRound >= totalRounds && isPlaying && !hasFinished) {
      setIsPlaying(false);
      setHasFinished(true);
      clearTimeout(cycleTimerRef.current);

      const pi = totalSelections === 0 ? '0.0' : ((successfulHits / totalSelections) * 100).toFixed(1);
      const mrt = successfulHits === 0 ? '0' : (sumResponseTime / successfulHits).toFixed(0);
      onFinish(successfulHits * 10, {
        mrt,
        pi,
        rawData: {
          successfulHits: successfulHits,
          totalSelections: totalSelections,
          sumOfResponseTimesMs: sumResponseTime,
        },
      });
    }
  }, [currentRound, isPlaying, totalSelections, successfulHits, sumResponseTime, onFinish, totalRounds, hasFinished]);

  useEffect(() => {
    if (!isPlaying || currentRound >= totalRounds || hasFinished || isLoading) return;

    if (lightState === 'green') return;

    let minDelay, maxDelay;
    if (lightState === 'red') {
      minDelay = difficulty === 'easy' ? 1000 : difficulty === 'hard' ? 600 : 800;
      maxDelay = difficulty === 'easy' ? 2000 : difficulty === 'hard' ? 2500 : 2500;
    } else {
      minDelay = difficulty === 'easy' ? 1000 : difficulty === 'hard' ? 400 : 800;
      maxDelay = difficulty === 'easy' ? 3000 : difficulty === 'hard' ? 4500 : 3500;
    }

    cycleTimerRef.current = setTimeout(
      () => {
        let nextState;
        if (lightState === 'red') {
          nextState = 'yellow';
        } else {
          const fakeOutChance = difficulty === 'easy' ? 0.1 : difficulty === 'medium' ? 0.3 : 0.5;
          nextState = Math.random() < fakeOutChance ? 'red' : 'green';
        }

        if (nextState === 'green') appearTimeRef.current = Date.now();
        setLightState(nextState);
      },
      Math.random() * (maxDelay - minDelay) + minDelay,
    );

    return () => clearTimeout(cycleTimerRef.current);
  }, [isPlaying, lightState, currentRound, difficulty, totalRounds, hasFinished, isLoading]); // Added isLoading to dependencies

  const handleTap = () => {
    if (!isPlaying || currentRound >= totalRounds || hasFinished) return;
    setTotalSelections((t) => t + 1);

    if (lightState === 'green') {
      playSound(SOUNDS.match);
      setSuccessfulHits((h) => h + 1);

      if (appearTimeRef.current > 0) {
        const rt = Date.now() - appearTimeRef.current;
        if (rt > 0 && rt < 10000) setSumResponseTime((prev) => prev + rt);
        appearTimeRef.current = 0;
      }

      setCurrentRound((r) => r + 1);
      setLightState('red');
    } else {
      playSound(SOUNDS.wrong);
    }
  };

  // Consistent Loading UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[60vh] select-none [-webkit-tap-highlight-color:transparent]">
      {!isPlaying && !hasFinished ? (
        <button
          onClick={() => setIsPlaying(true)}
          className="bg-yellow-400 text-black font-black text-2xl px-10 py-5 rounded-full shadow-sm animate-bounce select-none [-webkit-tap-highlight-color:transparent]"
        >
          START!
        </button>
      ) : (
        <>
          <div className="text-xl font-bold text-gray-500 mb-6">
            Round: {Math.min(currentRound + 1, totalRounds)}/{totalRounds}
          </div>
          <div className="bg-gray-800 p-6 rounded-[3rem] shadow-xl flex flex-col gap-4 border-8 border-gray-900 mb-8">
            <div
              className={`w-24 h-24 rounded-full transition-colors duration-200 ${lightState === 'red' ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)]' : 'bg-red-900'}`}
            />
            <div
              className={`w-24 h-24 rounded-full transition-colors duration-200 ${lightState === 'yellow' ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)]' : 'bg-yellow-900'}`}
            />
            <div
              className={`w-24 h-24 rounded-full transition-colors duration-200 ${lightState === 'green' ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)]' : 'bg-green-900'}`}
            />
          </div>
          <button
            onPointerDown={handleTap}
            className="bg-white w-full py-6 rounded-full font-black text-3xl text-gray-800 shadow-sm border-b-8 border-gray-200 active:translate-y-2 active:border-b-0 touch-none select-none [-webkit-tap-highlight-color:transparent]"
          >
            TAP GREEN!
          </button>
        </>
      )}
    </div>
  );
};
