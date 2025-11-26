export interface SessionData {
  sessionId: number;
  createdAt: string;
}

export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },

  // Session management with timestamp
  setSession: (sessionId: number): void => {
    if (typeof window === 'undefined') return;
    const sessionData: SessionData = {
      sessionId,
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
    } catch (error) {
      console.error('Storage setSession error:', error);
    }
  },

  getSession: (): SessionData | null => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem('sessionData');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  clearSession: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('sessionData');
    localStorage.removeItem('sessionId');
  },

  // Check if session has expired (more than 10 hours)
  isSessionExpired: (): boolean => {
    const sessionData = storage.getSession();
    if (!sessionData) return true;

    const createdAt = new Date(sessionData.createdAt);
    const now = new Date();
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    return diffHours > 10;
  },

  // Get session age in hours
  getSessionAgeHours: (): number => {
    const sessionData = storage.getSession();
    if (!sessionData) return 0;

    const createdAt = new Date(sessionData.createdAt);
    const now = new Date();
    return (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  },
};
