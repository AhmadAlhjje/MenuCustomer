'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/templates/MainLayout';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useI18n } from '@/hooks/useI18n';
import { useNotification } from '@/hooks/useNotification';
import { sessionsApi } from '@/api/sessions';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSession, loadSessionFromStorage } from '@/store/slices/sessionSlice';
import { validateNumberOfGuests } from '@/utils/validators';
import { storage } from '@/utils/storage';

export default function QRCodePage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const { success, error } = useNotification();
  const dispatch = useAppDispatch();
  const sessionId = useAppSelector((state) => state.session.sessionId);

  const [numberOfGuests, setNumberOfGuests] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string>('');

  // Load session from localStorage on mount
  useEffect(() => {
    console.log('[QRCodePage] Component mounted, loading session from localStorage');
    dispatch(loadSessionFromStorage());
  }, [dispatch]);

  // Redirect to menu once sessionId is set
  useEffect(() => {
    console.log('[QRCodePage] sessionId changed:', sessionId, 'loading:', loading);
    if (sessionId && !loading) {
      console.log('[QRCodePage] Redirecting to /menu with sessionId:', sessionId);
      router.push('/menu');
    }
  }, [sessionId, loading, router]);

  const handleStartSession = async () => {
    const guests = parseInt(numberOfGuests);

    console.log('[QRCodePage] Starting session with guests:', guests);
    console.log('[QRCodePage] QR Code:', params.code);
    console.log('[QRCodePage] API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

    if (!validateNumberOfGuests(guests)) {
      setErrors(t('session.sessionError'));
      return;
    }

    setLoading(true);
    setErrors('');

    try {
      // Check if there's an existing session and if it has expired
      const existingSessionData = storage.getSession();
      if (existingSessionData) {
        const sessionAgeHours = storage.getSessionAgeHours();
        console.log(`[QRCodePage] Existing session found, age: ${sessionAgeHours.toFixed(2)} hours`);

        if (sessionAgeHours > 10) {
          console.log('[QRCodePage] Session expired (>10 hours), clearing old session');
          storage.clearSession();
        }
      }

      const qrCode = params.code as string;
      console.log('[QRCodePage] Calling API with:', { qrCode, numberOfGuests: guests });

      const session = await sessionsApi.startSession(qrCode, { numberOfGuests: guests });

      console.log('[QRCodePage] Session received:', session);

      dispatch(setSession(session));
      success(t('session.sessionStarted'));
      // Set loading to false so the redirect effect can trigger
      setLoading(false);

      // Fallback: redirect directly if the effect doesn't trigger
      setTimeout(() => {
        console.log('[QRCodePage] Fallback redirect to /menu');
        router.push('/menu');
      }, 500);
    } catch (err: any) {
      console.error('[QRCodePage] Session start error:', err);
      console.error('[QRCodePage] Error response:', err.response?.data);
      console.error('[QRCodePage] Error status:', err.response?.status);
      console.error('[QRCodePage] Error message:', err.message);

      // تحديد رسالة الخطأ بناءً على نوع الخطأ
      let errorMessage = t('session.sessionError');
      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'لا يمكن الاتصال بالخادم. تأكد من أن الخادم يعمل على ' + process.env.NEXT_PUBLIC_API_BASE_URL;
      } else if (err.response?.status === 404) {
        errorMessage = 'كود QR غير صحيح أو انتهت صلاحيته';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || 'بيانات غير صحيحة';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      error(errorMessage);
      setErrors(errorMessage);
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
