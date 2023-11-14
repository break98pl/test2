import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import {DimensionValue} from 'react-native';

type TsushoSettledItemProps = {
  width: DimensionValue;
  isSettled?: boolean;
};

const TsushoSettledItem = ({
  width,
  isSettled = false,
}: TsushoSettledItemProps) => {
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.flatten([{width}, styles.center, styles.borderRight])}>
      <BaseText style={styles.settledText}>
        {isSettled ? t('tsusho_vp_list.settled') : '---'}
      </BaseText>
    </View>
  );
};

export default TsushoSettledItem;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  settledText: {},
});
