import { Modal } from '@/components/common/Modal';
import { THEME } from '@/constants/config';
import { useSwitchToChild } from '@/hooks/auth';
import { Play } from 'lucide-react';

export const PlayWarningModal = ({ onClose, profile }) => {
  const switchToChildMutation = useSwitchToChild(profile);

  const handleContinue = () => {
    switchToChildMutation.mutate({ childId: profile.id });
  };

  return (
    <Modal onClose={onClose}>
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play size={32} fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Enter Child Mode?</h2>
        <p className="text-gray-500 font-medium text-sm mb-8">
          You are about to switch to the child's interface. To exit back to the Parent Dashboard later, you will need to
          enter your parent password.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={switchToChildMutation.isPending}
            className={`flex-1 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-3.5 rounded-full hover:bg-[#E5B427] transition-colors flex items-center justify-center gap-2`}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};
