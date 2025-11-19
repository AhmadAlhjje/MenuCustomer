import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

export const useSessionGuard = () => {
  const router = useRouter();
  const sessionId = useAppSelector((state) => state.session.sessionId);

  useEffect(() => {
    if (!sessionId && typeof window !== 'undefined') {
      const storedSessionId = localStorage.getItem('sessionId');
      // if (!storedSessionId) {
      //   router.push('/');
      // }
    }
  }, [sessionId, router]);

  return { sessionId, hasSession: !!sessionId };
};
