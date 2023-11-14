import {StyleSheet} from 'react-native';
import React from 'react';
import SettingItem from '@molecules/SettingItem';
import SettingWrapper from '@molecules/SettingWrapper';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {ScreenName, SettingStackNavigatorParams} from '@navigation/type';
import {useDispatch, useSelector} from 'react-redux';
import {
  AppType,
  FetchTimeType,
  SettingOption,
} from '@modules/setting/setting.type';
import {
  selectFetchTime,
  selectIsAllowMultipleOptions,
  selectIsCardexDefault,
  selectIsElapsedDefault,
  selectIsNotDistinctionProvisionTimeAndOutside,
  selectIsShowCareManagerProfileJutaku,
  selectIsShowCareManagerProfileTakino,
  selectIsShowCareManagerProfileTsusho,
  selectIsShowedSaveButton,
  selectIsUseTemplateExcretion,
  toggleChange,
} from '@modules/setting/setting.slice';
import Screen from '@templates/Screen';
import {Colors} from '@themes/colors';
import {selectAuthState} from '@modules/authentication/auth.slice';
import DeviceInfo from '@libs/deviceInfo';

const SettingScreen = () => {
  const fetchTime = useSelector(selectFetchTime);
  const isCardexDefault = useSelector(selectIsCardexDefault);
  const isUseTemplateExcretion = useSelector(selectIsUseTemplateExcretion);
  const isElapsedDefault = useSelector(selectIsElapsedDefault);
  const isAllowMultipleOptions = useSelector(selectIsAllowMultipleOptions);
  const isShowedSaveButton = useSelector(selectIsShowedSaveButton);
  const isNotDistinctionProvisionTimeAndOutside = useSelector(
    selectIsNotDistinctionProvisionTimeAndOutside,
  );
  const isShowCareManagerProfileJutaku = useSelector(
    selectIsShowCareManagerProfileJutaku,
  );
  const isShowCareManagerProfileTakino = useSelector(
    selectIsShowCareManagerProfileTakino,
  );
  const isShowCareManagerProfileTsusho = useSelector(
    selectIsShowCareManagerProfileTsusho,
  );

  const {isAuthenticated, appType} = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingStackNavigatorParams>>();

  const navigateToFetchTimeOptions = () => {
    /**
     * The function `navigateToFetchTimeOptions` is used to navigate to the `FetchTimeOptions` screen.
     */
    navigation.navigate(ScreenName.FetchTimeOptions);
  };

  /**
   * The function `getFetchTime` returns a translated string based on the value of the `fetch`
   * parameter.
   * @param {FetchTimeType} fetch - The `fetch` parameter is of type `FetchTimeType`. It is used in
   * a switch statement to determine the appropriate string value to return based on its value.
   * @returns The function `getFetchTime` returns a string value based on the value of the `fetch`
   * parameter. The returned string is determined by the value of `fetch` and is obtained using the `t`
   * function with the corresponding translation key.
   */
  const getFetchTime = (fetch: FetchTimeType) => {
    switch (fetch) {
      case FetchTimeType.OneDay:
        return t('setting.one_day');
      case FetchTimeType.ThreeDay:
        return t('setting.three_day');
      case FetchTimeType.OneWeek:
        return t('setting.one_week');
      case FetchTimeType.TwoWeek:
        return t('setting.two_week');
      case FetchTimeType.OneMonth:
        return t('setting.one_month');
      default:
        return t('setting.two_week');
    }
  };

  /**
   * The function `navigateToCreateLoginInformation` is used to navigate to the screen for creating
   * login information.
   */
  const navigateToCreateLoginInformation = () => {
    navigation.navigate(ScreenName.ConnectionSetting);
  };

  const getValueShowCareManager = () => {
    switch (appType) {
      case AppType.JUTAKU:
        return isShowCareManagerProfileJutaku;
      case AppType.TAKINO:
        return isShowCareManagerProfileTakino;
      case AppType.TSUSHO:
        return isShowCareManagerProfileTsusho;
      default:
        return isShowCareManagerProfileJutaku;
    }
  };

  const handleChangeShowCareManage = () => {
    let type;
    switch (appType) {
      case AppType.JUTAKU:
        type = SettingOption.ShowCareManagerElapsedJutaku;
        break;
      case AppType.TAKINO:
        type = SettingOption.ShowCareManagerElapsedTakino;
        break;
      case AppType.TSUSHO:
        type = SettingOption.ShowCareManagerElapsedTsusho;
        break;
      default:
        type = SettingOption.ShowCareManagerElapsedJutaku;
        break;
    }
    dispatch(
      toggleChange({
        type: type,
      }),
    );
  };

  return (
    <Screen
      scrollable
      style={styles.screen}
      contentStyle={styles.contentContainer}
      barStyle="dark-content">
      <SettingWrapper style={styles.settingList} title={''}>
        <SettingItem
          label={t('setting.version')}
          after={t('common.versionNo', {
            version: DeviceInfo.getAppVersion().appVersion,
          })}
        />

        {!isAuthenticated && (
          <SettingItem
            onPress={navigateToCreateLoginInformation}
            label={t('setting.connection_info')}
            link
          />
        )}

        <SettingItem
          onPress={navigateToFetchTimeOptions}
          label={t('setting.period_fetch')}
          link
          after={getFetchTime(fetchTime)}
        />

        {isAuthenticated && appType === AppType.TSUSHO && (
          <>
            <SettingItem
              toggle
              toggleValue={isCardexDefault}
              onToggleChange={() =>
                dispatch(toggleChange({type: SettingOption.CardexDefault}))
              }
              label={t('setting.cardex_default')}
            />
            <SettingItem
              toggle
              toggleValue={isNotDistinctionProvisionTimeAndOutside}
              onToggleChange={() =>
                dispatch(
                  toggleChange({
                    type: SettingOption.NotDistinctionProvisionTimeAndOutside,
                  }),
                )
              }
              label={t('setting.no_distinction_provision_time_and_outside')}
            />
          </>
        )}

        <SettingItem
          toggle
          toggleValue={isUseTemplateExcretion}
          onToggleChange={() =>
            dispatch(toggleChange({type: SettingOption.UseTemplateExcretion}))
          }
          label={t('setting.use_template_excretion')}
        />
        <SettingItem
          toggle
          toggleValue={isElapsedDefault}
          onToggleChange={() =>
            dispatch(toggleChange({type: SettingOption.ElapsedDefault}))
          }
          label={t('setting.elapsed_default')}
        />
        <SettingItem
          toggle
          toggleValue={isAllowMultipleOptions}
          onToggleChange={() =>
            dispatch(toggleChange({type: SettingOption.AllowMultipleOptions}))
          }
          label={t('setting.allow_multiple_options')}
        />

        <SettingItem
          toggle
          toggleValue={isShowedSaveButton}
          onToggleChange={() =>
            dispatch(toggleChange({type: SettingOption.ShowSaveButton}))
          }
          label={t('setting.show_save_button')}
        />

        {isAuthenticated && appType !== AppType.SHISETSHU && (
          <SettingItem
            toggle
            toggleValue={getValueShowCareManager()}
            onToggleChange={handleChangeShowCareManage}
            label={t('setting.show_care_manager_profile')}
            noBottomLine
          />
        )}
      </SettingWrapper>
    </Screen>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  settingList: {
    marginVertical: 35,
  },
});
