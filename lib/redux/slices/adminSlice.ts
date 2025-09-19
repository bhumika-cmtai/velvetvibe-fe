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
  deleteUserApi,
  getWalletConfigApi,
  updatePointValueApi,
  addRewardRuleApi,
  updateRewardRuleApi,
  deleteRewardRuleApi,
  type WalletConfig,
  type RewardRule
} from '@/lib/api/admin';

import type { Product } from '@/lib/types/product';
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
  walletConfig: WalletConfig | null;
  walletConfigStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  walletConfigError: string | null;
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
  walletConfig: null,
  walletConfigStatus: 'idle',
  walletConfigError: null,
};


export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (params: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await getAllProductsApi(params);
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
     (error)
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ productId, formData }: { productId: string; formData: FormData }, { rejectWithValue }) => {
  try {
    const response = await updateProductApi(productId, formData);
    return response.data.data;
  } catch (error: any) {
     (error)
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

//walletconfig
export const fetchWalletConfig = createAsyncThunk(
  'admin/fetchWalletConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWalletConfigApi();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wallet config');
    }
  }
);

export const updatePointValue = createAsyncThunk(
  'admin/updatePointValue',
  async (rupeesPerPoint: number, { rejectWithValue }) => {
    try {
      const response = await updatePointValueApi(rupeesPerPoint);
      toast.success("Point value updated!");
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update point value');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addRewardRule = createAsyncThunk(
  'admin/addRewardRule',
  async (rule: RewardRule, { rejectWithValue }) => {
    try {
      const response = await addRewardRuleApi(rule);
      toast.success("Reward rule added!");
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add rule');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateRewardRule = createAsyncThunk(
  'admin/updateRewardRule',
  async ({ targetMinSpend, updates }: { targetMinSpend: number, updates: Partial<RewardRule> }, { rejectWithValue }) => {
    try {
      const response = await updateRewardRuleApi(targetMinSpend, updates);
      toast.success("Reward rule updated!");
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update rule');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteRewardRule = createAsyncThunk(
  'admin/deleteRewardRule',
  async (minSpend: number, { rejectWithValue }) => {
    try {
      const response = await deleteRewardRuleApi(minSpend);
      toast.success("Reward rule deleted!");
      return response.data.data; // Return the updated config
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete rule');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Product Reducers
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
      })

      .addCase(fetchProductById.pending, (state) => { state.selectedProductStatus = 'loading'; state.selectedProduct = null; })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.selectedProductStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => { 
          state.selectedProductStatus = 'failed'; 
          toast.error(`Fetch Details Error: ${action.payload as string}`); 
      })

      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      
      // User Reducers
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
      .addCase(fetchUsers.rejected, (state, action) => { 
          state.userStatus = 'failed'; 
          state.error = action.payload as string; 
      })

      .addCase(fetchUserById.pending, (state) => { state.selectedUserStatus = 'loading'; state.selectedUser = null; })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.selectedUserStatus = 'succeeded'; 
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => { 
          state.selectedUserStatus = 'failed'; 
          toast.error(`Fetch User Details Error: ${action.payload as string}`); 
      })
      
      // Toast Notifications and State Logic Combined
      
      .addCase(createProduct.pending, () => { 
        toast.loading("Creating product...", { id: 'product-action-toast' }); 
      })
      .addCase(createProduct.fulfilled, () => { 
        toast.success("Product created successfully!", { id: 'product-action-toast' }); 
      })
      .addCase(createProduct.rejected, (state, action) => { 
        toast.error(`Create failed: ${action.payload as string}`, { id: 'product-action-toast' }); 
      })

      .addCase(updateProduct.pending, () => { 
        toast.loading("Updating product...", { id: 'product-action-toast' }); 
      })
      .addCase(updateProduct.rejected, (state, action) => { 
        toast.error(`Update failed: ${action.payload as string}`, { id: 'product-action-toast' }); 
      })

      .addCase(deleteProduct.pending, () => {
        toast.loading("Deleting product...", { id: 'product-delete-toast' });
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(p => p._id !== action.payload);
        toast.success("Product deleted successfully!", { id: 'product-delete-toast' });
      })
      .addCase(deleteProduct.rejected, (state, action) => { 
        toast.error(`Delete failed: ${action.payload as string}`, { id: 'product-delete-toast' });
      })

      .addCase(updateUser.pending, () => { 
        toast.loading("Updating user...", { id: 'user-action-toast' }); 
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
        toast.success("User updated successfully!", { id: 'user-action-toast' });
      })
      .addCase(updateUser.rejected, (state, action) => { 
        toast.error(`Update failed: ${action.payload as string}`, { id: 'user-action-toast' }); 
      })
      
      .addCase(deleteUser.pending, () => {
        toast.loading("Deleting user...", { id: 'user-delete-toast' });
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(u => u._id !== action.payload);
        toast.success("User deleted successfully!", { id: 'user-delete-toast' });
      })
      .addCase(deleteUser.rejected, (state, action) => { 
        toast.error(`Delete failed: ${action.payload as string}`, { id: 'user-delete-toast' });
      })
      .addCase(fetchWalletConfig.pending, (state) => {
        state.walletConfigStatus = 'loading';
      })
      .addCase(fetchWalletConfig.fulfilled, (state, action: PayloadAction<WalletConfig>) => {
        state.walletConfigStatus = 'succeeded';
        state.walletConfig = action.payload;
      })
      .addCase(fetchWalletConfig.rejected, (state, action) => {
        state.walletConfigStatus = 'failed';
        state.walletConfigError = action.payload as string;
      })

      // Reducers for updating the state after a successful action
      .addCase(updatePointValue.fulfilled, (state, action: PayloadAction<WalletConfig>) => {
        state.walletConfig = action.payload;
      })
      .addCase(addRewardRule.fulfilled, (state, action: PayloadAction<WalletConfig>) => {
        state.walletConfig = action.payload;
      })
      .addCase(updateRewardRule.fulfilled, (state, action: PayloadAction<WalletConfig>) => {
        state.walletConfig = action.payload;
      })
      .addCase(deleteRewardRule.fulfilled, (state, action: PayloadAction<WalletConfig>) => {
        state.walletConfig = action.payload;
      });
  },
});

export default adminSlice.reducer;