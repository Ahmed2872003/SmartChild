import { SOUNDS } from '@/assets';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { Puzzle } from 'lucide-react';
import { useEffect, useState } from 'react';

export const MemoryGame = ({ onFinish, difficulty = 'medium' }) => {
  const { data, isLoading } = useGetTestsConfig();

  const matchingTest = data?.testsDescription?.find((test) => test.name === 'Matching');
  const testDescription = matchingTest?.descriptions?.find((desc) => desc.difficulty === difficulty);
  const targetPairs = testDescription?.config?.targetPairs || 6;

  const ALL_ICONS = ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐸', '🐼'];
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isPreviewing, setIsPreviewing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewTime, setPreviewTime] = useState(3);

  const [gameStartTime, setGameStartTime] = useState(0);
  const [pairTimestamps, setPairTimestamps] = useState([]);

  const gridColsClass = difficulty === 'easy' ? 'grid-cols-3' : 'grid-cols-4';
  const cardSizeClass =
    difficulty === 'easy' ? 'text-5xl sm:text-6xl rounded-[1.5rem]' : 'text-4xl sm:text-5xl rounded-xl';
  const iconSize = difficulty === 'easy' ? 48 : 32;

  useEffect(() => {
    if (isLoading) return;

    let pairCount = targetPairs;
    const selectedIcons = ALL_ICONS.slice(0, pairCount);
    let deck = [...selectedIcons, ...selectedIcons].map((emoji, idx) => ({
      id: idx,
      emoji,
      isFlipped: true,
      isMatched: false,
      isJoker: false,
    }));

    deck.sort(() => Math.random() - 0.5);
    setCards(deck);

    let timeLeft = 3;
    const interval = setInterval(() => {
      timeLeft -= 1;
      playSound(SOUNDS.cowntdown);
      setPreviewTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setCards((prevCards) => prevCards.map((c) => ({ ...c, isFlipped: false })));
        setIsPreviewing(false);
        setGameStartTime(Date.now());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [difficulty, targetPairs, isLoading]); // Added isLoading to dependency array

  const handleCardClick = (index) => {
    if (isPreviewing || isProcessing || flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched)
      return;

    playSound(SOUNDS.click);

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true); // Lock interactions
      const currentMoves = moves + 1;
      setMoves(currentMoves);
      const currentClickTime = Date.now();
      const newTimestamps = [...pairTimestamps, currentClickTime];
      setPairTimestamps(newTimestamps);

      const match = newCards[newFlipped[0]].emoji === newCards[newFlipped[1]].emoji;

      if (match) {
        playSound(SOUNDS.match);
        newCards[newFlipped[0]].isMatched = true;
        newCards[newFlipped[1]].isMatched = true;
        setCards(newCards);
        setFlippedIndices([]);
        setIsProcessing(false); // Unlock

        const currentMatches = matches + 1;
        setMatches(currentMatches);

        if (currentMatches === targetPairs) {
          const ar = ((currentMatches / currentMoves) * 100).toFixed(1);
          let sumDiff = 0,
            prevT = gameStartTime;
          newTimestamps.forEach((t) => {
            if (prevT > 0) sumDiff += t - prevT;
            prevT = t;
          });
          const arl = (sumDiff / currentMoves).toFixed(2);

          setTimeout(
            () =>
              onFinish(Math.max(10, 50 - currentMoves), {
                ar,
                arl,
                rawData: {
                  correctRecalls: currentMatches,
                  totalSelections: currentMoves,
                  sumOfRecallLatenciesMs: sumDiff,
                },
              }),
            800,
          );
        }
      } else {
        playSound(SOUNDS.wrong);
        setTimeout(() => {
          setCards((prev) => {
            const reverted = [...prev];
            if (reverted[newFlipped[0]]) reverted[newFlipped[0]].isFlipped = false;
            if (reverted[newFlipped[1]]) reverted[newFlipped[1]].isFlipped = false;
            return reverted;
          });
          setFlippedIndices([]);
          setIsProcessing(false); // Unlock after animation finishes
        }, 1000);
      }
    }
  };

  // Optional: Add a simple loading state return so the screen doesn't stay blank
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto h-[60vh] relative select-none [-webkit-tap-highlight-color:transparent]">
      <div className="h-16 w-full flex justify-center items-center mb-4">
        {isPreviewing && (
          <div className="bg-white px-8 py-3 rounded-full shadow-md text-[#FFC82C] font-black text-2xl animate-bounce border-2 border-[#FFC82C]">
            Memorize! ({previewTime}s)
          </div>
        )}
      </div>
      <div className={`grid ${gridColsClass} gap-3 md:gap-4 w-full px-4 touch-none select-none`}>
        {cards.map((card, idx) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square ${cardSizeClass} flex items-center justify-center cursor-pointer select-none transition-all duration-300 transform-gpu will-change-transform ${card.isFlipped || card.isMatched ? 'bg-white shadow-md rotate-y-180' : 'bg-[#FFC82C] border-b-8 border-[#E5B427] hover:scale-105'} [-webkit-tap-highlight-color:transparent]`}
          >
            {card.isFlipped || card.isMatched ? (
              card.emoji
            ) : (
              <Puzzle size={iconSize} className="text-yellow-600/30 pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
