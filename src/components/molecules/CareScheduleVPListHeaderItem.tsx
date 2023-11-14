import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';

type Props = {
  width: DimensionValue;
};

const CareScheduleVPListHeaderItem = ({width}: Props) => {
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.flatten([
        styles.careScheduleContainer,
        styles.borderRight,
        {width},
      ])}>
      <View
        style={StyleSheet.flatten([
          styles.careScheduleTop,
          styles.center,
          styles.borderBottom,
          styles.filled,
        ])}>
        <BaseText style={styles.smallHeaderText}>
          {t('tsusho_vp_list.careSchedule')}
        </BaseText>
      </View>
      <View
        style={StyleSheet.flatten([styles.careScheduleBottom, styles.filled])}>
        <View
          style={StyleSheet.flatten([
            styles.careScheduleStartTime,
            styles.center,
            styles.filled,
            styles.borderRight,
          ])}>
          <BaseText style={styles.smallHeaderText}>
            {t('tsusho_vp_list.careStartTime')}
          </BaseText>
        </View>
        <View
          style={StyleSheet.flatten([
            styles.careScheduleEndTime,
            styles.center,
            styles.filled,
          ])}>
          <BaseText style={styles.smallHeaderText}>
            {t('tsusho_vp_list.careEndTime')}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

export default CareScheduleVPListHeaderItem;

const styles = StyleSheet.create({
  careScheduleContainer: {},
  careScheduleTop: {},
  careScheduleBottom: {
    flexDirection: 'row',
  },
  careScheduleStartTime: {},
  careScheduleEndTime: {},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filled: {
    flex: 1,
  },
  smallHeaderText: {
    color: Colors.WHITE,
    fontSize: FontSize.SMALL,
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
});
