'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@/components/atoms/Button';
import { useI18n } from '@/hooks/useI18n';

export default function ScanQRPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [showHttpsWarning, setShowHttpsWarning] = useState(false);
  const scannerRef = useRef<any>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

  // Check HTTPS on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLocalhost = window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '[::1]';
      const isHttps = window.location.protocol === 'https:';

      if (!isHttps && !isLocalhost) {
        setShowHttpsWarning(true);
      }
    }
  }, []);

  const handleScan = useCallback((data: string) => {
    try {
      // Try parsing as URL first
      const url = new URL(data);
      const pathParts = url.pathname.split('/');
      const qrCode = pathParts[pathParts.length - 1];

      if (qrCode) {
        router.push(`/table/${qrCode}`);
      }
    } catch (err) {
      // Not a URL, try direct QR code
      if (data && (data.startsWith('QR-') || data.includes('table/'))) {
        const code = data.includes('table/') ? data.split('table/')[1] : data;
        router.push(`/table/${code}`);
      } else {
        setError(t('session.invalidQR'));
        setIsScanning(false);
      }
    }
  }, [router, t]);

  // Request camera permission
  const requestCameraPermission = async () => {
    setIsRequestingPermission(true);
    setError('');

    try {
      // Check if mediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported');
      }

      console.log('Requesting camera permission...');

      // Request camera access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Permission granted
      console.log('Camera permission granted');
      setCameraPermission('granted');

      // Stop the stream immediately as we just needed to check permission
      stream.getTracks().forEach(track => track.stop());

      // Start scanning
      setIsScanning(true);
      setError('');
    } catch (err: any) {
      console.error('Camera permission error:', err);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraPermission('denied');
        setError(t('common.cameraPermissionDenied'));
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError(t('common.noCameraFound'));
      } else if (err.name === 'NotSupportedError' || err.message === 'MediaDevices API not supported') {
        setError(t('common.cameraNotSupported'));
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError(t('common.cameraInUse'));
      } else if (err.name === 'NotSupportedError' || err.message?.includes('secure')) {
        setError(t('common.httpsRequiredShort'));
      } else {
        setError(t('common.cameraAccessError') + ': ' + err.message);
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  useEffect(() => {
    let html5QrCode: any = null;

    const startScanner = async () => {
      if (isScanning && qrReaderRef.current && cameraPermission === 'granted') {
        try {
          // Dynamically import html5-qrcode to avoid SSR issues
          const { Html5Qrcode } = await import('html5-qrcode');

          html5QrCode = new Html5Qrcode('qr-reader');
          scannerRef.current = html5QrCode;

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            videoConstraints: {
              facingMode: 'environment',
              advanced: [{ focusMode: 'continuous' }]
            }
          };

          await html5QrCode.start(
            { facingMode: 'environment' }, // Use rear camera on mobile
            config,
            (decodedText: string) => {
              // Success callback
              handleScan(decodedText);
              // Stop scanning after successful scan
              if (html5QrCode) {
                html5QrCode.stop().catch((err: any) => console.error(err));
              }
            },
            () => {
              // Error callback (usually just means no QR code detected)
              // Don't show error to user unless it's critical
            }
          );
        } catch (err: any) {
          console.error('Error starting QR scanner:', err);

          if (err.name === 'NotAllowedError') {
            setError(t('common.cameraPermissionDenied'));
            setCameraPermission('denied');
          } else if (err.name === 'NotFoundError') {
            setError(t('common.noCameraFound'));
          } else {
            setError(t('common.cameraAccessError'));
          }
          setIsScanning(false);
        }
      }
    };

    startScanner();

    // Cleanup
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err: any) => console.error('Error stopping scanner:', err));
      }
    };
  }, [isScanning, handleScan, t, cameraPermission]);

  const handleStopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          setIsScanning(false);
          setError('');
        })
        .catch((err: any) => {
          console.error('Error stopping scanner:', err);
          setIsScanning(false);
        });
    } else {
      setIsScanning(false);
      setError('');
    }
  };

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-md mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          {t('session.scanQR')}
        </h1>

        <div className="bg-surface rounded-lg shadow-lg p-6">
          {!isScanning ? (
            <div className="text-center">
              <div className="mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mx-auto text-primary mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-muted mb-2">{t('session.scanQR')}</p>
                <p className="text-sm text-muted mb-4">{t('common.allowCamera')}</p>

                {showHttpsWarning && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-xs text-blue-700">
                          {t('common.httpsRecommended')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isRequestingPermission && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-600">
                      {t('common.requestingCameraAccess')}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      {t('common.pleaseAllowCamera')}
                    </p>
                  </div>
                )}

                {cameraPermission === 'denied' && !isRequestingPermission && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      {t('common.cameraPermissionDenied')}
                    </p>
                    <p className="text-xs text-red-500 mt-1">
                      {t('common.enableCameraInSettings')}
                    </p>
                  </div>
                )}

                {error && !isRequestingPermission && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={requestCameraPermission}
                fullWidth
                disabled={isRequestingPermission}
              >
                {isRequestingPermission ? t('common.requesting') : t('common.startScanning')}
              </Button>
            </div>
          ) : (
            <>
              <div
                id="qr-reader"
                ref={qrReaderRef}
                className="mb-4 rounded-lg overflow-hidden"
              ></div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Button
                variant="secondary"
                onClick={handleStopScanning}
                fullWidth
              >
                {t('common.cancel')}
              </Button>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push('/')}
          >
            {t('common.back')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
