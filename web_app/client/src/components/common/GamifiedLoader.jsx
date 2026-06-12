import { SOUNDS } from '@/assets';
import { THEME } from '@/constants/config';
import { Heart, Puzzle, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

const GamifiedLoader = () => {
  const [taps, setTaps] = useState(0);

  const handleTap = () => {
    setTaps((prev) => prev + 1);
    try {
      const audio = new Audio(SOUNDS.click);
      audio.play().catch(() => {});
    } catch (e) {}
  };

  return (
    <div
      className={` ${THEME.bgBeige} flex flex-col flex-1 items-center justify-center p-2 relative overflow-hidden touch-none select-none`}
      onPointerDown={handleTap}
    >
      <div className="absolute top-1/4 left-1/4 animate-bounce text-yellow-400" style={{ animationDuration: '2s' }}>
        <Star size={40} fill="currentColor" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 animate-bounce text-blue-400" style={{ animationDuration: '1.5s' }}>
        <Puzzle size={40} fill="currentColor" />
      </div>
      <div className="absolute top-1/3 right-1/3 animate-ping text-pink-400" style={{ animationDuration: '3s' }}>
        <Heart size={30} fill="currentColor" />
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl text-center z-10 flex flex-col items-center transform transition-transform active:scale-95 cursor-pointer">
        <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
          <div
            className={`absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin`}
            style={{ animationDuration: Math.max(0.2, 1 - taps * 0.05) + 's' }}
          ></div>
          <Sparkles className={`text-yellow-500 ${taps > 0 ? 'animate-ping' : 'animate-pulse'}`} size={48} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">Loading...</h2>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Please Wait</p>

        <div className="bg-blue-50 text-blue-500 font-black px-4 py-2 rounded-full text-sm">Taps: {taps}</div>
      </div>
    </div>
  );
};

export default GamifiedLoader;
