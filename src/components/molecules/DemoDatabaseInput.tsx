import React, {memo, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectAuthState,
  setDBName,
  setSelectedStaff,
} from '@modules/authentication/auth.slice';
import {StyleSheet} from 'react-native';
import {Colors} from '@themes/colors';
import {AuthService} from '@modules/authentication/auth.service';
import {DEMO_ADDRESS} from '@constants/constants';

const DemoDatabaseInput = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {dbName, service, selectedStaff} = useAppSelector(selectAuthState);

  const handleDBNameChanged = useCallback((text: string) => {
    dispatch(setDBName({dbName: text}));
    if (selectedStaff) {
      dispatch(setSelectedStaff({value: null}));
    }
  }, []);

  return (
    <BaseTextInput
      value={dbName}
      onChangeText={handleDBNameChanged}
      label={t('login.databaseName')}
      containerStyle={styles.inputContainer}
      editable={!!(service?.serviceType && service?.serviceName)}
      placeholder={AuthService.showPlaceHolderMissingInputText({
        serverAddress: DEMO_ADDRESS,
        serviceType: service?.serviceType ?? '',
        serviceName: service?.serviceName ?? '',
      })}
    />
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
  },
});

export default memo(DemoDatabaseInput);
