import { difficultyWeights } from '@/constants/testConfig';
import { useGetCurrentChild } from '@/hooks/child';
import { useGetDailyReports } from '@/hooks/report';
import { formatDate } from '@/utils/date';
import { keepPreviousData } from '@tanstack/react-query';
import { ChevronRight, FileText, Loader2, Puzzle } from 'lucide-react';
import { useEffect, useState } from 'react';

const historyLimit = 5;

const ReportsSection = ({ child, onSelectHistoryItem }) => {
  const [page, setPage] = useState(1);
  const [accumulatedAssesmentReports, setaccumulatedAssesmentReports] = useState([]);

  const { data, isLoading, isFetching, isError } = useGetDailyReports(
    {
      params: { childId: child.id },
      query: { page, limit: historyLimit },
    },
    {
      placeholderData: keepPreviousData,
      staleTime: Infinity,
    },
  );

  useEffect(() => {
    if (data?.data) {
      setaccumulatedAssesmentReports((prev) => {
        const existingIds = new Set(prev.map((assessmentReport) => assessmentReport.report.id));
        const newAssessmentReports = data.data.filter(
          (assessmentReport) => !existingIds.has(assessmentReport.report.id),
        );
        return [...prev, ...newAssessmentReports];
      });
    }
  }, [data]);

  const calculateOverallScore = (results) => {
    if (!results) return 0;
    const categories = ['memory', 'reactionSpeed', 'colorExplore', 'hearing', 'iq'];
    let totalScore = 0;
    let weightSum = 0;

    categories.forEach((cat) => {
      const catAccuracy = results[cat].averageAccuracy;
      const catDifficulty = results[cat].overallDifficulty;

      if (results[cat]?.averageAccuracy !== undefined) {
        totalScore += catAccuracy * difficultyWeights[catDifficulty];
        weightSum += difficultyWeights[catDifficulty];
      }
    });

    return weightSum > 0 ? Math.round(totalScore / weightSum) : 0;
  };

  if (isError) {
    return <div className="text-red-500 font-bold">Failed to load assessment history.</div>;
  }

  return (
    <section className="print:hidden">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <FileText size={24} className="text-pink-500" /> Assessment History
      </h2>
      {isLoading && page === 1 ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-[#FFC82C]" size={32} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {accumulatedAssesmentReports.length === 0 ? (
              <p className="p-8 text-center text-gray-500 font-bold">No assessments found.</p>
            ) : (
              accumulatedAssesmentReports.map((assessmentReport) => {
                const report = assessmentReport.report;
                const score = calculateOverallScore(report.results);
                const date = formatDate(new Date(report.createdAt));

                return (
                  <div
                    key={report.id}
                    onClick={() => onSelectHistoryItem(assessmentReport)}
                    className="p-5 md:p-6 border-b border-gray-50 flex items-center justify-between gap-4 hover:bg-gray-50 cursor-pointer transition-colors group last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Puzzle size={20} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg">Daily Assessment</h4>
                        <p className="text-sm text-gray-500 font-bold">{date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:inline-block bg-gray-100 text-gray-700 text-xs font-black px-3 py-1.5 rounded-lg border border-gray-200">
                        Score: {score}%
                      </span>
                      <ChevronRight className="text-gray-300 group-hover:text-gray-600 transition-colors" size={20} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {data?.pagination?.hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isFetching}
                className="px-8 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-black rounded-2xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isFetching && page > 1 ? <Loader2 className="animate-spin text-[#FFC82C]" size={32} /> : 'See More'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReportsSection;
