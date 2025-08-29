// wishlistSlice.tsx
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; // Assuming you have a store.ts file for your Redux store
import { Product } from '@/lib/data'; // Adjust this path to your Product type definition
import api from '@/lib/api/user'; // Import the custom Axios instance

// Define the type for a Wishlist Item received from the backend
// Assuming backend returns product details directly for wishlist
interface WishlistItemBackend {
  _id: string; // The product ID from the backend
  name: string;
  price: number;
  images: string[];
  stock: number;
  // Add any other relevant product fields you expect
}

// Define the state for the wishlist slice
interface WishlistState {
  items: WishlistItemBackend[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async Thunk for fetching the user's wishlist
export const fetchWishlist = createAsyncThunk<WishlistItemBackend[], void, { state: RootState }>(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      // Use the imported 'api' instance
      const response = await api.get('/wishlist'); // The baseURL in api/user.ts handles /api/v1/users
      return response.data.data; // Assuming API returns { success, data, message }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk for adding a product to the wishlist
export const addToWishlist = createAsyncThunk<WishlistItemBackend[], string, { state: RootState }>(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      // Use the imported 'api' instance
      const response = await api.post('/wishlist', { productId }); // The baseURL in api/user.ts handles /api/v1/users
      console.log(response.data.data)
      return response.data.data; // Assuming API returns the updated wishlist
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk for removing a product from the wishlist
export const removeFromWishlist = createAsyncThunk<WishlistItemBackend[], string, { state: RootState }>(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      // Use the imported 'api' instance
      const response = await api.delete(`/wishlist/${productId}`); // The baseURL in api/user.ts handles /api/v1/users
      return response.data.data; // Assuming API returns the updated wishlist
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Synchronous action to clear wishlist locally (e.g., on logout)
    clearWishlist: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    // Optimistic update for adding to wishlist (before API response)
    addWishlistOptimistic: (state, action: PayloadAction<WishlistItemBackend>) => {
      if (!state.items.some(item => item._id === action.payload._id)) {
        state.items.push(action.payload);
      }
    },
    // Optimistic update for removing from wishlist (before API response)
    removeWishlistOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Add To Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading'; // Can be 'idle' if optimistic update is used
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Replace with the updated wishlist from the backend
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        // Revert optimistic update if it was applied
      })
      // Remove From Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading'; // Can be 'idle' if optimistic update is used
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Replace with the updated wishlist from the backend
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        // Revert optimistic update if it was applied
      });
  },
});

export const { clearWishlist, addWishlistOptimistic, removeWishlistOptimistic } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistStatus = (state: RootState) => state.wishlist.status;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectTotalWishlistItems = (state: RootState) => state.wishlist.items.length;
export const selectIsAddedToWishlist = (productId: string) => (state: RootState) =>
  state.wishlist.items.some(item => item._id === productId);

export default wishlistSlice.reducer;