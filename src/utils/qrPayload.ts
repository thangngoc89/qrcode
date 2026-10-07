import { QRContentState } from '../types';

export function formatEventDate(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  // Convert local ISO string YYYY-MM-DDTHH:mm to YYYYMMDDTHHmmSSZ
  const d = new Date(dateTimeStr);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function generateQRPayload(content: QRContentState): string {
  switch (content.type) {
    case 'url': {
      let url = content.url.trim();
      if (!url) return 'https://example.com';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;
    }

    case 'text':
      return content.text || 'Hello World!';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = content.wifi;
      const escape = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');
      const enc = encryption === 'nopass' ? 'nopass' : encryption;
      return `WIFI:S:${escape(ssid || 'MyWiFi')};T:${enc};P:${escape(password || '')};H:${hidden ? 'true' : 'false'};;`;
    }

    case 'vcard': {
      const v = content.vcard;
      const fullName = `${v.firstName || ''} ${v.lastName || ''}`.trim() || 'Contact';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName || ''};${v.firstName || ''};;;`,
        `FN:${fullName}`
      ];
      if (v.organization) lines.push(`ORG:${v.organization}`);
      if (v.title) lines.push(`TITLE:${v.title}`);
      if (v.phone) lines.push(`TEL;TYPE=CELL:${v.phone}`);
      if (v.mobile) lines.push(`TEL;TYPE=WORK:${v.mobile}`);
      if (v.email) lines.push(`EMAIL:${v.email}`);
      if (v.url) lines.push(`URL:${v.url}`);
      if (v.street || v.city || v.country) {
        lines.push(`ADR:;;${v.street || ''};${v.city || ''};;;${v.country || ''}`);
      }
      if (v.note) lines.push(`NOTE:${v.note}`);
      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'email': {
      const { email, subject, body } = content.email;
      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (body) params.set('body', body);
      const query = params.toString();
      return `mailto:${email || 'hello@example.com'}${query ? `?${query}` : ''}`;
    }

    case 'sms': {
      const { phone, message } = content.sms;
      return `smsto:${phone || ''}:${message || ''}`;
    }

    case 'whatsapp': {
      const { phone, message } = content.whatsapp;
      const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(message || '');
      return `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
    }

    case 'event': {
      const e = content.event;
      const dtStart = formatEventDate(e.start);
      const dtEnd = formatEventDate(e.end);
      const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${e.title || 'Special Event'}`
      ];
      if (e.location) lines.push(`LOCATION:${e.location}`);
      if (e.description) lines.push(`DESCRIPTION:${e.description}`);
      if (dtStart) lines.push(`DTSTART:${dtStart}`);
      if (dtEnd) lines.push(`DTEND:${dtEnd}`);
      lines.push('END:VEVENT');
      lines.push('END:VCALENDAR');
      return lines.join('\n');
    }

    case 'crypto': {
      const { currency, address, amount, message } = content.crypto;
      if (!address) return 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      const params = new URLSearchParams();
      if (amount) params.set('amount', amount);
      if (message) params.set('message', message);
      const qs = params.toString();
      return `${currency}:${address}${qs ? `?${qs}` : ''}`;
    }

    default:
      return 'https://example.com';
  }
}
