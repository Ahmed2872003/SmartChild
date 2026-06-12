import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import DashboardHeader from '@/components/dashboard/reportDashboard/Header';
import ProgressSection from '@/components/dashboard/reportDashboard/ProgressSection';
import ReportsSection from '@/components/dashboard/reportDashboard/HistorySection';
import HistoryDetailModal from '@/components/dashboard/reportDashboard/HistoryDetailModal';
import { useGetOverallReport } from '@/hooks/report';
import GamifiedLoader from '@/components/common/GamifiedLoader';

const ReportsDashboard = () => {
  const { state } = useLocation();

  if (!state || !state.child) return <Navigate to="/parent/dashboard" />;

  const [selectedAssessmentReport, setselectedAssessmentReport] = useState(null);

  const selectedChild = state.child;

  const getOverallReportQuery = useGetOverallReport({ params: { childId: selectedChild.id } });

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (!getOverallReportQuery.isSuccess) return <GamifiedLoader />;

  return (
    <>
      {/* Global Print Styles */}
      <style>{`
        @media print { body { background-color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } @page { margin: 15mm; size: A4 portrait; } }
          
      `}</style>

      {/* Main Dashboard - Hides during print ONLY if a modal is open */}
      <div className={`${selectedAssessmentReport ? 'print:hidden' : 'block'}`}>
        <DashboardHeader child={selectedChild} reportsData={getOverallReportQuery.data} onPrintOverall={handlePrint} />

        <ProgressSection reportsData={getOverallReportQuery.data} selectedChild={selectedChild} />

        <ReportsSection child={selectedChild} onSelectHistoryItem={setselectedAssessmentReport} />
      </div>

      {/* Assessment Modal - Prints cleanly without the background */}
      {selectedAssessmentReport && (
        <HistoryDetailModal
          assessmentReport={selectedAssessmentReport}
          onClose={() => setselectedAssessmentReport(null)}
          onDownload={handlePrint}
        />
      )}
    </>
  );
};

export default ReportsDashboard;
