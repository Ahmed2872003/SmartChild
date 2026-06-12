import React from 'react';
import {
  Activity,
  Download,
  Puzzle,
  X,
  Brain,
  Zap,
  Palette,
  Ear,
  Lightbulb,
  ImageIcon,
  PieChart, // Imported for chart section header
} from 'lucide-react';
import { THEME } from '@/constants/config';
import { formatDate } from '@/utils/date';
import { ProbabilityChart } from './ProbabilityChart';
import { DifficultyBadge, DifficultyLabel } from '@/components/common/DifficultyLabel';

// Map backend keys to human-readable titles, icons, and themes
const CATEGORY_UI_MAP = {
  memory: {
    title: 'Memory',
    icon: Brain,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    barColor: 'bg-purple-500',
  },
  reactionSpeed: {
    title: 'Reaction Speed',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    barColor: 'bg-yellow-500',
  },
  colorExplore: {
    title: 'Color Exploration',
    icon: Palette,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    barColor: 'bg-pink-500',
  },
  hearing: { title: 'Hearing', icon: Ear, color: 'text-blue-500', bgColor: 'bg-blue-50', barColor: 'bg-blue-500' },
  iq: {
    title: 'IQ & Logic',
    icon: Lightbulb,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    barColor: 'bg-orange-500',
  },
  art: {
    title: 'Art Creation',
    icon: ImageIcon,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    barColor: 'bg-green-500',
  },
};

const HistoryDetailModal = ({ assessmentReport, onClose, onDownload }) => {
  if (!assessmentReport) return null;

  const { report } = assessmentReport;

  const reportResults = report.results || {};
  if (!reportResults.art) reportResults.art = {};

  // Filter keys and prioritize ART to appear first
  const keys = Object.keys(reportResults).filter((key) => CATEGORY_UI_MAP[key]);
  const sortedKeys = keys.includes('art') ? ['art', ...keys.filter((k) => k !== 'art')] : keys;

  return (
    <>
      <style type="text/css">
        {`
          @media screen {
            body { overflow: hidden !important; }
          }
        `}
      </style>

      {/* Added print:static, print:bg-transparent, print:p-0, print:block, print:h-auto to flatten the overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 print:static print:bg-transparent print:p-0 print:block print:h-auto">
        {/* Added print:max-w-none, print:shadow-none, print:border-none, print:overflow-visible to let content flow naturally */}
        <div
          className={`${THEME.cardWhite} w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:shadow-none print:border-none print:overflow-visible print:p-0`}
        >
          {/* Added print:hidden to Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full print:hidden"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pr-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Puzzle size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Daily Assessment</h2>
              <p className="text-gray-500 font-bold text-sm">{formatDate(new Date(report.createdAt))}</p>
            </div>
          </div>

          {/* System Recommendation */}
          {report.system_recommendation && (
            <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100 text-blue-900">
              <h3 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity size={16} className="text-blue-500" /> System Recommendation
              </h3>
              <p className="text-sm font-medium leading-relaxed">{report.system_recommendation}</p>
            </div>
          )}

          {/* Detailed Results */}
          <div className="mb-8 space-y-4">
            <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wider">Detailed Test Results</h3>

            {sortedKeys.map((key) => {
              const resultData = reportResults[key];
              const uiConfig = CATEGORY_UI_MAP[key];
              const IconComponent = uiConfig.icon;

              if (key === 'art') {
                const { classification } = resultData;

                return (
                  <div
                    key={key}
                    className={`bg-gray-50 p-5 rounded-xl border border-gray-100 print:break-inside-avoid`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-gray-800 flex items-center gap-2">
                        <IconComponent size={18} className={uiConfig.color} />
                        {uiConfig.title}
                      </div>
                      <div className="text-xs font-bold text-gray-400">Artwork Analysis</div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5 p-3.5 bg-white rounded-xl border border-gray-100">
                      {/* The Image */}
                      <div className="w-full sm:w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        {resultData.image ? (
                          <img
                            src={`${import.meta.env.VITE_IMG_BASE_URL}/${resultData.image}`}
                            alt="Child's Art"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                            <ImageIcon size={32} />
                            <span className="text-[10px] font-bold">Image Saved</span>
                          </div>
                        )}
                      </div>

                      {/* The Chart Component */}
                      <ProbabilityChart classificationData={classification} />
                    </div>
                  </div>
                );
              }

              // Standard Metric Rendering for other categories
              return (
                <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-100 print:break-inside-avoid">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-gray-800 flex items-center gap-2">
                      <IconComponent size={18} className={uiConfig.color} />
                      {uiConfig.title}
                      <DifficultyBadge difficulty={resultData.overallDifficulty} className="text-[10px] font-bold" />
                    </div>
                    {resultData.averageAccuracy !== undefined && (
                      <div className="font-black text-gray-900">{Math.round(resultData.averageAccuracy)}%</div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {resultData.averageAccuracy !== undefined && (
                      <div className="bg-white p-2 rounded-lg border border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Accuracy</span>
                        <span className="text-sm font-black text-gray-800">
                          {Math.round(resultData.averageAccuracy)}%
                        </span>
                      </div>
                    )}
                    {resultData.averageSpeedMs !== undefined && (
                      <div className="bg-white p-2 rounded-lg border border-gray-100 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Avg Speed</span>
                        <span className="text-sm font-black text-gray-800">
                          {resultData.averageSpeedMs === 0 ? 'N/A' : `${Math.round(resultData.averageSpeedMs)}ms`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Added print:hidden to Action Buttons */}
          <div className="flex gap-3 mt-6 print:hidden">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onDownload(assessmentReport)}
              className={`flex-[2] ${THEME.primaryYellow} ${THEME.textBlack} font-black py-3.5 rounded-full hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2`}
            >
              <Download size={18} /> Download Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryDetailModal;
