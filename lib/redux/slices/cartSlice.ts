import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Coupon } from './couponSlice'; // Ensure this path is correct

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : 'http://localhost:8000/api/v1';

// Configure axios to include credentials for session-based auth
axios.defaults.withCredentials = true;

// =================================================================
// --- TYPE DEFINITIONS ---
// =================================================================

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

// --- FIXED: Expanded CartState to include all calculated totals ---
 interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  appliedCoupon: Coupon | null;
  totalItems: number;
  subTotal: number; // The price before any discounts or shipping
  shippingCost: number;
  discountAmount: number;
  finalTotal: number; // The final price the user has to pay
}

// --- FIXED: Updated initialState to match the new CartState interface ---
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

interface CartPayload {
  items: CartItem[];
  // Include other properties your API might return inside the 'data' object
}



// =================================================================
// --- ASYNC THUNKS (API Calls) ---
// (No changes here, these are correct)
// =================================================================

export const fetchCart = createAsyncThunk<CartPayload, void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/cart`);
      
      // --- THE FIX ---
      // The API likely returns the array directly in response.data.data.
      // We check if it's an array and wrap it in the { items: [...] } object
      // to match the expected CartPayload structure for the reducer.
      if (Array.isArray(response.data.data)) {
        return { items: response.data.data }; 
      }
      
      // If the API already returns the correct object, this will handle it too.
      return response.data.data;

    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Failed to fetch cart'
      );
    }
  }
);


export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }: { productId: string; quantity?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/cart`, { productId, quantity });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error.message || 'Failed to add to cart'
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/users/cart/item/${cartItemId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error.message || 'Failed to remove from cart'
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/cart/item/quantity/${productId}`, { quantity });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error.message || 'Failed to update cart quantity'
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
    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
      // Also reset all totals
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
    // --- FIXED: Only ONE version of calculateTotals ---
    calculateTotals: (state) => {
      const subTotal = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);

      let discountAmount = 0;
      if (state.appliedCoupon) {
        discountAmount = subTotal * (state.appliedCoupon.discountPercentage / 100);
      }

      const shippingCost = subTotal > 2000 ? 0 : 99;
      const finalTotal = subTotal - discountAmount + shippingCost;

      // Update all state properties
      state.subTotal = subTotal;
      state.totalItems = totalItems;
      state.discountAmount = discountAmount;
      state.shippingCost = shippingCost;
      state.finalTotal = finalTotal;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Universal pending and rejected states ---
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action: PayloadAction<string>) => { // <-- TYPE ANNOTATION ADDED
          state.loading = false;
          // Now TypeScript knows action.payload exists and is a string
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state, action: PayloadAction<CartPayload>) => { // <-- TYPE ANNOTATION ADDED
          state.loading = false;
          // Now TypeScript knows action.payload exists and has an 'items' property
          state.items = action.payload.items || [];
          cartSlice.caseReducers.calculateTotals(state);
        }
      );
  },
});

// --- FIXED: Export all necessary actions ---
export const { clearCart, applyCoupon, removeCoupon, calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;