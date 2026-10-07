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
  let cleanQrSvg = qrSvgString.trim();

  // Try DOMParser if in browser
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(templateSvg, 'image/svg+xml');
      const qrDoc = parser.parseFromString(cleanQrSvg, 'image/svg+xml');

      const parseError = doc.querySelector('parsererror') || qrDoc.querySelector('parsererror');
      if (!parseError) {
        // 1. Check placeholder rect: <rect id="qr-placeholder" ...>
        const placeholder = doc.querySelector('#qr-placeholder, #qr-target, #qrcode');
        if (placeholder && placeholder.tagName.toLowerCase() === 'rect') {
          const x = placeholder.getAttribute('x') || '0';
          const y = placeholder.getAttribute('y') || '0';
          const w = placeholder.getAttribute('width') || '300';
          const h = placeholder.getAttribute('height') || '300';

          const g = doc.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('transform', `translate(${x}, ${y})`);

          const qrEl = doc.importNode(qrDoc.documentElement, true);
          qrEl.setAttribute('width', w);
          qrEl.setAttribute('height', h);
          g.appendChild(qrEl);

          placeholder.parentNode?.replaceChild(g, placeholder);

          const serializer = new XMLSerializer();
          result = serializer.serializeToString(doc);
        } else {
          // 2. Check for innermost SVG (me-qr pattern)
          const allSvgs = doc.querySelectorAll('svg');
          if (allSvgs.length > 1) {
            const innerQrSvg = allSvgs[allSvgs.length - 1];
            const qrEl = doc.importNode(qrDoc.documentElement, true);
            qrEl.setAttribute('width', '300');
            qrEl.setAttribute('height', '300');

            innerQrSvg.parentNode?.replaceChild(qrEl, innerQrSvg);

            const serializer = new XMLSerializer();
            result = serializer.serializeToString(doc);
          }
        }
      }
    } catch (e) {
      console.warn('DOMParser injection encountered an issue, using regex replacer:', e);
    }
  }

  // Fallback / Regex replacer if DOMParser didn't update result
  if (result === templateSvg) {
    // me-qr pattern: replace inner <svg width="300" height="300">...</svg>
    const innerQrSvgRegex = /<svg\s+width="300"\s+height="300"[^>]*>[\s\S]*?<\/svg>/i;
    if (innerQrSvgRegex.test(result)) {
      result = result.replace(innerQrSvgRegex, cleanQrSvg);
    } else if (/<rect[^>]*id="(?:qr-placeholder|qr-target|qrcode)"[^>]*\/>/i.test(result)) {
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
  }

  // Harmonize frame colors if requested
  if (options.syncColors && options.dotColor && options.cornerColor) {
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

    let cleanSvg = svgString;
    if (!cleanSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
      cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const img = new Image();
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const cleanup = () => {
      URL.revokeObjectURL(url);
    };

    img.onload = () => {
      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(img, 0, 0, targetSize, targetSize);
      cleanup();
      resolve(canvas);
    };

    img.onerror = () => {
      // Fallback: Data URI Base64 encoding
      try {
        const base64 = btoa(unescape(encodeURIComponent(cleanSvg)));
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          ctx.clearRect(0, 0, targetSize, targetSize);
          ctx.drawImage(fallbackImg, 0, 0, targetSize, targetSize);
          cleanup();
          resolve(canvas);
        };
        fallbackImg.onerror = (err) => {
          cleanup();
          reject(err);
        };
        fallbackImg.src = `data:image/svg+xml;base64,${base64}`;
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    img.src = url;
  });
}
