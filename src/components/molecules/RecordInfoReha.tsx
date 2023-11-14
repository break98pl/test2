import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import ReportInputRecord from './ReportInputRecord';
import RecordContentItem from './RecordContentItem';
import SlideTabButtons from './SlideTabButtons';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {DateTimePickerMode} from './DateTimePickerText';
import DateTimePicker from '@organisms/DateTimePicker';
import {TenantInfo} from '@modules/tenant/tenant.type';
import {useSelector} from 'react-redux';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import moment from 'moment';

export type TRehaInfo = {
  userInfo: TenantInfo;
  reporter: string;
  date: Date;
  attendanceFee: string;
  settingReport: string;
};

export type TRehaInfoChange = {
  reporter?: string;
  date?: Date;
  attendanceFee?: string;
  settingReport?: string;
};

interface IRecordInfoRehaProps {
  data: TRehaInfo;
  onChange: (e: TRehaInfoChange) => void;
}

const RecordInfoReha = (props: IRecordInfoRehaProps) => {
  const {data, onChange} = props;
  const {t} = useTranslation();
  const feeRehaList = [
    t('common.not_have'),
    t('popover.i_fee'),
    t('popover.ro_fee'),
  ];
  const [tabFeeIndex, setTabFeeIndex] = useState(0);
  const filteringDate = useSelector(selectFilteringDate);

  return (
    <View style={styles.container}>
      <View style={styles.reporterAndDateView}>
        <RecordContentItem
          disable
          showLabel={false}
          renderLeftView={
            <BaseText
              style={styles.labelReha}
              text={`${t('popover.reporter')}:`}
            />
          }>
          <BaseText color={Colors.TEXT_PRIMARY} text={data.reporter} />
        </RecordContentItem>
        <DateTimePicker
          disabled
          title={t('popover.record_date')}
          isShowOk
          isSimpleHeader
          mode={DateTimePickerMode.Date}
          isAllowChangeColor={false}
          isShowArrowDown={false}
          dateTextColor={Colors.TEXT_PRIMARY}
          weightDateTxt={'normal'}
          defaultDate={moment(filteringDate).toDate()}
        />
      </View>

      <RecordContentItem
        disable
        showLabel={false}
        renderLeftView={
          <BaseText
            style={styles.labelReha}
            text={`${t('popover.attendance_fee')}:`}
          />
        }>
        <SlideTabButtons
          tabContents={feeRehaList}
          tabWidth={95}
          tabHeight={25}
          chosenTabIndex={tabFeeIndex}
          setChosenTabIndex={setTabFeeIndex}
          onChooseItem={index => onChange({attendanceFee: feeRehaList[index]})}
        />
      </RecordContentItem>
      <ReportInputRecord
        useRehaLabel
        animatedPress={false}
        placement="bottom"
        value={data.settingReport}
        onChange={e => onChange({settingReport: e})}
      />
    </View>
  );
};

export default RecordInfoReha;

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
  },
  labelReha: {
    marginRight: 15,
  },
  reporterAndDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
});
