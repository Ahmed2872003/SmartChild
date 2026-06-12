import { THEME } from '@/constants/config';
import { LinkIcon, Plus, Smile } from 'lucide-react';
import { useState } from 'react';

import { ProfileCard } from '@/components/dashboard/parentDashboard/ProfileCard';

import { ProfileModal, LinkModal, PlayWarningModal, DeleteModal } from '@/components/dashboard/parentDashboard/modals';
import { useGetChildren } from '@/hooks/child';
import GamifiedLoader from '@/components/common/GamifiedLoader';

const ParentDashboard = () => {
  const childrenQuery = useGetChildren();

  const [activeModal, setActiveModal] = useState(null); // null, "ADD", "EDIT", "LINK", "DELETE", "PLAY_WARNING"
  const [selectedProfile, setSelectedProfile] = useState(null);

  const openModal = (type, profile = null) => {
    setSelectedProfile(profile);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProfile(null);
  };

  if (!childrenQuery.isSuccess) return <GamifiedLoader />;

  const {
    data: { children: parentChild },
  } = childrenQuery;

  const ownerProfiles = parentChild.filter((pc) => pc.is_owner);
  const linkedProfiles = parentChild.filter((pc) => !pc.is_owner);

  return (
    <>
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage profiles and view progress</p>
        </div>
        <button
          onClick={() => openModal('ADD')}
          className={`${THEME.primaryYellow} ${THEME.textBlack} font-bold px-6 py-3 rounded-full hover:bg-[#E5B427] transition-colors shadow-sm`}
        >
          + Create Child
        </button>
      </div>

      {/* Managed Profiles Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">Managed Profiles</h2>
        {ownerProfiles.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-sm">
              <Smile size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Profiles Yet</h3>
            <p className="text-gray-500 font-medium max-w-sm mb-6">
              Get started by creating a profile for your child to track their progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ownerProfiles.map((pc) => (
              <ProfileCard
                key={pc.child.id}
                profile={pc.child}
                isLinked={!pc.is_owner}
                onEdit={() => openModal('EDIT', pc.child)}
                onDelete={() => openModal('DELETE', pc.child)}
                onPlay={() => openModal('PLAY_WARNING', pc.child)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Linked Profiles Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">Linked Profiles</h2>

          {/* Mobile-only Link button - only shows if there are profiles (empty state has its own button) */}
          {linkedProfiles.length > 0 && (
            <button
              onClick={() => openModal('LINK')}
              className="sm:hidden bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full"
            >
              <LinkIcon size={18} /> Link Profile
            </button>
          )}
        </div>

        {linkedProfiles.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-sm">
              <LinkIcon size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Linked Profiles</h3>
            <p className="text-gray-500 font-medium max-w-sm mb-6">
              Connect to a read-only profile using a unique connection code from another parent.
            </p>
            <button
              onClick={() => openModal('LINK')}
              className="bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <LinkIcon size={16} /> Link a Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {linkedProfiles.map((pc) => (
              <ProfileCard
                key={pc.child.id}
                profile={pc.child}
                isLinked={!pc.is_owner}
                onPlay={() => openModal('PLAY_WARNING', pc.child)}
              />
            ))}

            {/* The large dashed card is hidden on mobile (sm:hidden reverse -> hidden sm:flex) */}
            <div
              onClick={() => openModal('LINK')}
              className="hidden sm:flex border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-[2rem] p-8 flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-all min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 text-gray-300 shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={24} strokeWidth={3} />
              </div>
              <h3 className="text-xl font-bold text-gray-700">Link Profile</h3>
              <p className="text-sm text-gray-400 font-medium mt-1">Connect a read-only child profile</p>
            </div>
          </div>
        )}
      </section>

      {['ADD', 'EDIT'].includes(activeModal) && (
        <ProfileModal mode={activeModal} initialData={selectedProfile} onClose={closeModal} />
      )}

      {activeModal === 'LINK' && <LinkModal onClose={closeModal} />}
      {activeModal === 'DELETE' && <DeleteModal profile={selectedProfile} onClose={closeModal} />}
      {activeModal === 'PLAY_WARNING' && <PlayWarningModal profile={selectedProfile} onClose={closeModal} />}
    </>
  );
};

export default ParentDashboard;
