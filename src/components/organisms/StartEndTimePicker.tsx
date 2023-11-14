import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import RecordContentItem from '@molecules/RecordContentItem';
import useVisible from '@hooks/useVisible';
import BaseText from '@atoms/BaseText';
import BaseTooltip from '@templates/BaseTooltip';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import TinyItem from '@molecules/TinyItem';
import DatePicker from 'react-native-date-picker';
import BaseButton from '@atoms/BaseButton';
import moment from 'moment';
import {TIME_24H_FORMAT} from '@constants/constants';
import {handleAlertSave} from '@modules/alerts/alert.ultils';
import {FontSize} from '@themes/typography';

enum RehaTime {
  StartTime = 'StartTime',
  EndTime = 'EndTime',
}

interface IStartEndTimePickerProps {
  value?: string;
  label?: string;
  title?: string;
  onChange: (e: string) => void;
  notAnySelectedItem?: boolean;
  postponePerform?: boolean;
  disabled?: boolean;
}

const StartEndTimePicker = (props: IStartEndTimePickerProps) => {
  const {
    value,
    label,
    title,
    onChange,
    notAnySelectedItem,
    postponePerform,
    disabled,
  } = props;
  const {t} = useTranslation();
  const {
    isVisible: isShowPicker,
    showComponent: openPicker,
    hideComponent: hidePicker,
  } = useVisible();
  const [tempStartTime, setTempStartTime] = useState('');
  const [tempEndTime, setTempEndTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeType, setTimeType] = useState<RehaTime>();

  const handleOpenTimePicker = () => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    openPicker();
  };

  const handleHideTimePicker = () => {
    setTimeType(undefined);
    hidePicker();
  };

  const getReplaceText = () => {
    if (notAnySelectedItem) {
      return t('popover.not_any_select');
    } else if (postponePerform) {
      return t('popover.can_not_edit');
    }
    return value || t('popover.tap_to_select');
  };

  const saveChosenTime = () => {
    if (startTime !== tempStartTime || endTime !== tempEndTime) {
      handleAlertSave(
        () => {
          if (startTime.length + endTime.length > 0) {
            onChange(`${startTime} 〜 ${endTime}`);
          } else {
            onChange('');
          }
          handleHideTimePicker();
        },
        () => null,
      );
    } else {
      handleHideTimePicker();
    }
  };

  const clearChosenTime = () => {
    setStartTime('');
    setEndTime('');
    setTimeType(undefined);
  };

  const handleChangeTime = (e: Date) => {
    const timeFormat = moment(e).format(TIME_24H_FORMAT);
    if (timeType === RehaTime.StartTime) {
      setStartTime(timeFormat);
    } else if (timeType === RehaTime.EndTime) {
      setEndTime(timeFormat);
    }
  };

  const getSelectedTime = () => {
    let selectedTime = new Date();
    if (
      !timeType ||
      (timeType === RehaTime.StartTime && !startTime.length) ||
      (timeType === RehaTime.EndTime && !endTime.length)
    ) {
      return selectedTime;
    }
    return (
      (timeType === RehaTime.StartTime
        ? moment(startTime, TIME_24H_FORMAT).toDate()
        : moment(endTime, TIME_24H_FORMAT).toDate()) || new Date()
    );
  };

  const handleChooseStartTime = () => {
    if (!startTime.length) {
      if (
        !!endTime.length &&
        moment().format(TIME_24H_FORMAT) <
          moment(endTime, TIME_24H_FORMAT).toString()
      ) {
        setStartTime(endTime);
      } else {
        setStartTime(moment().format(TIME_24H_FORMAT));
      }
    }
    setTimeType(RehaTime.StartTime);
  };

  const handleChooseEndTime = () => {
    if (!endTime.length) {
      if (
        !!startTime.length &&
        moment().format(TIME_24H_FORMAT) <
          moment(startTime, TIME_24H_FORMAT).toString()
      ) {
        setEndTime(startTime);
      } else {
        setEndTime(moment().format(TIME_24H_FORMAT));
      }
    }
    setTimeType(RehaTime.EndTime);
  };

  const checkMinimumDate = () => {
    if (timeType === RehaTime.EndTime && !!startTime.length) {
      return moment(startTime, TIME_24H_FORMAT).toDate();
    }
    return undefined;
  };

  const checkMaximumDate = () => {
    if (timeType === RehaTime.StartTime && !!endTime.length) {
      return moment(endTime, TIME_24H_FORMAT).toDate();
    }
    return undefined;
  };

  const renderTimePickerTooltip = () => {
    return (
      <View style={styles.container}>
        <TinyItem
          onPress={handleChooseStartTime}
          isChoosing={timeType === RehaTime.StartTime}
          label={t('tsusho_vp_list.startTimeFilter')}
          value={startTime}
        />
        <TinyItem
          onPress={handleChooseEndTime}
          isChoosing={timeType === RehaTime.EndTime}
          label={t('tsusho_vp_list.endTimeFilter')}
          value={endTime}
        />
        <DatePicker
          onDateChange={handleChangeTime}
          date={getSelectedTime()}
          mode={'time'}
          locale="ja"
          minimumDate={checkMinimumDate()}
          maximumDate={checkMaximumDate()}
        />
        <View style={styles.footerSection}>
          <BaseButton onPress={clearChosenTime}>
            <BaseText weight="bold" color={Colors.TEXT_LINK_BLUE} size="xLarge">
              {t('common.clear').toUpperCase()}
            </BaseText>
          </BaseButton>
          <BaseButton onPress={saveChosenTime}>
            <BaseText weight="bold" color={Colors.TEXT_LINK_BLUE} size="xLarge">
              {t('common.ok').toUpperCase()}
            </BaseText>
          </BaseButton>
        </View>
      </View>
    );
  };

  return (
    <RecordContentItem
      disable={disabled}
      isChoosing={isShowPicker}
      onPress={handleOpenTimePicker}
      title={label}>
      <BaseTooltip
        title={title}
        showHeader
        placement={'right'}
        isVisible={isShowPicker}
        onClose={saveChosenTime}
        closeOnContentInteraction={false}
        closeOnBackgroundInteraction={false}
        leftButtonText={t('user_list.close')}
        onLeftButtonPress={saveChosenTime}
        content={renderTimePickerTooltip()}
        contentStyle={styles.tooltipContainer}
        headerStyle={styles.headerSettingPeriod}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      <BaseText
        opacity={!!value && value.length ? 'normal' : 'low'}
        color={Colors.TEXT_PRIMARY}
        text={getReplaceText()}
      />
    </RecordContentItem>
  );
};

export default StartEndTimePicker;

const styles = StyleSheet.create({
  tooltipContainer: {
    width: 390,
    height: 450,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomColor: Colors.GRAY_PH,
  },
  targetShowTooltip: {
    width: 1,
    height: 20,
  },
  container: {
    height: '100%',
    paddingVertical: 25,
    alignItems: 'center',
    rowGap: 7,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  pickerListView: {
    width: '33%',
  },
  footerSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 100,
    gap: 150,
  },
  typingTimeView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 216,
  },
  distance: {
    marginHorizontal: 10,
  },
  blockNumber: {
    width: 35,
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonChange: {
    position: 'absolute',
    top: 125,
    zIndex: 10,
  },
  changeIcon: {
    width: 20,
    height: 20,
  },
  numberText: {
    fontSize: FontSize.XX_LARGE,
  },
});
