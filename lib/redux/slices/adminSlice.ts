import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from '@/lib/api/admin';
import type { RootState } from '../store';
import type { Product } from '@/lib/data';
import { toast } from 'sonner';
import { AdminUser, deleteUserApi, getAllUsersApi, getProductByIdApi, getUserByIdApi, updateUserApi } from '@/lib/admin-data';

interface AdminState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedProduct: Product | null;
  selectedProductStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  //for user 
  users: AdminUser[];
  userStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  userPagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
  };
  selectedUser: AdminUser | null;
  selectedUserStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AdminState = {
  products: [],
  status: 'idle',
  error: null,
  selectedProduct: null,
  selectedProductStatus: 'idle',
  users: [],
  userStatus: 'idle',
  userPagination: { currentPage: 1, totalPages: 1, totalUsers: 0 },
  selectedUser: null,
  selectedUserStatus: 'idle',

};

// Helper to get the auth token from the state
const getToken = (getState: () => unknown) => {
  // Replace with your actual auth slice logic
  // const token = (getState() as RootState).auth.accessToken;
  const token = 'mock-auth-token'; // Using a placeholder for now
  if (!token) throw new Error('Authentication token is not available.');
  return token;
};

// --- ASYNC THUNKS ---
// --- User Thunks ---
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; gender?: string; search?: string }, { getState, rejectWithValue }) => {
    try {
      const response = await getAllUsersApi(params, getToken(getState));
      if (response && response.data) {
        // console.log()
        console.log(response.data.data)
        return response.data.data; // This should be the object: { users, currentPage, ... }
      } else {
        // Handle cases where the API response shape is unexpected
        throw new Error("Invalid API response structure");
      }
    } catch (error: any) { 
      return rejectWithValue(error.message); 
    }
  }
);
export const fetchUserById = createAsyncThunk('admin/fetchUserById', async (userId: string, { getState, rejectWithValue }) => {
    try { return (await getUserByIdApi(userId, getToken(getState))).data; } 
    catch (e: any) { return rejectWithValue(e.response?.data?.message || e.message); }
});
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId, updates }: { userId: string; updates: Partial<AdminUser> }, { getState, rejectWithValue }) => {
    try { return (await updateUserApi(userId, updates, getToken(getState))).data; } 
    catch (e: any) { return rejectWithValue(e.response?.data?.message || e.message); }
});
export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId: string, { getState, rejectWithValue }) => {
    try { await deleteUserApi(userId, getToken(getState)); return userId; } 
    catch (e: any) { return rejectWithValue(e.response?.data?.message || e.message); }
});

export const fetchProductById = createAsyncThunk(
  'admin/fetchProductById',
  async (productId: string, { getState, rejectWithValue }) => {
    try {
      const response = await getProductByIdApi(productId, getToken(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await getAllProductsApi(getToken(getState));

      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (formData: FormData, { getState, rejectWithValue }) => {
    try {
      const response = await createProductApi(formData, getToken(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ productId, formData }: { productId: string; formData: FormData }, { getState, rejectWithValue }) => {
    try {
      const response = await updateProductApi(productId, formData, getToken(getState));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId: string, { getState, rejectWithValue }) => {
    try {
      await deleteProductApi(productId, getToken(getState));
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- SLICE DEFINITION ---

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        toast.error(`Fetch Error: ${state.error}`);
      })

      .addCase(fetchProductById.pending, (state) => {
        state.selectedProductStatus = 'loading';
        state.selectedProduct = null; // Clear previous product while loading
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.selectedProductStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedProductStatus = 'failed';
        toast.error(`Failed to fetch details: ${action.payload as string}`);
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        toast.loading("Creating new product...", { id: 'create-product-toast' });
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.unshift(action.payload);
        // The loading toast is updated to a success message.
        toast.success("Product created successfully!", { id: 'create-product-toast' });
      })
      .addCase(createProduct.rejected, (state, action) => {
        // The loading toast is updated to an error message.
        toast.error(`Failed to create product: ${action.payload as string}`, { id: 'create-product-toast' });
      })
      // Update Product
      .addCase(updateProduct.pending, () => {
        toast.loading("Updating product...", { id: 'update-product-toast' });
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        toast.success("Product updated successfully!", { id: 'update-product-toast' });
      })
      .addCase(updateProduct.rejected, (state, action) => {
        toast.error(`Update failed: ${action.payload as string}`, { id: 'update-product-toast' });
      })

      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(p => p.id !== action.payload);
        toast.success("Product deleted successfully!");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        toast.error(`Delete Error: ${action.payload as string}`);
      })
      // ... (add fulfilled/rejected cases for updateUser and deleteUser with toasts)
      
// --- User Reducers ---
      .addCase(fetchUsers.pending, (state) => { state.userStatus = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.userStatus = 'succeeded';
        state.users = action.payload.users || [];
        state.userPagination = {
          currentPage: action.payload.currentPage, totalPages: action.payload.totalPages, totalUsers: action.payload.totalUsers,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.userStatus = 'failed'; state.error = action.payload as string; toast.error(`Fetch Users Error: ${state.error}`);
      })
      .addCase(fetchUserById.pending, (state) => {
        state.selectedUserStatus = 'loading'; state.selectedUser = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.selectedUserStatus = 'succeeded'; state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.selectedUserStatus = 'failed'; toast.error(`Fetch User Details Error: ${action.payload as string}`);
      })
      .addCase(updateUser.pending, () => { toast.loading("Updating user...", { id: 'user-toast' }); })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        toast.success("User updated!", { id: 'user-toast' });
      })
      .addCase(updateUser.rejected, (state, action) => { toast.error(`Update failed: ${action.payload as string}`, { id: 'user-toast' }); })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(u => u._id !== action.payload); toast.success("User deleted!");
      })
      .addCase(deleteUser.rejected, (state, action) => { toast.error(`Delete failed: ${action.payload as string}`); });
},
});

export default adminSlice.reducer;