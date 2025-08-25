import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice'
import contactReducer from './slices/contactSlice'
import couponReducer from './slices/couponSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    contact: contactReducer,
    coupon: couponReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;