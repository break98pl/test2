import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import BaseTextInput from '@molecules/BaseTextInput';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';
import RecordContentItem from '@molecules/RecordContentItem';
import {useTranslation} from 'react-i18next';
import ReportInputRecord from '@molecules/ReportInputRecord';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import TypingInputRecord from '@molecules/TypingInputRecord';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import DateTimePickerInputRecord from '@molecules/DateTimePickerInputRecord';
import {serviceTypeListOne, serviceTypeListTwo} from '@constants/constants';
import {useAppSelector} from '@store/config';

export type TExcretionRecordData = {
  recordDate: string;
  reporter: string;
  serviceType: string;
  incontinence: string;
  excretionTool: string;
  excrete: string;
  urineVolume: string;
  urineStatus: string;
  defecationVolume: string;
  defecationStatus: string;
  memo: string;
  settingReport: string;
};

export type TExcretionRecordDataChange = {
  recordDate?: string;
  reporter?: string;
  serviceType?: string;
  incontinence?: string;
  excretionTool?: string;
  excrete?: string;
  urineVolume?: string;
  urineStatus?: string;
  defecationVolume?: string;
  defecationStatus?: string;
  memo?: string;
  settingReport?: string;
};

interface IExcretionRecordContentProps {
  data: TExcretionRecordData;
  onChange: (e: TExcretionRecordDataChange) => void;
  style?: ViewStyle;
}

// TODO: Mock data remove later
const incontinenceList = [
  {
    id: '0',
    label: 'あり',
  },
  {
    id: '1',
    label: 'なし',
  },
  {
    id: '2',
    label: '',
  },
];

const excreteList = [
  {
    id: '0',
    label: 'トイレ2',
  },
  {
    id: '1',
    label: '布おむつ',
  },
  {
    id: '2',
    label: '尿取りパッド',
  },
  {
    id: '3',
    label: '導尿',
  },
  {
    id: '4',
    label: '',
  },
];

// TODO: mock data remove later
const urineVolumeList: any[] = [];

const urineStatusList: any[] = [];

const defecationVolumeList: any[] = [];

const defecationStatusList: any[] = [];

const ExcretionRecordContent = (props: IExcretionRecordContentProps) => {
  const {data, onChange, style} = props;
  const {t} = useTranslation();
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        onChange={e => onChange({recordDate: e})}
      />

      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.reporter}
        />
      </RecordContentItem>

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

      <CapacityInputRecord
        label={t('popover.incontinence')}
        title={t('popover.incontinence')}
        value={data.incontinence}
        data={incontinenceList}
        onChange={e => onChange({incontinence: e})}
      />

      <CapacityInputRecord
        label={t('popover.excrete')}
        title={t('popover.excrete')}
        value={data.excrete}
        data={excreteList}
        onChange={e => onChange({excrete: e})}
      />

      <TypingInputRecord
        label={t('popover.urineVolume')}
        title={t('popover.urineVolume')}
        value={data.urineVolume}
        data={urineVolumeList}
        onChange={e => onChange({urineVolume: e})}
      />

      <CapacityInputRecord
        label={t('popover.urineStatus')}
        title={t('popover.urineStatus')}
        value={data.urineStatus}
        data={urineStatusList}
        onChange={e => onChange({urineStatus: e})}
        showClearIcon
      />

      <CapacityInputRecord
        label={t('popover.defecationVolume')}
        title={t('popover.defecationVolume')}
        value={data.defecationVolume}
        data={defecationVolumeList}
        onChange={e => onChange({defecationVolume: e})}
        showClearIcon
      />

      <CapacityInputRecord
        label={t('popover.defecationStatus')}
        title={t('popover.defecationStatus')}
        value={data.defecationStatus}
        data={defecationStatusList}
        onChange={e => onChange({defecationStatus: e})}
        showClearIcon
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

export default ExcretionRecordContent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
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
    height: 150,
    backgroundColor: Colors.WHITE,
    width: 410,
  },
  memoInputStyle: {
    height: 150,
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
});
