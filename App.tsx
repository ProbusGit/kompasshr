import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from 'react-redux';

import RootNavigation from './src/Navigation/RootNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store/store';
import SnackbarComponent from './src/components/snackbar/SnackbarComponent';
import DialogManager from './src/components/dialog/DialogManager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function App(): React.JSX.Element {

  return (

    <SafeAreaProvider style={styles.backgroundStyle}>
      <StoreProvider store={store}>
        <PaperProvider>
          <GestureHandlerRootView >
            <NavigationContainer>
              <RootNavigation />
              <SnackbarComponent />
            </NavigationContainer>
            <DialogManager />
          </GestureHandlerRootView>
        </PaperProvider>
      </StoreProvider>
    </SafeAreaProvider>

  )
}

export default App

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});