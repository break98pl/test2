import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseTextInput from './BaseTextInput';

const TsushoRegisterMemoInput = () => {
  const {t} = useTranslation();
  const memoText = t('common.memo');

  return (
    <View style={styles.container}>
      <BaseTextInput
        label={memoText}
        labelSize="small"
        labelWeight="semiBold"
        labelColor={Colors.TEXT_SECONDARY}
        style={styles.input}
        labelViewStyle={styles.labelView}
      />
    </View>
  );
};

export default TsushoRegisterMemoInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  labelView: {
    width: 50,
  },
  input: {
    borderColor: Colors.SEPARATOR_LINE,
    borderWidth: 1,
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
});
