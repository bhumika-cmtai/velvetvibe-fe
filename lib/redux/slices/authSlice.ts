// lib/redux/slices/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// =================================================================
// INTERFACES - These now perfectly match your Mongoose schemas
// =================================================================

 interface Address {
  _id: string; // MongoDB adds an _id to subdocuments
  fullName: string;
  phone: string;
  type: 'Home' | 'Work';
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

 interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  addresses: Address[];
  wishlist: string[]; // Array of Product ObjectIds
  // The cart is often managed by a separate context/slice due to its frequent updates,
  // but it can be included here if needed.
  createdAt: string; // Timestamps from Mongoose
  updatedAt: string;
}

// The shape of our Redux authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
}

// =================================================================
// LOCAL STORAGE - For session persistence
// =================================================================

const loadState = (): AuthState => {
  try {
    const serializedState = typeof window !== 'undefined' ? localStorage.getItem('authState') : null;
    if (serializedState === null) {
      return { isAuthenticated: false, user: null, accessToken: null };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { isAuthenticated: false, user: null, accessToken: null };
  }
};

const saveState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

const initialState: AuthState = loadState();

// =================================================================
// THE AUTH SLICE
// =================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after a successful login or OTP verification from the backend.
     * Sets the entire user session.
     */
    loginSuccess: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      saveState(state);
    },

    /**
     * Clears the user session and removes data from local storage.
     */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      // Clear the persisted state from local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
      }
    },

    /**
     * Updates user profile details in the Redux store without a full re-login.
     * Useful after a user updates their name or avatar.
     */
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
        if (state.user) {
            state.user = { ...state.user, ...action.payload };
            saveState(state);
        }
    },
    
    // --- Address Management Reducers ---
    // These reducers now operate on the `addresses` array within the `user` object.

    /**
     * Adds a new address to the user's address list.
     * In a real app, you'd dispatch this after a successful API call.
     */
    addAddress: (state, action: PayloadAction<Address>) => {
      if (state.user) {
        // If this is the very first address, make it the default
        if (state.user.addresses.length === 0) {
          action.payload.isDefault = true;
        }
        state.user.addresses.push(action.payload);
        saveState(state);
      }
    },

    /**
     * Removes an address by its _id.
     */
    removeAddress: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const addressIdToRemove = action.payload;
        state.user.addresses = state.user.addresses.filter(addr => addr._id !== addressIdToRemove);
        
        // If the deleted address was the default and there are other addresses left,
        // make the new first one the default.
        const wasDefault = state.user.addresses.find(a => a._id === addressIdToRemove)?.isDefault;
        if (wasDefault && state.user.addresses.length > 0) {
            if (!state.user.addresses.some(a => a.isDefault)) {
                state.user.addresses[0].isDefault = true;
            }
        }
        saveState(state);
      }
    },
    
    /**
     * Updates an existing address in the list.
     */
    updateAddress: (state, action: PayloadAction<Address>) => {
      if (state.user) {
        const index = state.user.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.user.addresses[index] = action.payload;
          saveState(state);
        }
      }
    },

    /**
     * Sets a specific address as the default one.
     */
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.addresses.forEach(addr => {
          addr.isDefault = addr._id === action.payload;
        });
        saveState(state);
      }
    },
  },
});

export const { 
  loginSuccess, 
  logout, 
  updateUserProfile,
  addAddress, 
  removeAddress, 
  updateAddress, 
  setDefaultAddress 
} = authSlice.actions;

export default authSlice.reducer;