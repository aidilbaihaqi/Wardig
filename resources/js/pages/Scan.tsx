import { Head, Link } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { QrCode, Camera, Upload, AlertTriangle } from 'lucide-react';

type BarcodeFormat =
  | 'qr_code'
  | 'aztec'
  | 'code_128'
  | 'code_39'
  | 'code_93'
  | 'codabar'
  | 'data_matrix'
  | 'ean_13'
  | 'ean_8'
  | 'itf'
  | 'pdf417'
  | 'upc_a'
  | 'upc_e';

interface DetectedBarcode {
  rawValue: string;
}

interface BarcodeDetectorOptions {
  formats?: BarcodeFormat[];
}

interface BarcodeDetector {
  detect(
    source:
      | HTMLVideoElement
      | HTMLImageElement
      | HTMLCanvasElement
      | ImageBitmap
  ): Promise<DetectedBarcode[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: BarcodeDetectorOptions): BarcodeDetector;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);
  const [supported, setSupported] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [manualCode, setManualCode] = useState<string>('');
  const scanTimerRef = useRef<number | null>(null);
  type QrScannerInstance = { start(): Promise<void>; stop(): void; destroy(): void };
  const qrScannerRef = useRef<QrScannerInstance | null>(null);

  useEffect(() => {
    setSupported(!!window.BarcodeDetector);
  }, []);

  const stopScan = useCallback(() => {
    setScanning(false);
    if (scanTimerRef.current) {
      window.clearInterval(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      } catch {
        void 0; // ignore cleanup errors
      }
      qrScannerRef.current = null;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopScan();
    };
  }, [stopScan]);

  async function startScan() {
    try {
      setMessage('');
      // Jika BarcodeDetector tersedia, gunakan yang ada sekarang
      if (window.BarcodeDetector) {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        setStream(s);
        setScanning(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }

        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const tick = async () => {
          if (!videoRef.current || !scanning) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length > 0) {
              const value = codes[0].rawValue as string;
              handleResult(value);
            }
          } catch {
            void 0; // ignore per-frame errors
          }
        };
        // Scan ~4x per second
        scanTimerRef.current = window.setInterval(tick, 250);
        return;
      }

      // Fallback: gunakan qr-scanner untuk pemindaian kamera
      if (!videoRef.current) {
        setMessage('Video element tidak tersedia. Muat ulang halaman dan coba lagi.');
        return;
      }

      type QrScannerConstructor = new (
        video: HTMLVideoElement,
        onDecode: (result: string) => void,
        options?: {
          preferredCamera?: 'environment' | 'user';
          highlightScanRegion?: boolean;
          highlightCodeOutline?: boolean;
        }
      ) => QrScannerInstance;
      const QrScanner = (await import('qr-scanner')).default as unknown as QrScannerConstructor & {
        WORKER_PATH: string;
        scanImage: (image: Blob | File | HTMLImageElement) => Promise<string | null>;
      };
      const workerPath = (await import('qr-scanner/qr-scanner-worker.min.js')).default as string;
      QrScanner.WORKER_PATH = workerPath;

      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result: string) => {
          handleResult(result);
        },
        { preferredCamera: 'environment', highlightScanRegion: true, highlightCodeOutline: true }
      );

      await qrScannerRef.current.start();
      setScanning(true);
      setMessage('');
    } catch (err) {
      console.error(err);
      setMessage('Gagal mengakses kamera. Pastikan izin diberikan atau gunakan opsi lain.');
    }
  }

  // stopScan moved to useCallback above

  function extractCodeFromValue(value: string): string | null {
    try {
      if (value.startsWith('http')) {
        const u = new URL(value);
        const match = u.pathname.match(/\/product\/([^/]+)/);
        return match ? match[1] : null;
      }
      const match = value.match(/\/product\/([^/]+)/);
      if (match && match[1]) return match[1];
      // Assume value itself is the unique_code
      return value;
    } catch {
      return null;
    }
  }

  function handleResult(value: string) {
    stopScan();
    // Navigasi ke halaman sukses scan dengan kode unik
    try {
      const code = extractCodeFromValue(value);
      if (code) {
        window.location.href = `/scan/success/${code}`;
      } else {
        setMessage('QR terbaca, tetapi kode tidak valid. Coba input manual.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Gagal membuka tautan dari QR. Coba input manual.');
    }
  }

  async function onUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (window.BarcodeDetector) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = async () => {
          try {
            const codes = await detector.detect(img);
            URL.revokeObjectURL(url);
            if (codes && codes.length > 0) {
              handleResult(codes[0].rawValue as string);
            } else {
              setMessage('QR tidak terdeteksi pada gambar yang diupload.');
            }
          } catch (err) {
            console.error(err);
            setMessage('Terjadi kesalahan saat membaca gambar.');
          }
        };
        img.src = url;
      } else {
        const QrScanner = (await import('qr-scanner')).default as unknown as {
          WORKER_PATH: string;
          scanImage: (image: Blob | File | HTMLImageElement) => Promise<string | null>;
        };
        const workerPath = (await import('qr-scanner/qr-scanner-worker.min.js')).default as string;
        QrScanner.WORKER_PATH = workerPath;
        const result = await QrScanner.scanImage(file);
        if (result) {
          handleResult(result as string);
        } else {
          setMessage('QR tidak terdeteksi pada gambar yang diupload.');
        }
      }
    } catch (err) {
      console.error(err);
      setMessage('Upload pemindaian tidak tersedia atau gagal pada browser ini.');
    }
  }

  function goWithManualCode() {
    const code = manualCode.trim();
    if (!code) return;
    window.location.href = `/scan/success/${code}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Scan Produk" />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <QrCode className="w-6 h-6 mr-2 text-blue-600" />
            Scan Produk
          </h1>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">Beranda</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Pemindaian Kamera
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video ref={videoRef} className="w-full h-full" playsInline muted />
                  {!scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <p className="text-sm opacity-90">Tekan "Mulai Scan" untuk mengaktifkan kamera</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!scanning ? (
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={startScan}>
                      <Camera className="w-4 h-4 mr-2" /> Mulai Scan
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={stopScan}>
                      Hentikan
                    </Button>
                  )}
                  <label className="inline-flex items-center px-3 py-2 border rounded-md cursor-pointer text-sm bg-white text-gray-900 hover:bg-gray-50 border-gray-300 dark:bg-white dark:text-gray-900">
                    <Upload className="w-4 h-4 mr-2" /> Upload Gambar QR
                    <input type="file" accept="image/*" className="hidden" onChange={onUploadChange} />
                  </label>
                </div>

                {!supported && (
                  <Alert className="border-amber-300 bg-amber-50 text-amber-800">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <AlertDescription>
                      Browser Anda belum mendukung pemindaian kamera melalui API BarcodeDetector. Anda tetap bisa upload gambar QR atau masukkan kode unik manual di sebelah.
                    </AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-red-300 bg-red-50 text-red-800">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Masukkan Kode Unik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Jika Anda memiliki kode unik produk (misalnya dari label), masukkan di sini:</p>
                <div className="flex space-x-2">
                  <Input placeholder="Mis: kXTjGm7Op5" value={manualCode} onChange={(e) => setManualCode(e.target.value)} />
                  <Button onClick={goWithManualCode} className="bg-blue-600 hover:bg-blue-700">Buka</Button>
                </div>
                <p className="text-xs text-gray-500">Contoh URL hasil scan: <code className="font-mono">/product/&lt;kode_unik&gt;</code></p>
                <div className="mt-6 text-xs text-gray-500">Privasi: Kami hanya mencatat waktu, perangkat, dan IP untuk analytics (lihat admin dashboard).</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          Powered by Wardig • Scan untuk temukan produk lokal terbaik
        </div>
      </div>
    </div>
  );
}