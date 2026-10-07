import React from 'react';
import { 
  Link2, 
  Image as ImageIcon, 
  AlignLeft, 
  FileText, 
  MapPin, 
  MessageSquare, 
  Instagram, 
  Youtube, 
  Wifi, 
  Contact, 
  Mail, 
  PhoneCall, 
  Coins 
} from 'lucide-react';
import { ContentType, QRContentState } from '../types';

interface ContentEditorProps {
  content: QRContentState;
  onChange: (updater: (prev: QRContentState) => QRContentState) => void;
}

const CONTENT_TYPES: { id: ContentType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'url', label: 'URL / Link', icon: Link2 },
  { id: 'text', label: 'Text', icon: AlignLeft },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'vcard', label: 'vCard', icon: Contact },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'sms', label: 'SMS', icon: PhoneCall },
  { id: 'event', label: 'Event', icon: MapPin },
  { id: 'crypto', label: 'Crypto', icon: Coins },
];

export const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => {
  const setType = (type: ContentType) => {
    onChange(prev => ({ ...prev, type }));
  };

  return (
    <div className="space-y-4">
      {/* Horizontal Type Selector Bar (me-qr style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {CONTENT_TYPES.map(tab => {
          const Icon = tab.icon;
          const isActive = content.type === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setType(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] py-3 px-2 rounded-xl text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-pink-50 border-pink-400 text-pink-600 shadow-sm shadow-pink-100 dark:bg-pink-950/40 dark:border-pink-500/60 dark:text-pink-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-800 dark:text-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1.5 ${isActive ? 'text-pink-600 dark:text-pink-400' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="truncate w-full text-center text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step 1: Add Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold flex items-center justify-center text-xs">
            1
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Add Content
          </h2>
        </div>

        {/* Input area */}
        {content.type === 'url' && (
          <div>
            <div className="relative">
              <input
                type="url"
                value={content.url}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, url: val }));
                }}
                placeholder="Put your link here (e.g. https://yourwebsite.com)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition"
              />
            </div>
            <div className="flex items-center gap-2 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>100% Free client-side QR generation • No link expiration • No redirect backend</span>
            </div>
          </div>
        )}

        {content.type === 'text' && (
          <div>
            <textarea
              rows={3}
              value={content.text}
              onChange={e => {
                const val = e.target.value;
                onChange(prev => ({ ...prev, text: val }));
              }}
              placeholder="Enter your message, voucher code, or memo..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
        )}

        {content.type === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="tel"
                value={content.whatsapp.phone}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, phone: val } }));
                }}
                placeholder="e.g. 14155552671 (numbers only)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pre-filled Message (Optional)
              </label>
              <input
                type="text"
                value={content.whatsapp.message}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, message: val } }));
                }}
                placeholder="Hi! I scanned your QR code..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {content.type === 'wifi' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={content.wifi.ssid}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, wifi: { ...prev.wifi, ssid: val } }));
                }}
                placeholder="e.g. CoffeeShop_Guest"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  value={content.wifi.password}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, wifi: { ...prev.wifi, password: val } }));
                  }}
                  placeholder="Network password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Security</label>
                <select
                  value={content.wifi.encryption}
                  onChange={e => {
                    const val = e.target.value as 'WPA' | 'WEP' | 'nopass';
                    onChange(prev => ({ ...prev, wifi: { ...prev.wifi, encryption: val } }));
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                >
                  <option value="WPA">WPA/WPA2/WPA3 (Standard)</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {content.type === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={content.vcard.firstName}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, firstName: val } }));
                  }}
                  placeholder="Jane"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={content.vcard.lastName}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, lastName: val } }));
                  }}
                  placeholder="Doe"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={content.vcard.phone}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, phone: val } }));
                  }}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={content.vcard.email}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, email: val } }));
                  }}
                  placeholder="jane@company.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>
        )}

        {content.type === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={content.email.email}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, email: { ...prev.email, email: val } }));
                }}
                placeholder="contact@example.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input
                type="text"
                value={content.email.subject}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, email: { ...prev.email, subject: val } }));
                }}
                placeholder="Inquiry from QR"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {content.type === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={content.sms.phone}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, sms: { ...prev.sms, phone: val } }));
                }}
                placeholder="+15551234567"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {content.type === 'event' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Event Title</label>
              <input
                type="text"
                value={content.event.title}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, event: { ...prev.event, title: val } }));
                }}
                placeholder="Special Celebration Event"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {content.type === 'crypto' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Wallet Address</label>
            <input
              type="text"
              value={content.crypto.address}
              onChange={e => {
                const val = e.target.value;
                onChange(prev => ({ ...prev, crypto: { ...prev.crypto, address: val } }));
              }}
              placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:border-pink-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};
