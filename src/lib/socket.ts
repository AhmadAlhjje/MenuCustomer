import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket && socket.connected) {
    return socket;
  }

  const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3003';

  socket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => {
    console.log('🔌 Customer Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Customer Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Customer Socket connection error:', error);
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
  }
};
