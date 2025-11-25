import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '@/api/types';

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

interface OrderState {
  items: OrderItem[];
  orderNotes?: string;
}

const initialState: OrderState = {
  items: [],
  orderNotes: undefined,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToOrder: (state, action: PayloadAction<{ item: MenuItem; quantity?: number; notes?: string }>) => {
      const { item, quantity = 1, notes = '' } = action.payload;
      const existingItem = state.items.find((orderItem) => orderItem.item.id === item.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        if (notes) {
          existingItem.notes = notes;
        }
      } else {
        state.items.push({ item, quantity, notes });
      }
    },
    removeFromOrder: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((orderItem) => orderItem.item.id !== action.payload);
    },
    updateOrderItemQuantity: (state, action: PayloadAction<{ itemId: number; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((orderItem) => orderItem.item.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateOrderItemNotes: (state, action: PayloadAction<{ itemId: number; notes: string }>) => {
      const { itemId, notes } = action.payload;
      const item = state.items.find((orderItem) => orderItem.item.id === itemId);
      if (item) {
        item.notes = notes;
      }
    },
    setOrderNotes: (state, action: PayloadAction<string>) => {
      state.orderNotes = action.payload;
    },
    clearOrder: (state) => {
      state.items = [];
      state.orderNotes = undefined;
    },
  },
});

export const {
  addToOrder,
  removeFromOrder,
  updateOrderItemQuantity,
  updateOrderItemNotes,
  setOrderNotes,
  clearOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
