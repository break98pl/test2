import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';

type Props = {
  width: DimensionValue;
};

const RehaVPListHeaderItem = ({width}: Props) => {
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.flatten([
        styles.borderRight,
        {
          width,
        },
      ])}>
      <View
        style={StyleSheet.flatten([
          styles.rehaTop,
          styles.center,
          styles.borderBottom,
          styles.filled,
        ])}>
        <BaseText style={styles.smallHeaderText}>
          {t('tsusho_vp_list.reha')}
        </BaseText>
      </View>
      <View style={StyleSheet.flatten([styles.rehaBottom, styles.filled])}>
        <View
          style={StyleSheet.flatten([
            styles.plannedRehaExercise,
            styles.center,
            styles.borderRight,
            styles.filled,
          ])}>
          <BaseText style={styles.smallHeaderText}>
            {t('tsusho_vp_list.plannedRehaExercise')}
          </BaseText>
        </View>
        <View
          style={StyleSheet.flatten([
            styles.doneRehaExercise,
            styles.center,
            styles.borderRight,
            styles.filled,
          ])}>
          <BaseText style={styles.smallHeaderText}>
            {t('common.perform')}
          </BaseText>
        </View>
        <View
          style={StyleSheet.flatten([
            styles.cancelRehaExercise,
            styles.center,
            styles.filled,
          ])}>
          <BaseText style={styles.smallHeaderText}>
            {t('tsusho_vp_list.cancelRehaExercise')}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

export default RehaVPListHeaderItem;

const styles = StyleSheet.create({
  rehaTop: {},
  rehaBottom: {
    flexDirection: 'row',
  },
  plannedRehaExercise: {},
  doneRehaExercise: {},
  cancelRehaExercise: {},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: FontSize.MEDIUM,
  },
  smallHeaderText: {
    color: Colors.WHITE,
    fontSize: FontSize.SMALL,
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
  filled: {
    flex: 1,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
});
