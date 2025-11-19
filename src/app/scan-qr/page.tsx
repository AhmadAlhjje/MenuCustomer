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
  const scannerRef = useRef<any>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    let html5QrCode: any = null;

    const startScanner = async () => {
      if (isScanning && qrReaderRef.current) {
        try {
          // Dynamically import html5-qrcode to avoid SSR issues
          const { Html5Qrcode } = await import('html5-qrcode');

          html5QrCode = new Html5Qrcode('qr-reader');
          scannerRef.current = html5QrCode;

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          };

          await html5QrCode.start(
            { facingMode: 'environment' }, // Use rear camera
            config,
            (decodedText: string) => {
              // Success callback
              handleScan(decodedText);
              // Stop scanning after successful scan
              if (html5QrCode) {
                html5QrCode.stop().catch((err: any) => console.error(err));
              }
            },
            (errorMessage: string) => {
              // Error callback (usually just means no QR code detected)
              // Don't show error to user unless it's critical
            }
          );
        } catch (err) {
          console.error('Error starting QR scanner:', err);
          setError(t('common.error'));
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
  }, [isScanning, handleScan, t]);

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
                <p className="text-sm text-muted">{t('common.allowCamera')}</p>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsScanning(true)}
                fullWidth
              >
                {t('common.startScanning')}
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
                <p className="text-error text-center mb-4">{error}</p>
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

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-muted text-center mb-2">
              {t('session.orEnterManually')}
            </p>
            <Button
              variant="accent"
              size="sm"
              onClick={() => router.push('/table/QR-1-T1-demo')}
              fullWidth
            >
              {t('session.useDemo')}
            </Button>
          </div>
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
