import { formatEmotionLabel } from '@/utils/TextFormat';
import { PieChart } from 'lucide-react';

const ProbabilityChart = ({ classificationData }) => {
  if (!classificationData || !classificationData.probabilities) return null;

  const { probabilities, emotion: dominantEmotion } = classificationData;

  // Convert the object to an array and sort it highest-to-lowest
  const sortedProbabilities = Object.entries(probabilities).sort(([, valA], [, valB]) => valB - valA);

  return (
    <div className="space-y-2.5 flex-1 w-full min-w-[150px]">
      <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
        <PieChart size={12} /> Emotion Analysis
      </h4>
      {sortedProbabilities.map(([key, value]) => {
        const percentage = Math.round(value * 100);
        const isDominant = key === dominantEmotion;

        return (
          <div key={key} className="text-xs">
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-bold ${isDominant ? 'text-indigo-600' : 'text-gray-700'}`}>
                {formatEmotionLabel(key)}
              </span>
              <span className={`font-black text-[10px] ${isDominant ? 'text-indigo-700' : 'text-gray-900'}`}>
                {percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative border border-gray-200">
              <div
                // Dynamically color the dominant emotion differently
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  isDominant ? 'bg-indigo-500' : 'bg-gray-400'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { ProbabilityChart };
