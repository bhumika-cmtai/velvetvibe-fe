// lib/api/admin.ts (Corrected Version)

// IMPORTANT: We are now importing the main, correctly configured apiClient from 'auth.ts'
import apiClient from './auth'; 

// Define the types needed for the API responses
export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  fullName: string; 
  email: string;
  phoneNumber?: string; 
  message: string;
  status: "New" | "Contacted" | "Completed" | "Rejected"; 
  createdAt: string;
  updatedAt: string; 
}

export interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// ==========================================================
// --- PRODUCT API FUNCTIONS ---
// (No changes needed in the functions themselves)
// ==========================================================
export const getAllProductsApi = async (params: { page?: number; limit?: number }) => {
  return apiClient.get('/admin/products', { params });
};
export const getProductByIdApi = async (productId: string) => {
  return apiClient.get(`/admin/products/${productId}`);
};
export const createProductApi = async (formData: FormData) => {
  return apiClient.post('/admin/products', formData);
};
export const updateProductApi = async (productId: string, formData: FormData) => {
  return apiClient.put(`/admin/products/${productId}`, formData);
};
export const deleteProductApi = async (productId: string) => {
  return apiClient.delete(`/admin/products/${productId}`);
};

// ==========================================================
// --- USER API FUNCTIONS ---
// ==========================================================
export const getAllUsersApi = async (params: { page?: number; limit?: number; gender?: string; search?: string }) => {
  return apiClient.get('/admin/users', { params });
};
export const getUserByIdApi = async (userId: string) => {
  return apiClient.get(`/admin/users/${userId}`);
};
export const updateUserApi = async (userId: string, updates: Partial<AdminUser>) => {
  return apiClient.put(`/admin/users/${userId}`, updates);
};
export const deleteUserApi = async (userId: string) => {
  return apiClient.delete(`/admin/users/${userId}`);
};

// ==========================================================
// --- INQUIRY (CONTACT) API FUNCTIONS ---
// ==========================================================
export const getAllInquiriesApi = async (status?: string) => {
  const params = status ? { status } : {};
  return apiClient.get('/contact/admin', { params });
};
export const updateInquiryApi = async (inquiryId: string, updates: Partial<Inquiry>) => {
  return apiClient.put(`/contact/admin/${inquiryId}`, updates);
};
export const deleteInquiryApi = async (inquiryId: string) => {
  return apiClient.delete(`/contact/admin/${inquiryId}`);
};

// ==========================================================
// --- COUPON API FUNCTIONS ---
// ==========================================================
export const createCouponApi = (couponData: { code: string; discountPercentage: number; status?: 'active' | 'inactive' }) => {
  return apiClient.post('/coupon', couponData);
};
export const getAllCouponsApi = (status?: 'active' | 'inactive') => {
  const params = status ? { status } : {};
  return apiClient.get('/coupon', { params });
};
export const updateCouponApi = (couponId: string, couponData: Partial<{ code: string; discountPercentage: number; status: 'active' | 'inactive' }>) => {
  return apiClient.patch(`/coupon/${couponId}`, couponData);
};
export const deleteCouponApi = (couponId: string) => {
  return apiClient.delete(`/coupon/${couponId}`);
};
export const getCouponByNameApi = (couponCode: string) => {
  return apiClient.get(`/coupon/code/${couponCode}`);
};