import React from 'react';
import { QrCode, Scan, Bookmark, ShieldCheck, Github } from 'lucide-react';

interface HeaderProps {
  onOpenScanner: () => void;
  onOpenPresets: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScanner, onOpenPresets }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                QR Studio Pro
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Zero backend • Pure browser execution • Artistic templates & high-res vector export
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Saved Designs & Presets"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">My Saved</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition"
            title="Test QR Code Scanner"
          >
            <Scan className="w-4 h-4 text-indigo-400" />
            <span>Test Scanner</span>
          </button>
        </div>
      </div>
    </header>
  );
};
