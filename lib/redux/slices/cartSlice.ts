// cartSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios'; // Import AxiosError for better type checking
import apiClient from '@/lib/api/auth'; 
// Removed coupon import - using points system instead 

interface LocalCartItem {
  _id: string;
  quantity: number;
}

export interface CartItem {
  _id: string; // Cart item ki apni unique ID
  product: {
    _id: string;
    name: string;
    slug: string;
  };
  sku_variant: string;
  quantity: number;
  price: number; // Item ka price ab yahan se aayega
  image?: string; // Variant-specific image
  attributes?: Record<string, string>; 
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  appliedPoints: number; // Points applied for discount
  totalItems: number;
  subTotal: number;
  shippingCost: number;
  discountAmount: number;
  finalTotal: number;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  appliedPoints: 0,
  totalItems: 0,
  subTotal: 0,
  shippingCost: 0,
  discountAmount: 0,
  finalTotal: 0,
};

interface ApiResponse {
  data: CartItem[];
  message?: string;
}

interface ApiError {
  message: string;
}



export const fetchCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/users/cart');
      // Assuming API returns the cart array directly in response.data.data
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk<CartItem[], { productId: string; sku_variant?: string; quantity: number }, { rejectValue: string }>(
  'cart/addToCart',
  async (params, { rejectWithValue }) => {
    try {
      
      const response = await apiClient.post('/users/cart', params);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk<CartItem[], string, { rejectValue: string }>(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/users/cart/item/${cartItemId}`);
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk<CartItem[], { cartItemId: string; quantity: number }, { rejectValue: string }>(
  'cart/updateQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      // Endpoint ko bhi cartItemId ke hisaab se update karein
        console.log("---cartItemId---")
        console.log(cartItemId)
      const response = await apiClient.patch(`/users/cart/item/quantity/${cartItemId}`, { quantity });
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      return rejectWithValue(err.response?.data?.message || 'Failed to update cart quantity');
    }
  }
);

export const mergeCarts = createAsyncThunk<CartItem[], { productId: string, sku_variant: string, quantity: number }[], { rejectValue: string }>(
    'cart/mergeCarts',
    async (localCartItems, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/users/cart/merge', { items: localCartItems });
            return response.data.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            return rejectWithValue(err.response?.data?.message || 'Failed to merge carts');
        }
    }
);



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearLocalCartState: (state) => {
        state.items = [];
        state.appliedPoints = 0;
        cartSlice.caseReducers.calculateTotals(state);
    },
    applyPoints: (state, action: PayloadAction<number>) => {
      state.appliedPoints = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    removePoints: (state) => {
      state.appliedPoints = 0;
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      // Calculate subtotal from items
      const subTotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      
      // Points discount: 1 point = 1 rupee
      const discountAmount = state.appliedPoints;
      
      const shippingCost = 0;
      const finalTotal = Math.max(0, subTotal - discountAmount + shippingCost);
      
      state.subTotal = subTotal;
      state.totalItems = totalItems;
      state.discountAmount = discountAmount;
      state.shippingCost = shippingCost;
      state.finalTotal = finalTotal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state, action: PayloadAction<CartItem[] | ApiResponse>) => {
          state.loading = false;
          // Handle both direct CartItem[] and wrapped ApiResponse
          if (Array.isArray(action.payload)) {
            state.items = action.payload;
          } else {
            state.items = action.payload.data || [];
          }
          cartSlice.caseReducers.calculateTotals(state);
        }
      );
  },
});

export const { clearLocalCartState, applyPoints, removePoints, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;