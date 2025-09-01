
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductByIdApi,
  getAllUsersApi,
  getUserByIdApi,
  updateUserApi,
  deleteUserApi
} from '@/lib/api/admin';

import type { Product } from '@/lib/data';
import type { AdminUser } from '@/lib/api/admin';

interface AdminState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedProduct: Product | null;
  selectedProductStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  productPagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
  };
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
  productPagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
  users: [],
  userStatus: 'idle',
  userPagination: { currentPage: 1, totalPages: 1, totalUsers: 0 },
  selectedUser: null,
  selectedUserStatus: 'idle',
};


export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await getAllProductsApi(params);
      // Your backend wraps data in a 'data' property
      return response.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk('admin/fetchProductById', async (productId: string, { rejectWithValue }) => {
  try {
    const response = await getProductByIdApi(productId);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (formData: FormData, { rejectWithValue }) => {
  try {
    const response = await createProductApi(formData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ productId, formData }: { productId: string; formData: FormData }, { rejectWithValue }) => {
  try {
    const response = await updateProductApi(productId, formData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (productId: string, { rejectWithValue }) => {
  try {
    await deleteProductApi(productId);
    return productId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: { page?: number; limit?: number; name?: string }, { rejectWithValue }) => {
    try {
      const response = await getAllUsersApi(params);
      
      return response.data.data; 
    } catch (error: any) { 
      return rejectWithValue(error.response?.data?.message || error.message); 
    }
  }
);


export const fetchUserById = createAsyncThunk('admin/fetchUserById', async (userId: string, { rejectWithValue }) => {
  try { 
    const response = await getUserByIdApi(userId);
    return response.data.data;
  } catch (e: any) { 
    return rejectWithValue(e.response?.data?.message || e.message); 
  }
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ userId, updates }: { userId: string; updates: Partial<AdminUser> }, { rejectWithValue }) => {
  try { 
    const response = await updateUserApi(userId, updates);
    return response.data.data;
  } catch (e: any) { 
    return rejectWithValue(e.response?.data?.message || e.message); 
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId: string, { rejectWithValue }) => {
  try { 
    await deleteUserApi(userId); 
    return userId; 
  } catch (e: any) { 
    return rejectWithValue(e.response?.data?.message || e.message); 
  }
});


const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.products = action.payload.products || [];
        state.productPagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalProducts: action.payload.totalProducts,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        toast.error(`Fetch Error: ${state.error}`);
      })

      .addCase(fetchProductById.pending, (state) => { state.selectedProductStatus = 'loading'; state.selectedProduct = null; })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.selectedProductStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => { state.selectedProductStatus = 'failed'; toast.error(`Fetch Details Error: ${action.payload as string}`); })

      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.unshift(action.payload);
        toast.success("Product created successfully!");
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p._id === action.payload._id); // Use _id for consistency with DB
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        toast.success("Product updated successfully!");
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(p => p._id !== action.payload); // Use _id
        toast.success("Product deleted successfully!");
      })

      .addCase(fetchUsers.pending, (state) => { state.userStatus = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.userStatus = 'succeeded';
        state.users = action.payload.users || [];
        state.userPagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalUsers: action.payload.totalUsers,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => { state.userStatus = 'failed'; state.error = action.payload as string; toast.error(`Fetch Users Error: ${state.error}`); })
      .addCase(fetchUserById.pending, (state) => { state.selectedUserStatus = 'loading'; state.selectedUser = null; })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.selectedUserStatus = 'succeeded'; state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => { state.selectedUserStatus = 'failed'; toast.error(`Fetch User Details Error: ${action.payload as string}`); })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        toast.success("User updated!");
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(u => u._id !== action.payload); 
        toast.success("User deleted!");
      })
      
      .addCase(createProduct.pending, () => { toast.loading("Creating product...", { id: 'product-toast' }); })
      .addCase(createProduct.rejected, (state, action) => { toast.error(`Create failed: ${action.payload as string}`, { id: 'product-toast' }); })
      .addCase(updateProduct.pending, () => { toast.loading("Updating product...", { id: 'product-toast' }); })
      .addCase(updateProduct.rejected, (state, action) => { toast.error(`Update failed: ${action.payload as string}`, { id: 'product-toast' }); })
      .addCase(deleteProduct.rejected, (state, action) => { toast.error(`Delete Error: ${action.payload as string}`); })
      .addCase(updateUser.pending, () => { toast.loading("Updating user...", { id: 'user-toast' }); })
      .addCase(updateUser.rejected, (state, action) => { toast.error(`Update failed: ${action.payload as string}`, { id: 'user-toast' }); })
      .addCase(deleteUser.rejected, (state, action) => { toast.error(`Delete failed: ${action.payload as string}`); });
  },
});

export default adminSlice.reducer;