// lib/api/auth.ts
import axios from 'axios';

export interface Address {
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


export interface User {
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
// Define the expected shape of your user and API responses based on your backend

interface AuthResponseData {
  user: User;
  accessToken: string;
}

// This type matches the `ApiResponse` class on your backend
interface BackendResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

// Configure your API base URL. Use environment variables for this.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1', // Default for local dev
  withCredentials: true, // Important for sending cookies
});

// =================================================================
// API FUNCTIONS
// =================================================================

/**
 * Registers a new user.
 * Corresponds to the `registerUser` controller.
 */
export const registerUserApi = async (userData: { name: string; email: string; password: string }) => {
  try {
    const response = await apiClient.post<BackendResponse<{ email: string }>>(
      '/auth/register', 
      userData
    );
    return response.data;
  } catch (error: any) {
    // Throw an error with the message from the backend's ApiResponse
    throw new Error(error.response?.data?.message || 'An unexpected error occurred during registration.');
  }
};

/**
 * Verifies the user's OTP.
 * Corresponds to the `verifyOtp` controller.
 */
export const verifyOtpApi = async (otpData: { email: string; otp: string }) => {
  try {
    const response = await apiClient.post<BackendResponse<AuthResponseData>>(
      '/auth/verify-otp', 
      otpData
    );
    return response.data; // This will contain { user, accessToken }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP.');
  }
};

/**
 * Logs in an existing user.
 * Corresponds to the `loginUser` controller.
 */
export const loginUserApi = async (credentials: { email: string; password: string }) => {
  try {
    const response = await apiClient.post<BackendResponse<AuthResponseData>>(
      '/auth/login', 
      credentials
    );
    return response.data; // This will contain { user, accessToken }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Invalid credentials or server error.');
  }
};

export const logoutUserApi = async () => {
  try {
    // The interceptor will automatically attach the auth token to this request.
    const response = await apiClient.post<BackendResponse<{}>>(
      '/auth/logout'
    );
    // console.log("logout---")
    // console.log(response.data)
    return response.data;
  } catch (error: any) {
    // Even if the server fails to log out (e.g., network error),
    // we should proceed with the client-side logout.
    // So, we can just log the error or handle it silently.
    console.error("Logout API call failed:", error.response?.data?.message || error.message);
    // Optionally re-throw if you want the calling component to handle it
    throw new Error(error.response?.data?.message || 'Logout failed.');
  }
};