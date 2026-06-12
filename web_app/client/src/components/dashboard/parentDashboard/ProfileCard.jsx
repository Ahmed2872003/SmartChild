import { useState } from 'react';
import { PenTool, Trash2, Play, BarChart2, LinkIcon, Copy, Bot } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { THEME } from '@/constants/config';
import { ChatModal } from './modals/ChatModal';

import '@/services/chatSession';

export const ProfileCard = ({ profile, isLinked, onEdit, onDelete, onPlay, onViewReports }) => {
  const navigate = useNavigate();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center relative overflow-hidden group">
        {isLinked ? (
          <div className="absolute top-4 right-4 text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1">
            <LinkIcon size={12} /> Linked
          </div>
        ) : (
          <div className="absolute top-4 left-4 text-xs font-bold text-[#4ade80] bg-green-50 px-3 py-1 rounded-full border border-green-100">
            Owner
          </div>
        )}

        {!isLinked && (
          <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(profile)}
              className="p-2 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit Profile"
            >
              <PenTool size={16} />
            </button>
            <button
              onClick={() => onDelete(profile)}
              className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Profile"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <img
          src={`${import.meta.env.VITE_IMG_BASE_URL}/${profile.photo}`}
          className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-sm mb-4 object-cover"
          alt={profile.name}
        />
        <div className="mb-4">
          <h3 className="text-2xl font-black text-gray-900 mb-1">
            {profile.name}
            {profile.age !== '-' && `, ${profile.age}`}
          </h3>
          {profile.last_active && (
            <p className="text-sm text-gray-400 font-medium">Last active: {profile.last_active}</p>
          )}
        </div>

        {/* --- Share Code Section --- */}
        {profile.share_code && (
          <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6 flex items-center justify-between group/code">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Share Code</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-gray-700 tracking-wide select-all">
                {profile.share_code}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profile.share_code);
                  toast.success('Share code copied!');
                }}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                title="Copy Code"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={() => onPlay(profile)}
            className={`w-full ${THEME.primaryYellow} ${THEME.textBlack} font-bold py-3 rounded-full hover:bg-[#E5B427] transition-colors text-sm flex justify-center items-center gap-2`}
          >
            <Play size={16} fill="currentColor" /> Play Mode
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={() => navigate('/parent/child/reports', { state: { child: profile } })}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-full transition-colors text-sm flex justify-center items-center gap-2 border border-gray-100"
            >
              <BarChart2 size={16} /> Reports
            </button>
            <button
              onClick={() => setIsChatModalOpen(true)}
              className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold py-3 rounded-full transition-colors text-sm flex justify-center items-center gap-2 border border-yellow-100"
            >
              <Bot size={18} /> Ask AI
            </button>
          </div>
        </div>
      </div>

      {isChatModalOpen && <ChatModal onClose={() => setIsChatModalOpen(false)} profile={profile} />}
    </>
  );
};
