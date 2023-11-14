import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigatorName, RootNavigatorParams} from './type';
import AuthStackNavigator from './AuthStackNavigator';
import MainTabNavigator from './MainTabNavigator';
import {useSelector} from 'react-redux';
import {selectIsAuthenticated} from '@modules/authentication/auth.slice';

const Stack = createNativeStackNavigator<RootNavigatorParams>();

const RootNavigator = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, headerBackVisible: true}}>
      {isAuthenticated ? (
        <Stack.Screen
          name={NavigatorName.MainTab}
          component={MainTabNavigator}
        />
      ) : (
        <Stack.Screen
          name={NavigatorName.AuthStack}
          component={AuthStackNavigator}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
