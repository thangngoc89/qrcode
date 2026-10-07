import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  Image as ImageIcon, 
  Sliders, 
  Upload, 
  Trash2, 
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { 
  QRStyleState, 
  DotType, 
  CornerSquareType, 
  CornerDotType, 
  ErrorCorrectionLevel, 
  FrameType, 
  FrameFont 
} from '../types';
import { PRESET_ICONS } from '../constants/icons';

interface StyleEditorProps {
  style: QRStyleState;
  onChange: (updater: (prev: QRStyleState) => QRStyleState) => void;
  onReset: () => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange, onReset }) => {
  const [activeSubTab, setActiveSubTab] = useState<'frames' | 'shapes' | 'logo' | 'level'>('frames');
  const [mode, setMode] = useState<'classic' | 'logo'>('classic');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(prev => ({
        ...prev,
        logoSrc: result,
        errorCorrectionLevel: 'H'
      }));
      setMode('logo');
    };
    reader.readAsDataURL(file);
  };

  const templatesList: { id: FrameType; label: string; icon: string; previewDots?: string }[] = [
    { id: 'none', label: 'No Frame', icon: '✕' },
    { id: 'anniversary-hearts', label: 'Anniversary', icon: '❤️' },
    { id: 'birthday-confetti', label: 'Birthday', icon: '🎉' },
    { id: 'scan-me-bottom', label: 'SCAN ME', icon: '🏷️' },
    { id: 'scan-me-top', label: 'Top Banner', icon: '⬆️' },
    { id: 'restaurant-menu', label: 'Menu', icon: '🍽️' },
    { id: 'wifi-card', label: 'WiFi Card', icon: '📶' },
    { id: 'polaroid', label: 'Polaroid', icon: '📷' },
    { id: 'neon-bracket', label: 'Cyber Matrix', icon: '⚡' },
    { id: 'minimal-rounded', label: 'Minimal Card', icon: '🔲' },
  ];

  const dotOptions: { id: DotType; label: string }[] = [
    { id: 'square', label: 'Square (Standard)' },
    { id: 'dots', label: 'Dots (Circles)' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy Rounded' },
    { id: 'extra-rounded', label: 'Extra Rounded' },
  ];

  const cornerSquareOptions: { id: CornerSquareType; label: string }[] = [
    { id: 'square', label: 'Square (Classic)' },
    { id: 'dot', label: 'Target Rings (Circles)' },
    { id: 'extra-rounded', label: 'Smooth Rounded' },
  ];

  const cornerDotOptions: { id: CornerDotType; label: string }[] = [
    { id: 'square', label: 'Square' },
    { id: 'dot', label: 'Circle Dot' },
  ];

  const fontOptions: { id: FrameFont; label: string; fontClass: string }[] = [
    { id: 'script', label: 'Cursive Script', fontClass: 'font-script text-base' },
    { id: 'serif', label: 'Playfair Serif', fontClass: 'font-serif text-xs' },
    { id: 'display', label: 'Bold Modern', fontClass: 'font-extrabold tracking-wide text-xs' },
    { id: 'sans', label: 'Clean Sans', fontClass: 'font-sans text-xs' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Step Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold flex items-center justify-center text-xs">
          2
        </div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Customize
        </h2>
      </div>

      {/* Top Toggle: Classic QR vs Logo QR (me-qr style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => {
            setMode('classic');
            onChange(prev => ({ ...prev, logoSrc: null }));
          }}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
            mode === 'classic'
              ? 'bg-pink-50/70 dark:bg-pink-950/30 border-pink-500 ring-2 ring-pink-500/20'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${mode === 'classic' ? 'border-pink-600 bg-pink-600' : 'border-slate-400'}`}>
              {mode === 'classic' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Classic QR</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">🔲</span>
            <span className="w-5 h-5 rounded bg-pink-100 dark:bg-pink-900/60 flex items-center justify-center text-[10px]">❤️</span>
          </div>
        </button>

        <button
          onClick={() => {
            setMode('logo');
            setActiveSubTab('logo');
          }}
          className={`flex items-center justify-between p-3.5 rounded-2xl border transition text-left ${
            mode === 'logo'
              ? 'bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-rose-900/40 border-pink-500 ring-2 ring-pink-500/20'
              : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${mode === 'logo' ? 'border-pink-600 bg-pink-600' : 'border-slate-400'}`}>
              {mode === 'logo' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                Logo QR <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">W</span>
            <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[9px] font-bold">♥</span>
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">📶</span>
          </div>
        </button>
      </div>

      {/* Subtabs Bar: Frames, Shapes, Logo, Level + Reset Settings */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'frames', label: 'Frames', icon: Sparkles },
            { id: 'shapes', label: 'Shapes', icon: Layers },
            { id: 'logo', label: 'Logo', icon: ImageIcon },
            { id: 'level', label: 'Level', icon: Sliders },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 border border-pink-300 dark:border-pink-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition ml-2 flex-shrink-0"
          title="Reset to default clean QR"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Settings</span>
        </button>
      </div>

      {/* SUBTAB 1: FRAMES & PRE-MADE TEMPLATES */}
      {activeSubTab === 'frames' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Pre-Made Templates
            </h3>

            {/* Horizontal row of template pills */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {templatesList.map(t => {
                const isSelected = style.frame.type === t.id;
                const isAnniversary = t.id === 'anniversary-hearts';

                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (t.id === 'none') {
                        onChange(prev => ({
                          ...prev,
                          frame: { ...prev.frame, type: 'none' }
                        }));
                      } else if (t.id === 'anniversary-hearts') {
                        onChange(prev => ({
                          ...prev,
                          dotsType: 'dots',
                          cornersSquareType: 'dot',
                          cornersDotType: 'dot',
                          dotColor: '#8b5cf6',
                          cornersSquareColor: '#f43f5e',
                          cornersDotColor: '#f43f5e',
                          errorCorrectionLevel: 'H',
                          frame: {
                            type: 'anniversary-hearts',
                            text: prev.frame.text || 'Happy Anniversary',
                            subtext: '',
                            fontFamily: 'script',
                            textColor: '#8b5cf6',
                            frameColor: '#f43f5e',
                            accentColor: '#8b5cf6',
                          }
                        }));
                      } else {
                        onChange(prev => ({
                          ...prev,
                          frame: {
                            ...prev.frame,
                            type: t.id,
                            text: prev.frame.text || (t.id === 'birthday-confetti' ? 'Happy Birthday!' : 'SCAN ME')
                          }
                        }));
                      }
                    }}
                    className={`flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] h-20 p-2 rounded-2xl border transition-all flex-shrink-0 ${
                      isSelected
                        ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 ring-2 ring-pink-500/20 text-pink-600 dark:text-pink-300'
                        : isAnniversary
                          ? 'bg-gradient-to-b from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20 border-pink-200 dark:border-pink-900/60 hover:border-pink-400'
                          : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xl mb-1">{t.icon}</span>
                    <span className="text-[11px] font-semibold text-center truncate w-full">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EDITABLE TEXT SECTION (When any frame is active) */}
          {style.frame.type !== 'none' && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/70 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ✏️ Edit Frame Text & Colors
                </span>
                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-medium">
                  Live editable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Banner Text
                  </label>
                  <input
                    type="text"
                    value={style.frame.text}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, frame: { ...prev.frame, text: val } }));
                    }}
                    placeholder="e.g. Happy Anniversary"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subtext (Optional)
                  </label>
                  <input
                    type="text"
                    value={style.frame.subtext || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, frame: { ...prev.frame, subtext: val } }));
                    }}
                    placeholder="e.g. Scan to RSVP"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Font Choice */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Font Typography
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {fontOptions.map(font => (
                    <button
                      key={font.id}
                      onClick={() => onChange(prev => ({
                        ...prev,
                        frame: { ...prev.frame, fontFamily: font.id }
                      }))}
                      className={`px-3 py-2 rounded-xl border text-center transition ${
                        style.frame.fontFamily === font.id
                          ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 ring-1 ring-pink-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className={`block ${font.fontClass}`}>{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.frame.textColor}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, frame: { ...prev.frame, textColor: val } }));
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={style.frame.textColor}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, frame: { ...prev.frame, textColor: val } }));
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Frame Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.frame.frameColor}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, frame: { ...prev.frame, frameColor: val } }));
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={style.frame.frameColor}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, frame: { ...prev.frame, frameColor: val } }));
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Decorations Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.frame.accentColor}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, frame: { ...prev.frame, accentColor: val } }));
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={style.frame.accentColor}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, frame: { ...prev.frame, accentColor: val } }));
                      }}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: SHAPES & EYES */}
      {activeSubTab === 'shapes' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Body Dots Pattern
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dotOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChange(prev => ({ ...prev, dotsType: opt.id }))}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${
                    style.dotsType === opt.id
                      ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 ring-1 ring-pink-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Corner Eye Outer Frame
              </label>
              <div className="space-y-1.5">
                {cornerSquareOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onChange(prev => ({ ...prev, cornersSquareType: opt.id }))}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      style.cornersSquareType === opt.id
                        ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 ring-1 ring-pink-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Corner Eye Inner Pupil
              </label>
              <div className="space-y-1.5">
                {cornerDotOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onChange(prev => ({ ...prev, cornersDotType: opt.id }))}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      style.cornersDotType === opt.id
                        ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 ring-1 ring-pink-400'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color pickers */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Colors</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Dots Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.dotColor}
                    onChange={e => onChange(prev => ({ ...prev, dotColor: e.target.value }))}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.dotColor}
                    onChange={e => onChange(prev => ({ ...prev, dotColor: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Eye Ring Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.cornersSquareColor}
                    onChange={e => onChange(prev => ({ ...prev, cornersSquareColor: e.target.value }))}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.cornersSquareColor}
                    onChange={e => onChange(prev => ({ ...prev, cornersSquareColor: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Eye Dot Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.cornersDotColor}
                    onChange={e => onChange(prev => ({ ...prev, cornersDotColor: e.target.value }))}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={style.cornersDotColor}
                    onChange={e => onChange(prev => ({ ...prev, cornersDotColor: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: LOGO */}
      {activeSubTab === 'logo' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Preset Brand & Symbol Logos
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {PRESET_ICONS.map(icon => (
                <button
                  key={icon.id}
                  onClick={() => {
                    onChange(prev => ({
                      ...prev,
                      logoSrc: icon.svgDataUri,
                      errorCorrectionLevel: 'H'
                    }));
                    setMode('logo');
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                    style.logoSrc === icon.svgDataUri
                      ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 ring-1 ring-pink-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <img src={icon.svgDataUri} alt={icon.name} className="w-5 h-5 mb-1" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 truncate w-full text-center">{icon.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Custom Upload</span>
              {style.logoSrc && (
                <button
                  onClick={() => onChange(prev => ({ ...prev, logoSrc: null }))}
                  className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-500 rounded-xl p-3 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 hover:text-pink-600 transition"
            >
              <Upload className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium">Upload custom logo (PNG, JPG, SVG)</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 4: QUALITY LEVEL */}
      {activeSubTab === 'level' && (
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Reed-Solomon Error Correction Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'L', label: 'L (7%)', desc: 'Fast, low density' },
              { id: 'M', label: 'M (15%)', desc: 'Standard default' },
              { id: 'Q', label: 'Q (25%)', desc: 'High redundancy' },
              { id: 'H', label: 'H (30%)', desc: 'Best for logos & art' },
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => onChange(prev => ({ ...prev, errorCorrectionLevel: lvl.id as ErrorCorrectionLevel }))}
                className={`p-3 rounded-xl border text-left transition ${
                  style.errorCorrectionLevel === lvl.id
                    ? 'bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 ring-1 ring-pink-400'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="block text-xs font-bold">{lvl.label}</span>
                <span className="block text-[10px] text-slate-400">{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
