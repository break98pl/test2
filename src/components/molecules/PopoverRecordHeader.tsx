import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import FastImage, {Source} from 'react-native-fast-image';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@organisms/DateTimePicker';
import {DateTimePickerMode} from './DateTimePickerText';
import {AppType} from '@modules/setting/setting.type';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {convertDateToDateTime} from '@modules/tenant/tenant.utils';
import {SettingService} from '@modules/setting/setting.service';
import moment from 'moment';
import {useAppSelector} from '@store/config';
import {selectFetchTime} from '@modules/setting/setting.slice';
import {AuthService} from '@modules/authentication/auth.service';

export enum RecordStatus {
  Create = 'create',
  UnSync = 'unSync',
  NotEdit = 'notEdit',
  DoneAndNotEdit = 'doneAndNotEdit',
}

interface IPopoverRecordHeaderProps {
  onConfirmDate?: (date: Date) => void;
  source?: Source;
  recordName?: string;
  recordStatus?: RecordStatus;
  showRecordDate?: boolean;
  showIcon?: boolean;
  label?: string;
  iconStatus?: React.ReactNode;
  style?: ViewStyle;
  recordNameColor?: string;
  defaultDate?: Date;
  serviceCode?: string | null;
}

const PopoverRecordHeader = (props: IPopoverRecordHeaderProps) => {
  const {
    onConfirmDate,
    source,
    recordName,
    recordStatus = RecordStatus.Create,
    showRecordDate,
    showIcon = true,
    label,
    iconStatus,
    style,
    recordNameColor = Colors.TITLE,
    defaultDate,
    serviceCode,
  } = props;
  const {t} = useTranslation();
  const serviceNameLogin = useAppSelector(selectChoseServiceName);
  const appType = useAppSelector(selectAppType);
  const filteringDate = useAppSelector(selectFilteringDate);
  const fetchTime = useAppSelector(selectFetchTime);
  const serviceName =
    !serviceCode || serviceCode === '-1'
      ? serviceNameLogin
      : AuthService.getServiceNameByCode(serviceCode);
  // TODO: When the logic of fetching more data has implemented, fix min date and max date
  const pickerMinDate = moment()
    .subtract(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
    .toDate();
  const pickerMaxDate = moment().toDate();

  const getTextFromRecordStatus = () => {
    switch (recordStatus) {
      case RecordStatus.Create:
        return '';
      case RecordStatus.UnSync:
        return t('popover.un_sync_note');
      case RecordStatus.NotEdit:
        return t('popover.not_allow_edit_note');
      case RecordStatus.DoneAndNotEdit:
        return t('popover.done_and_not_edit_note');
      default:
        return '';
    }
  };

  return (
    <View style={StyleSheet.compose(styles.header, style)}>
      {showIcon && (
        <FastImage
          style={styles.serviceIcon}
          source={source}
          resizeMode="contain"
        />
      )}
      <View style={styles.unsyncZone}>
        {appType === AppType.JUTAKU && (
          <BaseText
            color={Colors.BOLD_GREY}
            size="small"
            text={serviceName}
            weight="semiBold"
          />
        )}
        <View style={styles.appNameView}>
          {label ? (
            <BaseText text={label} />
          ) : (
            <BaseText
              color={recordNameColor}
              size="xxLarge"
              weight="semiBold"
              text={recordName}
            />
          )}
          <View style={styles.iconStatus}>{iconStatus}</View>

          <BaseText
            color={Colors.TITLE}
            size="xxLarge"
            weight="semiBold"
            text={getTextFromRecordStatus()}
          />
        </View>
      </View>

      <View style={styles.dateRecordTemplate}>
        {showRecordDate && (
          <View style={styles.unsyncZone}>
            {appType === AppType.JUTAKU && <BaseText />}
            <DateTimePicker
              title={t('popover.record_date')}
              isShowOk
              isSimpleHeader
              mode={DateTimePickerMode.DateTime}
              isShowArrowDown={false}
              dateTextColor={Colors.TEXT_BLUE}
              weightDateTxt={'normal'}
              isAllowChangeColor={false}
              hideYear
              defaultDate={
                defaultDate === undefined
                  ? convertDateToDateTime(filteringDate)
                  : defaultDate
              }
              minDate={pickerMinDate}
              maxDate={pickerMaxDate}
              onConfirmDate={e => onConfirmDate && onConfirmDate(e)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default PopoverRecordHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 22,
  },
  serviceIcon: {
    width: 40,
    height: 36,
  },
  appNameView: {
    flexDirection: 'row',
  },
  dateRecordTemplate: {
    marginLeft: 40,
  },
  unsyncZone: {
    flexDirection: 'column',
    marginLeft: 15,
    marginRight: 30,
    gap: 1,
  },
  iconStatus: {
    marginHorizontal: 15,
    marginLeft: -15,
  },
});
