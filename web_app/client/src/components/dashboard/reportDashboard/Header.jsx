import { Angry, Calendar, Download, Smile, TrendingDown, TrendingUp, Frown, Meh } from 'lucide-react';
import { THEME } from '@/constants/config';
import { formatDate } from '@/utils/date';
import { formatEmotionLabel } from '@/utils/TextFormat';

const getEmotionConfig = (feeling) => {
  const str = (feeling || '').toLowerCase();

  if (str.includes('anger') || str.includes('aggression')) {
    return { icon: Angry, className: 'bg-red-50 text-red-700 border-red-100' };
  }
  if (str.includes('anxiety') || str.includes('depression')) {
    return { icon: Frown, className: 'bg-blue-50 text-blue-700 border-blue-100' };
  }
  if (str.includes('happy') || str.includes('happiness')) {
    return { icon: Smile, className: 'bg-green-50 text-green-700 border-green-100' };
  }

  return { icon: Meh, className: 'bg-gray-50 text-gray-700 border-gray-100' };
};

const DashboardHeader = ({ child, reportsData, onPrintOverall }) => {
  const overallReport = reportsData?.overallReport || {};

  const isNegativeGrowth = overallReport.overall_growth_percentage < 0;

  // Fetch the dynamic styles and icon for the current feeling
  const { icon: EmotionIcon, className: emotionClass } = getEmotionConfig(overallReport.overall_feeling);

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-gray-200 pb-8 mb-8">
      <div className="flex items-center gap-6">
        <img
          src={`${import.meta.env.VITE_IMG_BASE_URL}/${child.photo}`}
          className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-sm object-cover"
          alt={child.name}
        />
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">{child.name}'s Progress</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2 mb-3">
            <Calendar size={16} /> Last Updated: {formatDate(new Date(overallReport.updatedAt))}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={` ${isNegativeGrowth ? 'text-red-700 border-red-100 bg-red-50' : 'text-green-700 border-green-100 bg-green-50'} font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 border  w-fit text-sm`}
            >
              {isNegativeGrowth ? <TrendingDown size={16} /> : <TrendingUp size={16} />} Overall Growth:{' '}
              {overallReport.overall_growth_percentage}%
            </div>

            {/* 👇 Adaptive Emotion Container */}
            <div
              className={`${emotionClass} font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 border w-fit text-sm`}
            >
              <EmotionIcon size={16} /> Overall Feeling: {formatEmotionLabel(overallReport.overall_feeling)}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onPrintOverall}
        className={`print:hidden ${THEME.primaryYellow} text-black font-black px-6 py-4 rounded-full shadow-sm hover:-translate-y-1 transition-all flex items-center gap-2 text-lg`}
      >
        <Download size={22} /> Overall Report
      </button>
    </div>
  );
};

export default DashboardHeader;
