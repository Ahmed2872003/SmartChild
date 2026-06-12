import { ASSETS } from '@/assets';
import InputField from '@/components/common/InputField';
import { Modal } from '@/components/common/Modal';
import { THEME } from '@/constants/config';
import { shareCodePattern } from '@/constants/pattern';
import { useAppContext } from '@/context/AppContext';
import { useRequestCoparent } from '@/hooks/coparent';
import { LinkIcon, User } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export const LinkModal = ({ onClose }) => {
  const requestCoparentMutation = useRequestCoparent();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { shareCode: '' },
  });

  const onSubmit = async (data) => {
    requestCoparentMutation
      .mutateAsync(data.shareCode)
      .then((res) => onClose())
      .catch((err) => {});
  };

  return (
    <Modal onClose={() => !requestCoparentMutation.isPending && onClose()}>
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <LinkIcon size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Link Profile</h2>
        <p className="text-gray-500 font-medium text-sm mb-6">
          Enter a code to request read-only access from the account owner.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            {...register('shareCode', {
              required: 'Required',
              pattern: {
                value: shareCodePattern.pattern,
                message: shareCodePattern.description,
              },
            })}
            disabled={requestCoparentMutation.isPending}
            placeholder="e.g. 8X9P2AH1"
            type="text"
            icon={User}
            error={errors.shareCode?.message}
          />
          <button
            type="submit"
            disabled={requestCoparentMutation.isPending}
            className={`w-full mt-6 ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-4 px-4 rounded-full ${requestCoparentMutation.isPending ? 'opacity-70 cursor-not-allowed' : THEME.primaryYellowHover} transition-colors text-lg flex justify-center items-center gap-2`}
          >
            {requestCoparentMutation.isPending && (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            )}
            {requestCoparentMutation.isPending ? 'Verifying...' : 'Request Link'}
          </button>
        </form>
      </div>
    </Modal>
  );
};
