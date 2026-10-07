import { QRStyleState } from '../types';

// Helper to draw a heart shape path on Canvas
export function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotationDeg = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.fillStyle = color;
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(0, topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    0, 0,
    -size / 2, 0,
    -size / 2, topCurveHeight
  );
  // bottom left curve
  ctx.bezierCurveTo(
    -size / 2, (size + topCurveHeight) / 2,
    0, (size + topCurveHeight) / 1.2,
    0, size
  );
  // bottom right curve
  ctx.bezierCurveTo(
    0, (size + topCurveHeight) / 1.2,
    size / 2, (size + topCurveHeight) / 2,
    size / 2, topCurveHeight
  );
  // top right curve
  ctx.bezierCurveTo(
    size / 2, 0,
    0, 0,
    0, topCurveHeight
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Helper to draw a star shape
export function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) {
  ctx.save();
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export interface ComposeOptions {
  qrImage: HTMLImageElement | HTMLCanvasElement;
  style: QRStyleState;
  targetSize: number; // e.g. 1000 for high-res export
}

/**
 * Composites the styled QR image with selected decorative frame, wreath, badges, and typography
 */
export async function renderComposedQRCanvas(options: ComposeOptions): Promise<HTMLCanvasElement> {
  const { qrImage, style, targetSize } = options;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const frameType = style.frame.type;

  // Set canvas dimension based on frame type
  // Polaroid is taller, hearts wreath has extra decorative margins
  let canvasWidth = targetSize;
  let canvasHeight = targetSize;

  if (frameType === 'polaroid') {
    canvasHeight = Math.round(targetSize * 1.25);
  } else if (frameType === 'scan-me-bottom' || frameType === 'restaurant-menu' || frameType === 'wifi-card') {
    canvasHeight = Math.round(targetSize * 1.18);
  } else if (frameType === 'scan-me-top') {
    canvasHeight = Math.round(targetSize * 1.15);
  } else if (frameType === 'anniversary-hearts' || frameType === 'birthday-confetti') {
    canvasHeight = Math.round(targetSize * 1.05);
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // 1. Draw Background
  if (!style.transparentBackground) {
    ctx.fillStyle = style.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  const primaryAccent = style.frame.frameColor || style.dotColor || '#f43f5e';
  const secondaryAccent = style.frame.accentColor || '#8b5cf6';
  const textColor = style.frame.textColor || '#1e293b';

  // Calculate QR placement
  let qrX = 0;
  let qrY = 0;
  let qrSize = targetSize * 0.75;

  if (frameType === 'none') {
    qrSize = targetSize;
    qrX = 0;
    qrY = 0;
  } else if (frameType === 'anniversary-hearts') {
    // Exact proportion like user sample: centered QR code with wreath arc
    qrSize = targetSize * 0.58;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = canvasHeight * 0.28;
  } else if (frameType === 'birthday-confetti') {
    qrSize = targetSize * 0.62;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = canvasHeight * 0.22;
  } else if (frameType === 'polaroid') {
    qrSize = targetSize * 0.8;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = targetSize * 0.1;
  } else if (frameType === 'scan-me-bottom') {
    qrSize = targetSize * 0.8;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = targetSize * 0.08;
  } else if (frameType === 'scan-me-top') {
    qrSize = targetSize * 0.8;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = canvasHeight - qrSize - targetSize * 0.08;
  } else if (frameType === 'restaurant-menu' || frameType === 'wifi-card') {
    qrSize = targetSize * 0.72;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = canvasHeight * 0.2;
  } else if (frameType === 'neon-bracket' || frameType === 'minimal-rounded') {
    qrSize = targetSize * 0.76;
    qrX = (canvasWidth - qrSize) / 2;
    qrY = (canvasHeight - qrSize) / 2 - targetSize * 0.03;
  }

  // Draw Specific Frame Decorations BEFORE or AFTER QR
  if (frameType === 'anniversary-hearts') {
    // Draw the Hearts Wreath Arc surrounding the QR Code!
    // Recreating the user's uploaded image with floating hearts and circles in arc!
    const centerX = canvasWidth / 2;
    const centerY = qrY + qrSize / 2;
    const arcRadius = qrSize * 0.76;

    // Elements array: [{ angleDeg, distFactor, size, color, rotDeg, isHeart }]
    const wreathElements = [
      // Top arch
      { angleDeg: -90, dist: 1.05, size: 28, color: primaryAccent, rot: 0, isHeart: true },
      { angleDeg: -108, dist: 1.02, size: 22, color: secondaryAccent, rot: -15, isHeart: true },
      { angleDeg: -72, dist: 1.02, size: 22, color: primaryAccent, rot: 15, isHeart: true },
      { angleDeg: -125, dist: 1.0, size: 24, color: primaryAccent, rot: -25, isHeart: true },
      { angleDeg: -55, dist: 1.0, size: 24, color: secondaryAccent, rot: 25, isHeart: true },

      // Upper left & right clusters
      { angleDeg: -142, dist: 0.98, size: 30, color: secondaryAccent, rot: -30, isHeart: true },
      { angleDeg: -38, dist: 0.98, size: 38, color: primaryAccent, rot: 20, isHeart: true },
      { angleDeg: -160, dist: 0.96, size: 20, color: primaryAccent, rot: -20, isHeart: true },
      { angleDeg: -20, dist: 0.96, size: 26, color: primaryAccent, rot: 15, isHeart: true },

      // Mid-lower flanks
      { angleDeg: -178, dist: 0.95, size: 40, color: primaryAccent, rot: -15, isHeart: true },
      { angleDeg: -2, dist: 0.96, size: 38, color: secondaryAccent, rot: 15, isHeart: true },
      { angleDeg: 165, dist: 0.95, size: 26, color: primaryAccent, rot: 25, isHeart: true },
      { angleDeg: 15, dist: 0.97, size: 20, color: primaryAccent, rot: -15, isHeart: true },
      { angleDeg: 148, dist: 0.96, size: 18, color: secondaryAccent, rot: 35, isHeart: true },
      { angleDeg: 32, dist: 0.96, size: 16, color: primaryAccent, rot: -20, isHeart: true },

      // Scattered playful dots like the original
      { angleDeg: -100, dist: 1.15, size: 6, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: -80, dist: 1.15, size: 5, color: secondaryAccent, rot: 0, isHeart: false },
      { angleDeg: -60, dist: 1.18, size: 5, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: -115, dist: 1.18, size: 5, color: secondaryAccent, rot: 0, isHeart: false },
      { angleDeg: -135, dist: 1.12, size: 7, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: -45, dist: 1.12, size: 6, color: secondaryAccent, rot: 0, isHeart: false },
      { angleDeg: -150, dist: 1.14, size: 5, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: -30, dist: 1.15, size: 8, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: -168, dist: 1.12, size: 7, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: -10, dist: 1.12, size: 6, color: secondaryAccent, rot: 0, isHeart: false },
      { angleDeg: 175, dist: 1.1, size: 8, color: secondaryAccent, rot: 0, isHeart: false },
      { angleDeg: 5, dist: 1.1, size: 6, color: secondaryAccent, rot: 0, isHeart: false },
      { angleDeg: 155, dist: 1.08, size: 9, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: 25, dist: 1.08, size: 8, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: 140, dist: 1.02, size: 6, color: primaryAccent, rot: 0, isHeart: false },
      { angleDeg: 40, dist: 1.04, size: 6, color: secondaryAccent, rot: 0, isHeart: false },
    ];

    const scaleFactor = (targetSize / 600);

    wreathElements.forEach(el => {
      const rad = (el.angleDeg * Math.PI) / 180;
      const r = arcRadius * el.dist;
      const x = centerX + Math.cos(rad) * r;
      const y = centerY + Math.sin(rad) * r;
      const s = el.size * scaleFactor;

      if (el.isHeart) {
        drawHeart(ctx, x, y, s, el.color, el.rot);
      } else {
        ctx.fillStyle = el.color;
        ctx.beginPath();
        ctx.arc(x, y, s / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

  } else if (frameType === 'birthday-confetti') {
    // Multi-colored confetti & party stars
    const colors = [primaryAccent, secondaryAccent, '#0ea5e9', '#eab308', '#22c55e', '#ec4899'];
    const scaleFactor = targetSize / 600;

    // Draw confetti dots, ribbons, stars in top & sides
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const r = (qrSize * 0.7) + (Math.sin(i * 3.7) * 40 + 50) * scaleFactor;
      const x = canvasWidth / 2 + Math.cos(angle) * r;
      const y = (qrY + qrSize / 2) + Math.sin(angle) * r;
      const col = colors[i % colors.length];

      if (i % 4 === 0) {
        drawStar(ctx, x, y, 5, 8 * scaleFactor, 4 * scaleFactor, col);
      } else if (i % 3 === 0) {
        // Confetti rectangular pill
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + i);
        ctx.fillStyle = col;
        ctx.fillRect(-6 * scaleFactor, -3 * scaleFactor, 12 * scaleFactor, 6 * scaleFactor);
        ctx.restore();
      } else {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, (3 + (i % 4)) * scaleFactor, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (frameType === 'polaroid') {
    // Polaroid border
    const pad = targetSize * 0.05;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2 * (targetSize / 600);
    ctx.strokeRect(pad, pad, canvasWidth - pad * 2, canvasHeight - pad * 2);
  } else if (frameType === 'wifi-card') {
    // Top banner with WiFi antenna
    const topBarHeight = targetSize * 0.12;
    ctx.fillStyle = primaryAccent;
    ctx.fillRect(targetSize * 0.06, targetSize * 0.06, canvasWidth - targetSize * 0.12, topBarHeight);
    
    // Rounded Card border
    ctx.strokeStyle = primaryAccent;
    ctx.lineWidth = 4 * (targetSize / 600);
    ctx.strokeRect(targetSize * 0.06, targetSize * 0.06, canvasWidth - targetSize * 0.12, canvasHeight - targetSize * 0.12);
  } else if (frameType === 'neon-bracket') {
    // High-tech Cyberpunk Corner Brackets
    const margin = qrX - targetSize * 0.04;
    const bracketSize = qrSize + targetSize * 0.08;
    const bLen = bracketSize * 0.22;
    const bWidth = 4 * (targetSize / 600);

    ctx.strokeStyle = primaryAccent;
    ctx.lineWidth = bWidth;
    ctx.lineCap = 'round';

    // Top Left
    ctx.beginPath();
    ctx.moveTo(margin, margin + bLen);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + bLen, margin);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(margin + bracketSize - bLen, margin);
    ctx.lineTo(margin + bracketSize, margin);
    ctx.lineTo(margin + bracketSize, margin + bLen);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(margin, margin + bracketSize - bLen);
    ctx.lineTo(margin, margin + bracketSize);
    ctx.lineTo(margin + bLen, margin + bracketSize);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(margin + bracketSize - bLen, margin + bracketSize);
    ctx.lineTo(margin + bracketSize, margin + bracketSize);
    ctx.lineTo(margin + bracketSize, margin + bracketSize - bLen);
    ctx.stroke();
  } else if (frameType === 'minimal-rounded') {
    // Elegant rounded border
    const pad = targetSize * 0.06;
    ctx.strokeStyle = primaryAccent;
    ctx.lineWidth = 3 * (targetSize / 600);
    const r = 24 * (targetSize / 600);
    const x = pad, y = pad, w = canvasWidth - pad * 2, h = canvasHeight - pad * 2;
    
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
  }

  // 2. Draw the QR Code image in the center
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // 3. Draw Typography & Frame Badges (Top / Bottom)
  const fontChoice = style.frame.fontFamily;
  let fontFace = 'Inter, sans-serif';
  if (fontChoice === 'script') {
    fontFace = '"Dancing Script", "Great Vibes", cursive';
  } else if (fontChoice === 'serif') {
    fontFace = '"Playfair Display", Georgia, serif';
  } else if (fontChoice === 'display') {
    fontFace = 'Montserrat, Inter, sans-serif';
  }

  const text = style.frame.text || '';
  const subtext = style.frame.subtext || '';

  if (frameType === 'anniversary-hearts') {
    // User's screenshot style: Curved or lovely bottom cursive script
    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.08);
      ctx.font = `600 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textY = qrY + qrSize + targetSize * 0.08;
      ctx.fillText(text, canvasWidth / 2, textY);
      ctx.restore();
    }
  } else if (frameType === 'birthday-confetti') {
    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.075);
      ctx.font = `800 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvasWidth / 2, canvasHeight * 0.12);
      ctx.restore();
    }
    if (subtext) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.04);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(subtext, canvasWidth / 2, qrY + qrSize + targetSize * 0.06);
      ctx.restore();
    }
  } else if (frameType === 'scan-me-bottom') {
    // "SCAN ME" bottom banner
    const bannerHeight = targetSize * 0.12;
    const bannerWidth = qrSize;
    const bannerX = (canvasWidth - bannerWidth) / 2;
    const bannerY = qrY + qrSize + targetSize * 0.02;
    const radius = 12 * (targetSize / 600);

    // Pill banner
    ctx.fillStyle = style.frame.badgeColor || primaryAccent;
    ctx.beginPath();
    ctx.roundRect 
      ? ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, radius) 
      : ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
    ctx.fill();

    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.055);
      ctx.font = `800 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvasWidth / 2, bannerY + bannerHeight / 2);
      ctx.restore();
    }
  } else if (frameType === 'scan-me-top') {
    const bannerHeight = targetSize * 0.11;
    const bannerWidth = qrSize;
    const bannerX = (canvasWidth - bannerWidth) / 2;
    const bannerY = targetSize * 0.04;
    const radius = 12 * (targetSize / 600);

    ctx.fillStyle = style.frame.badgeColor || primaryAccent;
    ctx.beginPath();
    ctx.roundRect 
      ? ctx.roundRect(bannerX, bannerY, bannerWidth, bannerHeight, radius)
      : ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);
    ctx.fill();

    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.052);
      ctx.font = `800 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvasWidth / 2, bannerY + bannerHeight / 2);
      ctx.restore();
    }
  } else if (frameType === 'restaurant-menu') {
    // Top banner
    if (text) {
      ctx.save();
      const topFontSize = Math.round(targetSize * 0.058);
      ctx.font = `700 ${topFontSize}px ${fontFace}`;
      ctx.fillStyle = primaryAccent;
      ctx.textAlign = 'center';
      ctx.fillText(text, canvasWidth / 2, canvasHeight * 0.12);
      ctx.restore();
    }

    if (subtext) {
      ctx.save();
      const subFontSize = Math.round(targetSize * 0.035);
      ctx.font = `500 ${subFontSize}px Inter, sans-serif`;
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.fillText(subtext, canvasWidth / 2, qrY + qrSize + targetSize * 0.06);
      ctx.restore();
    }
  } else if (frameType === 'wifi-card') {
    // Top WiFi text
    if (text) {
      ctx.save();
      const topFontSize = Math.round(targetSize * 0.045);
      ctx.font = `800 ${topFontSize}px ${fontFace}`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, canvasWidth / 2, targetSize * 0.12);
      ctx.restore();
    }

    // Bottom pill
    if (subtext) {
      const pillY = qrY + qrSize + targetSize * 0.03;
      const pillH = targetSize * 0.08;
      const pillW = qrSize * 0.9;
      ctx.fillStyle = style.frame.badgeColor || '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect 
        ? ctx.roundRect((canvasWidth - pillW) / 2, pillY, pillW, pillH, 8 * (targetSize / 600))
        : ctx.fillRect((canvasWidth - pillW) / 2, pillY, pillW, pillH);
      ctx.fill();

      ctx.font = `600 ${Math.round(targetSize * 0.035)}px Inter, sans-serif`;
      ctx.fillStyle = primaryAccent;
      ctx.fillText(subtext, canvasWidth / 2, pillY + pillH / 2);
    }
    ctx.restore();
  } else if (frameType === 'polaroid') {
    // Polaroid caption text
    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.075);
      ctx.font = `600 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textY = qrY + qrSize + (canvasHeight - (qrY + qrSize)) / 2;
      ctx.fillText(text, canvasWidth / 2, textY);
      ctx.restore();
    }
  } else if (frameType === 'neon-bracket') {
    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.045);
      ctx.font = `800 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = primaryAccent;
      ctx.textAlign = 'center';
      ctx.fillText(text, canvasWidth / 2, qrY + qrSize + targetSize * 0.06);
      ctx.restore();
    }
  } else if (frameType === 'minimal-rounded') {
    if (text) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.048);
      ctx.font = `700 ${fontSize}px ${fontFace}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(text, canvasWidth / 2, qrY + qrSize + targetSize * 0.05);
      ctx.restore();
    }
    if (subtext) {
      ctx.save();
      const fontSize = Math.round(targetSize * 0.032);
      ctx.font = `400 ${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'center';
      ctx.fillText(subtext, canvasWidth / 2, qrY + qrSize + targetSize * 0.09);
      ctx.restore();
    }
  }

  return canvas;
}
