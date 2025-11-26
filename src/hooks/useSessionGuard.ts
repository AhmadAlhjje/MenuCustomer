import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { loadSessionFromStorage, clearSession } from '@/store/slices/sessionSlice';
import { storage } from '@/utils/storage';

export const useSessionGuard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sessionId = useAppSelector((state) => state.session.sessionId);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    dispatch(loadSessionFromStorage());
    setIsInitialized(true);
  }, [dispatch]);

  // Check session expiration periodically
  useEffect(() => {
    if (!sessionId) return;

    const checkSessionExpiration = () => {
      if (storage.isSessionExpired()) {
        console.log('[useSessionGuard] Session expired, clearing and redirecting to home');
        dispatch(clearSession());
        storage.clearSession();
        router.push('/');
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkSessionExpiration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [sessionId, dispatch, router]);

  return { sessionId, hasSession: !!sessionId, isInitialized };
};
