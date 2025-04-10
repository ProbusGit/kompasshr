import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  visible: boolean;
  title: string;
  content: string;
  onConfirm?: () => void;
}

const initialState: DialogState = {
  visible: false,
  title: '',
  content: '',
  onConfirm: undefined,
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    showDialog: (state, action: PayloadAction<{ title: string; content: string; onConfirm?: () => void }>) => {
      state.visible = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.onConfirm = action.payload.onConfirm;
    },
    hideDialog: (state) => {
      state.visible = false;
      state.title = '';
      state.content = '';
      state.onConfirm = undefined;
    },
  },
});

export const { showDialog, hideDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
