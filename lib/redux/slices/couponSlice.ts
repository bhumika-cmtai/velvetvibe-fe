import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { createCouponApi, deleteCouponApi, getAllCouponsApi,getCouponByNameApi ,updateCouponApi } from '@/lib/api/admin';

// --- Type Definitions (No change) ---
export interface Coupon {
    _id: string;
    code: string;
    discountPercentage: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

interface CouponState {
    coupons: Coupon[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// --- Initial State (No change) ---
const initialState: CouponState = {
    coupons: [],
    status: 'idle',
    error: null,
};

// Helper to get token (No change)
const getToken = (getState: () => unknown): string => {
    const token = (getState() as { auth: { accessToken: string } }).auth.accessToken;
    if (!token) throw new Error('Authentication token is not available.');
    return token;
};

// --- Async Thunks (Corrected Data & Error Handling) ---
export const fetchCoupons = createAsyncThunk(
    'coupons/fetchAll',
    // The thunk now accepts an optional 'status' payload
    async (status: 'active' | 'inactive' | undefined, { getState, rejectWithValue }) => {
        try {
            const token = getToken(getState);
            // Pass the status along to the updated API function
            const response = await getAllCouponsApi(status);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch coupons.');
        }
    }
);

// Fetch a single coupon by its code name (for cart validation)
export const fetchCouponByName = createAsyncThunk(
    'coupons/fetchByName',
    async (couponCode: string, { rejectWithValue }) => {
        try {
            // This API call fetches the coupon and validates if it's active on the backend
            const response = await getCouponByNameApi(couponCode);
            return response.data.data as Coupon; // The backend returns the full coupon object
        } catch (error: any) {
            // The backend API sends specific error messages for "not found" or "inactive"
            return rejectWithValue(error.response?.data?.message || 'An error occurred.');
        }
    }
);



export const createCoupon = createAsyncThunk('coupons/create', async (couponData: { code: string; discountPercentage: number }, { getState, rejectWithValue }) => {
    try {
        const token = getToken(getState);
        const response = await createCouponApi(couponData);
        // --- FIX: Extract the new coupon object from the ApiResponse ---
        return response.data.data;
    } catch (error: any) {
        // --- FIX: Extract the specific backend message (e.g., "coupon already exists") ---
        return rejectWithValue(error.response?.data?.message || 'Failed to create coupon.');
    }
});

export const updateCoupon = createAsyncThunk('coupons/update', async ({ couponId, couponData }: { couponId: string; couponData: Partial<Coupon> }, { getState, rejectWithValue }) => {
    try {
        const token = getToken(getState);
        const response = await updateCouponApi(couponId, couponData);
        // --- FIX: Extract the updated coupon object ---
        return response.data.data;
    } catch (error: any) {
        // --- FIX: Extract the specific backend message ---
        return rejectWithValue(error.response?.data?.message || 'Failed to update coupon.');
    }
});

export const deleteCoupon = createAsyncThunk('coupons/delete', async (couponId: string, { getState, rejectWithValue }) => {
    try {
        const token = getToken(getState);
        await deleteCouponApi(couponId);
        return couponId;
    } catch (error: any) {
        // --- FIX: Extract the specific backend message ---
        return rejectWithValue(error.response?.data?.message || 'Failed to delete coupon.');
    }
});

// --- Slice Definition (Corrected to show toasts on rejection) ---
const couponSlice = createSlice({
    name: 'coupons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCoupons.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
                state.status = 'succeeded';
                state.coupons = action.payload;
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                // Also show a toast for fetch errors
                toast.error(state.error); 
            })
            // Create
            .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                state.coupons.unshift(action.payload);
                // This success toast will now work correctly
                toast.success('Coupon created successfully!');
            })
            .addCase(createCoupon.rejected, (_, action) => {
                // This will now show the specific message from the backend
                toast.error(action.payload as string);
            })
            // Update
            .addCase(updateCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
                const index = state.coupons.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.coupons[index] = action.payload;
                }
                toast.success('Coupon updated successfully!');
            })
            .addCase(updateCoupon.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            // Delete
            .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<string>) => {
                state.coupons = state.coupons.filter(c => c._id !== action.payload);
                toast.success('Coupon deleted successfully!');
            })
            .addCase(deleteCoupon.rejected, (_, action) => {
                toast.error(action.payload as string);
            });
    },
});

export default couponSlice.reducer;