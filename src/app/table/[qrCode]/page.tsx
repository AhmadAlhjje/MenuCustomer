'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { useNotification } from '@/hooks/useNotification';
import { sessionsApi } from '@/api/sessions';
import { useAppDispatch } from '@/store';
import { setSession } from '@/store/slices/sessionSlice';
import { validateNumberOfGuests } from '@/utils/validators';

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const { success, error } = useNotification();
  const dispatch = useAppDispatch();

  const [numberOfGuests, setNumberOfGuests] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>('');

  const handleStartSession = async () => {
    const guests = parseInt(numberOfGuests);

    console.log('Starting session with guests:', guests);
    console.log('QR Code:', params.qrCode);

    if (!validateNumberOfGuests(guests)) {
      setErrors(t('session.sessionError'));
      return;
    }

    setLoading(true);
    setErrors('');

    try {
      const qrCode = params.qrCode as string;
      console.log('Calling API with:', { qrCode, numberOfGuests: guests });

      const session = await sessionsApi.startSession(qrCode, { numberOfGuests: guests });

      console.log('Session received:', session);

      dispatch(setSession(session));
      success(t('session.sessionStarted'));
      router.push('/menu');
    } catch (err: any) {
      console.error('Session start error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);

      error(err.response?.data?.message || t('session.sessionError'));
      setErrors(err.response?.data?.message || t('session.sessionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showHeader={false}>
      <div className="max-w-md mx-auto mt-20">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          {t('session.startSession')}
        </h1>

        <div className="bg-surface rounded shadow-lg p-6">
          <Input
            label={t('session.numberOfGuests')}
            type="number"
            min="1"
            placeholder={t('session.guestsPlaceholder')}
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            error={errors}
            fullWidth
          />

          <Button
            variant="primary"
            size="lg"
            onClick={handleStartSession}
            loading={loading}
            disabled={!numberOfGuests || loading}
            fullWidth
            className="mt-6"
          >
            {t('session.startSession')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
