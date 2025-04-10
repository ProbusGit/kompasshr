import React from 'react';
import {StyleSheet} from 'react-native';
import {Snackbar, DefaultTheme} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../../redux/hook';
import {hideSnackbar} from '../../redux/slices/snackbarSlice';
import Colors from '../../colors/Color';

const SnackbarComponent = () => {
  const dispatch = useAppDispatch();
  const {visible, message, severity} = useAppSelector(state => state.snackbar);

  console.log('Snackbar State:', {visible, message, severity}); // Debugging

  const getSnackbarStyle = () => {
    switch (severity) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      case 'warning':
        return styles.warning;
      case 'info':
        return styles.info;
      default:
        return styles.default;
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={() => dispatch(hideSnackbar())}
      style={[styles.snackbar, getSnackbarStyle()]}
      duration={1200}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          onSurface: Colors.white, // Set text color to white
        },
      }}>
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    marginBottom: 20,
    borderRadius: 8,
  },
  success: {
    backgroundColor: Colors.success,
  },
  error: {
    backgroundColor: Colors.error,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  info: {
    backgroundColor: Colors.info,
  },
  default: {
    backgroundColor: Colors.grey,
  },
});

export default SnackbarComponent;
