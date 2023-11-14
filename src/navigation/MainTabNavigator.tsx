import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {MainTabNavigatorParams, NavigatorName, ScreenName} from './type';
import CustomBottomTabBar, {TabBarProps} from '@organisms/CustomBottomTabBar';
import MealScreen from '@screens/MealScreen';
import VitalScreen from '@screens/VitalScreen';
import BathScreen from '@screens/BathScreen';
import CardexScreen from '@screens/CardexScreen';
import ReportScreen from '@screens/ReportScreen';
import TenantStackNavigator from './TenantStackNavigator';
import SettingNavigator from './SettingNavigator';
import ElapsedScreen from '@screens/ElapsedScreen';
import {selectIsCardexDefault} from '@modules/setting/setting.slice';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';

const Tab = createBottomTabNavigator<MainTabNavigatorParams>();

const MainTabNavigator = () => {
  const isCardexDefault = useSelector(selectIsCardexDefault);
  const appType = useSelector(selectAppType);

  const renderCustomTabBar = (props: BottomTabBarProps): React.ReactNode => (
    <CustomBottomTabBar {...(props as TabBarProps)} />
  );

  return (
    <Tab.Navigator
      initialRouteName={
        isCardexDefault && appType === AppType.TSUSHO
          ? ScreenName.Cardex
          : NavigatorName.TenantStack
      }
      tabBar={renderCustomTabBar}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen
        name={NavigatorName.TenantStack}
        component={TenantStackNavigator}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate(NavigatorName.TenantStack, {
              screen: ScreenName.TenantList,
            });
          },
        })}
      />
      <Tab.Screen name={ScreenName.Meal} component={MealScreen} />
      <Tab.Screen name={ScreenName.Vital} component={VitalScreen} />
      <Tab.Screen name={ScreenName.Bath} component={BathScreen} />
      <Tab.Screen name={ScreenName.Elapsed} component={ElapsedScreen} />
      <Tab.Screen name={ScreenName.Cardex} component={CardexScreen} />
      <Tab.Screen name={ScreenName.Report} component={ReportScreen} />
      <Tab.Screen
        name={NavigatorName.SettingStack}
        component={SettingNavigator}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
