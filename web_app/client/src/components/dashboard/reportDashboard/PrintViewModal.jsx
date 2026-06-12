import React from 'react';
import { Activity, Printer, Puzzle, X, Brain, Zap, Palette, Ear, Lightbulb, ImageIcon } from 'lucide-react';
import { ASSETS } from '@/assets';
import { MOCK_REPORTS_DATA, OVERALL_RECOMMENDATION } from '@/constants/mockData';
import {
  ColorChartVisual,
  HearingChartVisual,
  MemoryChartVisual,
  MiniLineChart,
  ReactionChartVisual,
} from '@/components/charts/Charts';
import { formatDate } from '@/utils/date';
import { ProbabilityChart } from './ProbabilityChart';

const CATEGORY_UI_MAP = {
  memory: { title: 'Memory', icon: Brain, color: 'bg-purple-500' },
  reactionSpeed: { title: 'Reaction Speed', icon: Zap, color: 'bg-yellow-500' },
  colorExplore: { title: 'Color Exploration', icon: Palette, color: 'bg-pink-500' },
  hearing: { title: 'Hearing', icon: Ear, color: 'bg-blue-500' },
  iq: { title: 'IQ & Logic', icon: Lightbulb, color: 'bg-orange-500' },
  art: { title: 'Art Creation', icon: ImageIcon, color: 'bg-green-500' },
};

const formatPrintDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const datePart = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
  const timePart = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  return `${datePart} • ${timePart}`;
};

const formatEmotionLabel = (key) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' / ');
};

const PrintViewModal = ({ printState, child, onClose }) => {
  if (!printState) return null;

  const { type, data } = printState;

  const renderChart = (key, chartData) => {
    switch (key) {
      case 'memory':
        return <MemoryChartVisual data={chartData.history} />;
      case 'reaction':
        return <ReactionChartVisual data={chartData.history} />;
      case 'color':
        return <ColorChartVisual history={chartData.history} rgb={chartData.rgbProfile} />;
      case 'hearing':
        return <HearingChartVisual data={chartData.history} />;
      default:
        return <MiniLineChart data={chartData.history} colorClass={chartData.textColor} />;
    }
  };

  return (
    <>
      {/* Replaced flex/fixed layout with print:block and print:h-auto to allow natural document flow in PDFs */}
      <div className="fixed inset-0 z-50 bg-gray-500/50 backdrop-blur-sm overflow-y-auto print:bg-transparent print:static print:block print:h-auto print:overflow-visible">
        <div className="min-h-full flex justify-center items-start p-4 sm:p-10 print:p-0 print:block print:h-auto print:min-h-0 print:overflow-visible">
          <div className="fixed top-4 right-4 flex gap-3 z-[60] no-print">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Printer size={20} /> Print PDF
            </button>
            <button
              onClick={onClose}
              className="bg-white text-gray-600 font-bold p-3 rounded-full shadow-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div
            id="printable-modal"
            className="bg-white w-full max-w-4xl shadow-2xl rounded-2xl relative overflow-hidden print:overflow-visible print:rounded-none print:shadow-none print:w-full print:max-w-none print:bg-transparent print:p-0"
          >
            {type === 'overall' ? (
              <div className="p-6 sm:p-10 print:p-0">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-200 pb-6 mb-6 print:flex-row print:pb-4 print:mb-4">
                  <div>
                    <img src={ASSETS.logo} alt="logo" className="w-16 print:w-12" />
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight print:text-3xl">
                      Progress Report
                    </h1>
                    <h2 className="text-xl font-bold text-gray-500 mt-1 print:text-base">Overall Cognitive Growth</h2>
                  </div>
                  <div className="text-left sm:text-right print:text-right flex flex-col items-start sm:items-end print:items-end w-full sm:w-auto">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-xs">
                      Generated On
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-3 print:text-sm print:mb-2">
                      {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-xs">
                      Child Profile
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-3 print:text-sm print:mb-2">
                      {child.name} (Age: {child.age})
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-3 border-b border-gray-100 pb-2 print:text-lg">
                  General System Recommendation
                </h3>
                <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100 text-blue-900 font-medium leading-relaxed text-lg print:text-sm print:p-4 print:mb-6">
                  {OVERALL_RECOMMENDATION}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 print:grid-cols-2 print:gap-4">
                  {Object.entries(MOCK_REPORTS_DATA)
                    .filter(([key]) => key !== 'drawing')
                    .map(([key, chartData]) => {
                      const Icon = chartData.icon;
                      return (
                        <div
                          key={key}
                          className="bg-white p-5 rounded-2xl border-2 border-gray-100 flex flex-col print:break-inside-avoid print:p-3 print:border"
                        >
                          <div className="flex items-center gap-3 mb-3 print:mb-2">
                            <Icon size={18} className={chartData.textColor} />
                            <span className="font-black text-gray-900 text-lg print:text-base">{chartData.title}</span>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 flex-none print:max-h-48 flex items-center justify-center overflow-hidden">
                            {renderChart(key, chartData)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-10 print:p-0">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-200 pb-6 mb-6 print:flex-row print:pb-4 print:mb-4">
                  <div>
                    <img src={ASSETS.logo} alt="logo" className="w-16 print:w-12" />
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight print:text-3xl">
                      Assessment Result
                    </h1>
                    <h2 className="text-2xl font-bold text-indigo-500 mt-2 flex items-center gap-2 print:text-xl">
                      <Puzzle size={20} /> Daily Assessment
                    </h2>
                  </div>
                  <div className="text-left sm:text-right print:text-right w-full sm:w-auto">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-xs">
                      Assessment Date
                    </div>
                    <div className="text-lg font-bold text-gray-800 mb-4 sm:mb-0 print:text-sm print:mb-2">
                      {formatDate(new Date(data.report.createdAt))}
                    </div>
                    <div className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-xs print:mt-2">
                      Child Profile
                    </div>
                    <div className="text-lg font-bold text-gray-800 print:text-sm">
                      {child.name} (Age: {child.age})
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl mb-6 border border-blue-100 text-blue-900">
                  <h3 className="font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" /> System Recommendation
                  </h3>
                  <p className="text-sm font-medium leading-relaxed">
                    {data?.report?.system_recommendation || 'No recommendation available for this session.'}
                  </p>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-4 border-b border-gray-100 pb-2 print:text-lg">
                  Detailed Test Results
                </h3>
                <div className="space-y-4 mb-10 print:space-y-3">
                  {data?.report?.results &&
                    Object.entries(data.report.results)
                      .filter(([key]) => CATEGORY_UI_MAP[key])
                      .sort(([keyA], [keyB]) => (keyA === 'art' ? -1 : keyB === 'art' ? 1 : 0))
                      .map(([key, resultData]) => {
                        const uiConfig = CATEGORY_UI_MAP[key];
                        const IconComponent = uiConfig.icon;

                        return (
                          <div
                            key={key}
                            className="bg-white p-5 rounded-2xl border-2 border-gray-100 print:break-inside-avoid print:p-4 print:border"
                          >
                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${uiConfig.color} text-white print:p-1.5 print:print-color-adjust-exact`}
                                >
                                  <IconComponent size={18} />
                                </div>
                                <span className="font-black text-gray-900 text-lg print:text-base">
                                  {uiConfig.title}
                                </span>
                              </div>
                              {resultData.averageAccuracy !== undefined && (
                                <div className="text-2xl font-black text-gray-900 print:text-xl">
                                  {Math.round(resultData.averageAccuracy)}%
                                </div>
                              )}
                            </div>

                            {key === 'art' ? (
                              <div className="flex flex-col sm:flex-row gap-6 print:flex-row print:gap-4 items-start">
                                <div className="w-full sm:w-40 h-40 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 print:w-32 print:h-32">
                                  {resultData.image ? (
                                    <img
                                      src={`${import.meta.env.VITE_IMG_BASE_URL}/${resultData.image}`}
                                      alt="Artwork"
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                      <ImageIcon size={32} />
                                    </div>
                                  )}
                                </div>
                                <ProbabilityChart classificationData={resultData.classifiction} />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
                                {resultData.averageAccuracy !== undefined && (
                                  <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-[10px]">
                                      Accuracy
                                    </div>
                                    <div className="text-xl font-black text-gray-800 print:text-lg">
                                      {Math.round(resultData.averageAccuracy)}%
                                    </div>
                                  </div>
                                )}
                                {resultData.averageSpeedMs !== undefined && (
                                  <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-[10px]">
                                      Avg Speed
                                    </div>
                                    <div className="text-xl font-black text-gray-800 print:text-lg">
                                      {resultData.averageSpeedMs === 0
                                        ? 'N/A'
                                        : `${Math.round(resultData.averageSpeedMs)}ms`}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintViewModal;
