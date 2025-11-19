import apiClient from './client';
import { StartSessionRequest, StartSessionResponse, Session } from './types';

export const sessionsApi = {
  startSession: async (qrCode: string, data: StartSessionRequest): Promise<Session> => {
    const response = await apiClient.post<StartSessionResponse>(
      `/api/sessions/start/${qrCode}`,
      data
    );
    return response.data.session;
  },

  getSessionDetails: async (sessionId: number): Promise<Session> => {
    const response = await apiClient.get<Session>(`/api/sessions/${sessionId}`);
    return response.data;
  },
};
