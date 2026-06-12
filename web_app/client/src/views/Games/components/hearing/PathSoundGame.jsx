import { SOUNDS } from '@/assets';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound, playTone } from '@/utils/sound';
import { useEffect, useState } from 'react';

export const PathSoundGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const pathSoundTest = data?.testsDescription?.find((test) => test.name === 'Path Sound');
  const testDescription = pathSoundTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const seqLength = testDescription?.config?.seqLength || 4;
  const totalRounds = testDescription?.config?.totalRounds || 3;

  const [hasStarted, setHasStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activePad, setActivePad] = useState(null);

  const [totalSoundsPlayed, setTotalSoundsPlayed] = useState(0);
  const [correctIdentifications, setCorrectIdentifications] = useState(0);
  const [sumLatency, setSumLatency] = useState(0);
  const [audioEndTime, setAudioEndTime] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);
  const [roundErrors, setRoundErrors] = useState(0);

  const PADS = [
    { id: 0, color: 'bg-red-400', freq: 261.63 },
    { id: 1, color: 'bg-blue-400', freq: 329.63 },
    { id: 2, color: 'bg-green-400', freq: 392.0 },
    { id: 3, color: 'bg-yellow-400', freq: 523.25 },
  ];

  useEffect(() => {
    // Prevent game from running until data loads AND user clicks start
    if (isLoading || round >= totalRounds || !hasStarted) return;

    const newSeq = Array.from({ length: seqLength }).map(() => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setPlayerStep(0);
    setRoundErrors(0);
    setIsPlaying(true);

    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        const pad = PADS.find((p) => p.id === newSeq[step]);
        playTone(pad.freq);
        setActivePad(pad.id);
        setTimeout(() => setActivePad(null), 400);
        step++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
        setAudioEndTime(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [round, seqLength, totalRounds, isLoading, hasStarted]);

  useEffect(() => {
    if (round >= totalRounds && !hasFinished && !isLoading && hasStarted) {
      setHasFinished(true);
      const isr = totalSoundsPlayed === 0 ? '0.0' : ((correctIdentifications / totalSoundsPlayed) * 100).toFixed(1);
      const aarl = totalSoundsPlayed === 0 ? '0.00' : (sumLatency / totalSoundsPlayed).toFixed(2);
      onFinish(correctIdentifications * 10, {
        isr,
        aarl,
        rawData: {
          correctIdentifications: correctIdentifications,
          totalSoundsPlayed: totalSoundsPlayed,
          sumOfAudioResponseLatenciesMs: sumLatency,
        },
      });
    }
  }, [
    round,
    totalRounds,
    hasFinished,
    totalSoundsPlayed,
    correctIdentifications,
    sumLatency,
    onFinish,
    isLoading,
    hasStarted,
  ]);

  const handlePadClick = (id) => {
    if (isPlaying || !hasStarted) return;

    const now = Date.now();
    if (audioEndTime > 0) {
      const latency = now - audioEndTime;
      if (latency > 0 && latency < 30000) {
        setSumLatency((prev) => prev + latency);
      }
    }
    setAudioEndTime(now);
    setTotalSoundsPlayed((prev) => prev + 1);

    const pad = PADS.find((p) => p.id === id);
    playTone(pad.freq);

    const isCorrect = sequence[playerStep] === id;

    if (isCorrect) {
      setCorrectIdentifications((prev) => prev + 1);
    } else {
      setRoundErrors((prev) => prev + 1);
    }

    if (playerStep + 1 === sequence.length) {
      if (isCorrect && roundErrors === 0) {
        playSound(SOUNDS.match);
      }
      setTimeout(() => setRound((r) => r + 1), 1000);
      setIsPlaying(true);
    } else {
      setPlayerStep((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-[60vh] relative select-none [-webkit-tap-highlight-color:transparent]">
      {!hasStarted && !hasFinished && (
        <div className="absolute inset-0 flex items-center justify-center z-20 rounded-[2rem]">
          <button
            onClick={() => setHasStarted(true)}
            className="bg-yellow-400 text-black font-black text-2xl px-10 py-5 rounded-full shadow-sm animate-bounce select-none [-webkit-tap-highlight-color:transparent]"
          >
            START!
          </button>
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-gray-800">Follow the Sound Path!</h2>
        <p className="text-gray-500 font-bold mt-1">
          Round {Math.min(round + 1, totalRounds)} of {totalRounds}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full p-4">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onClick={() => handlePadClick(pad.id)}
            disabled={isPlaying || !hasStarted}
            className={`aspect-square rounded-[2rem] shadow-sm border-b-8 border-gray-200 transition-all duration-200 select-none [-webkit-tap-highlight-color:transparent] ${pad.color} ${activePad === pad.id ? 'scale-110 opacity-100 brightness-150' : 'opacity-80 hover:opacity-100 active:scale-95'}`}
          />
        ))}
      </div>
    </div>
  );
};
