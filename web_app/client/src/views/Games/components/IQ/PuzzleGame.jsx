import { PUZZLE_IMAGES, SOUNDS } from '@/assets';
import { THEME } from '@/constants/config';
import { useGetTestsConfig } from '@/hooks/test';
import { playSound } from '@/utils/sound';
import { useEffect, useState } from 'react';

export const PuzzleGame = ({ onFinish, difficulty = 'medium', imageUrl = null }) => {
  const { data, isLoading } = useGetTestsConfig();

  const puzzleTest = data?.testsDescription?.find((test) => test.name === 'Puzzle');
  const testDescription = puzzleTest?.descriptions?.find((desc) => desc.difficulty === difficulty);

  const gridSize = testDescription?.config?.gridSize || 3;
  const numPieces = gridSize * gridSize;

  const [pool, setPool] = useState([]);
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [hasFinished, setHasFinished] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (isLoading) return;

    let initialPool = Array.from({ length: numPieces }).map((_, i) => i);
    initialPool.sort(() => Math.random() - 0.5);
    setPool(initialPool);
    setGrid(Array(numPieces).fill(null));
    setMoves(0);
    setStartTime(Date.now());
    setHasFinished(false);

    setCurrentImage(imageUrl || PUZZLE_IMAGES[Math.floor(Math.random() * PUZZLE_IMAGES.length)]);
  }, [gridSize, numPieces, imageUrl, isLoading]);

  const checkWin = (currentGrid) => {
    if (currentGrid.includes(null)) return false;
    return currentGrid.every((piece, index) => piece === index);
  };

  const executeMove = (sourceType, sourceIdx, targetType, targetIdx) => {
    if (hasFinished) return;

    let newGrid = [...grid];
    let newPool = [...pool];
    let currentMoves = moves + 1;

    if (sourceType === 'pool' && targetType === 'grid') {
      const pieceId = newPool[sourceIdx];
      newPool.splice(sourceIdx, 1);
      if (newGrid[targetIdx] !== null) newPool.push(newGrid[targetIdx]);
      newGrid[targetIdx] = pieceId;
    } else if (sourceType === 'grid' && targetType === 'grid') {
      const temp = newGrid[targetIdx];
      newGrid[targetIdx] = newGrid[sourceIdx];
      newGrid[sourceIdx] = temp;
    } else if (sourceType === 'grid' && targetType === 'pool') {
      newPool.push(newGrid[sourceIdx]);
      newGrid[sourceIdx] = null;
    } else {
      return;
    }

    setMoves(currentMoves);
    setGrid(newGrid);
    setPool(newPool);
    setSelected(null);
    playSound(SOUNDS.click);

    if (checkWin(newGrid) && !hasFinished) {
      setHasFinished(true);
      playSound(SOUNDS.match);
      const timeTakenMs = Date.now() - startTime;
      const optimalMoves = numPieces;
      const ar = ((optimalMoves / currentMoves) * 100).toFixed(1);

      setTimeout(
        () =>
          onFinish(100, {
            ar,
            art: timeTakenMs.toFixed(1),
            rawData: {
              totalMoves: currentMoves,
              optimalMoves: optimalMoves,
              timeTakenMs: timeTakenMs,
            },
          }),
        1000,
      );
    }
  };

  const handleSlotClick = (type, index) => {
    if (hasFinished) return;
    if (selected === null) {
      if (type === 'pool' || (type === 'grid' && grid[index] !== null)) {
        setSelected({ type, index });
        playSound(SOUNDS.click);
      }
    } else {
      if (selected.type === type && selected.index === index) setSelected(null);
      else executeMove(selected.type, selected.index, type, index);
    }
  };

  const handleDragStart = (e, type, index) => {
    if (hasFinished) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, index }));
    setSelected({ type, index });
  };

  const handleDrop = (e, targetType, targetIndex) => {
    e.preventDefault();
    if (hasFinished) return;
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      executeMove(data.type, data.index, targetType, targetIndex);
    } catch (err) {}
  };

  const getPieceStyle = (pieceId) => {
    if (pieceId === null || !currentImage) return {};
    const bgX = (pieceId % gridSize) * (100 / (gridSize - 1));
    const bgY = Math.floor(pieceId / gridSize) * (100 / (gridSize - 1));
    return {
      backgroundImage: `url("${currentImage}")`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      backgroundRepeat: 'no-repeat',
      aspectRatio: '1/1',
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[#FFC82C] font-bold">
        Loading test configuration...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start w-full max-w-lg mx-auto m-h-[75vh] select-none [-webkit-tap-highlight-color:transparent]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">Solve the Picture!</h2>
        <p className="text-gray-500 font-bold mt-1 text-sm">Tap or drag pieces to the empty grid</p>
      </div>

      <div
        className="grid gap-1 w-full max-w-[320px] bg-gray-100 p-2 rounded-[2rem] shadow-inner mx-auto mb-8 touch-none select-none [-webkit-tap-highlight-color:transparent]"
        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
      >
        {grid.map((pieceId, i) => (
          <div
            key={`grid-${i}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'grid', i)}
            onClick={() => handleSlotClick('grid', i)}
            className={`w-full rounded-2xl relative overflow-hidden transition-all ${selected?.type === 'grid' && selected?.index === i ? 'ring-4 ring-yellow-400 z-10 scale-95' : 'hover:bg-gray-300'} ${pieceId === null ? 'border-2 border-dashed border-gray-500 aspect-square bg-gray-800/20' : 'shadow-sm cursor-pointer'}`}
            style={getPieceStyle(pieceId)}
          >
            {pieceId !== null && !hasFinished && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, 'grid', i)}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none [-webkit-tap-highlight-color:transparent]"
              />
            )}
          </div>
        ))}
      </div>

      <div
        className={`w-full max-h-[200px] overflow-y-scroll bg-gray-100  p-4 rounded-3xl shadow-sm border border-gray-200 flex flex-wrap justify-center gap-2 touch-none select-none [-webkit-tap-highlight-color:transparent]`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, 'pool', 0)}
        onClick={() => {
          if (selected && selected.type === 'grid' && !hasFinished)
            executeMove('grid', selected.index, 'pool', pool.length);
        }}
      >
        {pool.length === 0 ? (
          <span className="text-gray-400 font-bold text-sm my-auto select-none">Tray empty</span>
        ) : (
          pool.map((pieceId, i) => (
            <div
              key={`pool-${pieceId}`}
              draggable
              onDragStart={(e) => handleDragStart(e, 'pool', i)}
              onClick={(e) => {
                e.stopPropagation();
                handleSlotClick('pool', i);
              }}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl relative overflow-hidden shadow-md cursor-grab active:cursor-grabbing transition-transform ${selected?.type === 'pool' && selected?.index === i ? 'ring-4 ring-yellow-400 scale-90' : 'hover:scale-105'} select-none [-webkit-tap-highlight-color:transparent]`}
              style={getPieceStyle(pieceId)}
            />
          ))
        )}
      </div>
    </div>
  );
};
