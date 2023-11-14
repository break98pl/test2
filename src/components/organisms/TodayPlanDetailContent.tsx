import React from 'react';
import moment from 'moment';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import TodayPlanInfoItem from '@molecules/TodayPlanInfoItem';
import {images} from '@constants/images';
import {GoingOutPlan, TodayPlanType} from '@modules/tenant/tenant.type';
import {DATETIME_WEEKDAY_FORMAT, TIME_24H_FORMAT} from '@constants/constants';

interface Props {
  data: GoingOutPlan;
  isLineBreakDate?: boolean;
}

const TodayPlanDetailContent = ({data, isLineBreakDate}: Props) => {
  const {t} = useTranslation();

  const reportDate = moment(data.reportDate).format(DATETIME_WEEKDAY_FORMAT);
  const startDate = moment(data.startDate).format(DATETIME_WEEKDAY_FORMAT);
  const endDate =
    data.planType === TodayPlanType.OvernightOuting
      ? moment(data.endDate).format(DATETIME_WEEKDAY_FORMAT)
      : moment(data.endDate).format(TIME_24H_FORMAT);

  const planPeriod =
    !isLineBreakDate || !(data.planType === TodayPlanType.OvernightOuting)
      ? `${startDate} 〜 ${endDate}`
      : `${startDate} 〜\n${endDate}`;

  const confirmedString = data.isConfirmedStart
    ? t('today_plan.confirm_exit')
    : data.isConfirmedEnd
    ? t('today_plan.confirm_come_back')
    : t('today_plan.schedule_notification');

  const getIconButtonTodayPlan = () => {
    let todayPlanSet = {
      icon: images.tpSleepOverRepresent,
      label: t('popover.tp_sleep_over'),
    };
    if (!data) {
      return todayPlanSet;
    }
    switch (data.planType) {
      case TodayPlanType.OvernightOutingDateOut:
      case TodayPlanType.OvernightOutingInProgress:
      case TodayPlanType.OvernightOutingDateBack:
        todayPlanSet = {
          icon: images.tpSleepOverRepresent,
          label: t('popover.tp_sleep_over'),
        };
        break;
      case TodayPlanType.DayOuting:
        todayPlanSet = {
          icon: images.tpGoOut,
          label: t('popover.tp_go_out'),
        };
        break;
      case TodayPlanType.MedicalExamination:
        todayPlanSet = {
          icon: images.tpMeetDoctor,
          label: t('popover.tp_meet_doctor'),
        };
        break;
      case TodayPlanType.HavingVisitors:
        todayPlanSet = {
          icon: images.tpMeetFamily,
          label: t('popover.tp_meet_family'),
        };
        break;
      default:
        todayPlanSet = {
          icon: images.tpSleepOverRepresent,
          label: t('popover.tp_sleep_over'),
        };
        break;
    }
    return todayPlanSet;
  };

  return (
    <View style={styles.contentPopover}>
      <View style={styles.headerDetail}>
        <FastImage
          style={styles.recordInputIcon}
          source={getIconButtonTodayPlan().icon}
          resizeMode="contain"
        />
        <BaseText
          color={Colors.TITLE}
          size="xxLarge"
          weight="semiBold"
          text={t('today_plan.going_out_info')}
        />
      </View>
      <View style={styles.infoDetail}>
        <TodayPlanInfoItem
          label={getIconButtonTodayPlan().label}
          content={planPeriod}
        />
        <TodayPlanInfoItem
          label={`${getIconButtonTodayPlan().label}${t(
            'popover.sleep_over_place',
          )}`}
          content={data.place}
        />
        <TodayPlanInfoItem
          label={t('popover.comment')}
          content={data.comment}
        />
        <TodayPlanInfoItem
          label={t('popover.meal_type')}
          content={confirmedString}
        />
        <TodayPlanInfoItem
          label={t('popover.date_time_record')}
          content={reportDate}
        />
        <TodayPlanInfoItem
          label={t('popover.reporter')}
          content={data.reporterName}
        />
      </View>
    </View>
  );
};

export default TodayPlanDetailContent;

const styles = StyleSheet.create({
  contentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 15,
  },
  headerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 15,
  },
  infoDetail: {
    marginTop: 10,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
});
