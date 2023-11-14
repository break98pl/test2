import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import BaseText from '@atoms/BaseText';
import DateTimePicker from '@organisms/DateTimePicker';
import SlideTabButtons from '@molecules/SlideTabButtons';
import BaseTextInput from '@molecules/BaseTextInput';
import {DateTimePickerMode} from '@molecules/DateTimePickerText';
import FastImage from 'react-native-fast-image';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import RecordContentItem from '@molecules/RecordContentItem';
import {useTranslation} from 'react-i18next';
import {AppType} from '@modules/setting/setting.type';
import BaseButton from '@atoms/BaseButton';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {images} from '@constants/images';
import ReportInputRecord from '@molecules/ReportInputRecord';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import _ from 'lodash';
import DateTimePickerInputRecord from '@molecules/DateTimePickerInputRecord';
import {useAppSelector} from '@store/config';
import {SettingService} from '@modules/setting/setting.service';
import {selectFetchTime} from '@modules/setting/setting.slice';
import moment from 'moment';
import {serviceTypeListOne, serviceTypeListTwo} from '@constants/constants';

// TODO: Mock data remove later
const bathMethodList = [
  {
    id: '0',
    label: '一般浴（個浴',
  },
  {
    id: '1',
    label: 'シャワー浴',
  },
  {
    id: '2',
    label: '機械浴',
  },
  {
    id: '3',
    label: '足浴',
  },
  {
    id: '4',
    label: '清拭',
  },
  {
    id: '5',
    label: '',
  },
];

export enum PeriodReport {
  ThreeDay = '3d',
  OneWeek = '1w',
  OneMonth = '1m',
}

export type TBathRecordData = {
  recordDate: string;
  serviceType: string;
  timeZone: string;
  timeValue: Date;
  reporter: string;
  bathStatus: string;
  bathMethod: string;
  memo: string;
  settingReport: string;
};

export type TBathRecordDataChange = {
  recordDate?: string;
  serviceType?: string;
  timeZone?: string;
  timeValue?: Date;
  reporter?: string;
  bathStatus?: string;
  bathMethod?: string;
  memo?: string;
  settingReport?: string;
};

interface IBathRecordContentProps {
  data: TBathRecordData;
  onChange: (e: TBathRecordDataChange) => void;
}

const BathRecordContent = (props: IBathRecordContentProps) => {
  const {data, onChange} = props;
  const {t} = useTranslation();
  const [tabTimeZoneIndex, setTabTimeZoneIndex] = useState(0);
  const [tabStatusIndex, setTabStatusIndex] = useState(0);
  const timeZoneList = [
    t('popover.optional_input'),
    t('popover.morning'),
    t('popover.afternoon'),
  ];
  const bathStatusList = [t('common.perform'), t('popover.un_done')];
  const appType = useAppSelector(selectAppType);
  const fetchTime = useAppSelector(selectFetchTime);
  const serviceName = useAppSelector(selectChoseServiceName);

  // TODO: When the logic of fetching more data has implemented, fix min date and max date
  const pickerMinDate = moment()
    .subtract(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
    .toDate();
  const pickerMaxDate = moment().toDate();

  const clearTime = () => {
    const timeReset = new Date('');
    onChange({timeValue: timeReset});
  };

  const handleChooseTimeZone = (index: number) => {
    // If time zone is morning or after, prevent user from typing time value
    if (index === 1 || index === 2) {
      onChange({timeZone: timeZoneList[index], timeValue: new Date('')});
    } else {
      onChange({timeZone: timeZoneList[index]});
    }
  };

  const handleChooseBathStatus = (index: number) => {
    if (index === 1) {
      onChange({bathStatus: bathStatusList[index], bathMethod: ''});
    }
    onChange({bathStatus: bathStatusList[index]});
  };

  return (
    <View style={styles.container}>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        mode={DateTimePickerMode.Date}
        onChange={e => onChange({recordDate: e})}
      />

      {appType === AppType.TAKINO && (
        <CapacityInputRecord
          label={t('popover.service_type')}
          title={t('popover.service_type')}
          value={data.serviceType}
          data={
            serviceName === t('care_list.smallMultiFunctionsService')
              ? serviceTypeListOne
              : serviceTypeListTwo
          }
          onChange={e => onChange({serviceType: e})}
          placeholder={t('popover.not_set')}
          showInfoIcon
        />
      )}

      <RecordContentItem disable title={t('popover.time_zone')}>
        <SlideTabButtons
          tabWidth={90}
          tabHeight={25}
          tabContents={timeZoneList}
          chosenTabIndex={tabTimeZoneIndex}
          onChooseItem={index => handleChooseTimeZone(index)}
          setChosenTabIndex={setTabTimeZoneIndex}
        />
      </RecordContentItem>

      <RecordContentItem disable title={t('popover.time')}>
        <View style={styles.timeValueView}>
          <DateTimePicker
            isNullDate={data.timeValue.toString() === 'Invalid Date'}
            disabled={_.includes(
              [timeZoneList[1], timeZoneList[2]],
              data.timeZone,
            )}
            title={t('popover.time')}
            isShowOk
            isSimpleHeader
            mode={DateTimePickerMode.Time}
            isAllowChangeColor={false}
            onConfirmDate={e => onChange({timeValue: e})}
            isShowArrowDown={false}
            dateTextColor={Colors.TEXT_PRIMARY}
            weightDateTxt={'normal'}
            minDate={pickerMinDate}
            maxDate={pickerMaxDate}
          />
          <BaseButton onPress={clearTime}>
            <FastImage
              style={styles.multiplyIcon}
              resizeMode="contain"
              source={images.multiplyIcon}
            />
          </BaseButton>
        </View>
      </RecordContentItem>

      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.reporter}
        />
      </RecordContentItem>

      <RecordContentItem disable title={t('common.perform_status')}>
        <SlideTabButtons
          tabWidth={90}
          tabHeight={25}
          tabContents={bathStatusList}
          chosenTabIndex={tabStatusIndex}
          setChosenTabIndex={setTabStatusIndex}
          onChooseItem={index => handleChooseBathStatus(index)}
        />
      </RecordContentItem>

      <CapacityInputRecord
        label={t('bath.method')}
        title={t('bath.method')}
        value={data.bathMethod}
        data={bathMethodList}
        onChange={e => onChange({bathMethod: e})}
        disable={data.bathStatus === bathStatusList[1]}
      />

      <RecordContentItem
        titleStyle={styles.memoLabel}
        leftViewStyle={styles.contentLeftMemoView}
        disable
        title={t('popover.memo')}>
        <BaseTextInput
          onChangeText={e => onChange({memo: e})}
          value={data.memo}
          multiline
          containerStyle={styles.memoViewStyle}
          style={styles.memoInputStyle}
        />
      </RecordContentItem>

      <ReportInputRecord
        value={data.settingReport}
        onChange={e => onChange({settingReport: e})}
      />
    </View>
  );
};

export default BathRecordContent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  contentItem: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiplyIcon: {
    width: 24,
    height: 24,
  },
  timeValueView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'space-between',
  },
  memoViewStyle: {
    height: 200,
    backgroundColor: Colors.WHITE,
    width: 410,
  },
  memoInputStyle: {
    height: 200,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: 410,
    fontSize: FontSize.MEDIUM,
    fontWeight: FontWeight.NORMAL,
  },
  contentLeftMemoView: {
    height: '100%',
    width: 110,
  },
  memoLabel: {
    marginTop: 15,
  },
  headerSettingPeriod: {
    backgroundColor: Colors.GRAY_BACKGROUND,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
  },
  bathMethodContainer: {
    width: 345,
    height: '100%',
  },
});
