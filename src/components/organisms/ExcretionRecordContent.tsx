import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {TextListItem} from './SelectionList';
import {MasterItems} from '@modules/record/masterItem';
import moment from 'moment';

export type TExcretionRecordData = {
  id: string;
  recordDate: string;
  reporter: string;
  serviceType: string;
  incontinence: string;
  excretionTool?: string;
  excreteTools?: TextListItem[];
  excrete: string;
  urineVolume: string;
  urineStatus: string;
  defecationVolume: string;
  defecationStatus: string;
  memo: string;
  settingReport?: string; //deadline
  settingScreenId?: string; // SetteiGamenID
  setNo?: number;
  periodSelectedItem?: number;
  familyName?: string;
  updateUser?: string;
  fkUser?: string; //user code
  updateUserInfor?: string;
  isSynced?: boolean;
  type?: string;
  warningDueDate?: string;
  isAPRecord?: boolean;
  periodSelectedIndex?: string;
  job?: string;
  serviceCode?: string;
};

export type TExcretionRecordDataChange = {
  recordDate?: string;
  reporter?: string;
  serviceType?: string;
  incontinence?: string;
  excretionTool?: string;
  excreteTools?: TextListItem[];
  excrete?: string;
  urineVolume?: string;
  urineStatus?: string;
  defecationVolume?: string;
  defecationStatus?: string;
  memo?: string;
  settingReport?: string;
  periodSelectedIndex?: string;
};

interface IExcretionRecordContentProps {
  data: TExcretionRecordData;
  onChange: (e: TExcretionRecordDataChange) => void;
  style?: ViewStyle;
  enableEdit?: boolean;
}

const ExcretionRecordContent = (props: IExcretionRecordContentProps) => {
  const {data, onChange, style, enableEdit = true} = props;
  const {t} = useTranslation();
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const [masterExcretionOutput, setMasterExcretionOutput] = useState<any[]>([]);
  const masterIncontinence = MasterItems.getMasterIncontinence();
  const getMasterExcretionOutput = async () => {
    const newDatas = await MasterItems.getMasterExcretionOutputs();
    setMasterExcretionOutput(newDatas ? newDatas : []);
  };
  useEffect(() => {
    getMasterExcretionOutput();
  }, []);
  return (
    <View
      style={StyleSheet.compose(styles.container, style)}
      pointerEvents={enableEdit ? 'auto' : 'none'}>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        onChange={e => onChange({recordDate: e})}
        defaultDate={
          data.recordDate ? moment(data.recordDate).toDate() : undefined
        }
        allowChangeDefaultDate
        isFullWidth
      />

      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.familyName}
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
        data={masterIncontinence}
        onChange={e => onChange({incontinence: e})}
      />

      <CapacityInputRecord
        label={t('popover.excrete')}
        title={t('popover.excrete')}
        value={data.excrete}
        data={masterExcretionOutput[4]}
        values={data.excreteTools}
        onChange={e => onChange({excrete: e})}
        onChangelistSelectedValue={e =>
          onChange({excreteTools: e.rawData, excrete: e.handleData})
        }
        isMultipleChoice
      />

      <TypingInputRecord
        label={t('popover.urineVolume')}
        title={t('popover.urineVolume')}
        value={data.urineVolume}
        data={masterExcretionOutput[0]}
        onChange={e => onChange({urineVolume: e})}
        maxLength={51}
        isNumber={true}
        showInfoIcon={enableEdit}
      />

      <CapacityInputRecord
        label={t('popover.urineStatus')}
        title={t('popover.urineStatus')}
        value={data.urineStatus}
        data={masterExcretionOutput[1]}
        onChange={e => onChange({urineStatus: e})}
        showClearIcon={enableEdit}
      />

      <CapacityInputRecord
        label={t('popover.defecationVolume')}
        title={t('popover.defecationVolume')}
        value={data.defecationVolume}
        data={masterExcretionOutput[2]}
        onChange={e => onChange({defecationVolume: e})}
        showClearIcon={enableEdit}
      />

      <CapacityInputRecord
        label={t('popover.defecationStatus')}
        title={t('popover.defecationStatus')}
        value={data.defecationStatus}
        data={masterExcretionOutput[3]}
        onChange={e => onChange({defecationStatus: e})}
        showClearIcon={enableEdit}
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
          maxLength={1000}
        />
      </RecordContentItem>

      <ReportInputRecord
        value={data.settingReport ? data.settingReport : ''}
        display={data.warningDueDate}
        onChange={(e, id) =>
          onChange({settingReport: e, periodSelectedIndex: id})
        }
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
