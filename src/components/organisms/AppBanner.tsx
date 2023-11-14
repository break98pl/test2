import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Colors} from '@themes/colors';
import {images} from '@constants/images';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import {
  setDBName,
  selectDemoMode,
  toggleShowDemoDBInput,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {useAppDispatch, useAppSelector} from '@store/config';
import {AuthService} from '@modules/authentication/auth.service';

const AppBanner = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const isDemoSelector = useAppSelector(selectDemoMode);
  const serviceName = useAppSelector(selectChoseServiceName) ?? '';

  const showDatabaseInput = useCallback(() => {
    dispatch(toggleShowDemoDBInput());

    const {dbName} = AuthService.getDemoDBNameAndAppType(serviceName);
    dispatch(setDBName({dbName}));
  }, [serviceName]);

  return (
    <View style={styles.appBannerContainer}>
      <View style={styles.fullSize} />
      <FastImage
        source={images.appBanner}
        style={styles.appImg}
        resizeMode="contain"
      />
      <View style={styles.fullSize}>
        {isDemoSelector && (
          <BaseButton
            activeOpacity={1}
            onLongPress={showDatabaseInput}
            delayLongPress={3000}
            style={styles.demoButton}>
            <BaseText
              text={t('login.demoMode')}
              size="large"
              color={Colors.WHITE}
            />
          </BaseButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBannerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 7,
    marginTop: 58,
  },
  appImg: {
    width: 254,
    height: 92,
  },
  demoButton: {
    width: 120,
    height: 28,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DEMO_MODE_BACKGROUND,
  },
  fullSize: {
    flex: 1,
  },
});

export default AppBanner;
