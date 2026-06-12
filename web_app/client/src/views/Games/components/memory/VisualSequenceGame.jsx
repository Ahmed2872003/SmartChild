import { SOUNDS } from '@/assets';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { useEffect, useState } from 'react';

export const VisualSequenceGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const visualSeqTest = data?.testsDescription?.find((test) => test.name === 'visual Sequence');
  const testDescription = visualSeqTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const seqLength = testDescription?.config?.seqLength || 4;
  const totalRounds = testDescription?.config?.totalRounds || 3;

  const ANIMALS = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐸', '🐼', '🐯', '🦁', '🐮', '🐷'];

  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [phase, setPhase] = useState('memorize');
  const [timeLeft, setTimeLeft] = useState(3);

  const [totalSelections, setTotalSelections] = useState(0);
  const [correctRecalls, setCorrectRecalls] = useState(0);
  const [sumLatency, setSumLatency] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(() => Date.now());
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (isLoading || round >= totalRounds) return;

    const available = [...ANIMALS].sort(() => Math.random() - 0.5);
    const newSeq = available.slice(0, seqLength);
    setSequence(newSeq);
    setShuffledOptions([...newSeq].sort(() => Math.random() - 0.5));
    setPlayerSequence([]);
    setPhase('memorize');
    setTimeLeft(seqLength + 1);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        playSound(SOUNDS.cowntdown);
        if (prev <= 1) {
          clearInterval(interval);
          setPhase('recall');
          setLastTapTime(Date.now());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [round, seqLength, totalRounds, isLoading]);

  useEffect(() => {
    if (round >= totalRounds && !hasFinished && !isLoading) {
      setHasFinished(true);
      const ar = totalSelections === 0 ? '0.0' : ((correctRecalls / totalSelections) * 100).toFixed(1);
      const arl = totalSelections === 0 ? '0.00' : (sumLatency / totalSelections).toFixed(2);
      onFinish(correctRecalls * 10, {
        ar,
        arl,
        rawData: {
          correctRecalls: correctRecalls,
          totalSelections: totalSelections,
          sumOfRecallLatenciesMs: sumLatency,
        },
      });
    }
  }, [round, totalRounds, hasFinished, totalSelections, correctRecalls, sumLatency, onFinish, isLoading]);

  const handleOptionClick = (animal) => {
    if (phase !== 'recall') return;
    playSound(SOUNDS.click);

    const now = Date.now();
    if (lastTapTime > 0) {
      const latency = now - lastTapTime;
      if (latency > 0 && latency < 30000) {
        setSumLatency((prev) => prev + latency);
      }
    }
    setLastTapTime(now);
    setTotalSelections((prev) => prev + 1);

    const newPlayerSeq = [...playerSequence, animal];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq.length === sequence.length) {
      setPhase('evaluating');
      let roundCorrect = 0;

      newPlayerSeq.forEach((selectedAnimal, index) => {
        if (selectedAnimal === sequence[index]) {
          roundCorrect++;
        }
      });

      setCorrectRecalls((prev) => prev + roundCorrect);

      if (roundCorrect === sequence.length) {
        playSound(SOUNDS.match);
      } else {
        playSound(SOUNDS.wrong);
      }

      setTimeout(() => setRound((r) => r + 1), 2500);
    }
  };

  const handleSlotClick = (index) => {
    if (phase !== 'recall' || playerSequence[index] === undefined) return;
    playSound(SOUNDS.click);

    const newPlayerSeq = [...playerSequence];
    newPlayerSeq.splice(index, 1);
    setPlayerSequence(newPlayerSeq);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto h-[60vh] relative select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-800">
          {phase === 'memorize' ? 'Remember the order!' : phase === 'recall' ? 'What was the order?' : "Let's check..."}
        </h2>
        <p className="text-gray-500 font-bold mt-1">
          Round {Math.min(round + 1, totalRounds)} of {totalRounds}
        </p>
      </div>

      <div className="flex flex-col items-center w-full gap-8">
        <div className="flex justify-center gap-2 md:gap-4 h-20">
          {phase === 'memorize'
            ? sequence.map((animal, i) => (
                <div
                  key={i}
                  className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm border-b-4 border-gray-200 flex items-center justify-center text-4xl animate-in zoom-in duration-300"
                >
                  {animal}
                </div>
              ))
            : Array.from({ length: seqLength }).map((_, i) => {
                const isFilled = playerSequence[i] !== undefined;
                const isEvalPhase = phase === 'evaluating';
                const isCorrect = isEvalPhase && playerSequence[i] === sequence[i];

                let borderClass = 'border-gray-200';
                if (isEvalPhase) {
                  borderClass = isCorrect
                    ? 'border-green-400 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.5)]'
                    : 'border-red-400 bg-red-50 shadow-[0_0_15px_rgba(248,113,113,0.5)]';
                } else if (isFilled) {
                  borderClass =
                    'border-gray-200 bg-white shadow-sm cursor-pointer hover:scale-105 hover:border-red-400 active:scale-95';
                } else {
                  borderClass = 'border-dashed border-gray-300 bg-gray-200/50';
                }

                return (
                  <div
                    key={i}
                    onClick={() => handleSlotClick(i)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 select-none [-webkit-tap-highlight-color:transparent] ${isFilled ? 'border-b-4' : 'border-2'} ${borderClass}`}
                  >
                    {playerSequence[i] || ''}
                  </div>
                );
              })}
        </div>

        <div className="h-28 flex items-center justify-center w-full mt-4">
          {phase !== 'memorize' ? (
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {shuffledOptions.map((animal, i) => {
                const isSelected = playerSequence.includes(animal);
                return (
                  <button
                    key={i}
                    onClick={() => !isSelected && handleOptionClick(animal)}
                    disabled={isSelected || phase !== 'recall'}
                    className={`w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm border-b-4 border-gray-200 flex items-center justify-center text-4xl transition-all transform-gpu active:translate-y-1 active:border-b-0 select-none [-webkit-tap-highlight-color:transparent] ${isSelected ? 'opacity-0 scale-50' : 'hover:scale-105'}`}
                  >
                    {animal}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-4xl font-black text-yellow-500 animate-pulse bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center border-4 border-yellow-200 shadow-sm">
              {timeLeft}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
