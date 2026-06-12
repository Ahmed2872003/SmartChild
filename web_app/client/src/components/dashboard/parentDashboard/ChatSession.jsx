import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2, X, Loader2 } from 'lucide-react';
import { formatDate } from '@/utils/date';
import { useCreateSession, useDeleteChatSession, useGetChatSessions } from '@/hooks/chatSession';
import { useJwt } from '@/context/JwtProvider';

export const ChatSession = ({
  profile,
  activeSession,
  setActiveSession,
  setActiveSessionData,
  showMobileSidebar,
  setShowMobileSidebar,
}) => {
  // Local State Management
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const limit = 5;

  // Hooks & Mutations
  const { data: fetchedData, isFetching } = useGetChatSessions(
    { query: { childId: profile?.id, sort: '-createdAt', limit, page } },
    { enabled: !!profile?.id, staleTime: Infinity },
  );
  const createSessionMutation = useCreateSession();
  const deleteSessionMutation = useDeleteChatSession();

  const { decodedJwt } = useJwt();

  // 1. Reset states cleanly when modal opens for a new profile
  useEffect(() => {
    setPage(1);
    setSessions([]);
  }, [profile?.id]);

  // 2. Accumulate fetched sessions over pages
  useEffect(() => {
    const incomingSessions = fetchedData?.chatsessionList || (Array.isArray(fetchedData) ? fetchedData : []);

    if (incomingSessions.length > 0) {
      setSessions((prev) => {
        if (page === 1) return incomingSessions;
        // Combine while ensuring no duplicates
        const newSessions = incomingSessions.filter((ns) => !prev.some((es) => es._id === ns._id));
        return [...prev, ...newSessions];
      });
    }
  }, [fetchedData, page]);

  // 3. Keep the parent Modal updated with the full session object (for the chat header topic)
  useEffect(() => {
    if (activeSession) {
      const current = sessions.find((s) => s._id === activeSession);
      if (current && setActiveSessionData) setActiveSessionData(current);
    } else if (setActiveSessionData) {
      setActiveSessionData(null);
    }
  }, [activeSession, sessions, setActiveSessionData]);

  const hasMore = (fetchedData?.chatsessionList || []).length === limit;

  // Actions
  const handleLoadMore = () => setPage((prev) => prev + 1);

  const handleNewChat = async () => {
    try {
      const data = await createSessionMutation.mutateAsync({ childId: profile.id });

      setSessions((prev) => [data.chatsession, ...prev]);

      setActiveSession(data.chatsession._id);
      if (window.innerWidth < 768) setShowMobileSidebar(false);
    } catch (err) {
      console.error('Failed to create chat', err);
    }
  };

  const handleDeleteClick = (e, sessionId) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
  };

  const confirmDelete = () => {
    if (!sessionToDelete) return;

    deleteSessionMutation.mutate(
      { sessionId: sessionToDelete, childId: profile?.id },
      {
        onSuccess: () => {
          setSessions((prev) => prev.filter((s) => s._id !== sessionToDelete));
          if (activeSession === sessionToDelete) setActiveSession(null);

          setSessionToDelete(null);
        },
      },
    );
  };

  const cancelDelete = () => setSessionToDelete(null);

  return (
    <>
      <div
        className={`absolute inset-0 z-30 md:relative md:w-80 bg-gray-50 flex flex-col transition-transform duration-300 md:border-r border-gray-200 ${
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center h-[72px]">
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-800 text-lg leading-tight">Chat History</h2>
            {decodedJwt.role === 'parent' && <p className="text-xs text-gray-500 font-medium">For {profile?.name}</p>}
          </div>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="md:hidden p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            disabled={createSessionMutation.isPending}
            className="w-full bg-[#FFC107] hover:bg-yellow-400 text-black font-bold py-2.5 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2"
          >
            {createSessionMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            New Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-4">
          {sessions.map((session) => (
            <div
              key={session._id}
              className={`w-full flex items-center p-2 rounded-xl transition-all border text-left group ${
                activeSession === session._id
                  ? 'bg-white border-gray-200 shadow-sm text-gray-900'
                  : 'border-transparent hover:bg-gray-200/50 text-gray-600'
              }`}
            >
              <button
                onClick={() => {
                  setActiveSession(session._id);
                  if (window.innerWidth < 768) setShowMobileSidebar(false);
                }}
                className="flex-1 flex items-center gap-3 overflow-hidden text-left pl-1"
              >
                <MessageSquare
                  size={18}
                  className={`shrink-0 ${activeSession === session._id ? 'text-black' : 'text-gray-400'}`}
                />
                <div className="flex-1 overflow-hidden pr-2">
                  <p className="text-sm font-semibold truncate">{session.topic}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(new Date(session.createdAt))}</p>
                </div>
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, session._id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {sessions.length === 0 && isFetching && (
            <div className="text-center p-4 mt-4 flex items-center justify-center">
              <Loader2 className="animate-spin text-[#FFC82C]" size={32} />
            </div>
          )}

          {sessions.length === 0 && !isFetching && (
            <div className="text-center p-4 text-sm text-gray-400 mt-4">No chat history found.</div>
          )}

          {hasMore && sessions.length > 0 && (
            <button
              onClick={handleLoadMore}
              disabled={isFetching}
              className="w-full text-center py-3 mt-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200/50 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isFetching ? <Loader2 className="animate-spin text-[#FFC82C]" size={24} /> : 'See more'}
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {sessionToDelete && (
        <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Chat Session?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All messages in this conversation will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                disabled={deleteSessionMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteSessionMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {deleteSessionMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
