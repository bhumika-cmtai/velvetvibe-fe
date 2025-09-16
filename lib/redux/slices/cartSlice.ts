// cartSlicet.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Coupon } from './couponSlice'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : 'http://localhost:8000/api/v1';

axios.defaults.withCredentials = true;

// =================================================================
// --- TYPE DEFINITIONS ---
// =================================================================

// This interface is for items coming from the local cart
interface LocalCartItem {
  _id: string;
  quantity: number;
}
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    mainImage: string;
    images: string[];
    stock: number;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  appliedCoupon: Coupon | null;
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
  appliedCoupon: null,
  totalItems: 0,
  subTotal: 0,
  shippingCost: 0,
  discountAmount: 0,
  finalTotal: 0,
};

interface ApiResponse {
  data: CartItem[];
}

// =================================================================
// --- ASYNC THUNKS (API Calls) ---
// =================================================================

export const fetchCart = createAsyncThunk<ApiResponse, void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/cart`);
      return { data: response.data.data };
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to fetch cart'
      );
    }
  }
);

export const addToCart = createAsyncThunk<ApiResponse, { productId: string; quantity?: number }, { rejectValue: string }>(
  'cart/addToCart',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/cart`, params);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to add to cart'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk<ApiResponse, string, { rejectValue: string }>(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/cart/item/${cartItemId}`);
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to remove from cart'
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk<ApiResponse, { productId: string; quantity: number }, { rejectValue: string }>(
  'cart/updateQuantity',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/cart/item/quantity/${params.productId}`, { quantity: params.quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to update cart quantity'
      );
    }
  }
);

// --- NEW ASYNC THUNK FOR MERGING CART ---
export const mergeCarts = createAsyncThunk<ApiResponse, { localCartItems: LocalCartItem[] }, { rejectValue: string }>(
    'cart/mergeCarts',
    async ({ localCartItems }, { rejectWithValue }) => {
        try {
            // This endpoint should be created in your backend to handle the merge logic
            const response = await axios.post(`${API_BASE_URL}/users/cart/merge`, { items: localCartItems });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                axios.isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : 'Failed to merge carts'
            );
        }
    }
);


// =================================================================
// --- SLICE DEFINITION ---
// =================================================================

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // This is a local clear, for when a user logs out
    clearLocalCartState: (state) => {
        state.items = [];
        state.appliedCoupon = null;
        cartSlice.caseReducers.calculateTotals(state);
    },
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.appliedCoupon = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      cartSlice.caseReducers.calculateTotals(state);
    },
    calculateTotals: (state) => {
      const subTotal = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      let discountAmount = 0;
      if (state.appliedCoupon) {
        discountAmount = subTotal * (state.appliedCoupon.discountPercentage / 100);
      }
      const shippingCost = subTotal > 2000 ? 0 : 99;
      const finalTotal = subTotal - discountAmount + shippingCost;
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
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.items = action.payload.data || []; 
          cartSlice.caseReducers.calculateTotals(state);
        }
      );
  },
});

export const { clearLocalCartState, applyCoupon, removeCoupon, calculateTotals } = cartSlice.actions;
export default cartSlice.reducer;