import React, {useCallback} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  ImageRequireSource,
} from 'react-native';
import {
  BottomTabBarProps,
  BottomTabNavigationEventMap,
} from '@react-navigation/bottom-tabs';
import {NavigationHelpers, TabNavigationState} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Colors} from '@themes/colors';
import TabBarButton from '@molecules/TabBarButton';
import {
  MainTabNavigatorParams,
  NavigatorName,
  RootNavigatorParams,
  ScreenName,
} from '@navigation/type';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {useAppSelector} from '@store/config';
import {
  selectAppType,
  selectLatestSyncTime,
  selectChoseService,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {getUserLabel} from '@modules/tenant/tenant.utils';
import {handleAlertConfirmLogout} from '@modules/alerts/alert.ultils';
import moment from 'moment';
import {DATETIME_LATEST_SYNC_FORMAT} from '@constants/constants';
import useLogout from '@hooks/useLogout';

/**
 * Tab bar props
 * extends from BottomTabBarProps but override "state" field
 */
export interface TabBarProps
  extends Omit<BottomTabBarProps, 'state' | 'navigation'> {
  state: TabNavigationState<MainTabNavigatorParams>;
  navigation: NavigationHelpers<
    RootNavigatorParams,
    BottomTabNavigationEventMap
  >;
}

interface TabBarData {
  label: string;
  icon: ImageRequireSource;
}

const CustomBottomTabBar = ({state, navigation}: TabBarProps) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const appType = useAppSelector(selectAppType);
  const service = useAppSelector(selectChoseService);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const latestSyncTime = useAppSelector(selectLatestSyncTime);

  const {logout} = useLogout();

  const displayLogoutAlert = useCallback(() => {
    handleAlertConfirmLogout(logout, () => null);

    // TODO: Call this function handling show alert warning when having unSync record
  }, [navigation]);

  const getInfoFooter = () => {
    return t('button.info_footer', {
      latestTime: moment(latestSyncTime).format(DATETIME_LATEST_SYNC_FORMAT),
      name: `${selectedStaff?.firstName} ${selectedStaff?.lastName}`,
    });
  };

  const getTabBarData = (
    routeName: keyof MainTabNavigatorParams,
  ): TabBarData => {
    const tabBarData = {} as TabBarData;
    switch (routeName) {
      case NavigatorName.TenantStack:
        tabBarData.label = getUserLabel(appType, service?.serviceName ?? '');
        tabBarData.icon = require('@assets/images/all_riyousha.png');
        break;
      case ScreenName.Meal:
        tabBarData.label = 'meal.bottom_tab_label';
        tabBarData.icon = require('@assets/images/all_shokuji.png');
        break;
      case ScreenName.Vital:
        tabBarData.label = 'vital.bottom_tab_label';
        tabBarData.icon = require('@assets/images/vital_bulk.png');
        break;
      case ScreenName.Bath:
        tabBarData.label = 'bath.bottom_tab_label';
        tabBarData.icon = require('@assets/images/all_nyuyoku.png');
        break;
      case ScreenName.Elapsed:
        tabBarData.label = 'elapsed.bottom_tab_label';
        tabBarData.icon = require('@assets/images/all_kirokuichiran.png');
        break;
      case ScreenName.Cardex:
        tabBarData.label = 'cardex.bottom_tab_label';
        tabBarData.icon = require('@assets/images/all_cardex.png');
        break;
      case ScreenName.Report:
        tabBarData.label = 'report.bottom_tab_label';
        tabBarData.icon = require('@assets/images/all_moushiokuri.png');
        break;
      case NavigatorName.SettingStack:
        tabBarData.label = 'setting.bottom_tab_label';
        tabBarData.icon = require('@assets/images/all_settei.png');
        break;
      default:
        tabBarData.label = 'user_list.shisetsu_user_list';
        tabBarData.icon = require('@assets/images/all_riyousha.png');
        break;
    }
    return tabBarData;
  };

  return (
    <View style={styles.tabBarContainer}>
      <BaseButton
        text={t('common.logout')}
        onPress={displayLogoutAlert}
        style={styles.logoutButton}
        textStyle={styles.btnTxt}
      />
      <View style={styles.infoView}>
        <BaseText
          color={Colors.THICK_GREY}
          size="small"
          text={getInfoFooter()}
        />
      </View>

      {state.routes.map((route, index) => {
        const {label: labelTx, icon: iconName} = getTabBarData(route.name);
        const isFocused = state.index === index;

        const tabButtonContainerStyles: StyleProp<ViewStyle> = {
          paddingBottom: bottom > 0 ? bottom : 4,
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(NavigatorName.MainTab, {
              screen: route.name,
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            isFocused={isFocused}
            tabBarLabel={t(labelTx, {text: '一覧'})}
            tabBarIcon={iconName}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabBarButton, tabButtonContainerStyles]}
          />
        );
      })}
      <BaseButton
        textStyle={styles.btnTxt}
        text={t('common.sync')}
        style={styles.syncButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderTopWidth: 1,
    borderTopColor: Colors.GRAY_PH,
  },
  tabBarButton: {
    flex: 1,
    alignItems: 'center',
  },
  logoutButton: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  btnTxt: {
    color: Colors.TEXT_BLUE,
  },
  syncButton: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  infoView: {
    justifyContent: 'center',
  },
});

export default CustomBottomTabBar;
