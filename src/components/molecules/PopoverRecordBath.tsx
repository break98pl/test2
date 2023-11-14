import {StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import PopoverRecordHeader, {RecordStatus} from './PopoverRecordHeader';

import BathRecordContent, {
  TBathRecordData,
  TBathRecordDataChange,
} from '@organisms/BathRecordContent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';
import {images} from '@constants/images';
import {
  handleAlertConfirm,
  handleAlertNotCreateRecord,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {useAppSelector} from '@store/config';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';

const initialBathData: TBathRecordData = {
  recordDate: new Date().toISOString(),
  serviceType: '',
  timeZone: '時間入力',
  timeValue: new Date(''),
  reporter: '山下 達郎',
  bathStatus: '実施',
  bathMethod: '',
  memo: '',
  settingReport: '',
};

interface IPopoverRecordBathProps {
  tenantKanjiName?: string;
  firstServicePlan?: string;
}

const PopoverRecordBath = (props: IPopoverRecordBathProps) => {
  const {tenantKanjiName = '', firstServicePlan = ''} = props;
  const {t} = useTranslation();
  const [isShowPopover, setIsShowPopover] = useState(false);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const [recordData, setRecordData] = useState<TBathRecordData>(
    Object.assign(initialBathData, {
      reporter: reporterName,
      serviceType: firstServicePlan,
    }),
  );

  const hidePopover = () => {
    setIsShowPopover(false);
    setRecordData(initialBathData);
  };

  const cancelSaveRecord = () => {
    if (JSON.stringify(recordData) !== JSON.stringify(initialBathData)) {
      handleAlertConfirm(
        () => {
          setIsShowPopover(false);
          setRecordData(initialBathData);
        },
        () => {
          setIsShowPopover(false);
          setRecordData(initialBathData);
        },
      );
    } else {
      hidePopover();
    }
  };

  const openPopover = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowPopover(true);
    }
  };

  const handleChangeRecord = useCallback(
    (recordChange: TBathRecordDataChange) => {
      setRecordData(state => ({...state, ...recordChange}));
    },
    [],
  );

  // TODO: handle save bath record
  const handleSaveBathRecord = () => {
    handleAlertSave(
      () => {
        hidePopover();
      },
      () => null,
    );
  };

  const contentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.bathContentPopover}>
        <PopoverRecordHeader
          source={images.rinBath}
          recordName={t('bath.bottom_tab_label')}
          recordStatus={RecordStatus.DoneAndNotEdit}
        />
        <BathRecordContent onChange={handleChangeRecord} data={recordData} />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <View style={styles.container}>
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
        onRightButtonPress={handleSaveBathRecord}
        disabledRightButton={
          JSON.stringify(recordData) === JSON.stringify(initialBathData)
        }
        title={tenantKanjiName}
        subTitle={t('user_list.sama')}
        content={contentPopover()}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      <BaseButton onPress={openPopover}>
        <FastImage
          style={styles.recordInputIcon}
          source={images.rinBath}
          resizeMode="contain"
        />
      </BaseButton>
    </View>
  );
};

export default PopoverRecordBath;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -600,
    width: 640,
    position: 'absolute',
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  bathContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 15,
  },
  popoverContentStyle: {
    width: 570,
    height: 700,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
});
