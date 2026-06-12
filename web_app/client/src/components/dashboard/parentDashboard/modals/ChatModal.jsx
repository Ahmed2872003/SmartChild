import { useState, useEffect } from 'react';
import { ChatSession } from '../ChatSession';
import { ChatMessages } from '../ChatMessages';
import { useJwt } from '@/context/JwtProvider';

export const ChatModal = ({ onClose, profile }) => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Shared state between the Sidebar and the Message Window
  const [activeSession, setActiveSession] = useState(null);
  const [activeSessionData, setActiveSessionData] = useState(null);

  // Lock background scroll when the chatbot window is open (Mobile Only)
  useEffect(() => {
    const handleScrollLock = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };

    handleScrollLock();
    window.addEventListener('resize', handleScrollLock);

    return () => {
      window.removeEventListener('resize', handleScrollLock);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full h-full md:h-[85vh] md:w-[90vw] md:max-w-5xl md:rounded-[2rem] shadow-2xl flex overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Sidebar Component */}
        <ChatSession
          profile={profile}
          activeSession={activeSession}
          setActiveSession={setActiveSession}
          setActiveSessionData={setActiveSessionData} // Passes topic up to Modal
          showMobileSidebar={showMobileSidebar}
          setShowMobileSidebar={setShowMobileSidebar}
        />

        {/* Messages Component */}
        <ChatMessages
          profile={profile}
          activeSession={activeSession}
          currentSession={activeSessionData} // Receives topic from Modal
          onClose={onClose}
          setShowMobileSidebar={setShowMobileSidebar}
        />
      </div>
    </div>
  );
};
