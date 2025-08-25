async function apiFetch(endpoint: string, options: RequestInit = {}, token: string | null = null) {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    // --- FIX START: Use a more specific type for headers to allow string indexing ---
    // We initialize headers as a flexible key-value pair object.
    const headers: Record<string, string> = {};
    // --- FIX END ---
  
    // Set Content-Type only if the body is NOT FormData.
    // The browser must set the Content-Type for FormData itself to include the boundary.
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
  
    // Add the Authorization token if it exists.
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      ...options,
      // Merge our generated headers with any custom headers from the options.
      headers: { ...headers, ...options.headers },
    });
  
    // Handle cases where the response might not have a JSON body (e.g., 204 No Content)
    if (response.status === 204) {
        return null; 
    }
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'An API error occurred');
    }
  
    return data;
  }
  
  // =======================
  // Product API Functions (No changes needed here)
  // =======================
  
  export const getAllProductsApi = (token: string) => {
    return apiFetch('/admin/products', { method: 'GET' }, token);
  };
  
  export const createProductApi = (formData: FormData, token: string) => {
    return apiFetch('/admin/products', {
      method: 'POST',
      body: formData,
    }, token);
  };
  
  export const updateProductApi = (productId: string, formData: FormData, token: string) => {
    return apiFetch(`/admin/products/${productId}`, {
      method: 'PUT',
      body: formData,
    }, token);
  };
  
  export const deleteProductApi = (productId: string, token: string) => {
    return apiFetch(`/admin/products/${productId}`, {
      method: 'DELETE',
    }, token);
  };

  export const getAllInquiriesApi = (token: string, status?: string) => {
    let endpoint = '/contact/admin';
  
    // If a status is provided, append it to the URL as a query parameter.
    if (status) {
      endpoint += `?status=${status}`;
    }
    
    // The fetch call now uses the potentially modified endpoint.
    return apiFetch(endpoint, { method: 'GET' }, token);
  };
  
  export const updateInquiryApi = (inquiryId: string, formData: FormData, token: string) => {
    return apiFetch(`/contact/admin/${inquiryId}`, {
      method: 'PUT', // Using PUT as per your controller for a full update
      body: formData,
    }, token);
  };

  export const deleteInquiryApi = (inquiryId: string, token: string) => {
    return apiFetch(`/contact/admin/${inquiryId}`, {
      method: 'DELETE',
    }, token);
  };
  
  