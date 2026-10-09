import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { 
  Download, 
  Copy, 
  Printer, 
  Check, 
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Scan
} from 'lucide-react';
import { QRContentState, QRStyleState } from '../types';
import { generateQRPayload } from '../utils/qrPayload';
import { renderComposedQRCanvas } from '../utils/canvasRenderer';

interface QRPreviewProps {
  content: QRContentState;
  style: QRStyleState;
  onOpenScanner?: () => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ content, style, onOpenScanner }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg' | 'jpeg' | 'webp'>('png');
  const [selectedSize, setSelectedSize] = useState<number>(1000);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const payload = generateQRPayload(content);

  // Render preview whenever payload or style changes
  useEffect(() => {
    let isCancelled = false;

    async function generatePreview() {
      try {
        setIsRendering(true);

        // Preload logo image if provided to guarantee browser image cache is primed
        if (style.logoSrc) {
          try {
            const preloadImg = new Image();
            preloadImg.crossOrigin = 'anonymous';
            preloadImg.src = style.logoSrc;
            if (preloadImg.decode) {
              await preloadImg.decode().catch(() => {});
            }
          } catch {
            // ignore preload decode failure
          }
        }
        if (isCancelled) return;

        const qrInstance = new QRCodeStyling({
          width: 600,
          height: 600,
          data: payload,
          image: style.logoSrc || undefined,
          dotsOptions: {
            type: style.dotsType,
            color: style.dotColor,
            gradient: style.useGradient
              ? {
                  type: style.gradientType,
                  rotation: (style.gradientRotation * Math.PI) / 180,
                  colorStops: [
                    { offset: 0, color: style.dotColor },
                    { offset: 1, color: style.gradientColor2 }
                  ]
                }
              : undefined
          },
          cornersSquareOptions: {
            type: style.cornersSquareType,
            color: style.cornersSquareColor
          },
          cornersDotOptions: {
            type: style.cornersDotType,
            color: style.cornersDotColor
          },
          backgroundOptions: {
            color: style.transparentBackground ? 'transparent' : style.backgroundColor
          },
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: style.logoMargin,
            imageSize: style.logoSize,
            hideBackgroundDots: style.hideBehindLogo
          },
          qrOptions: {
            errorCorrectionLevel: style.errorCorrectionLevel
          }
        });

        const rawBlob: any = await qrInstance.getRawData('png');
        if (!rawBlob || isCancelled) return;

        const blob = rawBlob instanceof Blob ? rawBlob : new Blob([rawBlob as BlobPart], { type: 'image/png' });
        const objectUrl = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = async () => {
          if (isCancelled) {
            URL.revokeObjectURL(objectUrl);
            return;
          }

          const composed = await renderComposedQRCanvas({
            qrImage: img,
            style,
            targetSize: 600
          });

          URL.revokeObjectURL(objectUrl);

          if (isCancelled || !canvasRef.current) return;

          const previewCanvas = canvasRef.current;
          previewCanvas.width = composed.width;
          previewCanvas.height = composed.height;

          const ctx = previewCanvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            ctx.drawImage(composed, 0, 0);
          }
          setIsRendering(false);
        };

        img.src = objectUrl;
      } catch (err) {
        console.error('Failed to generate QR preview:', err);
        setIsRendering(false);
      }
    }

    generatePreview();

    return () => {
      isCancelled = true;
    };
  }, [payload, style]);

  // Main Download Trigger
  const handleDownload = async () => {
    if (selectedFormat === 'svg') {
      await handleDownloadSVG();
      return;
    }

    try {
      setIsRendering(true);

      if (style.logoSrc) {
        try {
          const preloadImg = new Image();
          preloadImg.crossOrigin = 'anonymous';
          preloadImg.src = style.logoSrc;
          if (preloadImg.decode) {
            await preloadImg.decode().catch(() => {});
          }
        } catch {
          // ignore
        }
      }

      const qrInstance = new QRCodeStyling({
        width: selectedSize,
        height: selectedSize,
        data: payload,
        image: style.logoSrc || undefined,
        dotsOptions: {
          type: style.dotsType,
          color: style.dotColor,
          gradient: style.useGradient
            ? {
                type: style.gradientType,
                rotation: (style.gradientRotation * Math.PI) / 180,
                colorStops: [
                  { offset: 0, color: style.dotColor },
                  { offset: 1, color: style.gradientColor2 }
                ]
              }
            : undefined
        },
        cornersSquareOptions: {
          type: style.cornersSquareType,
          color: style.cornersSquareColor
        },
        cornersDotOptions: {
          type: style.cornersDotType,
          color: style.cornersDotColor
        },
        backgroundOptions: {
          color: style.transparentBackground ? 'transparent' : style.backgroundColor
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: style.logoMargin,
          imageSize: style.logoSize,
          hideBackgroundDots: style.hideBehindLogo
        },
        qrOptions: {
          errorCorrectionLevel: style.errorCorrectionLevel
        }
      });

      const rawBlob: any = await qrInstance.getRawData('png');
      if (!rawBlob) return;

      const blob = rawBlob instanceof Blob ? rawBlob : new Blob([rawBlob as BlobPart], { type: 'image/png' });
      const img = new Image();
      const objectUrl = URL.createObjectURL(blob);

      img.onload = async () => {
        const composedCanvas = await renderComposedQRCanvas({
          qrImage: img,
          style,
          targetSize: selectedSize
        });
        URL.revokeObjectURL(objectUrl);

        const mime = selectedFormat === 'jpeg' ? 'image/jpeg' : selectedFormat === 'webp' ? 'image/webp' : 'image/png';
        const dataUrl = composedCanvas.toDataURL(mime, 0.95);

        const link = document.createElement('a');
        link.download = `qrcode-${style.frame.type}-${selectedSize}px.${selectedFormat}`;
        link.href = dataUrl;
        link.click();
        setIsRendering(false);
      };

      img.src = objectUrl;
    } catch (e) {
      console.error(e);
      setIsRendering(false);
    }
  };

  const handleDownloadSVG = async () => {
    try {
      if (style.logoSrc) {
        try {
          const preloadImg = new Image();
          preloadImg.crossOrigin = 'anonymous';
          preloadImg.src = style.logoSrc;
          if (preloadImg.decode) {
            await preloadImg.decode().catch(() => {});
          }
        } catch {
          // ignore
        }
      }

      const qrInstance = new QRCodeStyling({
        width: 1024,
        height: 1024,
        data: payload,
        image: style.logoSrc || undefined,
        dotsOptions: {
          type: style.dotsType,
          color: style.dotColor,
          gradient: style.useGradient
            ? {
                type: style.gradientType,
                rotation: (style.gradientRotation * Math.PI) / 180,
                colorStops: [
                  { offset: 0, color: style.dotColor },
                  { offset: 1, color: style.gradientColor2 }
                ]
              }
            : undefined
        },
        cornersSquareOptions: {
          type: style.cornersSquareType,
          color: style.cornersSquareColor
        },
        cornersDotOptions: {
          type: style.cornersDotType,
          color: style.cornersDotColor
        },
        backgroundOptions: {
          color: style.transparentBackground ? 'transparent' : style.backgroundColor
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: style.logoMargin,
          imageSize: style.logoSize,
          hideBackgroundDots: style.hideBehindLogo
        },
        qrOptions: {
          errorCorrectionLevel: style.errorCorrectionLevel
        }
      });

      const svgBlob: any = await qrInstance.getRawData('svg');
      if (!svgBlob) return;

      const blob = svgBlob instanceof Blob ? svgBlob : new Blob([svgBlob as BlobPart], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qrcode-vector-${style.frame.type}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async blob => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handlePrint = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
              img { max-width: 80%; height: auto; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sticky top-20">
      {/* Header (Step 3) */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold flex items-center justify-center text-xs">
            3
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Generate & download QR</span>
            {isRendering && <RefreshCw className="w-3.5 h-3.5 text-pink-500 animate-spin" />}
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
            className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1 font-mono">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
            className="p-1 hover:text-slate-900 dark:hover:text-white text-slate-500 dark:text-slate-400 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center min-h-[340px] max-h-[420px] bg-slate-50 dark:bg-slate-950/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden relative">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        <div 
          className="transition-transform duration-200 flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-xl shadow-lg max-w-full max-h-[350px] object-contain transition-all"
            style={{
              filter: isRendering ? 'opacity(0.85) blur(0.5px)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Download Controls Section (Matches user's screenshot layout) */}
      <div className="mt-5 space-y-3.5">
        {/* Dropdowns Row: Format & Size side-by-side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Format
            </label>
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500"
            >
              <option value="png">PNG (Raster)</option>
              <option value="svg">SVG (Vector Lossless)</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Size
            </label>
            <select
              value={selectedSize}
              onChange={e => setSelectedSize(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
            >
              <option value="1000">1000x1000 (Standard)</option>
              <option value="2000">2000x2000 (High-Res Print)</option>
              <option value="4000">4000x4000 (Ultra HD)</option>
              <option value="600">600x600 (Small)</option>
            </select>
          </div>
        </div>

        {/* Large Pink "Download QR CODE" Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide transition shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download QR CODE</span>
        </button>

        {/* Secondary quick action buttons */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
          >
            <Scan className="w-3.5 h-3.5 text-pink-500" />
            <span>Verify</span>
          </button>
        </div>

        {/* Footer info notice */}
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 pt-1">
          100% Free client-side export • No limits • Vector print-ready
        </p>
      </div>
    </div>
  );
};
