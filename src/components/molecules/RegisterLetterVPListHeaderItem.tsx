import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';
import {useTranslation} from 'react-i18next';

type Props = {
  width: DimensionValue;
};

const RegisterLetterVPListHeaderItem = ({width}: Props) => {
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.flatten([
        styles.center,
        styles.borderRight,
        {
          width,
        },
      ])}>
      <BaseText style={styles.headerText}>
        {t('tsusho_vp_list.registerLetter')}
      </BaseText>
    </View>
  );
};

export default RegisterLetterVPListHeaderItem;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: FontSize.MEDIUM,
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
});
