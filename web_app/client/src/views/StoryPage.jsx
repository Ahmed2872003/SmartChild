import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useGetStories } from '@/hooks/story';
import GamifiedLoader from '@/components/common/GamifiedLoader';
import { THEME } from '@/constants/config';
import { useJwt } from '@/context/JwtProvider';

const StoryPage = () => {
  const navigate = useNavigate();
  const { decodedJwt } = useJwt();

  const { data, isLoading, isError } = useGetStories({ childId: decodedJwt?.childId }, { staleTime: Infinity });

  const stories = data?.storyList || [];

  if (isLoading) {
    return (
      <div className={`flex min-h-screen ${THEME.bgBeige} relative overflow-hidden`}>
        <GamifiedLoader />
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${THEME.bgBeige} font-sans relative overflow-hidden`}>
      {/* Adjusted wrapper padding for mobile: px-4 py-6 instead of p-6 py-10 */}
      <div className="relative flex-1 z-10 max-w-6xl mx-auto w-full px-4 py-6 md:p-6 md:py-10 flex flex-col">
        {/* Header: Reduced bottom margin and scaled down UI elements for mobile */}
        <header className="flex justify-between items-center mb-8 md:mb-12 animate-in slide-in-from-top duration-700">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border-2 border-gray-100 text-gray-600 px-3 py-2 md:px-5 md:py-3 rounded-full hover:bg-gray-50 shadow-sm transition-transform flex items-center gap-1 md:gap-2 font-bold text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Back to Play</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-full font-black text-lg md:text-2xl flex items-center shadow-sm border-2 border-gray-100 text-purple-600">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" /> Story Time
          </div>
        </header>

        {/* Title: Scaled text down to 4xl on mobile, 5xl on tablet, 6xl on desktop */}
        <div className="text-center mb-8 md:mb-12 animate-in slide-in-from-top duration-700 delay-100">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight mb-2 md:mb-4">
            Pick a Story! 📚
          </h1>
        </div>

        {isError && (
          <div className="text-center bg-red-100 text-red-600 p-4 md:p-6 rounded-2xl md:rounded-3xl font-bold text-lg md:text-xl">
            Oops! We couldn't load the stories right now. Let's try again later!
          </div>
        )}

        {!isError && stories.length === 0 && (
          <div className="text-center bg-white p-6 md:p-10 rounded-2xl md:rounded-3xl font-bold text-lg md:text-xl shadow-sm">
            No stories found for today.
          </div>
        )}

        {/* Grid: Reduced gap on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 pb-10">
          {stories.map((story, index) => (
            <div
              key={story._id}
              className="bg-white rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 shadow-sm flex flex-col border-b-[5px] md:border-b-[6px] border-gray-200 animate-in slide-in-from-bottom duration-700 hover:-translate-y-2 transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Cover Image */}
              <div className="bg-purple-50 rounded-2xl md:rounded-[2rem] mb-4 md:mb-6 overflow-hidden aspect-[4/3] flex items-center justify-center border-[3px] md:border-4 border-purple-100">
                <img
                  src={`${import.meta.env.VITE_API_URL}${story.cover}`}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl md:text-2xl font-black text-gray-800 leading-tight mb-2 line-clamp-2">
                  {story.title}
                </h2>
                <div className="inline-block bg-purple-100 text-purple-600 text-xs md:text-sm font-bold px-3 py-1 rounded-full w-max mb-5 md:mb-6 uppercase tracking-wider">
                  {story.category}
                </div>

                {/* Buttons: Scaled padding, border, and text size for mobile */}
                <div className="mt-auto grid grid-cols-2 gap-2 md:gap-3">
                  <a
                    href={`${import.meta.env.VITE_API_URL}${story.filePath.en}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#3b82f6] text-white py-2.5 md:py-3 px-2 md:px-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-[#2563eb] transition-colors border-b-[3px] md:border-b-4 border-[#1d4ed8] flex items-center justify-center gap-1.5 md:gap-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform text-sm md:text-base">🇬🇧</span> EN
                  </a>

                  <a
                    href={`${import.meta.env.VITE_API_URL}${story.filePath.ar}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#10b981] text-white py-2.5 md:py-3 px-2 md:px-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:bg-[#059669] transition-colors border-b-[3px] md:border-b-4 border-[#047857] flex items-center justify-center gap-1.5 md:gap-2 group"
                    dir="rtl"
                  >
                    <span className="group-hover:scale-110 transition-transform text-sm md:text-base">🇪🇬</span> AR
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;
