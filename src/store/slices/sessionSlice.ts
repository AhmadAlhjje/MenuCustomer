import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@/api/types';
import { storage } from '@/utils/storage';

interface SessionState {
  session: Session | null;
  sessionId: number | null;
}

const initialState: SessionState = {
  session: null,
  sessionId: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload;
      state.sessionId = action.payload.id;
      if (typeof window !== 'undefined') {
        // Store both sessionId and createdAt timestamp
        storage.setSession(action.payload.id);
      }
    },
    clearSession: (state) => {
      state.session = null;
      state.sessionId = null;
      if (typeof window !== 'undefined') {
        storage.clearSession();
      }
    },
    loadSessionFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        // Check if session has expired
        if (storage.isSessionExpired()) {
          storage.clearSession();
          state.sessionId = null;
          state.session = null;
        } else {
          const sessionData = storage.getSession();
          if (sessionData) {
            state.sessionId = sessionData.sessionId;
          }
        }
      }
    },
  },
});

export const { setSession, clearSession, loadSessionFromStorage } = sessionSlice.actions;
export default sessionSlice.reducer;
