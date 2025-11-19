import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/api/types';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  orderNotes?: string;
}

const initialState: CartState = {
  items: [],
  orderNotes: undefined,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: MenuItem; quantity?: number }>) => {
      const { item, quantity = 1 } = action.payload;
      const existingItem = state.items.find((cartItem) => cartItem.item.id === item.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ item, quantity, notes: '' });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((cartItem) => cartItem.item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((cartItem) => cartItem.item.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateItemNotes: (state, action: PayloadAction<{ itemId: number; notes: string }>) => {
      const { itemId, notes } = action.payload;
      const item = state.items.find((cartItem) => cartItem.item.id === itemId);
      if (item) {
        item.notes = notes;
      }
    },
    setOrderNotes: (state, action: PayloadAction<string>) => {
      state.orderNotes = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.orderNotes = undefined;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateItemNotes,
  setOrderNotes,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
