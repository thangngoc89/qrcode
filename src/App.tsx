import React, { useState } from 'react';
import { Header } from './components/Header';
import { TemplateGallery } from './components/TemplateGallery';
import { ContentEditor } from './components/ContentEditor';
import { StyleEditor } from './components/StyleEditor';
import { QRPreview } from './components/QRPreview';
import { QRScannerModal } from './components/QRScannerModal';
import { SavedPresetsModal } from './components/SavedPresetsModal';
import { QRContentState, QRStyleState, TemplatePreset } from './types';
import { TEMPLATES } from './constants/templates';

export const App: React.FC = () => {
  // Initialize with standard clean QR (no frame, no decorations)
  const defaultTemplate = TEMPLATES[0];

  const [style, setStyle] = useState<QRStyleState>(defaultTemplate.style);
  const [content, setContent] = useState<QRContentState>({
    type: 'url',
    url: 'https://example.com',
    text: 'Hello World!',
    wifi: {
      ssid: 'HomeSweetHome',
      password: 'loveforever2026',
      encryption: 'WPA',
      hidden: false
    },
    vcard: {
      firstName: 'Emily',
      lastName: 'Clark',
      phone: '+1 (555) 012-3456',
      mobile: '+1 (555) 012-7890',
      email: 'emily@example.com',
      organization: 'Studio Creative',
      title: 'Art Director',
      url: 'https://emilyclark.design',
      street: '124 Blossom Lane',
      city: 'Portland',
      country: 'USA',
      note: 'Met at Design Gala'
    },
    email: {
      email: 'anniversary@ourfamily.com',
      subject: 'Happy Anniversary Wishes!',
      body: 'Wishing you both a wonderful year ahead!'
    },
    sms: {
      phone: '+15551234567',
      message: 'Happy Anniversary! Can’t wait to celebrate!'
    },
    whatsapp: {
      phone: '15551234567',
      message: 'Happy Anniversary! Here is the link to our video greeting!'
    },
    event: {
      title: '5th Anniversary Celebration Dinner',
      location: 'The Glasshouse Terrace',
      start: '2026-10-18T19:00',
      end: '2026-10-18T23:00',
      description: 'Join us for drinks, dining, and fond memories.'
    },
    crypto: {
      currency: 'bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: '0.005',
      message: 'Gift for the happy couple'
    }
  });

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const handleApplyTemplate = (template: TemplatePreset) => {
    setStyle(template.style);
    if (template.sampleContent) {
      setContent(prev => ({
        ...prev,
        ...template.sampleContent
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* me-qr style Template Gallery Carousel / Grid */}
        <TemplateGallery
          currentStyle={style}
          onApplyTemplate={handleApplyTemplate}
        />

        {/* 2-Column Core Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Content Data & Style Customizer */}
          <div className="lg:col-span-7 space-y-6">
            <ContentEditor
              content={content}
              onChange={setContent}
            />

            <StyleEditor
              style={style}
              onChange={setStyle}
            />
          </div>

          {/* Right Column: Sticky Live Canvas Preview & High-Res Downloader */}
          <div className="lg:col-span-5">
            <QRPreview
              content={content}
              style={style}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            QR Studio Pro — 100% Client-Side. No telemetry, no backend, zero data transmitted to servers.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Self-Hosted Ready (Static HTML/CSS/JS or Docker)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <SavedPresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        currentStyle={style}
        currentContent={content}
        onLoadPreset={preset => {
          setStyle(preset.style);
          setContent(preset.content);
        }}
      />
    </div>
  );
};
export default App;
