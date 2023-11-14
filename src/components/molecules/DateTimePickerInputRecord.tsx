import React from 'react';
import RecordContentItem from './RecordContentItem';
import DateTimePicker from '@organisms/DateTimePicker';
import {DateTimePickerMode} from './DateTimePickerText';
import {Colors} from '@themes/colors';
import {convertDateToDateTime} from '@modules/tenant/tenant.utils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import moment from 'moment';
import {SettingService} from '@modules/setting/setting.service';
import {selectFetchTime} from '@modules/setting/setting.slice';
import {useAppSelector} from '@store/config';

interface IDateTimePickerInputRecordProps {
  /**
   * mode of date picker
   */
  mode?: DateTimePickerMode;
  /**
   * handle change date picker
   */
  onChange: (date: string) => void;
  /**
   * label of record field
   */
  label?: string;
  /**
   * date is chosen from datetime tooltip
   */
  defaultDate?: Date;
  /**
   * allow change default date
   */
  allowChangeDefaultDate?: boolean;

  /**
   * min date
   */
  minDate?: Date;

  /**
   * max date
   */
  maxDate?: Date;

  /**
   * Set width of datetimepickerinput
   */
  isFullWidth?: boolean;
}

const DateTimePickerInputRecord = (props: IDateTimePickerInputRecordProps) => {
  const filteringDate = useAppSelector(selectFilteringDate);
  const fetchTime = useAppSelector(selectFetchTime);
  const {
    mode = DateTimePickerMode.DateTime,
    onChange,
    label,
    defaultDate = convertDateToDateTime(filteringDate),
    allowChangeDefaultDate,
    minDate = moment()
      .subtract(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
      .toDate(),
    maxDate = moment().toDate(),
    isFullWidth,
  } = props;
  return !isFullWidth ? (
    <RecordContentItem disable title={label}>
      <DateTimePicker
        isShowOk
        title={label}
        isSimpleHeader
        mode={mode}
        onConfirmDate={e => onChange(e.toISOString())}
        isShowArrowDown={false}
        isAllowChangeColor={false}
        dateTextColor={Colors.TEXT_PRIMARY}
        weightDateTxt={'normal'}
        defaultDate={defaultDate}
        minDate={minDate}
        maxDate={maxDate}
        allowChangeDefaultDate={allowChangeDefaultDate}
      />
    </RecordContentItem>
  ) : (
    <DateTimePicker
      isShowOk
      title={label}
      isSimpleHeader
      mode={mode}
      onConfirmDate={e => onChange(e.toISOString())}
      isShowArrowDown={false}
      isAllowChangeColor={false}
      dateTextColor={Colors.TEXT_PRIMARY}
      weightDateTxt={'normal'}
      defaultDate={defaultDate}
      minDate={minDate}
      maxDate={maxDate}
      allowChangeDefaultDate={allowChangeDefaultDate}
      isFullWidth={isFullWidth}
    />
  );
};

export default DateTimePickerInputRecord;
