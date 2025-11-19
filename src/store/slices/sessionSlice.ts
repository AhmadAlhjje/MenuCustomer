import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '@/api/types';

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
        localStorage.setItem('sessionId', action.payload.id.toString());
      }
    },
    clearSession: (state) => {
      state.session = null;
      state.sessionId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sessionId');
      }
    },
    loadSessionFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          state.sessionId = parseInt(sessionId, 10);
        }
      }
    },
  },
});

export const { setSession, clearSession, loadSessionFromStorage } = sessionSlice.actions;
export default sessionSlice.reducer;
