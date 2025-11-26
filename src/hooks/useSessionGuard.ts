import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store';
import { loadSessionFromStorage } from '@/store/slices/sessionSlice';

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

  return { sessionId, hasSession: !!sessionId, isInitialized };
};
