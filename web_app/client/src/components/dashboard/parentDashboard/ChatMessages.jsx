import { Bot, Menu, MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useGetSessionMsgs, useChatWithStream } from '@/hooks/chatMsgs';

import { useQueryClient } from '@tanstack/react-query';
import { useJwt } from '@/context/JwtProvider';

const limit = 6;

export const ChatMessages = ({ profile, activeSession, currentSession, onClose, setShowMobileSidebar }) => {
  // Local state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const messagesEndRef = useRef(null);
  const replyTimeoutRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Scroll preservation refs
  const scrollContainerRef = useRef(null);
  const isPaginatingRef = useRef(false);
  const distanceFromBottomRef = useRef(0);
  const previousMessagesLengthRef = useRef(0);

  const isOptimisticSwapRef = useRef(false);

  const chatWithStreamMutation = useChatWithStream();

  const queryClient = useQueryClient();

  const { decodedJwt } = useJwt();

  useEffect(() => {
    if (isOptimisticSwapRef.current) {
      isOptimisticSwapRef.current = false;
      return;
    }
    if (!activeSession) {
      setMessages([]);
      return;
    }

    setPage(1);
    setHasMore(true);
    isAtBottomRef.current = true;
    isPaginatingRef.current = false;

    setMessages([]);

    return () => queryClient.removeQueries({ queryKey: ['session-msgs', activeSession], type: 'all' });
  }, [activeSession]);

  // 2. Fetch messages
  const { data: msgsData, isFetching: isFetchingMsgs } = useGetSessionMsgs(
    { query: { sessionId: activeSession, sort: '-createdAt', limit, page } },
    { staleTime: Infinity, enabled: !!activeSession },
  );

  useEffect(() => {
    const incomingMsgs = msgsData?.chatmessageList || [];

    // Handle pagination status
    if (msgsData && incomingMsgs.length < limit) {
      setHasMore(false);
    } else if (msgsData) {
      setHasMore(true);
    }

    if (incomingMsgs.length > 0) {
      setMessages((prev) => {
        let updatedMessages = [...prev];
        let stateChanged = false;

        incomingMsgs.forEach((incoming) => {
          // 1. Only check if we already have this exact real ID
          const existsById = updatedMessages.some((m) => m._id === incoming._id);

          // 2. If it doesn't exist, it's a historical message from a page load
          if (!existsById) {
            updatedMessages.push(incoming);
            stateChanged = true;
          }
        });

        // 3. Only trigger a re-render if we actually added older messages
        if (stateChanged) {
          return updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return prev;
      });
    }
  }, [msgsData]);

  // Smart Auto-Scroll and Absolute Scroll Lock
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (isPaginatingRef.current) {
      // Anchor the scroll position to the bottom distance.
      // This absorbs ANY height changes (like loaders appearing/disappearing or messages rendering).
      container.scrollTop = container.scrollHeight - distanceFromBottomRef.current;

      // Release the lock safely once the new messages have officially rendered into the DOM
      if (messages.length > previousMessagesLengthRef.current) {
        isPaginatingRef.current = false;
      }
    } else if (isAtBottomRef.current || isTyping || (page === 1 && messages.length <= limit)) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages, isFetchingMsgs, isTyping, page]);

  // Safety fallback: Release the pagination lock if fetching completes but no new messages were added
  useEffect(() => {
    if (!isFetchingMsgs) {
      const timeout = setTimeout(() => {
        isPaginatingRef.current = false;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isFetchingMsgs]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || chatWithStreamMutation.isPending || !activeSession) return;

    const messageContent = input;
    const tempUserMsgId = Date.now().toString();
    const tempAiMsgId = `ai-stream-${tempUserMsgId}`; // A unique ID for the streaming message

    // 1. Instantly add BOTH the user's message AND an empty AI placeholder to the screen
    setMessages((prev) => [
      ...prev,
      {
        _id: tempUserMsgId,
        sessionId: activeSession,
        sender: decodedJwt.role,
        content: messageContent,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      },
      {
        _id: tempAiMsgId,
        sessionId: activeSession,
        sender: 'AI',
        content: '', // Starts completely empty
        createdAt: new Date().toISOString(),
        isStreaming: true, // Custom flag so we know it's live
        isOptimistic: true,
      },
    ]);

    setInput('');
    setIsTyping(true); // Bouncy dots while we wait for the first network byte

    try {
      await chatWithStreamMutation.mutateAsync({
        sessionId: activeSession,
        childId: profile?.id,
        message: messageContent,
        onIdsReceived: ({ realUserMsgId, realAiMsgId }) => {
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg._id === tempUserMsgId) {
                return { ...msg, _id: realUserMsgId, isOptimistic: false };
              }
              if (msg._id === tempAiMsgId) {
                return { ...msg, _id: realAiMsgId, isOptimistic: false };
              }
              return msg;
            }),
          );
        },
        onChunk: (chunkText) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.isStreaming ? { ...msg, content: msg.content + chunkText } : msg)),
          );
        },
      });

      setIsTyping(false);

      setMessages((prev) => prev.map((msg) => (msg.isStreaming ? { ...msg, isStreaming: false } : msg)));
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);

      setMessages((prev) => prev.filter((msg) => msg._id !== tempAiMsgId && msg._id !== tempUserMsgId));
    }
  };
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  };

  const handleLoadMore = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Capture the exact distance from the current scroll point to the bottom of the content
      distanceFromBottomRef.current = container.scrollHeight - container.scrollTop;
      isPaginatingRef.current = true;
    }
    setPage((prev) => prev + 1);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative z-10 w-full">
      {/* Chat Header */}
      <div className="h-[72px] bg-white border-b border-gray-100 px-4 md:px-6 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-2 -ml-2 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 shrink-0"
          >
            <Menu size={20} />
          </button>
          <div className="bg-[#FFC107] p-2 rounded-full hidden sm:flex shrink-0">
            <Bot size={22} className="text-black" />
          </div>
          <div className="flex flex-col overflow-hidden justify-center">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-md text-gray-900 leading-tight truncate">AI Assistant</h3>
              {decodedJwt.role === 'parent' && (
                <div
                  className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full shrink-0"
                  title={`Messaging for ${profile?.name}`}
                >
                  {profile?.photo ? (
                    <img
                      src={`${import.meta.env.VITE_IMG_BASE_URL}/${profile.photo}`}
                      className="w-3.5 h-3.5 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFC107] text-black flex items-center justify-center text-[8px] font-black">
                      {profile?.name?.charAt(0)}
                    </div>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider truncate max-w-[80px]">
                    {profile?.name}
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium truncate max-w-[200px] sm:max-w-[300px]">
              {currentSession?.topic}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors shrink-0"
          title="Close chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Feed */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/50 flex flex-col gap-4"
        onScroll={handleScroll}
      >
        {!activeSession ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm gap-3">
            <MessageSquare size={32} className="opacity-20" />
            <p>Select or create a new conversation to start.</p>
          </div>
        ) : isFetchingMsgs && page === 1 && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#FFC107]" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            No messages in this conversation yet.
          </div>
        ) : (
          <>
            {/* See More Button */}
            {activeSession !== 'new' && !isFetchingMsgs && hasMore && messages.length >= limit && (
              <div className="flex justify-center py-3 shrink-0">
                <button
                  onClick={handleLoadMore}
                  className="text-xs bg-white border border-gray-200 shadow-sm text-gray-600 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                >
                  See more
                </button>
              </div>
            )}

            {/* Top Pagination Loader */}
            {isFetchingMsgs && page > 1 && (
              <div className="flex justify-center py-2 shrink-0">
                <Loader2 className="animate-spin text-[#FFC107]" size={20} />
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m._id}
                className={`flex flex-col max-w-[85%] md:max-w-[75%] ${m.sender === decodedJwt.role ? 'self-end' : 'self-start'}`}
              >
                <div
                  className={`p-3.5 text-[15px] leading-relaxed shadow-sm ${
                    m.sender === decodedJwt.role
                      ? 'bg-[#FFC107] text-black rounded-2xl rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  {/* Render the text */}
                  {m.content}

                  {/* 🌟 Add a blinking cursor if this specific message is currently streaming */}
                  {m.isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-gray-400 animate-pulse align-middle" />
                  )}
                </div>

                <span
                  className={`text-[11px] text-gray-400 mt-1 px-1 ${m.sender === decodedJwt.role ? 'text-right' : 'text-left'}`}
                >
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </span>
              </div>
            ))}
          </>
        )}

        {/* Typing Indicator
        {isTyping && (
          <div className="bg-white border border-gray-100 text-gray-800 self-start rounded-2xl rounded-bl-sm max-w-[85%] px-4 py-4 shadow-sm flex items-center gap-1.5 w-[72px] shrink-0">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        )} */}
        <div ref={messagesEndRef} className="h-1 shrink-0" />
      </div>

      {/* Input Form */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-100">
        {activeSession && !isFetchingMsgs && (
          <>
            <form
              onSubmit={handleSend}
              className="max-w-4xl mx-auto flex gap-2 items-end bg-gray-50 p-1.5 rounded-3xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#FFC107]/30 focus-within:border-[#FFC107] transition-all"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder={
                  !activeSession
                    ? 'Create a new chat to message...'
                    : isTyping
                      ? 'Waiting for response...'
                      : decodedJwt.role === 'parent'
                        ? `Ask something about ${profile?.name}...`
                        : "Let's talk together"
                }
                className="flex-1 bg-transparent text-[15px] px-4 py-3 outline-none resize-none max-h-32 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-[#FFC107] text-black p-3 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mb-1 mr-1 shadow-sm"
              >
                <Send size={20} className="ml-0.5" />
              </button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-gray-400">
                For better performance, the AI only remembers the last 10 messages of this conversation.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
