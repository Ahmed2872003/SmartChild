import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEME } from '@/constants/config';
import { useAppContext } from '@/context/AppContext';
import {
  Archive,
  ArrowLeft,
  Brain,
  Ear,
  Hand,
  Layers,
  Music,
  Palette,
  PenTool,
  Puzzle,
  Search,
  Smile,
  Star,
  Zap,
} from 'lucide-react';
import { useGetTests, useGetTestsConfig } from '@/hooks/test';
import GamifiedLoader from '@/components/common/GamifiedLoader';

const CATEGORY_VISUALS = {
  Memory: { icon: Brain, color: 'bg-[#86D293]', border: 'border-[#5dbb6d]' },
  'Reaction Speed': { icon: Zap, color: 'bg-[#ff5e5e]', border: 'border-[#e65a5a]' },
  'Color Explore': { icon: Palette, color: 'bg-[#60A5FA]', border: 'border-[#3b82f6]' },
  Hearing: { icon: Ear, color: 'bg-[#a78bfa]', border: 'border-[#8b5cf6]' },
  IQ: { icon: Puzzle, color: 'bg-[#F472B6]', border: 'border-[#db2777]' },
  Art: { icon: PenTool, color: 'bg-[#fbbf24]', border: 'border-[#f59e0b]' },
};

const GAME_ICONS = {
  Matching: Brain,
  'visual Sequence': Layers,
  'Bug Catch': Hand,
  'Light Reaction': Zap,
  'Colors Identification': Palette,
  'Color Sorting': Archive,
  'Sound Identification': Ear,
  'Path Sound': Music,
  Puzzle: Puzzle,
  'Odd One Out': Search,
  Drawing: PenTool,
};

export const FreePlayMenu = () => {
  const navigate = useNavigate();
  const { globalStars } = useAppContext();
  const [difficulty, setDifficulty] = useState('easy');
  const [activeCategory, setActiveCategory] = useState(null);

  const testsQuery = useGetTests();

  const testsData = testsQuery.data;

  const testConfigQuery = useGetTestsConfig();

  const { categories, gamesByCategory } = useMemo(() => {
    if (!testsData || !Array.isArray(testsData)) {
      return { categories: [], gamesByCategory: {} };
    }

    const cats = [];
    const gamesByCat = {};

    testsData.forEach((test) => {
      const catName = test.category.name;

      if (!gamesByCat[catName]) {
        gamesByCat[catName] = [];

        const visuals = CATEGORY_VISUALS[catName] || { icon: Star, color: 'bg-gray-400', border: 'border-gray-500' };

        cats.push({
          id: catName,
          title: catName,
          desc: test.category.description,
          ...visuals,
        });
      }

      gamesByCat[catName].push({
        id: test.id,
        title: test.name,
        desc: test.description,
        icon: GAME_ICONS[test.name] || Star,
      });
    });

    return { categories: cats, gamesByCategory: gamesByCat };
  }, [testsData]);

  const isLoading = testsQuery.isLoading || testConfigQuery.isLoading;

  return (
    <div
      className={`min-h-screen ${THEME.bgBeige} font-sans relative select-none [-webkit-tap-highlight-color:transparent]`}
    >
      <div className="min-h-screen max-w-6xl mx-auto p-6 py-10 flex flex-col">
        <header className="flex justify-between items-center mb-10">
          <button
            onClick={() => (activeCategory ? setActiveCategory(null) : navigate('/child/dashboard'))}
            className="bg-white border-2 border-gray-100 text-gray-600 px-5 py-3 rounded-full hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2 font-bold"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="bg-white px-6 py-3 rounded-full font-black text-2xl flex items-center shadow-sm border-2 border-gray-100 text-[#4ade80]">
            <Smile size={24} className="mr-2" /> Free Play
          </div>
        </header>
        {isLoading ? (
          <GamifiedLoader />
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                {activeCategory ? 'Choose a Game!' : 'Choose a Category!'}
              </h1>
            </div>

            {/* Note: changed 'drawing' to 'Art' to match the new API category name */}
            {activeCategory && activeCategory !== 'Art' && (
              <div className="flex justify-center mb-8 animate-in fade-in duration-500">
                <div className="bg-white rounded-full p-1.5 shadow-sm flex border border-gray-100 max-w-md w-full">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex-1 py-3 rounded-full font-black text-sm capitalize transition-all ${difficulty === level ? THEME.primaryYellow + ' text-black shadow-md scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!activeCategory ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`${cat.color} text-white p-8 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 ${cat.border}`}
                  >
                    <div className="bg-white/20 p-6 rounded-full mb-4">
                      <cat.icon size={48} fill="currentColor" />
                    </div>
                    <h2 className="text-3xl font-black mb-2">{cat.title}</h2>
                    <p className="text-white/80 font-bold text-sm">{cat.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-500">
                {gamesByCategory[activeCategory]?.map((game) => {
                  const activeCatDetails = categories.find((c) => c.id === activeCategory);
                  return (
                    <button
                      key={game.id}
                      onClick={() =>
                        navigate('/child/free-play-game', { state: { gameId: game.title, activeCategory, difficulty } })
                      }
                      className={`${activeCatDetails.color} text-white p-6 rounded-[2rem] shadow-sm hover:-translate-y-2 transition-all flex flex-col items-center text-center border-b-8 ${activeCatDetails.border}`}
                    >
                      <div className="bg-white/20 p-4 rounded-full mb-4">
                        <game.icon size={40} fill="currentColor" />
                      </div>
                      <h2 className="text-xl font-black mb-1">{game.title}</h2>
                      <p className="text-white/80 font-bold text-xs">{game.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
