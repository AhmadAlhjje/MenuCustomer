import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Log API URL for debugging network issues
if (typeof window !== 'undefined') {
  console.log('[API Client] Initialized with API URL:', API_URL);
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log('[API Client] Request to:', config.url);
    return config;
  },
  (error) => {
    console.error('[API Client] Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Client] Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios
    if (error.code === 'ECONNREFUSED') {
      console.error('[API Client] 🔴 Connection refused - Server may not be running at:', API_URL);
    } else if (error.code === 'ENOTFOUND') {
      console.error('[API Client] 🔴 Cannot resolve hostname:', API_URL);
    } else if (error.code === 'ETIMEDOUT') {
      console.error('[API Client] 🔴 Request timeout - Network may be slow or server unresponsive');
    } else if (error.response?.status === 401) {
      console.warn('[API Client] ⚠️ Unauthorized - Clearing stored credentials');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else if (error.response?.status === 403) {
      console.error('[API Client] 🔴 Forbidden - Access denied');
    } else if (error.response?.status === 404) {
      console.error('[API Client] 🔴 Not found - Endpoint may not exist:', error.config?.url);
    } else if (error.response?.status === 500) {
      console.error('[API Client] 🔴 Server error - The backend server encountered an error');
    } else {
      console.error('[API Client] Error:', error.message, 'Status:', error.response?.status);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
