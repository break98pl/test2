import React, {memo, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseTextInput from '@molecules/BaseTextInput';
import {Colors} from '@themes/colors';
import {StyleSheet} from 'react-native';
import {AuthService} from '@modules/authentication/auth.service';
import {useAppSelector} from '@store/config';
import {selectAuthState} from '@modules/authentication/auth.slice';

interface Props {
  onPasswordChange?: (password: string) => void;
  onSubmitEditing?: () => void;
}

const PasswordInput = ({onPasswordChange, onSubmitEditing}: Props) => {
  const {t} = useTranslation();
  const {serverName, service, selectedStaff, isDemoMode, dbName} =
    useAppSelector(selectAuthState);

  const [password, setPassword] = useState('');

  /**
   * Clear the password whenever the selected staff has changed.
   */
  useEffect(() => {
    setPassword('');
  }, [selectedStaff]);

  /**
   * Called when user enter password.
   */
  const handlePasswordChanged = useCallback((text: string) => {
    setPassword(text);
    if (onPasswordChange) {
      onPasswordChange(text);
    }
  }, []);

  return (
    <BaseTextInput
      secureTextEntry
      value={password}
      returnKeyType={'done'}
      editable={!!selectedStaff}
      label={t('login.password')}
      onChangeText={handlePasswordChanged}
      containerStyle={styles.inputContainer}
      onSubmitEditing={onSubmitEditing}
      placeholder={AuthService.showPlaceHolderMissingInputText({
        serverAddress: serverName,
        serviceType:
          (isDemoMode ? service?.serviceType : service?.serviceName) ?? '',
        serviceName: service?.serviceName ?? '',
        dbName: dbName,
        staff: selectedStaff,
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

export default memo(PasswordInput);
