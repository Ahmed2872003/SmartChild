import { Modal } from '@/components/common/Modal';
import { useAppContext } from '@/context/AppContext';
import { useDeleteChild } from '@/hooks/child';
import { Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const DeleteModal = ({ onClose, profile }) => {
  const deleteChildMutation = useDeleteChild();

  const handleDelete = async () => {
    if (!profile) return;

    deleteChildMutation
      .mutateAsync(profile.id)
      .then((res) => onClose())
      .catch((err) => {});
  };

  return (
    <Modal onClose={() => !deleteChildMutation.isPending && onClose()}>
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Delete Profile?</h2>
        <p className="text-gray-500 font-medium text-sm mb-8">
          This action cannot be undone. All data and assessment history for <b>{profile?.name}</b> will be permanently
          removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleteChildMutation.isPending}
            className="flex-1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteChildMutation.isPending}
            className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {deleteChildMutation.isPending && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {deleteChildMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
