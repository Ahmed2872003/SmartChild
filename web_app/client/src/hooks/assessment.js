import { getAssessmentTests, getAssignedAssessment, saveTestResults } from '@/services/assessment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useGetAssignedAssessment = () =>
  useQuery({
    queryFn: getAssignedAssessment,
    queryKey: ['assignedAssessment'],
    staleTime: Infinity,
  });

const useGetAssessmentTests = (assessmentId, queryConfig = {}) =>
  useQuery({
    queryFn: () => getAssessmentTests({ assessmentId }),
    queryKey: ['assessmentTests', assessmentId],
    ...queryConfig,
  });

const useSaveTestResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTestResults,
    onSuccess: (data) => {
      if (data.assessmentState.status === 'completed') {
        const { assessmentState } = data;

        queryClient.invalidateQueries({ queryKey: ['assignedAssessment'] });

        queryClient.setQueryData(['currentChild'], (oldChildData) => {
          return {
            ...oldChildData,
            num_of_stars: oldChildData.num_of_stars + assessmentState.completionPayload.TotalStarsEarned,
          };
        });
      }
    },
  });
};

export { useGetAssignedAssessment, useGetAssessmentTests, useSaveTestResults };
