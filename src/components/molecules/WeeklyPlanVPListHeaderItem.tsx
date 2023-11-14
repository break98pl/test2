import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';

type Props = {
  width: DimensionValue;
};

const WeeklyPlanVPListHeaderItem = ({width}: Props) => {
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.flatten([styles.center, styles.borderRight, {width}])}>
      <BaseText style={styles.headerText}>
        {t('tsusho_vp_list.weeklySchedule')}
      </BaseText>
    </View>
  );
};

export default WeeklyPlanVPListHeaderItem;

const styles = StyleSheet.create({
  headerText: {
    color: Colors.WHITE,
    fontSize: FontSize.MEDIUM,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
});
