import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import moment from 'moment';

type CareListSectionHeaderDateProps = {
  date: Date;
  isHoliday: boolean;
};

const CareListSectionHeaderDate = ({
  date = new Date(),
  isHoliday = false,
}: CareListSectionHeaderDateProps) => {
  // text
  const {t} = useTranslation();
  const weekdays = [
    t('common.sunday'),
    t('common.monday'),
    t('common.tuesday'),
    t('common.wednesday'),
    t('common.thursday'),
    t('common.friday'),
    t('common.saturday'),
  ];
  const monthFormatText = t('common.monthFormat');
  const dayFormatText = t('common.dayFormat');
  const todayText = t('care_list.today');

  // methods
  const getFormattedDate = () => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const suffix = getDateSuffix();

    return {
      formattedDate: `${month}${monthFormatText}${day}${dayFormatText}`,
      suffix,
    };
  };

  const getDateColor = () => {
    const dayInWeek = date.getDay();
    // if date passed is Sunday or date is in holiday fetched info
    if (dayInWeek === 0 || isHoliday) {
      return Colors.HOLIDAY_LIGHT_RED;
    }
    // if date passed is Saturday
    else if (dayInWeek === 6) {
      return Colors.WEEKEND_LIGHT_BLUE;
    }
    // other cases
    else {
      return Colors.WHITE;
    }
  };

  const getDateSuffix = () => {
    const dayInWeek = date.getDay();

    return `(${weekdays[dayInWeek]})`;
  };

  // render methods
  const renderDate = () => {
    const dateColor = getDateColor();
    const {formattedDate, suffix} = getFormattedDate();

    return (
      <>
        <BaseText weight="semiBold" style={[styles.date, {color: dateColor}]}>
          {formattedDate}
        </BaseText>

        <BaseText weight="semiBold" style={{color: dateColor}}>
          {suffix}
        </BaseText>
      </>
    );
  };

  const renderDaysDiff = () => {
    const daysDiff = moment().diff(date, 'day');
    let formattedDaysDiff = '';

    if (daysDiff === 0) {
      formattedDaysDiff = todayText;
    } else {
      formattedDaysDiff = t('care_list.daysAgo', {day: Math.abs(daysDiff)});
    }

    return (
      <View style={styles.daysDiffContainer}>
        <BaseText style={styles.daysDiff}>{formattedDaysDiff}</BaseText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderDate()}
      {renderDaysDiff()}
    </View>
  );
};

export default CareListSectionHeaderDate;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 180,
  },
  date: {
    width: 70,
  },
  daysDiffContainer: {
    width: 66,
    alignItems: 'flex-end',
  },
  daysDiff: {
    color: Colors.GRAY,
  },
});
