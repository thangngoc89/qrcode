import happyAnniversarySvg from '../templates/happy_anniversary.svg?raw';

export interface SvgTemplateInfo {
  id: string;
  name: string;
  filename: string;
  rawSvg: string;
  recommendedDotType: 'dots' | 'rounded';
  recommendedCornerSquareType: 'dot';
  recommendedCornerDotType: 'dot';
  defaultDotColor: string;
  defaultCornerColor: string;
}

export const BUILTIN_SVG_TEMPLATES: Record<string, SvgTemplateInfo> = {
  'happy-anniversary-svg': {
    id: 'happy-anniversary-svg',
    name: 'Happy Anniversary (Exact me-qr Vector)',
    filename: 'happy_anniversary.svg',
    rawSvg: happyAnniversarySvg,
    recommendedDotType: 'dots',
    recommendedCornerSquareType: 'dot',
    recommendedCornerDotType: 'dot',
    defaultDotColor: '#9f6eff',
    defaultCornerColor: '#ff6caf',
  }
};

export interface SvgInjectOptions {
  dotColor?: string;
  cornerColor?: string;
  syncColors?: boolean;
}

/**
 * Injects a dynamically generated QR Code SVG into an SVG Template
 */
export function injectQRIntoSvgTemplate(
  templateSvg: string,
  qrSvgString: string,
  options: SvgInjectOptions = {}
): string {
  let result = templateSvg;

  // Normalize qrSvgString: make sure it has width/height or viewBox
  let cleanQrSvg = qrSvgString.trim();

  // 1. Detect me-qr pattern:
  // e.g. <g transform="translate(470, 480)scale(1.9)" fill="none"><svg width="300" height="300">...</svg></g>
  const meQrGroupRegex = /(<g transform="translate\([^"]+\)scale\([^"]+\)"[^>]*>)([\s\S]*?)(<\/g>)/;
  if (meQrGroupRegex.test(result)) {
    result = result.replace(meQrGroupRegex, (_match, prefix, _inner, suffix) => {
      return `${prefix}${cleanQrSvg}${suffix}`;
    });
  } 
  // 2. Detect placeholder rect: <rect id="qr-placeholder" x="100" y="100" width="300" height="300" .../>
  else if (/<rect[^>]*id="(?:qr-placeholder|qr-target|qrcode)"[^>]*\/>/i.test(result)) {
    const rectRegex = /<rect[^>]*id="(?:qr-placeholder|qr-target|qrcode)"[^>]*\/>/i;
    const rectMatch = result.match(rectRegex);
    if (rectMatch) {
      const tag = rectMatch[0];
      const xMatch = tag.match(/x="([^"]+)"/);
      const yMatch = tag.match(/y="([^"]+)"/);
      const wMatch = tag.match(/width="([^"]+)"/);
      const hMatch = tag.match(/height="([^"]+)"/);

      const x = xMatch ? xMatch[1] : '0';
      const y = yMatch ? yMatch[1] : '0';
      const w = wMatch ? wMatch[1] : '300';
      const h = hMatch ? hMatch[1] : '300';

      const replacement = `<g transform="translate(${x}, ${y})"><svg width="${w}" height="${h}" viewBox="0 0 300 300">${cleanQrSvg}</svg></g>`;
      result = result.replace(rectRegex, replacement);
    }
  }
  // 3. Detect container group: <g id="qr-container">...</g>
  else if (/<g[^>]*id="(?:qr-container|qrcode|qr-target)"[^>]*>([\s\S]*?)<\/g>/i.test(result)) {
    result = result.replace(
      /(<g[^>]*id="(?:qr-container|qrcode|qr-target)"[^>]*>)([\s\S]*?)(<\/g>)/i,
      `$1${cleanQrSvg}$3`
    );
  }
  // 4. Detect inner nested <svg width="300" height="300">...</svg>
  else if (/<svg width="300" height="300"[\s\S]*?<\/svg>/.test(result)) {
    result = result.replace(/<svg width="300" height="300"[\s\S]*?<\/svg>/, cleanQrSvg);
  }

  // 5. Optionally harmonize/re-theme template frame colors with chosen user colors
  if (options.syncColors && options.dotColor && options.cornerColor) {
    // In happy_anniversary.svg:
    // .cls-5ann8 is purple (#9f6eff)
    // .cls-5ann5 is pink (#ff6caf)
    result = result
      .replace(/#9f6eff/gi, options.dotColor)
      .replace(/#ff6caf/gi, options.cornerColor);
  }

  return result;
}

/**
 * Renders an SVG string onto an HTML5 Canvas at target resolution
 */
export function renderSvgStringToCanvas(
  svgString: string,
  targetSize = 1500
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas 2D context not available'));
      return;
    }

    const img = new Image();
    // Wrap as SVG data URL
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}
