import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  employeeId: string | null;
  employeeName: string | null;
  departmentName: string | null;
  designationName: string | null;
  profilePic: string | null;
  customerCode: string | null;
  loginId: string | null;
  password: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, {rejectWithValue}) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);

        return parsedUserData; // Return user data if it exists
      }
      return null; // Return null if no user data is found
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateUserData: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload, // Only update the fields provided in the payload
      };
    },
    resetUser: state => {
      state.user = {
        employeeId: null,
        employeeName: null,
        departmentName: null,
        designationName: null,
        profilePic: null,
        customerCode: null,
        loginId: null,
        password: null,
      };
      state.isAuthenticated = false;
    },
  },
  extraReducers: builder => {
    builder
      // Check Authentication Status
      .addCase(checkAuthStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload; // Set isAuthenticated based on user data
        state.user = action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearError, updateUserData, resetUser} = authSlice.actions;
export default authSlice.reducer;
