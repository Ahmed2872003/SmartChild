import { Puzzle } from "lucide-react";

export const Logo = () => (
  <div className="flex flex-col items-center justify-center">
    <div className="flex -space-x-1 mb-1">
      <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center text-white transform -rotate-6">
        <Puzzle size={18} />
      </div>
      <div className="w-8 h-8 bg-pink-400 rounded-lg flex items-center justify-center text-white transform rotate-6">
        <Puzzle size={18} />
      </div>
    </div>
    <span className="text-[10px] font-black tracking-widest text-slate-800">
      SMARTCHILD
    </span>
  </div>
);
