import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthStackNavigatorParams, ScreenName} from './type';
import SettingScreen from '@screens/SettingScreen';
import FetchTimeOptionsScreen from '@screens/FetchTimeOptionsScreen';
import {useTranslation} from 'react-i18next';
import LoginScreen from '@screens/LoginScreen';
import ConnectionSettingScreen from '@screens/ConnectionSettingScreen';
import {StyleSheet} from 'react-native';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';

const Stack = createNativeStackNavigator<AuthStackNavigatorParams>();

const AuthStackNavigator = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: styles.headerTitle,
      }}>
      <Stack.Screen
        name={ScreenName.Login}
        component={LoginScreen}
        options={{
          headerShown: false,
          headerBackTitleStyle: styles.headerBackTitle,
        }}
      />
      <Stack.Screen
        name={ScreenName.Setting}
        component={SettingScreen}
        options={{
          headerShown: true,
          title: t('setting.bottom_tab_label'),
          headerBackTitle: t('common.login'),
        }}
      />
      <Stack.Screen
        name={ScreenName.FetchTimeOptions}
        component={FetchTimeOptionsScreen}
        options={{
          headerShown: true,
          title: t('setting.period_fetch'),
          headerBackTitle: t('setting.bottom_tab_label'),
        }}
      />
      <Stack.Screen
        name={ScreenName.ConnectionSetting}
        component={ConnectionSettingScreen}
        options={{
          title: t('setting.connection_setting_title'),
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;

const styles = StyleSheet.create({
  headerTitle: {
    color: Colors.TITLE,
    fontSize: FontSize.XX_LARGE,
    fontWeight: FontWeight.SEMI_BOLD,
  },
  headerBackTitle: {
    fontSize: FontSize.XX_LARGE,
  },
});
