import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';

interface IRehaContentFooterProps {
  onClose?: () => void;
  onSave?: () => void;
  disabledSave?: boolean;
}

const RehaContentFooter = (props: IRehaContentFooterProps) => {
  const {onClose, onSave, disabledSave} = props;
  const {t} = useTranslation();

  return (
    <View style={styles.modalFooter}>
      <BaseButton onPress={onClose}>
        <BaseText
          color={Colors.PRIMARY}
          size="xxLarge"
          text={t('common.close')}
        />
      </BaseButton>
      <BaseButton disabled={disabledSave} onPress={onSave}>
        <BaseText
          color={disabledSave ? Colors.DISABLED_COLOR : Colors.PRIMARY}
          size="xxLarge"
          text={t('common.save')}
        />
      </BaseButton>
    </View>
  );
};

export default RehaContentFooter;

const styles = StyleSheet.create({
  modalFooter: {
    backgroundColor: Colors.POPOVER_BG,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
});
