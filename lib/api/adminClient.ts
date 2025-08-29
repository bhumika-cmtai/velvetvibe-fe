import axios from 'axios';
import type { RootState } from '@/lib/redux/store'; // Adjust path if needed
import { store } from '@/lib/redux/store'; // Import the store itself

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Your API's base URL
  withCredentials: true, // Important for cookies, if you use them
});

// This is the magic part: an interceptor that runs before every request.
apiClient.interceptors.request.use(
  (config) => {
    // Get the current Redux state
    const state: RootState = store.getState();
    const token = state.auth.accessToken;

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;