import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import RecordContentItem from '@molecules/RecordContentItem';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import PopoverRecordHeader from '@molecules/PopoverRecordHeader';
import SlideTabButtons from '@molecules/SlideTabButtons';
import TypingInputRecord from '@molecules/TypingInputRecord';
import BaseTextInput from '@molecules/BaseTextInput';
import RehaTargetSection from '@molecules/RehaTargetSection';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import ItemPicker, {TRehaTarget} from './ItemPicker';
import PopoverRemark, {TRemark} from '@molecules/PopoverRemark';
import StartEndTimePicker from './StartEndTimePicker';

export type TRehaRecordData = {
  reporter: string;
  category1: string;
  category2: string;
  practiceContent: string;
  remarkContent: TRemark[];
  performStatus: string;
  postponeReason: string;
  rehaTime: string;
  target: string;
  perform: TRehaTarget;
  borgScale: string;
  completedLevel: string;
  memo: string;
};

export type TRehaRecordDataChange = {
  reporter?: string;
  category1?: string;
  category2?: string;
  practiceContent?: string;
  remarkContent?: TRemark[];
  performStatus?: string;
  postponeReason?: string;
  rehaTime?: string;
  target?: string;
  perform?: TRehaTarget;
  borgScale?: string;
  completedLevel?: string;
  memo?: string;
};

// TODO: Mock data remove later
const postponeReasonList = [
  {
    id: '0',
    label: '接入力',
  },
  {
    id: '1',
    label: '供中',
  },
  {
    id: '2',
    label: 'る',
  },
  {
    id: '3',
    label: '',
  },
];

const borgScaleList = [
  {
    id: '0',
    label: '',
  },
  {
    id: '1',
    label: '6:達成',
  },
  {
    id: '2',
    label: '7:状況訓練',
  },
  {
    id: '3',
    label: '8:',
  },
  {
    id: '4',
    label: '9:中止にす',
  },
  {
    id: '5',
    label: '10:',
  },
  {
    id: '6',
    label: '11: 欠席に',
  },
  {
    id: '7',
    label: '',
  },
];

interface IRehaRecordContentProps {
  data: TRehaRecordData;
  onChange: (e: TRehaRecordDataChange) => void;
}

const RehaRecordContent = (props: IRehaRecordContentProps) => {
  const {data, onChange} = props;
  const {t} = useTranslation();
  const [tabStatusIndex, setTabStatusIndex] = useState(0);
  const [tabCompletedIndex, setTabCompletedIndex] = useState(0);
  const performStatusList = [
    t('common.perform'),
    t('tsusho_vp_list.cancelRehaExercise'),
  ];
  const completedLevelList = [
    t('common.not_have'),
    t('popover.enable_complete_target'),
    t('popover.not_enable_complete_target'),
    t('popover.complete_target'),
  ];

  return (
    <View style={styles.container}>
      <PopoverRecordHeader
        style={styles.headerRecord}
        recordNameColor={Colors.BLACK}
        recordName="個人メニュー記録"
        showIcon={false}
      />
      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.reporter}
        />
      </RecordContentItem>
      <RecordContentItem disable title={`${t('popover.category')}1`}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.category1}
        />
      </RecordContentItem>
      <RecordContentItem disable title={`${t('popover.category')}2`}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.category2}
        />
      </RecordContentItem>
      <RecordContentItem disable title={t('popover.practice_content')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.practiceContent}
        />
      </RecordContentItem>
      <RecordContentItem disable title={t('popover.remark')}>
        <View style={styles.remarkView}>
          <PopoverRemark placement="right" data={data.remarkContent[0]} />
          <PopoverRemark placement="right" data={data.remarkContent[1]} />
        </View>
      </RecordContentItem>
      <RecordContentItem disable title={t('common.perform_status')}>
        <SlideTabButtons
          tabWidth={90}
          tabHeight={25}
          notInitial={!data.performStatus.length}
          tabContents={performStatusList}
          chosenTabIndex={tabStatusIndex}
          setChosenTabIndex={setTabStatusIndex}
          onChooseItem={index => {
            if (index === 1) {
              onChange({completedLevel: ''});
            } else {
              onChange({postponeReason: ''});
            }
            onChange({performStatus: performStatusList[index]});
          }}
        />
      </RecordContentItem>
      <TypingInputRecord
        label={t('popover.postpone_reason')}
        title={t('popover.postpone_reason')}
        value={data.postponeReason}
        placeholder={
          !data.performStatus.length
            ? t('popover.not_any_select')
            : data.performStatus === performStatusList[0]
            ? t('popover.perform_done')
            : ''
        }
        editable={data.performStatus === performStatusList[1]}
        data={postponeReasonList}
        onChange={e => onChange({postponeReason: e})}
        maxLength={20}
      />
      <StartEndTimePicker
        disabled={data.performStatus !== performStatusList[0]}
        postponePerform={data.performStatus === performStatusList[1]}
        notAnySelectedItem={!data.performStatus.length}
        label={t('popover.deliver_time')}
        title={t('popover.deliver_time')}
        value={data.rehaTime}
        onChange={e => onChange({rehaTime: e})}
      />
      <RecordContentItem disable title={t('popover.perform_target')}>
        <RehaTargetSection />
      </RecordContentItem>
      <ItemPicker
        postponePerform={data.performStatus === performStatusList[1]}
        notAnySelectedItem={!data.performStatus.length}
        value={data.perform}
        label={t('popover.perform_actual')}
        title={t('popover.perform_actual')}
        disabled={data.performStatus !== performStatusList[0]}
        onChange={e => {
          const newValue = {
            weight: e.weight,
            count: e.count,
            times: e.times,
          };
          onChange({perform: newValue});
        }}
      />
      <CapacityInputRecord
        postponePerform={data.performStatus === performStatusList[1]}
        notAnySelectedItem={!data.performStatus.length}
        label={t('popover.borg_scale')}
        title={t('popover.borg_scale')}
        value={data.borgScale}
        data={borgScaleList}
        onChange={e => onChange({borgScale: e})}
        disable={data.performStatus !== performStatusList[0]}
      />
      <RecordContentItem disable title={t('popover.finished_level')}>
        <SlideTabButtons
          disabled={
            !data.performStatus.length ||
            data.performStatus === performStatusList[1]
          }
          tabWidth={66}
          tabHeight={25}
          tabContents={completedLevelList}
          chosenTabIndex={tabCompletedIndex}
          setChosenTabIndex={setTabCompletedIndex}
          onChooseItem={index =>
            onChange({completedLevel: completedLevelList[index]})
          }
        />
      </RecordContentItem>
      <RecordContentItem
        titleStyle={styles.memoLabel}
        leftViewStyle={styles.contentLeftMemoView}
        disable
        title={t('popover.memo')}>
        <BaseTextInput
          editable={!!data.performStatus.length}
          onChangeText={e => onChange({memo: e})}
          value={data.memo}
          multiline
          containerStyle={styles.memoViewStyle}
          style={styles.memoInputStyle}
        />
      </RecordContentItem>
    </View>
  );
};

export default RehaRecordContent;

const styles = StyleSheet.create({
  container: {},
  headerRecord: {
    marginLeft: 0,
    backgroundColor: Colors.GRAY_BORDER,
    paddingVertical: 10,
  },
  contentLeftMemoView: {
    height: '100%',
    width: 110,
  },
  memoLabel: {
    marginTop: 15,
  },
  memoViewStyle: {
    height: 180,
    backgroundColor: Colors.WHITE,
    width: 410,
  },
  memoInputStyle: {
    height: 180,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: 410,
  },
  remarkView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
  },
});
