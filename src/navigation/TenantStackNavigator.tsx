import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CareListScreen from '@screens/CareListScreen';
import TenantListScreen from '@screens/TenantListScreen';
import {ScreenName, TenantStackNavigatorParams} from './type';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import TsushoVisitPlanList from '@screens/TsushoVisitPlanList';

const Stack = createNativeStackNavigator<TenantStackNavigatorParams>();

const TenantStackNavigator = () => {
  const appType = useSelector(selectAppType);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={ScreenName.TenantList}
        component={
          appType === AppType.TSUSHO ? TsushoVisitPlanList : TenantListScreen
        }
      />
      <Stack.Screen name={ScreenName.CareList} component={CareListScreen} />
    </Stack.Navigator>
  );
};

export default TenantStackNavigator;
