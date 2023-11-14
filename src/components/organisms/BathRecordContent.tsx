import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {TextListItem} from './SelectionList';
import {BathModel} from '@modules/record/bath.model';

export type TBathRecordData = {
  id: string;
  familyName?: string;
  recordDate: string;
  serviceType: string;
  timeZone: string;
  timeValue: Date;
  reporter?: string;
  bathStatus: string;
  bathMethod: string;
  memo: string;
  settingReport: string;
  fkUser?: string;
  settingReportID?: string;
  periodSelectedIndex?: string;
  isSynced?: boolean;
  isAPRecord?: boolean;
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
  periodSelectedIndex?: string;
};

interface IBathRecordContentProps {
  data: TBathRecordData;
  onChange: (e: TBathRecordDataChange) => void;
  enableEdit?: boolean;
}

const BathRecordContent = (props: IBathRecordContentProps) => {
  const {t} = useTranslation();
  const timeZoneList = [
    t('popover.optional_input'),
    t('popover.morning'),
    t('popover.afternoon'),
  ];
  const {data, enableEdit = true, onChange} = props;
  const timeZoneIndex: number =
    data.timeZone === '' ? 0 : timeZoneList.findIndex(e => e === data.timeZone);
  const bathStatusIndex: number =
    data.bathStatus === t('popover.un_done') ? 1 : 0;

  const [tabTimeZoneIndex, setTabTimeZoneIndex] = useState(timeZoneIndex);
  const [tabStatusIndex, setTabStatusIndex] = useState(bathStatusIndex);

  const bathStatusList = [t('common.perform'), t('popover.un_done')];
  const appType = useAppSelector(selectAppType);
  const fetchTime = useAppSelector(selectFetchTime);
  const serviceName = useAppSelector(selectChoseServiceName);
  const [masterBathStyles, setMasterBathStyles] = useState<TextListItem[]>([]);
  const getMasterBathStyles = async () => {
    try {
      const newDatas = await BathModel.GetMasterBathStyle();
      setMasterBathStyles(newDatas ? newDatas : []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMasterBathStyles();
  }, []);

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
      data.bathMethod = '';
    }
    onChange({bathStatus: bathStatusList[index]});
  };

  return (
    <View style={styles.container} pointerEvents={enableEdit ? 'auto' : 'none'}>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        mode={DateTimePickerMode.Date}
        onChange={e => onChange({recordDate: e})}
        defaultDate={
          data.recordDate ? moment(data.recordDate).toDate() : undefined
        }
        isFullWidth
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
            disabled={
              tabTimeZoneIndex !== 0 &&
              _.includes([timeZoneList[1], timeZoneList[2]], data.timeZone)
            }
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
            defaultDate={
              data.recordDate ? moment(data.recordDate).toDate() : undefined
            }
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
          text={data.familyName}
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
        data={masterBathStyles}
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
        onChange={(e, id) =>
          onChange({settingReport: e, periodSelectedIndex: id})
        }
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
