import {StyleSheet} from 'react-native';
import React from 'react';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';

interface ICheckAllButtonProps {
  onPress?: () => void;
  isChecked?: boolean;
}

const CheckAllButton = (props: ICheckAllButtonProps) => {
  const {isChecked, onPress} = props;
  const {t} = useTranslation();

  return (
    <BaseButton
      onPress={onPress}
      style={StyleSheet.compose(
        styles.checkAllBtn,
        isChecked && styles.unCheckStatus,
      )}>
      <BaseText
        size={'xxLarge'}
        color={isChecked ? Colors.TEXT_PRIMARY : Colors.TEXT_NAVY}
        text={
          isChecked ? t('elapsed.check_all') : t('elapsed.cancel_check_all')
        }
      />
    </BaseButton>
  );
};

export default CheckAllButton;

const styles = StyleSheet.create({
  checkAllBtn: {
    backgroundColor: Colors.LIGHT_BLUE,
    borderColor: Colors.TEXT_NAVY,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 0.5,
    width: 101,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unCheckStatus: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.TEXT_PRIMARY,
  },
});
