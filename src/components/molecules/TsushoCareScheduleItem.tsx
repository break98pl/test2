import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {FontSize, FontWeight} from '@themes/typography';
import {useTranslation} from 'react-i18next';
import {DaysInWeek} from '@modules/visitPlan/type';

type Weekdays = {
  [key: string]: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
};

export type TsushoCareScheduleItemProps = {
  width?: DimensionValue;
  startTime?: string;
  endTime?: string;
  blurWeekdays?: DaysInWeek[];
};

const TsushoCareScheduleItem = ({
  width,
  startTime,
  endTime,
  blurWeekdays = [],
}: TsushoCareScheduleItemProps) => {
  const {t} = useTranslation();

  const weekdays: Weekdays = {
    monday: t('common.monday'),
    tuesday: t('common.tuesday'),
    wednesday: t('common.wednesday'),
    thursday: t('common.thursday'),
    friday: t('common.friday'),
    saturday: t('common.saturday'),
    sunday: t('common.sunday'),
  };

  return (
    <View
      style={StyleSheet.flatten([
        {width},
        styles.borderRight,
        styles.borderLeft,
      ])}>
      {/* section top */}
      <View
        style={StyleSheet.flatten([
          styles.careScheduleTop,
          styles.filled,
          styles.borderBottom,
        ])}>
        <View
          style={StyleSheet.flatten([
            styles.careScheduleStartTime,
            styles.center,
            styles.filled,
            styles.borderRight,
          ])}>
          <BaseText style={styles.timeText}>{startTime}</BaseText>
        </View>
        <View
          style={StyleSheet.flatten([
            styles.careScheduleEndTime,
            styles.center,
            styles.filled,
          ])}>
          <BaseText style={styles.timeText}>{endTime}</BaseText>
        </View>
      </View>

      {/* section bottom */}
      <View
        style={StyleSheet.flatten([
          styles.careScheduleBottom,
          styles.center,
          styles.filled,
        ])}>
        {Object.keys(weekdays).map((item, index) => {
          return (
            <BaseText
              key={index + item}
              style={
                blurWeekdays.includes(weekdays[item] as DaysInWeek)
                  ? StyleSheet.flatten([styles.weekdays, styles.blurText])
                  : styles.weekdays
              }>
              {weekdays[item]}
            </BaseText>
          );
        })}
      </View>
    </View>
  );
};

export default TsushoCareScheduleItem;

const styles = StyleSheet.create({
  careScheduleTop: {
    flexDirection: 'row',
  },
  careScheduleBottom: {
    flexDirection: 'row',
  },
  careScheduleStartTime: {},
  careScheduleEndTime: {},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  borderLeft: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.GRAY_PH,
  },
  filled: {
    flex: 1,
  },
  weekdays: {
    fontSize: FontSize.SMALL,
  },
  timeText: {
    fontWeight: FontWeight.NORMAL,
  },
  blurText: {
    fontSize: FontSize.SMALL,
    color: Colors.GRAY_PH,
  },
});
