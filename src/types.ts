export type ContentType = 
  | 'url' 
  | 'text' 
  | 'wifi' 
  | 'vcard' 
  | 'email' 
  | 'sms' 
  | 'whatsapp' 
  | 'event' 
  | 'crypto';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  mobile: string;
  email: string;
  organization: string;
  title: string;
  url: string;
  street: string;
  city: string;
  country: string;
  note: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface EventData {
  title: string;
  location: string;
  start: string;
  end: string;
  description: string;
}

export interface CryptoData {
  currency: 'bitcoin' | 'ethereum' | 'usdt';
  address: string;
  amount: string;
  message: string;
}

export interface QRContentState {
  type: ContentType;
  url: string;
  text: string;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  sms: SmsData;
  whatsapp: WhatsAppData;
  event: EventData;
  crypto: CryptoData;
}

export type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type FrameType =
  | 'none'
  | 'anniversary-hearts'
  | 'birthday-confetti'
  | 'scan-me-bottom'
  | 'scan-me-top'
  | 'badge-ribbon'
  | 'polaroid'
  | 'restaurant-menu'
  | 'wifi-card'
  | 'neon-bracket'
  | 'minimal-rounded';

export type FrameFont = 'script' | 'serif' | 'sans' | 'display';

export interface QRStyleState {
  dotsType: DotType;
  cornersSquareType: CornerSquareType;
  cornersDotType: CornerDotType;
  
  // Dot Colors
  useGradient: boolean;
  gradientType: 'linear' | 'radial';
  dotColor: string;
  gradientColor2: string;
  gradientRotation: number;

  // Eyes Colors
  cornersSquareColor: string;
  cornersDotColor: string;

  // Background
  backgroundColor: string;
  transparentBackground: boolean;

  // Logo
  logoSrc: string | null;
  logoSize: number; // 0.1 to 0.4
  logoMargin: number; // 0 to 20
  hideBehindLogo: boolean;

  // Technical
  errorCorrectionLevel: ErrorCorrectionLevel;

  // Frame & Template
  frame: {
    type: FrameType;
    text: string;
    subtext?: string;
    fontFamily: FrameFont;
    textColor: string;
    frameColor: string;
    accentColor: string;
    badgeColor?: string;
  };
}

export interface TemplatePreset {
  id: string;
  name: string;
  category: 'Celebration' | 'Business' | 'Dining & Events' | 'Social & Tech' | 'Classic';
  description: string;
  previewThumbnail?: string;
  style: QRStyleState;
  sampleContent?: Partial<QRContentState>;
}
