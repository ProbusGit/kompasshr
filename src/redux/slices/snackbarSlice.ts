import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type SnackbarState = {
  visible: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info' | 'default';
};

const initialState: SnackbarState = {
  visible: false,
  message: '',
  severity: 'default',
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{message: string; severity: SnackbarState['severity']}>,
    ) => {
      state.visible = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideSnackbar: state => {
      state.visible = false;
      state.message = '';
      state.severity = 'default';
    },
  },
});

export const {showSnackbar, hideSnackbar} = snackbarSlice.actions;
export default snackbarSlice.reducer;
