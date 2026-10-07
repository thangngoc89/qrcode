import React, { useState } from 'react';
import { Sparkles, Heart, Coffee, Wifi, Briefcase, Tag, Check } from 'lucide-react';
import { TEMPLATES } from '../constants/templates';
import { TemplatePreset, QRStyleState, QRContentState } from '../types';

interface TemplateGalleryProps {
  currentStyle: QRStyleState;
  onApplyTemplate: (template: TemplatePreset) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ currentStyle, onApplyTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Celebration', 'Dining & Events', 'Social & Tech', 'Business', 'Classic'];

  const filteredTemplates = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">2. Pre-made Design Templates (me-qr style)</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              One-Click Styles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose an artistic theme like Happy Anniversary, Touchless Menu, WiFi, or Classic SCAN ME
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTemplates.map(t => {
          const isFeatured = t.id === 'anniversary-hearts';
          const isSelected = t.style.svgTemplate?.enabled
            ? Boolean(currentStyle.svgTemplate?.enabled)
            : (!currentStyle.svgTemplate?.enabled &&
               currentStyle.frame.type === t.style.frame.type &&
               currentStyle.dotsType === t.style.dotsType &&
               currentStyle.dotColor === t.style.dotColor);

          return (
            <div
              key={t.id}
              onClick={() => onApplyTemplate(t)}
              className={`group relative rounded-xl border p-3.5 cursor-pointer transition-all duration-200 hover:translate-y-[-2px] ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
                  : isFeatured
                    ? 'bg-slate-950/70 border-pink-500/50 hover:border-pink-500 shadow-lg shadow-pink-950/20'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
              }`}
            >
              {isFeatured && (
                <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-[10px] font-extrabold uppercase tracking-wider text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Heart className="w-2.5 h-2.5 fill-white" />
                  Your Example
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Visual miniature swatch */}
                <div 
                  className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center p-1.5 shadow-inner border border-white/10 relative overflow-hidden"
                  style={{ backgroundColor: t.style.backgroundColor }}
                >
                  {/* Decorative preview illustration */}
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <div 
                      className="w-8 h-8 rounded-sm grid grid-cols-3 grid-rows-3 gap-0.5 p-0.5"
                      style={{ 
                        backgroundColor: 'transparent'
                      }}
                    >
                      <div className="rounded-full" style={{ backgroundColor: t.style.cornersSquareColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.dotColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.cornersSquareColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.dotColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.dotColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.dotColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.cornersSquareColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.dotColor }}></div>
                      <div className="rounded-full" style={{ backgroundColor: t.style.dotColor }}></div>
                    </div>
                    {t.style.frame.text && (
                      <span 
                        className="text-[6px] font-bold truncate max-w-[48px] mt-0.5"
                        style={{ color: t.style.frame.textColor }}
                      >
                        {t.style.frame.text}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition truncate">
                      {t.name}
                    </h3>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 ml-1">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                      {t.style.frame.type.replace('-', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      • {t.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
