import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item } from './itemSlice';

export interface CartItem {
  item: Item;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  customerId: string | null;
}

const initialState: CartState = {
  items: [],
  customerId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Item>) => {
      const existingItem = state.items.find((cartItem) => cartItem.item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ item: action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.item.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    },
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.customerId = null;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCustomerId, clearCart } = cartSlice.actions;
export default cartSlice.reducer;