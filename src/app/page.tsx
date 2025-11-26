'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { Button } from '@/components/atoms/Button';
import { QRScannerButton } from '@/components/molecules/QRScannerButton';
import { useI18n } from '@/hooks/useI18n';
import { useAppSelector } from '@/store';

export default function HomePage() {
  const router = useRouter();
  const { t } = useI18n();
  const sessionId = useAppSelector((state) => state.session.sessionId);

  React.useEffect(() => {
    if (sessionId) {
      router.push('/menu');
    }
  }, [sessionId, router]);

  return (
    <MainLayout showHeader={false}>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="mb-8">
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
              strokeWidth={1.5}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t('common.welcome')}
          </h1>
          <p className="text-lg text-muted mb-2">
            {t('session.scanQR')}
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <QRScannerButton />
        </div>
      </div>
    </MainLayout>
  );
}
