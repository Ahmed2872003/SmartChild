import { THEME } from "@/constants/config";
import { X } from "lucide-react";

export const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`${THEME.cardWhite} w-full max-w-md p-8 md:p-10 relative animate-in zoom-in-95 duration-200`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};
