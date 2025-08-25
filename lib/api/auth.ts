// lib/api/auth.ts

// A simple fetch wrapper for making API requests
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      // Throw an error with the message from the backend
      throw new Error(data.message || 'Something went wrong');
    }
  
    return data;
  }
  
  // === API Functions ===
  
  export const registerUserApi = (userData: any) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  };
  
  export const verifyOtpApi = (otpData: any) => {
    return apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });
  };
  
  export const loginUserApi = (credentials: any) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  };
  
  export const forgotPasswordApi = (emailData: any) => {
      return apiFetch('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify(emailData),
      });
  };
  
  export const resetPasswordApi = (token: string, passwordData: any) => {
      return apiFetch(`/auth/reset-password/${token}`, {
          method: 'POST',
          body: JSON.stringify(passwordData),
      });
  };