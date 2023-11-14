import {NavigatorScreenParams} from '@react-navigation/native';

/**
 * Define all navigator's name here.
 */
export enum NavigatorName {
  AuthStack = 'AuthStack',
  MainTab = 'MainTab',
  TenantStack = 'TenantStack',
  SettingStack = 'SettingStack',
}

/**
 * Define all screen's name here.
 */
export enum ScreenName {
  Login = 'Login',
  TenantList = 'TenantList',
  Meal = 'Meal',
  Vital = 'Vital',
  Bath = 'Bath',
  Elapsed = 'Elapsed',
  Cardex = 'Cardex',
  Report = 'Report',
  Setting = 'Setting',
  FetchTimeOptions = 'FetchTimeOptions',
  ConnectionSetting = 'ServerConnectionSetting',
  CareList = 'CareList',
}

export enum PortalHostName {
  Tooltip = 'TooltipPortalHost',
}

export type RootNavigatorParams = {
  [NavigatorName.AuthStack]:
    | NavigatorScreenParams<AuthStackNavigatorParams>
    | undefined;
  [NavigatorName.MainTab]:
    | NavigatorScreenParams<MainTabNavigatorParams>
    | undefined;
};

export type AuthStackNavigatorParams = {
  [ScreenName.Login]: undefined;
  [ScreenName.Setting]: undefined;
  [ScreenName.FetchTimeOptions]: undefined;
  [ScreenName.ConnectionSetting]: undefined;
};

export type MainTabNavigatorParams = {
  [NavigatorName.TenantStack]: TenantStackNavigatorParams | undefined;
  [ScreenName.Meal]: undefined;
  [ScreenName.Vital]: undefined;
  [ScreenName.Bath]: undefined;
  [ScreenName.Elapsed]: undefined;
  [ScreenName.Cardex]: undefined;
  [ScreenName.Report]: undefined;
  [NavigatorName.SettingStack]:
    | NavigatorScreenParams<SettingStackNavigatorParams>
    | undefined;
};

export type SettingStackNavigatorParams = {
  [ScreenName.Setting]: undefined;
  [ScreenName.FetchTimeOptions]: undefined;
  [ScreenName.ConnectionSetting]: undefined;
};

export type TenantStackNavigatorParams = {
  [ScreenName.TenantList]: undefined;
  [ScreenName.CareList]: undefined;
};
