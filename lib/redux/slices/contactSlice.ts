import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';
import { getAllInquiriesApi, updateInquiryApi, deleteInquiryApi } from '@/lib/api/admin';

// Define the type for a single inquiry object, matching the Mongoose model
interface ContactInquiry {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    message: string;
    size?: string;
    referenceImage?: string;
    status: "New" | "Contacted" | "Completed" | "Rejected";
    createdAt: string;
    updatedAt: string;
}

// Define the interface for the slice's state
interface ContactState {
    inquiries: ContactInquiry[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Set the initial state for the slice
const initialState: ContactState = {
    inquiries: [],
    status: 'idle',
    error: null,
};

// Helper function to safely get the authentication token from the global Redux state
const getToken = (getState: () => unknown): string => {
    // Cast the state to access the auth slice and the accessToken
    const token = (getState() as { auth: { accessToken: string } }).auth.accessToken;
    if (!token) {
        // Throw an error if the token is missing, which will be caught by rejectWithValue
        throw new Error('Authentication token is not available.');
    }
    return token;
};

// Define the base URL for the API to avoid repetition
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// --- Async Thunks for API Operations ---

/**
 * PUBLIC: Submits the contact form data, including an optional file.
 */
export const submitContactForm = createAsyncThunk(
    'contact/submit',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            // Using axios here for simplicity in this public, non-authenticated endpoint
            const response = await axios.post(`${API_BASE_URL}/contact`, formData);
            return response.data.message; // Return the success message from the API
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Submission failed due to a server error.');
        }
    }
);

/**
 * ADMIN: Fetches all contact inquiries from the server.
 */
export const fetchInquiries = createAsyncThunk(
    'contact/fetchAll',
    // The thunk now accepts an optional 'status' argument
    async (status: string | undefined, { getState, rejectWithValue }) => {
        try {
            const token = getToken(getState);
            // Pass the status to your API function
            const response = await getAllInquiriesApi(token, status);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch inquiries.');
        }
    }
);

/**
 * ADMIN: Updates an entire inquiry record, including replacing the image if a new one is provided.
 */
export const updateInquiry = createAsyncThunk(
    'contact/update',
    async ({ inquiryId, formData }: { inquiryId: string; formData: FormData }, { getState, rejectWithValue }) => {
        try {
            const token = getToken(getState);
            const response = await updateInquiryApi(inquiryId, formData, token);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update the inquiry.');
        }
    }
);

/**
 * ADMIN: Deletes an inquiry from the server and Cloudinary.
 */
export const deleteInquiry = createAsyncThunk(
    'contact/delete',
    async (inquiryId: string, { getState, rejectWithValue }) => {
        try {
            const token = getToken(getState);
            await deleteInquiryApi(inquiryId, token);
            return inquiryId; // Return the ID for successful deletion to update the state
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete the inquiry.');
        }
    }
);


// --- Slice Definition ---
const contactSlice = createSlice({
    name: 'contact',
    initialState,
    // No synchronous reducers are needed for this slice
    reducers: {},
    // Handle the state changes for each async thunk
    extraReducers: (builder) => {
        builder
            // Submit Form (Public)
            .addCase(submitContactForm.pending, () => {
                toast.loading("Sending your inquiry...", { id: 'contact-toast' });
            })
            .addCase(submitContactForm.fulfilled, (_, action) => {
                toast.success(action.payload, { id: 'contact-toast' });
            })
            .addCase(submitContactForm.rejected, (_, action) => {
                toast.error(`Error: ${action.payload}`, { id: 'contact-toast' });
            })

            // Fetch All Inquiries (Admin)
            .addCase(fetchInquiries.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchInquiries.fulfilled, (state, action: PayloadAction<ContactInquiry[]>) => {
                state.status = 'succeeded';
                state.inquiries = action.payload;
            })
            .addCase(fetchInquiries.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
                toast.error(state.error);
            })

            // Update Inquiry (Admin)
            .addCase(updateInquiry.fulfilled, (state, action: PayloadAction<ContactInquiry>) => {
                // Find the index of the updated inquiry in the state array
                const index = state.inquiries.findIndex(inquiry => inquiry._id === action.payload._id);
                if (index !== -1) {
                    // Replace the old inquiry data with the new data from the server
                    state.inquiries[index] = action.payload;
                }
                toast.success("Inquiry updated successfully!");
            })
            .addCase(updateInquiry.rejected, (_, action) => {
                toast.error(`Update failed: ${action.payload}`);
            })

            // Delete Inquiry (Admin)
            .addCase(deleteInquiry.fulfilled, (state, action: PayloadAction<string>) => {
                // Filter out the deleted inquiry from the state array using its ID
                state.inquiries = state.inquiries.filter(inquiry => inquiry._id !== action.payload);
                toast.success("Inquiry deleted successfully!");
            })
            .addCase(deleteInquiry.rejected, (_, action) => {
                toast.error(`Delete failed: ${action.payload}`);
            });
    },
});

export default contactSlice.reducer;