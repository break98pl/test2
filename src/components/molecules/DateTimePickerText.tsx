import {ColorValue, StyleSheet} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '../atoms/BaseText';
import {Weight} from '@themes/typography';
import {Colors} from '@themes/colors';
import {TouchableOpacityProps} from 'react-native';
import BaseButton from '@atoms/BaseButton';
import SVGIcon from '@atoms/SVGIcon';
import moment from 'moment';
import {DATABASE_DATETIME_FORMAT} from '@constants/constants';

export enum DateTimePickerMode {
  DateTime = 'datetime',
  Date = 'date',
  Time = 'time',
}

interface DateTimePickerTextProps extends TouchableOpacityProps {
  mode: DateTimePickerMode;
  date: Date | string;
  color?: ColorValue;
  isShowArrowDown?: boolean;
  isAllowChangeColor?: boolean;
  isShowSuffix?: boolean;
  weightDateText?: Weight;
  hideYear?: boolean;
}

const DateTimePickerText = ({
  mode = DateTimePickerMode.DateTime,
  color = Colors.DARK_BLUE,
  date,
  isShowArrowDown = true,
  isAllowChangeColor = true,
  isShowSuffix,
  weightDateText = 'semiBold',
  hideYear,
  ...rest
}: DateTimePickerTextProps) => {
  const {t} = useTranslation();

  const [stringColor, setStringColor] = useState(color);
  const [suffix, setSuffix] = useState(t('common.today'));

  useEffect(() => {
    checkDaysDifference();
  }, [date]);

  const checkDate = () => {
    const currentDate = new Date();

    // Remove the time component from the current date
    currentDate.setHours(0, 0, 0, 0);

    // Remove the time component from the provided date
    const providedDate = new Date(date);
    providedDate.setHours(0, 0, 0, 0);

    // Calculate the difference in days
    const timeDifference = Math.abs(
      providedDate.getTime() - currentDate.getTime(),
    );
    let differenceInDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (providedDate.getTime() < currentDate.getTime()) {
      differenceInDays *= -1;
    }

    return differenceInDays;
  };

  const renderFormatDate = (dateToFormat: Date | string) => {
    if (typeof dateToFormat === 'string') {
      dateToFormat = moment(dateToFormat, DATABASE_DATETIME_FORMAT).toDate();
    }
    const weekdays = [
      t('common.sunday'),
      t('common.monday'),
      t('common.tuesday'),
      t('common.wednesday'),
      t('common.thursday'),
      t('common.friday'),
      t('common.saturday'),
    ];

    const year = dateToFormat.getFullYear();
    const month = dateToFormat.getMonth() + 1;
    const day = dateToFormat.getDate();

    const weekday = weekdays[dateToFormat.getDay()];
    const formatMonth = `${month}${t('common.monthFormat')}${day}${t(
      'common.dayFormat',
    )} (${weekday}) `;
    const formatDate = `${year}${t('common.yearFormat')}${month}${t(
      'common.monthFormat',
    )}${day}${t('common.dayFormat')} (${weekday}) `;
    const formattedTime = dateToFormat.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    switch (mode) {
      case DateTimePickerMode.DateTime:
        if (hideYear) {
          return `${formatMonth}${formattedTime} `;
        }
        return `${formatDate}${formattedTime} `;
      case DateTimePickerMode.Date:
        return formatDate;
      case DateTimePickerMode.Time:
        return `${formattedTime} `;
      default:
    }
  };

  const checkDaysDifference = () => {
    const differences = checkDate();
    if (differences === 0) {
      isAllowChangeColor && setStringColor(Colors.DARK_BLUE);
      setSuffix(t('common.today'));
    } else if (differences === 1) {
      isAllowChangeColor && setStringColor(Colors.PURPLE);
      setSuffix(t('common.tomorrow'));
    } else if (differences === 2) {
      isAllowChangeColor && setStringColor(Colors.PURPLE);
      setSuffix(t('common.dayAfterTomorrow'));
    } else if (differences === -1) {
      isAllowChangeColor && setStringColor(Colors.DARK_GREEN);
      setSuffix(t('common.yesterday'));
    } else if (differences === -2) {
      isAllowChangeColor && setStringColor(Colors.DARK_GREEN);
      setSuffix(t('common.dayBeforeYesterday'));
    } else if (differences > 2) {
      isAllowChangeColor && setStringColor(Colors.PURPLE);
      setSuffix(
        t('common.daysInTheFuture', {
          days: Math.abs(differences).toString(),
        }),
      );
    } else {
      isAllowChangeColor && setStringColor(Colors.DARK_GREEN);
      setSuffix(
        t('common.daysInThePast', {
          days: Math.abs(differences).toString(),
        }),
      );
    }
  };

  return (
    <BaseButton {...rest} style={styles.container}>
      {isShowArrowDown && (
        <SVGIcon
          name="triangle-down"
          width={12}
          height={12}
          color={stringColor}
          style={styles.downIcon}
        />
      )}
      <BaseText weight={weightDateText} color={stringColor}>
        {date.toString() !== 'Invalid Date'
          ? isShowSuffix
            ? renderFormatDate(date) + suffix
            : renderFormatDate(date)
          : t('common.space')}
      </BaseText>
    </BaseButton>
  );
};

export default memo(DateTimePickerText);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downIcon: {
    marginRight: 4,
  },
});
