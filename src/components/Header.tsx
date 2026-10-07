import React from 'react';
import { QrCode, Scan, Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenScanner: () => void;
  onOpenPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenScanner,
  onOpenPresets
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-500/25">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                QR<span className="text-pink-600">Studio</span>
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 border border-pink-200">
                100% Free
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <Bookmark className="w-4 h-4 text-pink-500" />
            <span className="hidden sm:inline">My Saved</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 transition"
          >
            <Scan className="w-4 h-4 text-pink-500" />
            <span>Test Scanner</span>
          </button>
        </div>
      </div>
    </header>
  );
};
