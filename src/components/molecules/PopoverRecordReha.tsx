import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import BaseText from '@atoms/BaseText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import RehaRecordContent, {
  TRehaRecordData,
  TRehaRecordDataChange,
} from '@organisms/RehaRecordContent';
import {
  handleAlertConfirm,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';

interface IPopoverRecordRehaProps {
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  practiceContent?: string;
  performStatus?: string;
  time?: string;
}

const initialRehaData: TRehaRecordData = {
  reporter: '山下 達郎',
  category1: '歩行訓練',
  category2: '個別',
  practiceContent: '室内歩行（介護あり）',
  remarkContent: [
    {
      label: 'メニューの特記',
      content:
        'タイムアウトが発生しました。/サーバーやネットワークが混み合っている可能性があります。',
    },
    {
      label: 'グスケール',
      content:
        '入浴方法が登録されていません。\n・ファーストケア本体で\n・あらかじめ設定してください',
    },
  ],
  performStatus: '',
  postponeReason: '',
  rehaTime: '',
  target: '',
  perform: {
    weight: '',
    count: '',
    times: '',
  },
  borgScale: '',
  completedLevel: 'なし',
  memo: '',
};

const PopoverRecordReha = (props: IPopoverRecordRehaProps) => {
  const {
    isShowPopover,
    setIsShowPopover,
    practiceContent,
    performStatus,
    time,
  } = props;
  const {t} = useTranslation();
  const [recordData, setRecordData] = useState(initialRehaData);

  const handleChangeRecord = useCallback(
    (recordChange: TRehaRecordDataChange) => {
      setRecordData(state => ({...state, ...recordChange}));
    },
    [],
  );

  const hidePopover = () => {
    setIsShowPopover(false);
    setRecordData(initialRehaData);
  };

  const cancelSaveRecord = () => {
    if (JSON.stringify(recordData) !== JSON.stringify(initialRehaData)) {
      handleAlertConfirm(
        () => {
          setIsShowPopover(false);
          setRecordData(initialRehaData);
        },
        () => {
          setIsShowPopover(false);
          setRecordData(initialRehaData);
        },
      );
    } else {
      hidePopover();
    }
  };

  // TODO: handle save reha record
  const handleSaveRehaRecord = () => {
    handleAlertSave(
      () => {
        hidePopover();
      },
      () => null,
    );
  };

  const getStatusColor = () => {
    if (performStatus === t('tsusho_vp_list.cancelRehaExercise')) {
      return Colors.PLUM_RED;
    } else if (performStatus === t('common.perform')) {
      return Colors.TEXT_SECONDARY;
    }
    return Colors.TEXT_PRIMARY;
  };

  const contentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.rehaContentPopover}>
        <RehaRecordContent data={recordData} onChange={handleChangeRecord} />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <BaseTooltip
      showHeader
      isVisible={isShowPopover}
      placement="right"
      onClose={hidePopover}
      closeOnBackgroundInteraction={false}
      closeOnContentInteraction={false}
      contentStyle={styles.popoverContentStyle}
      leftButtonText={t('user_list.close')}
      rightButtonText={t('common.save')}
      onLeftButtonPress={cancelSaveRecord}
      onRightButtonPress={handleSaveRehaRecord}
      disabledRightButton={
        JSON.stringify(recordData) === JSON.stringify(initialRehaData)
      }
      title={'山下達郎'} // TODO: replace by name of user later
      subTitle={t('user_list.sama')}
      content={contentPopover()}>
      <View style={styles.container}>
        <BaseText text={practiceContent} />
        <BaseText color={getStatusColor()} text={performStatus} />
        <BaseText text={time} />
      </View>
    </BaseTooltip>
  );
};

export default PopoverRecordReha;

const styles = StyleSheet.create({
  popoverContentStyle: {
    width: 570,
    height: 700,
  },
  container: {
    width: '100%',
  },
  rehaContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
  },
});
