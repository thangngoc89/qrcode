import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Image as ImageIcon, 
  Sliders, 
  Type, 
  Sparkles,
  Upload, 
  Trash2, 
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp
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
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange }) => {
  const [activeSection, setActiveSection] = useState<'frame' | 'shapes' | 'colors' | 'logo' | 'tech'>('frame');

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
        errorCorrectionLevel: 'H' // Auto switch to High correction for reliability
      }));
    };
    reader.readAsDataURL(file);
  };

  const dotOptions: { id: DotType; label: string }[] = [
    { id: 'dots', label: 'Dots (Circles)' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'classy', label: 'Classy' },
    { id: 'classy-rounded', label: 'Classy Rounded' },
    { id: 'extra-rounded', label: 'Extra Rounded' },
    { id: 'square', label: 'Standard Square' },
  ];

  const cornerSquareOptions: { id: CornerSquareType; label: string }[] = [
    { id: 'dot', label: 'Target / Circle Rings' },
    { id: 'extra-rounded', label: 'Smooth Rounded' },
    { id: 'square', label: 'Square' },
  ];

  const cornerDotOptions: { id: CornerDotType; label: string }[] = [
    { id: 'dot', label: 'Circle Dot' },
    { id: 'square', label: 'Square Dot' },
  ];

  const frameOptions: { id: FrameType; label: string }[] = [
    { id: 'anniversary-hearts', label: '❤️ Anniversary Hearts Arc (Example)' },
    { id: 'birthday-confetti', label: '🎉 Birthday & Party Confetti' },
    { id: 'scan-me-bottom', label: '🏷️ Classic "SCAN ME" Bottom' },
    { id: 'scan-me-top', label: '🏷️ "SCAN ME" Top Banner' },
    { id: 'restaurant-menu', label: '🍽️ Restaurant / Touchless Menu' },
    { id: 'wifi-card', label: '📶 Guest WiFi Card' },
    { id: 'polaroid', label: '📷 Polaroid Memory Card' },
    { id: 'neon-bracket', label: '⚡ Cyberpunk Neon Brackets' },
    { id: 'minimal-rounded', label: '🔲 Minimal Rounded Border' },
    { id: 'none', label: '🚫 No Frame (Pure QR Only)' },
  ];

  const fontOptions: { id: FrameFont; label: string; fontClass: string }[] = [
    { id: 'script', label: 'Cursive / Script (Anniversary)', fontClass: 'font-script text-base' },
    { id: 'serif', label: 'Elegant Serif', fontClass: 'font-serif' },
    { id: 'display', label: 'Bold Modern Display', fontClass: 'font-extrabold tracking-wider' },
    { id: 'sans', label: 'Clean Sans-Serif', fontClass: 'font-sans' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white">3. Custom Styling & Frames</h2>
          <p className="text-xs text-slate-400">Personalize frames, colors, dots, and center logos</p>
        </div>
      </div>

      {/* Accordion / Subtabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl mb-5 border border-slate-800/80 overflow-x-auto">
        <button
          onClick={() => setActiveSection('frame')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'frame'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Frame & Text</span>
        </button>

        <button
          onClick={() => setActiveSection('shapes')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'shapes'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Shapes & Eyes</span>
        </button>

        <button
          onClick={() => setActiveSection('colors')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'colors'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Colors & Gradient</span>
        </button>

        <button
          onClick={() => setActiveSection('logo')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'logo'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>Center Logo</span>
        </button>

        <button
          onClick={() => setActiveSection('tech')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
            activeSection === 'tech'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-purple-400" />
          <span>Quality & Tech</span>
        </button>
      </div>

      {/* 1. FRAME & TEXT SECTION */}
      {activeSection === 'frame' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Outer Frame & Decorative Wreath Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {frameOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChange(prev => ({
                    ...prev,
                    frame: { ...prev.frame, type: opt.id }
                  }))}
                  className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition ${
                    style.frame.type === opt.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {style.frame.type !== 'none' && (
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Frame Banner Text
                  </label>
                  <input
                    type="text"
                    value={style.frame.text}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, frame: { ...prev.frame, text: val } }));
                    }}
                    placeholder="e.g. Happy Anniversary"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subtext / Call to Action (Optional)
                  </label>
                  <input
                    type="text"
                    value={style.frame.subtext || ''}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, frame: { ...prev.frame, subtext: val } }));
                    }}
                    placeholder="e.g. Scan to RSVP"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Typography / Font Style
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
                          ? 'bg-indigo-600/30 border-indigo-500 text-white ring-1 ring-indigo-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className={`block text-xs ${font.fontClass}`}>{font.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Text Color</label>
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Frame Accent Color</label>
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Deco Color</label>
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
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. SHAPES & EYES SECTION */}
      {activeSection === 'shapes' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              QR Code Body Dots Pattern
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dotOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onChange(prev => ({ ...prev, dotsType: opt.id }))}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${
                    style.dotsType === opt.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Corner Square (Eye Outer Ring)
              </label>
              <div className="space-y-1.5">
                {cornerSquareOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onChange(prev => ({ ...prev, cornersSquareType: opt.id }))}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      style.cornersSquareType === opt.id
                        ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Corner Dot (Eye Pupil Center)
              </label>
              <div className="space-y-1.5">
                {cornerDotOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => onChange(prev => ({ ...prev, cornersDotType: opt.id }))}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition ${
                      style.cornersDotType === opt.id
                        ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. COLORS & GRADIENT SECTION */}
      {activeSection === 'colors' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">QR Dots Color</span>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={style.useGradient}
                  onChange={e => {
                    const checked = e.target.checked;
                    onChange(prev => ({ ...prev, useGradient: checked }));
                  }}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                Use Color Gradient
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {style.useGradient ? 'Gradient Start Color' : 'Dot Primary Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.dotColor}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, dotColor: val }));
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={style.dotColor}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, dotColor: val }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              {style.useGradient && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Gradient End Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.gradientColor2}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, gradientColor2: val }));
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={style.gradientColor2}
                      onChange={e => {
                        const val = e.target.value;
                        onChange(prev => ({ ...prev, gradientColor2: val }));
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {style.useGradient && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Gradient Type</label>
                  <select
                    value={style.gradientType}
                    onChange={e => {
                      const val = e.target.value as 'linear' | 'radial';
                      onChange(prev => ({ ...prev, gradientType: val }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200"
                  >
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Angle ({style.gradientRotation}°)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={style.gradientRotation}
                    onChange={e => {
                      const val = Number(e.target.value);
                      onChange(prev => ({ ...prev, gradientRotation: val }));
                    }}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Eyes Colors */}
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">Corner Eyes Colors</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Eye Frame (Outer Ring)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.cornersSquareColor}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, cornersSquareColor: val }));
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={style.cornersSquareColor}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, cornersSquareColor: val }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Eye Pupil (Center Dot)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.cornersDotColor}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, cornersDotColor: val }));
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={style.cornersDotColor}
                    onChange={e => {
                      const val = e.target.value;
                      onChange(prev => ({ ...prev, cornersDotColor: val }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Background</span>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={style.transparentBackground}
                  onChange={e => {
                    const checked = e.target.checked;
                    onChange(prev => ({ ...prev, transparentBackground: checked }));
                  }}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                Transparent Background
              </label>
            </div>

            {!style.transparentBackground && (
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, backgroundColor: val }));
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={style.backgroundColor}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, backgroundColor: val }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-mono"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. LOGO SECTION */}
      {activeSection === 'logo' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Preset Brand Icons (Social, WiFi, Heart, Menu)
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
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                    style.logoSrc === icon.svgDataUri
                      ? 'bg-indigo-600/30 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <img src={icon.svgDataUri} alt={icon.name} className="w-6 h-6 mb-1" />
                  <span className="text-[10px] text-slate-300 truncate w-full text-center">{icon.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Custom Logo Image</span>
              {style.logoSrc && (
                <button
                  onClick={() => onChange(prev => ({ ...prev, logoSrc: null }))}
                  className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Logo
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-400 transition"
            >
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Click to upload your logo (PNG, SVG, JPG)</span>
              <span className="text-[10px] text-slate-500 mt-0.5">High-contrast, square images work best</span>
            </button>

            {style.logoSrc && (
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Logo Size</span>
                    <span>{Math.round(style.logoSize * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.12"
                    max="0.38"
                    step="0.02"
                    value={style.logoSize}
                    onChange={e => {
                      const val = Number(e.target.value);
                      onChange(prev => ({ ...prev, logoSize: val }));
                    }}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Logo Margin (Padding)</span>
                    <span>{style.logoMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={style.logoMargin}
                    onChange={e => {
                      const val = Number(e.target.value);
                      onChange(prev => ({ ...prev, logoMargin: val }));
                    }}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={style.hideBehindLogo}
                    onChange={e => {
                      const checked = e.target.checked;
                      onChange(prev => ({ ...prev, hideBehindLogo: checked }));
                    }}
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  Clear QR dots behind logo for clean contrast
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TECH & QUALITY SECTION */}
      {activeSection === 'tech' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Error Correction Level (Reed-Solomon redundancy)
            </label>
            <p className="text-[11px] text-slate-400 mb-3">
              Higher error correction ensures readability even if the QR code has artistic decorations, center logos, or is printed on uneven surfaces.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'L', label: 'L — 7%', desc: 'Lowest density' },
                { id: 'M', label: 'M — 15%', desc: 'Standard use' },
                { id: 'Q', label: 'Q — 25%', desc: 'High resilience' },
                { id: 'H', label: 'H — 30%', desc: 'Best with logos / art' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => onChange(prev => ({ ...prev, errorCorrectionLevel: lvl.id as ErrorCorrectionLevel }))}
                  className={`p-3 rounded-xl border text-left transition ${
                    style.errorCorrectionLevel === lvl.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="block text-xs font-bold">{lvl.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{lvl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
