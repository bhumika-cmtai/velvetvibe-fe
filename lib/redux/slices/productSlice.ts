import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : 'http://localhost:8000/api/v1';

interface ProductQueryParams {
  page?: number | string;
  limit?: number | string;
  search?: string;
  type?: string;
  gender?: string;
  tags?: string;
  color?: string;
  material?: string;
  stones?: string;
  jewelleryCategory?: string;
  materialType?: string;
  [key: string]: any;
}

interface VideoProductParams {
  type?: string;
  limit?: number;
}

// --- Async Thunks ---
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (queryParams: ProductQueryParams = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();
      const response = await axios.get(`${API_BASE_URL}/products?${queryString}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error.message || 'An unknown error occurred'
      );
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/slug/${slug}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

// New thunk for fetching product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);

export const fetchProductsWithVideos = createAsyncThunk(
  'products/fetchProductsWithVideos',
  async (params: VideoProductParams = {}, { rejectWithValue }) => {
    try {
      // Use URLSearchParams for a cleaner and safer query string
      const queryParams = new URLSearchParams();
      if (params.type) {
        queryParams.append('type', params.type);
      }
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      const queryString = queryParams.toString();
      
      const response = await axios.get(`${API_BASE_URL}/products/videos?${queryString}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : error.message || 'An unknown error occurred'
      );
    }
  }
);



// --- Slice ---
interface ProductState {
  items: any[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  loading: boolean;
  error: string | null;
  selectedProduct: any | null;
  productDetailsLoading: boolean;
  productDetailsError: string | null;
  videoProducts: any[]; // New state for products with videos
}

const initialState: ProductState = {
  items: [],
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  loading: true,
  error: null,
  selectedProduct: null,
  productDetailsLoading: false,
  productDetailsError: null,
  videoProducts: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productDetailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchProducts ---
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch products';
        state.items = [];
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalProducts = 0;
      })
      
      // --- fetchProductBySlug ---
      .addCase(fetchProductBySlug.pending, (state) => {
        state.productDetailsLoading = true;
        state.productDetailsError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.productDetailsLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.productDetailsLoading = false;
        state.productDetailsError = (action.payload as string) || 'Failed to fetch product details';
        state.selectedProduct = null;
      })
      
      // --- fetchProductById ---
      .addCase(fetchProductById.pending, (state) => {
        state.productDetailsLoading = true;
        state.productDetailsError = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetailsLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailsLoading = false;
        state.productDetailsError = (action.payload as string) || 'Failed to fetch product details';
        state.selectedProduct = null;
      })
       // --- fetchProductsWithVideos ---
       .addCase(fetchProductsWithVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsWithVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videoProducts = action.payload;
      })
      .addCase(fetchProductsWithVideos.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch video products';
        state.videoProducts = [];
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;