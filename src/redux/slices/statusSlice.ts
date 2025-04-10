import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StatusState {
  status: 'in' | 'out';
}

const initialState: StatusState = {
  status: 'out',
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<'in' | 'out'>) => {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = statusSlice.actions;
export default statusSlice.reducer;
