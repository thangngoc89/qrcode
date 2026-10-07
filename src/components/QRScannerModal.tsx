import React, { useRef, useState, useEffect } from 'react';
import jsQR from 'jsqr';
import { X, Upload, Camera, CameraOff, ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose }) => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedResult(null);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    setErrorMsg(null);
    setScannedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not access camera. Please check permissions or use image upload.');
    }
  };

  const tickScan = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(tickScan);
      return;
    }

    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      setScannedResult(code.data);
      stopCamera();
    } else {
      animationFrameRef.current = requestAnimationFrame(tickScan);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setScannedResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScannedResult(code.data);
        } else {
          setErrorMsg('No readable QR code found in this image. Try increasing contrast or error correction.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (scannedResult) {
      navigator.clipboard.writeText(scannedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">Verify & Test QR Code</h3>
        <p className="text-xs text-slate-400 mb-5">
          Scan using your camera or upload any generated QR code image to test readability.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              <Camera className="w-4 h-4" />
              <span>Use Camera</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
            >
              <CameraOff className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Camera stream view */}
        {isCameraActive && (
          <div className="relative rounded-xl overflow-hidden bg-black mb-4 aspect-video flex items-center justify-center border border-indigo-500/50">
            <video ref={videoRef} className="w-full h-full object-cover" />
            <div className="absolute inset-8 border-2 border-dashed border-indigo-400 rounded-lg pointer-events-none animate-pulse" />
          </div>
        )}

        {/* Results view */}
        {scannedResult && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl mb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block mb-1">
              ✓ Successfully Decoded:
            </span>
            <p className="font-mono text-xs text-emerald-200 break-all bg-slate-950 p-2.5 rounded border border-emerald-900/50 max-h-36 overflow-y-auto">
              {scannedResult}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              {scannedResult.startsWith('http') && (
                <a
                  href={scannedResult}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open URL</span>
                </a>
              )}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-2 text-rose-300 text-xs mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
