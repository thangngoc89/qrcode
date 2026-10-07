import { TemplatePreset } from '../types';

export const TEMPLATES: TemplatePreset[] = [
  {
    id: 'anniversary-hearts',
    name: 'Happy Anniversary (Featured)',
    category: 'Celebration',
    description: 'Pastel purple dots, hot pink target eyes, surrounded by floating hearts and elegant script typography.',
    style: {
      dotsType: 'dots',
      cornersSquareType: 'dot',
      cornersDotType: 'dot',
      useGradient: false,
      gradientType: 'linear',
      dotColor: '#9f6eff',
      gradientColor2: '#a855f7',
      gradientRotation: 45,
      cornersSquareColor: '#ff6caf',
      cornersDotColor: '#ff6caf',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.25,
      logoMargin: 6,
      hideBehindLogo: true,
      errorCorrectionLevel: 'H',
      svgTemplate: {
        enabled: true,
        templateId: 'happy-anniversary-svg',
        rawSvg: null,
        syncColors: false,
      },
      frame: {
        type: 'anniversary-hearts',
        text: 'Happy Anniversary',
        subtext: '',
        fontFamily: 'script',
        textColor: '#9f6eff',
        frameColor: '#ff6caf',
        accentColor: '#9f6eff',
      }
    },
    sampleContent: {
      type: 'url',
      url: 'https://our-story.love/anniversary'
    }
  },
  {
    id: 'wedding-elegance',
    name: 'Wedding & Romance',
    category: 'Celebration',
    description: 'Champagne gold accents, refined dots, and a gentle floral heart wreath.',
    style: {
      dotsType: 'classy-rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      useGradient: true,
      gradientType: 'linear',
      dotColor: '#b45309',
      gradientColor2: '#d97706',
      gradientRotation: 45,
      cornersSquareColor: '#92400e',
      cornersDotColor: '#b45309',
      backgroundColor: '#fffbeb',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.22,
      logoMargin: 5,
      hideBehindLogo: true,
      errorCorrectionLevel: 'H',
      frame: {
        type: 'anniversary-hearts',
        text: 'Forever & Always',
        subtext: 'Scan for Our Wedding Schedule',
        fontFamily: 'script',
        textColor: '#78350f',
        frameColor: '#d97706',
        accentColor: '#f59e0b',
      }
    },
    sampleContent: {
      type: 'event',
      event: {
        title: 'Wedding Celebration',
        location: 'Grand Ballroom & Gardens',
        start: '2026-10-18T16:00',
        end: '2026-10-18T23:00',
        description: 'Celebrate our special day with us!'
      }
    }
  },
  {
    id: 'birthday-party',
    name: 'Birthday Bash',
    category: 'Celebration',
    description: 'Festive multicolored confetti and balloons with joyful party typography.',
    style: {
      dotsType: 'rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      useGradient: true,
      gradientType: 'linear',
      dotColor: '#ea580c',
      gradientColor2: '#f59e0b',
      gradientRotation: 90,
      cornersSquareColor: '#0284c7',
      cornersDotColor: '#ea580c',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.24,
      logoMargin: 6,
      hideBehindLogo: true,
      errorCorrectionLevel: 'Q',
      frame: {
        type: 'birthday-confetti',
        text: 'Happy Birthday!',
        subtext: 'Scan to RSVP & Gifts',
        fontFamily: 'display',
        textColor: '#0284c7',
        frameColor: '#f59e0b',
        accentColor: '#ec4899',
      }
    },
    sampleContent: {
      type: 'url',
      url: 'https://birthday.party/rsvp'
    }
  },
  {
    id: 'wifi-connect',
    name: 'Guest WiFi Connect',
    category: 'Social & Tech',
    description: 'Sleek guest wireless network badge with antenna frame and password callout.',
    style: {
      dotsType: 'classy',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      useGradient: true,
      gradientType: 'linear',
      dotColor: '#2563eb',
      gradientColor2: '#06b6d4',
      gradientRotation: 45,
      cornersSquareColor: '#1d4ed8',
      cornersDotColor: '#06b6d4',
      backgroundColor: '#f8fafc',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.22,
      logoMargin: 6,
      hideBehindLogo: true,
      errorCorrectionLevel: 'Q',
      frame: {
        type: 'wifi-card',
        text: 'FREE GUEST WI-FI',
        subtext: 'Scan to Connect Instantly',
        fontFamily: 'display',
        textColor: '#1e293b',
        frameColor: '#2563eb',
        accentColor: '#0ea5e9',
        badgeColor: '#e0f2fe'
      }
    },
    sampleContent: {
      type: 'wifi',
      wifi: {
        ssid: 'CoffeeShop-Guest',
        password: 'WelcomeCoffee2026',
        encryption: 'WPA',
        hidden: false
      }
    }
  },
  {
    id: 'restaurant-touchless',
    name: 'Digital Restaurant Menu',
    category: 'Dining & Events',
    description: 'Appetizing bistro frame with cutlery emblem, ideal for table tents and bar tops.',
    style: {
      dotsType: 'rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'square',
      useGradient: true,
      gradientType: 'linear',
      dotColor: '#9a3412',
      gradientColor2: '#c2410c',
      gradientRotation: 60,
      cornersSquareColor: '#7c2d12',
      cornersDotColor: '#ea580c',
      backgroundColor: '#fffdf5',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.22,
      logoMargin: 5,
      hideBehindLogo: true,
      errorCorrectionLevel: 'H',
      frame: {
        type: 'restaurant-menu',
        text: 'SCAN FOR MENU',
        subtext: 'Food • Drinks • Desserts',
        fontFamily: 'serif',
        textColor: '#431407',
        frameColor: '#c2410c',
        accentColor: '#f97316',
        badgeColor: '#ffedd5'
      }
    },
    sampleContent: {
      type: 'url',
      url: 'https://mybistro.menu'
    }
  },
  {
    id: 'classic-scan-me',
    name: 'Classic "SCAN ME" Badge',
    category: 'Classic',
    description: 'High-contrast universal callout banner widely used for flyers and packaging.',
    style: {
      dotsType: 'square',
      cornersSquareType: 'square',
      cornersDotType: 'square',
      useGradient: false,
      gradientType: 'linear',
      dotColor: '#0f172a',
      gradientColor2: '#334155',
      gradientRotation: 0,
      cornersSquareColor: '#0f172a',
      cornersDotColor: '#0f172a',
      backgroundColor: '#ffffff',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.2,
      logoMargin: 4,
      hideBehindLogo: true,
      errorCorrectionLevel: 'M',
      frame: {
        type: 'scan-me-bottom',
        text: 'SCAN ME',
        subtext: '',
        fontFamily: 'display',
        textColor: '#ffffff',
        frameColor: '#0f172a',
        accentColor: '#3b82f6',
        badgeColor: '#0f172a'
      }
    },
    sampleContent: {
      type: 'url',
      url: 'https://example.com'
    }
  },
  {
    id: 'executive-vcard',
    name: 'Executive vCard',
    category: 'Business',
    description: 'Sharp corporate slate with emerald accents for digital business cards.',
    style: {
      dotsType: 'extra-rounded',
      cornersSquareType: 'extra-rounded',
      cornersDotType: 'dot',
      useGradient: true,
      gradientType: 'linear',
      dotColor: '#065f46',
      gradientColor2: '#047857',
      gradientRotation: 135,
      cornersSquareColor: '#064e3b',
      cornersDotColor: '#059669',
      backgroundColor: '#f0fdf4',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.2,
      logoMargin: 5,
      hideBehindLogo: true,
      errorCorrectionLevel: 'Q',
      frame: {
        type: 'minimal-rounded',
        text: 'SAVE CONTACT',
        subtext: 'Tap or scan to add to phonebook',
        fontFamily: 'sans',
        textColor: '#064e3b',
        frameColor: '#059669',
        accentColor: '#10b981',
      }
    },
    sampleContent: {
      type: 'vcard',
      vcard: {
        firstName: 'Alexander',
        lastName: 'Wright',
        phone: '+1 555-0199',
        mobile: '+1 555-0188',
        email: 'alex.wright@venture.io',
        organization: 'Venture Dynamics',
        title: 'Managing Director',
        url: 'https://venturedynamics.io',
        street: '100 Innovation Way',
        city: 'San Francisco',
        country: 'USA',
        note: 'Met at Tech Summit'
      }
    }
  },
  {
    id: 'polaroid-retro',
    name: 'Polaroid Memory',
    category: 'Classic',
    description: 'Instant film photo card with vintage handwritten note at the bottom.',
    style: {
      dotsType: 'classy',
      cornersSquareType: 'dot',
      cornersDotType: 'dot',
      useGradient: false,
      gradientType: 'linear',
      dotColor: '#1c1917',
      gradientColor2: '#44403c',
      gradientRotation: 0,
      cornersSquareColor: '#1c1917',
      cornersDotColor: '#1c1917',
      backgroundColor: '#fafaf9',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.2,
      logoMargin: 4,
      hideBehindLogo: true,
      errorCorrectionLevel: 'M',
      frame: {
        type: 'polaroid',
        text: 'Our Best Memories ✨',
        subtext: '',
        fontFamily: 'script',
        textColor: '#292524',
        frameColor: '#e7e5e4',
        accentColor: '#a8a29e',
      }
    },
    sampleContent: {
      type: 'url',
      url: 'https://photos.app.goo.gl/sample'
    }
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Matrix',
    category: 'Social & Tech',
    description: 'Electric cyan and purple with futuristic bracket corners and dark mode contrast.',
    style: {
      dotsType: 'square',
      cornersSquareType: 'square',
      cornersDotType: 'square',
      useGradient: true,
      gradientType: 'linear',
      dotColor: '#06b6d4',
      gradientColor2: '#a855f7',
      gradientRotation: 45,
      cornersSquareColor: '#06b6d4',
      cornersDotColor: '#ec4899',
      backgroundColor: '#090d16',
      transparentBackground: false,
      logoSrc: null,
      logoSize: 0.22,
      logoMargin: 6,
      hideBehindLogo: true,
      errorCorrectionLevel: 'Q',
      frame: {
        type: 'neon-bracket',
        text: '[ ACCESS PORTAL ]',
        subtext: 'SYS//VERIFIED',
        fontFamily: 'display',
        textColor: '#22d3ee',
        frameColor: '#06b6d4',
        accentColor: '#a855f7',
      }
    },
    sampleContent: {
      type: 'url',
      url: 'https://matrix.dev'
    }
  }
];
