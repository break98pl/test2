import React, {useEffect} from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {ScreenName, SettingStackNavigatorParams} from './type';
import SettingScreen from '@screens/SettingScreen';
import FetchTimeOptionsScreen from '@screens/FetchTimeOptionsScreen';
import ConnectionSettingScreen from '@screens/ConnectionSettingScreen';
import {useTranslation} from 'react-i18next';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import {StyleSheet} from 'react-native';
import {
  NavigationAction,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';

const Stack = createNativeStackNavigator<SettingStackNavigatorParams>();

const SettingNavigator = () => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingStackNavigatorParams>>();

  useEffect(() => {
    // Reset the navigation stack and navigate to a specific screen
    if (!isFocused) {
      const resetAction: NavigationAction = {
        type: 'RESET',
        payload: {
          index: 0,
          routes: [{name: ScreenName.Setting}], // Name of the screen you want to navigate to
        },
      };
      // Dispatch the navigation action
      navigation.dispatch(resetAction);
    }
  }, [isFocused]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: styles.headerTitle,
      }}>
      <Stack.Screen
        options={{
          title: t('setting.bottom_tab_label'),
        }}
        name={ScreenName.Setting}
        component={SettingScreen}
      />
      <Stack.Screen
        name={ScreenName.FetchTimeOptions}
        component={FetchTimeOptionsScreen}
        options={{
          title: t('setting.period_fetch'),
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

export default SettingNavigator;

const styles = StyleSheet.create({
  headerTitle: {
    color: Colors.TITLE,
    fontSize: FontSize.XX_LARGE,
    fontWeight: FontWeight.SEMI_BOLD,
  },
});
