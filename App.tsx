/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';

import '@i18n/config';
import store, {persistor} from '@store/config';
import RootNavigator from './src/navigation/RootNavigator';
import {PortalHost, PortalProvider} from '@gorhom/portal';
import {PortalHostName} from '@navigation/type';
import 'react-native-devsettings/withAsyncStorage';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PortalProvider>
          <NavigationContainer>
            <RootNavigator />
            <PortalHost name={PortalHostName.Tooltip} />
          </NavigationContainer>
        </PortalProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
