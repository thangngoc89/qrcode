import React from 'react';
import { 
  Globe, 
  AlignLeft, 
  Wifi, 
  Contact, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  Calendar, 
  Coins 
} from 'lucide-react';
import { ContentType, QRContentState } from '../types';

interface ContentEditorProps {
  content: QRContentState;
  onChange: (updater: (prev: QRContentState) => QRContentState) => void;
}

const TABS: { id: ContentType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'url', label: 'Website URL', icon: Globe },
  { id: 'wifi', label: 'WiFi Network', icon: Wifi },
  { id: 'vcard', label: 'Contact Card', icon: Contact },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'text', label: 'Plain Text', icon: AlignLeft },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'sms', label: 'SMS / Text', icon: PhoneCall },
  { id: 'event', label: 'Calendar Event', icon: Calendar },
  { id: 'crypto', label: 'Crypto Payment', icon: Coins },
];

export const ContentEditor: React.FC<ContentEditorProps> = ({ content, onChange }) => {
  const setType = (type: ContentType) => {
    onChange(prev => ({ ...prev, type }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>1. Content & Data</span>
          </h2>
          <p className="text-xs text-slate-400">Choose what you want the QR code to open or share</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 p-1 bg-slate-950/60 rounded-xl mb-5 border border-slate-800/80">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = content.type === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setType(tab.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="truncate w-full text-center">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-4">
        {content.type === 'url' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Website or Landing Page URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={content.url}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, url: val }));
                }}
                placeholder="https://yourwebsite.com/promotion"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Enter any web link, Google Drive file, YouTube video, or digital invitation.
            </p>
          </div>
        )}

        {content.type === 'wifi' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={content.wifi.ssid}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, wifi: { ...prev.wifi, ssid: val } }));
                }}
                placeholder="e.g. CafeGuestWiFi"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="text"
                  value={content.wifi.password}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, wifi: { ...prev.wifi, password: val } }));
                  }}
                  placeholder="Network password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Security Type</label>
                <select
                  value={content.wifi.encryption}
                  onChange={e => {
                    const val = e.target.value as 'WPA' | 'WEP' | 'nopass';
                    onChange(prev => ({ ...prev, wifi: { ...prev.wifi, encryption: val } }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={content.wifi.hidden}
                onChange={e => {
                  const val = e.target.checked;
                  onChange(prev => ({ ...prev, wifi: { ...prev.wifi, hidden: val } }));
                }}
                className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              Hidden Network (Hidden SSID)
            </label>
          </div>
        )}

        {content.type === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={content.vcard.firstName}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, firstName: val } }));
                  }}
                  placeholder="Jane"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={content.vcard.lastName}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, lastName: val } }));
                  }}
                  placeholder="Doe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={content.vcard.phone}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, phone: val } }));
                  }}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={content.vcard.email}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, email: val } }));
                  }}
                  placeholder="jane@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Org</label>
                <input
                  type="text"
                  value={content.vcard.organization}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, organization: val } }));
                  }}
                  placeholder="Acme Studio"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={content.vcard.title}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, vcard: { ...prev.vcard, title: val } }));
                  }}
                  placeholder="Design Lead"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website</label>
              <input
                type="url"
                value={content.vcard.url}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, vcard: { ...prev.vcard, url: val } }));
                }}
                placeholder="https://janedoe.me"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {content.type === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp Phone Number (with Country Code)
              </label>
              <input
                type="tel"
                value={content.whatsapp.phone}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, phone: val } }));
                }}
                placeholder="e.g. 14155552671 (no '+' or spaces needed)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pre-filled Message (Optional)
              </label>
              <textarea
                rows={2}
                value={content.whatsapp.message}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, whatsapp: { ...prev.whatsapp, message: val } }));
                }}
                placeholder="Hi! I scanned your QR code and would like to learn more..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {content.type === 'text' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Plain Text</label>
            <textarea
              rows={3}
              value={content.text}
              onChange={e => {
                const val = e.target.value;
                onChange(prev => ({ ...prev, text: val }));
              }}
              placeholder="Enter any custom message, promo voucher code, or memo..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {content.type === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Email</label>
              <input
                type="email"
                value={content.email.email}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, email: { ...prev.email, email: val } }));
                }}
                placeholder="inquiry@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Subject</label>
              <input
                type="text"
                value={content.email.subject}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, email: { ...prev.email, subject: val } }));
                }}
                placeholder="Inquiry from QR Code"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {content.type === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={content.sms.phone}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, sms: { ...prev.sms, phone: val } }));
                }}
                placeholder="+15551234567"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SMS Message</label>
              <input
                type="text"
                value={content.sms.message}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, sms: { ...prev.sms, message: val } }));
                }}
                placeholder="Subscribed to updates"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {content.type === 'event' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
              <input
                type="text"
                value={content.event.title}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, event: { ...prev.event, title: val } }));
                }}
                placeholder="Anniversary Dinner Party"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={content.event.location}
                onChange={e => {
                  const val = e.target.value;
                  onChange(prev => ({ ...prev, event: { ...prev.event, location: val } }));
                }}
                placeholder="Sunset Garden Bistro, Room 4"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={content.event.start}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, event: { ...prev.event, start: val } }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={content.event.end}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, event: { ...prev.event, end: val } }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {content.type === 'crypto' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cryptocurrency</label>
                <select
                  value={content.crypto.currency}
                  onChange={e => {
                    const val = e.target.value as 'bitcoin' | 'ethereum' | 'usdt';
                    onChange(prev => ({ ...prev, crypto: { ...prev.crypto, currency: val } }));
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="bitcoin">Bitcoin (BTC)</option>
                  <option value="ethereum">Ethereum (ETH)</option>
                  <option value="usdt">Tether (USDT)</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={content.crypto.address}
                  onChange={e => {
                    const val = e.target.value;
                    onChange(prev => ({ ...prev, crypto: { ...prev.crypto, address: val } }));
                  }}
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
