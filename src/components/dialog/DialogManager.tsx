import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import DialogComponent from './DialogComponent';
import {useAppDispatch} from '../../redux/hook';
import {hideDialog} from '../../redux/slices/dialogSlice';

const DialogManager = () => {
  const dialogState = useSelector((state: RootState) => state.dialog);

  const dispatch = useAppDispatch();

  return (
    <DialogComponent
      visible={dialogState.visible}
      title={dialogState.title}
      content={dialogState.content}
      onDismiss={() => dispatch(hideDialog())}
        onConfirm={dialogState.onConfirm}
    />
  );
};

export default DialogManager;
