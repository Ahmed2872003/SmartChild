import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { useReplyCoparent } from '@/hooks/coparent';
import { useEffect } from 'react';

const CoparentActionPage = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const action = searchParams.get('action');

  const replyCoparentMutation = useReplyCoparent();

  useEffect(() => {
    replyCoparentMutation.mutateAsync({ token, action }).catch((err) => {});
  }, []);

  const renderLoading = () => (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      <h2 className="text-2xl font-black text-gray-900">Processing Request...</h2>
      <p className="text-gray-500 font-medium">Please wait while we verify this link.</p>
    </div>
  );

  const renderSuccessAccept = () => (
    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-2">
        <CheckCircle className="w-8 h-8 text-[#4ade80]" />
      </div>
      <h2 className="text-2xl font-black text-gray-900">Successfully Linked!</h2>
      <p className="text-gray-500 font-medium text-center px-4">
        You have approved the read-only access request. The co-parent can now view this profile's progress.
      </p>
      <button
        onClick={() => navigate('/parent/dashboard')}
        className="mt-6 w-full bg-[#ffc107] text-black font-bold py-3 px-8 rounded-full hover:bg-[#E5B427] transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );

  const renderSuccessDeny = () => (
    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
        <XCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-black text-gray-900">Request Denied</h2>
      <p className="text-gray-500 font-medium text-center px-4">
        You have declined the link request. The requester will not be granted access to this profile.
      </p>
      <button
        onClick={() => navigate('/parent/dashboard')}
        className="mt-6 w-full bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
      >
        Return to Dashboard
      </button>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center gap-4 animate-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-black text-gray-900">Link Invalid or Expired</h2>
      <p className="text-gray-500 font-medium text-center px-4">
        This link is no longer valid or an error occurred. If you still need to approve this request, please ask the
        user to send a new one.
      </p>
      <button
        onClick={() => navigate('/parent/dashboard')}
        className="mt-6 w-full bg-[#ffc107] text-black font-bold py-3 px-8 rounded-full hover:bg-[#E5B427] transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#fafafa]">
      <div className="bg-white max-w-md w-full rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col items-center text-center relative overflow-hidden">
        {replyCoparentMutation.isPending && renderLoading()}

        {replyCoparentMutation.isSuccess && action === 'accept' && renderSuccessAccept()}

        {replyCoparentMutation.isSuccess && action === 'deny' && renderSuccessDeny()}

        {replyCoparentMutation.isError && renderError()}
      </div>
    </div>
  );
};

export default CoparentActionPage;
