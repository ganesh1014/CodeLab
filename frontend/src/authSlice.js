import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

/* ----------------------------------
   Helper: Extract serializable error
----------------------------------- */
const getErrorPayload = (error) => {
  return {
    message:
      error.response?.data?.message ||
      error.message ||
      'Something went wrong',
    status: error.response?.status || null
  };
};

/* ----------------------------------
   Register User
----------------------------------- */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Login User
----------------------------------- */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Check Auth
----------------------------------- */
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Logout User
----------------------------------- */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Fetch all users (admin only)
----------------------------------- */
export const fetchAllUsers = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/user/admin/users');
      // Backend returns { success: true, users: [...] }
      return response.data.users;  
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Update user role (admin only)
----------------------------------- */
export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      // FIX: Changed { newRole } to { role } to match our backend fix!
      const response = await axiosClient.patch(`/user/admin/users/${userId}/role`, { role });
      return { userId, role, user: response.data.user };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Create a new admin (admin only)
----------------------------------- */
export const createAdmin = createAsyncThunk(
  'auth/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/admin/register', adminData);
      return response.data.user;  
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

/* ----------------------------------
   Auth Slice
----------------------------------- */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    isUsersLoading: false,
    error: null,
    allUsers: []
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* ---------- Register ---------- */
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = !!action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; state.user = null; state.isAuthenticated = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      /* ---------- Login ---------- */
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = !!action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; state.user = null; state.isAuthenticated = false;
        state.error = action.payload?.message || 'Login failed';
      })

      /* ---------- Check Auth ---------- */
      .addCase(checkAuth.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload; state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false; state.user = null; state.isAuthenticated = false;
        state.error = action.payload?.message || 'Unauthorized';
      })

      /* ---------- Logout ---------- */
      .addCase(logoutUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false; state.user = null; state.isAuthenticated = false; state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload?.message || 'Logout failed';
      })

      /* ---------- Fetch All Users ---------- */
      .addCase(fetchAllUsers.pending, (state) => {
        state.isUsersLoading = true; 
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.allUsers = action.payload; 
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isUsersLoading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })
      
      /* ---------- Update User Role ---------- */
      .addCase(updateUserRole.pending, (state) => {
        // Optional: Keep loading false here if you want the button click to feel instant
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        // BETTER UX: Since the user is now an admin, remove them from this regular user list instantly!
        if (state.allUsers) {
          state.allUsers = state.allUsers.filter(u => u._id !== action.payload.userId);
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      
      /* ---------- Create Admin ---------- */
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Note: Do NOT push the new admin to state.allUsers because that list is for regular users only!
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;