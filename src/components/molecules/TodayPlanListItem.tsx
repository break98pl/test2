import React from 'react';
import moment from 'moment/moment';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';
import {getIconTodayPlan} from '@modules/tenant/tenant.utils';
import {GoingOutPlan, TodayPlanType} from '@modules/tenant/tenant.type';
import {DATETIME_WEEKDAY_FORMAT, TIME_24H_FORMAT} from '@constants/constants';
import {images} from '@constants/images';

interface ITodayPlanListItemProps {
  todayPlan: GoingOutPlan;
  isLineBreakDate?: boolean;
  onPress?: () => void;
}

const TodayPlanListItem = ({
  todayPlan,
  isLineBreakDate,
  onPress,
}: ITodayPlanListItemProps) => {
  const startDate =
    todayPlan.planType === TodayPlanType.OvernightOuting
      ? moment(todayPlan.startDate).format(DATETIME_WEEKDAY_FORMAT)
      : moment(todayPlan.startDate).format(TIME_24H_FORMAT);

  const endDate =
    todayPlan.planType === TodayPlanType.OvernightOuting
      ? moment(todayPlan.endDate).format(DATETIME_WEEKDAY_FORMAT)
      : moment(todayPlan.endDate).format(TIME_24H_FORMAT);

  const planPeriod =
    !isLineBreakDate || !(todayPlan.planType === TodayPlanType.OvernightOuting)
      ? `${startDate} 〜 ${endDate}`
      : `${startDate} 〜\n${endDate}`;

  const planIcon =
    todayPlan.planType === TodayPlanType.OvernightOuting
      ? getIconTodayPlan(todayPlan.goingOutStatus)
      : getIconTodayPlan(todayPlan.planType);

  return (
    <BaseButton onPress={onPress} style={styles.container}>
      <FastImage
        source={planIcon}
        resizeMode="contain"
        style={styles.recordInputIcon}
      />
      <View style={styles.periodView}>
        <BaseText text={planPeriod} />
      </View>
      <FastImage source={images.rightArrow} style={styles.arrowIcon} />
    </BaseButton>
  );
};

export default TodayPlanListItem;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: Colors.WHITE,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  periodView: {
    flex: 1,
  },
  arrowIcon: {
    height: 15,
    width: 9,
  },
});
