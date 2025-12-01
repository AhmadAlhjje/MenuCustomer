import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let connectionAttempts = 0;
const MAX_RECONNECTION_ATTEMPTS = 15;

export const initializeSocket = (): Socket => {
  if (socket && socket.connected) {
    console.log('🔌 Using existing connected socket');
    connectionAttempts = 0;
    return socket;
  }

  const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3003';
  console.log('🔌 Initializing socket connection to:', serverUrl);

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECTION_ATTEMPTS,
    upgrade: true,
    path: '/socket.io/',
    // دعم اتصالات من أجهزة متعددة
    rememberUpgrade: true,
  });

  socket.on('connect', () => {
    console.log('✅ Customer Socket connected:', socket?.id);
    connectionAttempts = 0;
  });

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Customer Socket disconnected. Reason:', reason);
  });

  socket.on('reconnect_attempt', () => {
    connectionAttempts++;
    console.log(`🔄 Reconnection attempt ${connectionAttempts}/${MAX_RECONNECTION_ATTEMPTS}`);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Customer Socket connection error:', error);
    console.error('📍 Server URL:', serverUrl);
    console.error('💡 Troubleshooting: تأكد من أن الخادم يعمل على العنوان المحدد في NEXT_PUBLIC_API_BASE_URL');
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectionAttempts = 0;
  }
};

export const isSocketConnected = (): boolean => {
  return socket !== null && socket.connected;
};
