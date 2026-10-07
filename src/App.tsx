import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ContentEditor } from './components/ContentEditor';
import { StyleEditor } from './components/StyleEditor';
import { QRPreview } from './components/QRPreview';
import { QRScannerModal } from './components/QRScannerModal';
import { SavedPresetsModal } from './components/SavedPresetsModal';
import { QRContentState, QRStyleState } from './types';
import { TEMPLATES } from './constants/templates';

export const App: React.FC = () => {
  // Light / Dark UI mode state (Default to Light mode matching user screenshot)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('qr_studio_theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('qr_studio_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('qr_studio_theme', 'light');
    }
  }, [isDarkMode]);

  // Default to standard clean QR code (no frame, no decorations)
  const defaultTemplate = TEMPLATES[0];

  const [style, setStyle] = useState<QRStyleState>(defaultTemplate.style);
  const [content, setContent] = useState<QRContentState>({
    type: 'url',
    url: 'https://example.com',
    text: 'Hello World!',
    wifi: {
      ssid: 'CoffeeShop-Guest',
      password: 'CoffeePassword2026',
      encryption: 'WPA',
      hidden: false
    },
    vcard: {
      firstName: 'Emily',
      lastName: 'Clark',
      phone: '+1 (555) 012-3456',
      mobile: '+1 (555) 012-7890',
      email: 'emily@example.com',
      organization: 'Design Studio',
      title: 'Art Director',
      url: 'https://emilyclark.design',
      street: '124 Blossom Lane',
      city: 'Portland',
      country: 'USA',
      note: 'Met at Design Summit'
    },
    email: {
      email: 'contact@example.com',
      subject: 'Inquiry from QR',
      body: 'Hello, I scanned your QR code!'
    },
    sms: {
      phone: '+15551234567',
      message: 'Hello from QR code!'
    },
    whatsapp: {
      phone: '15551234567',
      message: 'Hello! I scanned your QR code.'
    },
    event: {
      title: 'Special Event Celebration',
      location: 'Grand Ballroom Terrace',
      start: '2026-10-18T18:00',
      end: '2026-10-18T22:00',
      description: 'Join us for dining and celebration.'
    },
    crypto: {
      currency: 'bitcoin',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      amount: '0.005',
      message: 'Payment via QR'
    }
  });

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const handleResetSettings = () => {
    setStyle(defaultTemplate.style);
  };

  return (
    <div className="min-h-screen bg-[#faf8fb] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-pink-500 selection:text-white">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Title (matching screenshot) */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create & Customize Dynamic QR Code for{' '}
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              FREE
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Easily generate, manage and customize your QR codes purely client-side
          </p>
        </div>

        {/* 1 -> 2 -> 3 Step Layout (matching screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Step 1 (Content) & Step 2 (Customize) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Add Content */}
            <ContentEditor
              content={content}
              onChange={setContent}
            />

            {/* Step 2: Customize */}
            <StyleEditor
              style={style}
              onChange={setStyle}
              onReset={handleResetSettings}
            />
          </div>

          {/* Right Column: Step 3 (Generate & download QR) */}
          <div className="lg:col-span-5">
            <QRPreview
              content={content}
              style={style}
              onOpenScanner={() => setIsScannerOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            QR Studio — 100% Client-Side. No telemetry, no backend, zero tracking.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Pink Theme Active • Light & Dark Mode Enabled</span>
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
