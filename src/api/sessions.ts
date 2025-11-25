import apiClient from './client';
import { StartSessionRequest, StartSessionResponse, Session } from './types';

export const sessionsApi = {
  startSession: async (qrCode: string, data: StartSessionRequest): Promise<Session> => {
    const response = await apiClient.post<any>(
      `/api/sessions/start/${qrCode}`,
      data
    );

    console.log('API Response:', response.data);

    // Handle different response formats
    // 1. { data: { session: {...} } } - wrapped in data
    if (response.data.data && response.data.data.session) {
      console.log('Found session in response.data.data.session');
      return response.data.data.session;
    }
    // 2. { session: {...} } - direct session
    else if (response.data.session) {
      console.log('Found session in response.data.session');
      return response.data.session;
    }
    // 3. Direct session object
    else {
      console.log('Using response.data as session directly');
      return response.data as Session;
    }
  },

  getSessionDetails: async (sessionId: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/api/sessions/${sessionId}`);
    return response.data;
  },
};
