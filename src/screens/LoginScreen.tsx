import React from 'react';
import Screen from '@templates/Screen';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppBanner from '@organisms/AppBanner';
import SettingButton from '@molecules/SettingButton';
import AppVersionSection from '@molecules/AppVersionSection';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';
import {Colors} from '@themes/colors';
import LoginForm from '@organisms/LoginForm';
import {hs} from '@themes/responsive';
import {useAppSelector} from '@store/config';
import {selectFetching} from '@modules/authentication/auth.slice';
import LoadingModal from '@molecules/LoadingModal';

const SendReportButton = () => {
  const {t} = useTranslation();
  return (
    <BaseButton style={styles.sendReportBtn}>
      <BaseText text={t('login.sendReport')} color={Colors.PRIMARY} />
    </BaseButton>
  );
};

const LoginScreen = () => {
  const isFetching = useAppSelector(selectFetching);

  return (
    <Screen enableSafeArea>
      <SettingButton />
      <KeyboardAwareScrollView
        bounces={false}
        overScrollMode="always"
        keyboardDismissMode={'on-drag'}
        showsVerticalScrollIndicator={false}>
        <AppBanner />
        <View style={styles.loginFormView}>
          <LoginForm />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footer}>
        <AppVersionSection />
        <SendReportButton />
      </View>
      <LoadingModal type={'circle'} visible={isFetching} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  loginFormView: {
    marginTop: 20,
    marginLeft: hs(252),
    marginRight: hs(241),
  },
  sendReportBtn: {
    padding: 10,
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 22,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LoginScreen;
