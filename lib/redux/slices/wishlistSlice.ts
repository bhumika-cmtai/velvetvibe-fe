// wishlistSlice.tsx
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store'; 
import { Product } from '@/lib/data'; 
import api from '@/lib/api/user'; 

interface WishlistItemBackend {
  _id: string; 
  name: string;
  price: number;
  images: string[];
  stock: number;
}

interface WishlistState {
  items: WishlistItemBackend[];
  totalItems: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
  status: 'idle',
  error: null,
};

export const fetchWishlist = createAsyncThunk<WishlistItemBackend[], void, { state: RootState }>(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist'); 
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk<WishlistItemBackend[], string, { state: RootState }>(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist', { productId }); 
      console.log(response.data.data)
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk<WishlistItemBackend[], string, { state: RootState }>(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`); 
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.status = 'idle';
      state.error = null;
    },
    addWishlistOptimistic: (state, action: PayloadAction<WishlistItemBackend>) => {
      if (!state.items.some(item => item._id === action.payload._id)) {
        state.items.push(action.payload);
        state.totalItems = state.items.length;
      }
    },
    removeWishlistOptimistic: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.totalItems = state.items.length;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; 
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; 
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
      
  },
});

export const { clearWishlist, addWishlistOptimistic, removeWishlistOptimistic } = wishlistSlice.actions;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistStatus = (state: RootState) => state.wishlist.status;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
export const selectTotalWishlistItems = (state: RootState) => state.wishlist.items.length;
export const selectIsAddedToWishlist = (productId: string) => (state: RootState) =>
  state.wishlist.items.some(item => item._id === productId);

export default wishlistSlice.reducer;