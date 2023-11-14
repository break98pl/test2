import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import UsernameInput from '@molecules/UsernameInput';
import DemoServiceTypeInput from '@molecules/DemoServiceTypeInput';
import ServiceNameInput from '@molecules/ServiceNameInput';
import PasswordInput from '@molecules/PasswordInput';
import {
  selectAuthState,
  setAuthInfo,
  setIsAuthenticated,
  setIsDemoMode,
  setShowDemoDatabaseInput,
} from '@modules/authentication/auth.slice';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {
  APINoInternetError,
  WrongPasswordError,
} from '@modules/errors/error.type';
import {useAppDispatch, useAppSelector} from '@store/config';
import DemoDatabaseInput from '@molecules/DemoDatabaseInput';
import useErrorHandler from '@hooks/useErrorHandler';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import ServerConnectionInput from '@molecules/ServerConnectionInput';
import DemoServiceNameInput from '@molecules/DemoServiceNameInput';
import {images} from '@constants/images';
import {selectLoginSettings} from '@modules/setting/setting.slice';
import {DEMO_ADDRESS} from '@constants/constants';
import {
  DEMO_CONNECTION,
  EMPTY_CONNECTION,
} from '@modules/authentication/auth.constant';
import {setSortingOption} from '@modules/tenant/tenant.slice';
import {SortingType} from '@modules/tenant/tenant.type';
import {AppType} from '@modules/setting/setting.type';
import {hasInternet} from '@modules/api/api.utils';
import {AuthService} from '@modules/authentication/auth.service';

const LoginForm = () => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const connectionList = useAppSelector(selectLoginSettings);
  const {
    dbName,
    appType,
    serverName,
    isDemoMode,
    selectedStaff,
    isShowDemoDatabaseInput,
    service,
    appTypeOfPreviousLogin,
    serviceOfPreviousLogin,
  } = useAppSelector(selectAuthState);

  const passwordRef = useRef('');
  const {handleAppError} = useErrorHandler();

  /**
   * Because the "serverName" is persisted but "isDemoMode" is not,
   * so there will be cases where serverName is DEMO_ADDRESS and "isDemoMode" is false.
   * This useEffect is used to handle this inconsistency.
   */
  useEffect(() => {
    if (!isDemoMode && serverName === DEMO_ADDRESS) {
      dispatch(setAuthInfo({connectionInfo: EMPTY_CONNECTION}));
    }
  }, [isDemoMode, serverName]);

  /**
   * Auto set demo mode to "true" when user remove all server connection setting.
   */
  useEffect(() => {
    if (connectionList.length === 0 && serverName !== DEMO_ADDRESS) {
      dispatch(setIsDemoMode({isDemoMode: true}));
      dispatch(setAuthInfo({connectionInfo: DEMO_CONNECTION}));
    }
  }, [connectionList, serverName]);

  /**
   * Called when user press "login" button.
   */
  const submitLoginForm = useCallback(async () => {
    if (selectedStaff?.password === passwordRef.current) {
      if (!(await hasInternet())) {
        handleAppError(new APINoInternetError());
        return;
      }

      if (
        appType !== appTypeOfPreviousLogin ||
        (appType === AppType.TAKINO &&
          serviceOfPreviousLogin?.serviceName !== service?.serviceName)
      ) {
        // Reset sorting conditions of tenant list
        dispatch(setSortingOption({sortedBy: SortingType.ByAlphabet}));
      }
      dispatch(setShowDemoDatabaseInput({showDBInput: false}));
      dispatch(setIsAuthenticated({value: true}));
    } else {
      handleAppError(new WrongPasswordError());
    }
  }, [selectedStaff]);

  /**
   * Called when user enter password.
   */
  const handlePasswordChange = useCallback((password: string) => {
    passwordRef.current = password;
  }, []);

  return (
    <View style={styles.loginForm}>
      {isDemoMode ? (
        <>
          <DemoServiceTypeInput />
          <DemoServiceNameInput />
          {isShowDemoDatabaseInput && <DemoDatabaseInput />}
        </>
      ) : (
        <>
          <ServerConnectionInput />
          <BaseTextInput
            editable={false}
            value={serverName}
            labelImage={images.block}
            label={t('login.serverName')}
            placeholder={AuthService.showPlaceHolderMissingInputText({
              serverAddress: serverName,
            })}
            containerStyle={styles.inputContainer}
          />
          <BaseTextInput
            value={dbName}
            editable={false}
            labelImage={images.block}
            label={t('login.databaseName')}
            placeholder={AuthService.showPlaceHolderMissingInputText({
              serverAddress: serverName,
            })}
            containerStyle={styles.inputContainer}
          />
          <ServiceNameInput />
        </>
      )}

      <UsernameInput />
      <PasswordInput
        onPasswordChange={handlePasswordChange}
        onSubmitEditing={submitLoginForm}
      />
      <BaseButton
        disabled={!selectedStaff}
        onPress={submitLoginForm}
        style={styles.loginBtn}>
        <BaseText
          size={'xxLarge'}
          text={t('common.login')}
          color={selectedStaff ? Colors.PRIMARY : Colors.GRAY_PH}
        />
      </BaseButton>
    </View>
  );
};

const styles = StyleSheet.create({
  loginForm: {
    flex: 1,
  },
  loginBtn: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 25,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
  },
});

export default LoginForm;
