import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import snackbarReducer from '../slices/snackbarSlice';
import dialogReducer from '../slices/dialogSlice';
import statusReducer from '../slices/statusSlice';
import { baseApi } from '../services/BaseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer, // Add baseApi reducer
    auth: authReducer,
    snackbar: snackbarReducer,
    dialog: dialogReducer,
    status : statusReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware), // Add baseApi middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
