import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { 
  Download, 
  Copy, 
  Printer, 
  Check, 
  Sparkles, 
  FileText, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { QRContentState, QRStyleState } from '../types';
import { generateQRPayload } from '../utils/qrPayload';
import { renderComposedQRCanvas } from '../utils/canvasRenderer';

interface QRPreviewProps {
  content: QRContentState;
  style: QRStyleState;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ content, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadResolution, setDownloadResolution] = useState<number>(2048);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const payload = generateQRPayload(content);

  // Re-render when content or style changes
  useEffect(() => {
    let isCancelled = false;

    async function generatePreview() {
      try {
        setIsRendering(true);

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

          // Composite Frame + QR at 600px for the preview
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

  // High-Resolution Export
  const handleDownload = async (format: 'png' | 'jpeg' | 'webp') => {
    try {
      setIsRendering(true);

      const qrInstance = new QRCodeStyling({
        width: downloadResolution,
        height: downloadResolution,
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
          targetSize: downloadResolution
        });
        URL.revokeObjectURL(objectUrl);

        const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const dataUrl = composedCanvas.toDataURL(mime, 0.95);

        const link = document.createElement('a');
        link.download = `qrcode-${style.frame.type}-${downloadResolution}px.${format}`;
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
        setTimeout(() => setCopied(false), 2200);
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full sticky top-20">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span>Live Preview</span>
            {isRendering && <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
          </h2>
          <p className="text-xs text-slate-400">High-res client-side rendering</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
            className="p-1 hover:text-white text-slate-400 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 px-1 font-mono">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.15))}
            className="p-1 hover:text-white text-slate-400 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Display Area */}
      <div className="flex-1 flex items-center justify-center min-h-[360px] max-h-[460px] bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 overflow-hidden relative group">
        {/* Subtle checkerboard pattern for transparency */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />

        <div 
          className="transition-transform duration-200 flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-2xl max-w-full max-h-[380px] object-contain transition-all"
            style={{
              filter: isRendering ? 'opacity(0.85) blur(0.5px)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Export & Download Controls */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 flex items-center gap-1">
            <span>Export Quality:</span>
          </label>
          <select
            value={downloadResolution}
            onChange={e => setDownloadResolution(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="1024">1024 × 1024 px (Web & Screen)</option>
            <option value="2048">2048 × 2048 px (Sharp Print / HD)</option>
            <option value="4096">4096 × 4096 px (Ultra 4K / Billboard)</option>
            <option value="600">600 × 600 px (Fast Small)</option>
          </select>
        </div>

        {/* Primary Download Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleDownload('png')}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>

          <button
            onClick={handleDownloadSVG}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition active:scale-[0.98]"
            title="Download lossless vector SVG"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>SVG Vector</span>
          </button>

          <button
            onClick={() => handleDownload('jpeg')}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>JPEG</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Print Option */}
        <button
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print QR Directly</span>
        </button>

        {/* Payload Peek */}
        <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <FileText className="w-3 h-3 text-indigo-400" />
              Encoded Payload:
            </span>
            <span className="font-mono text-[10px] text-slate-500">{payload.length} chars</span>
          </div>
          <p className="font-mono text-slate-300 truncate bg-slate-900 px-2 py-1 rounded border border-slate-800">
            {payload}
          </p>
        </div>
      </div>
    </div>
  );
};
