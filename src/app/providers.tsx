'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { loadSessionFromStorage } from '@/store/slices/sessionSlice';
import '@/utils/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadSessionFromStorage());
  }, []);

  return (
    <Provider store={store}>
      <Toaster position="top-center" />
      {children}
    </Provider>
  );
}
