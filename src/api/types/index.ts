export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  restaurantId: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantPhone?: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  nameAr: string;
  description?: string;
  displayOrder: number;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameAr: string;
  description?: string;
  price: number | string;
  image?: string;
  images?: string | string[]; // يمكن أن تكون string أو array
  preparationTime?: number;
  isAvailable: boolean;
  displayOrder: number;
  restaurantId?: number;
  category?: {
    id: number;
    name: string;
    nameAr: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: number;
  tableId: number;
  qrCode: string;
  numberOfGuests: number;
  status: 'active' | 'closed';
  startTime: string;
  endTime?: string;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface StartSessionRequest {
  numberOfGuests: number;
}

export interface StartSessionResponse {
  session: Session;
}

export interface OrderItem {
  itemId: number;
  quantity: number;
  notes?: string;
}

export interface CreateOrderRequest {
  sessionId: number;
  items: OrderItem[];
  notes?: string;
}

export interface Order {
  id: number;
  sessionId: number;
  status: 'new' | 'preparing' | 'delivered';
  totalAmount: number;
  notes?: string;
  restaurantId: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItemDetail[];
}

export interface OrderItemDetail {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  notes?: string;
  item?: MenuItem;
  unitPrice?: string | number;
  subtotal?: string | number;
}

export interface CreateOrderResponse {
  order: Order;
}

export interface BackendNote {
  id: string;
  title: string;
  description: string;
  endpoint: string;
  type: 'Bug' | 'Missing' | 'Enhancement';
  createdAt: string;
}
