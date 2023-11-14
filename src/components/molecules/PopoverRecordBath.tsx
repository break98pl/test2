import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useState, useCallback, useRef, useEffect, useMemo} from 'react';
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
} from '@modules/alerts/alert.ultils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {useAppSelector} from '@store/config';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';
import useHandleBathRecord from '@hooks/useHandleBathRecord';
import {TenantListItem} from '@modules/tenant/tenant.type';
import {getStatuOfRecord} from '@modules/record/record.utils';
import {t} from 'i18next';
import {BathCategory} from '@modules/record/record.type';

const initialBathData: TBathRecordData = {
  id: '',
  fkUser: '',
  recordDate: new Date().toISOString(),
  serviceType: '',
  timeZone: BathCategory.Custom,
  timeValue: new Date(''),
  reporter: '',
  bathStatus: t('common.perform'),
  bathMethod: '',
  memo: '',
  settingReport: '',
};

interface IPopoverRecordBathProps {
  tenantKanjiName?: string;
  firstServicePlan?: string;
  data?: TBathRecordData;
  tenant?: TenantListItem;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  showButton?: boolean;
  style?: ViewStyle;
}

const PopoverRecordBath = (props: IPopoverRecordBathProps) => {
  const {
    firstServicePlan = '',
    data = initialBathData,
    tenant,
    isShowPopover,
    showButton = true,
    setIsShowPopover,
    style,
  } = props;
  const inputData = {...data};
  const [enableSaveButton, setEnableSaveButton] = useState<boolean>(false);
  const {onSaveRecord} = useHandleBathRecord();
  const tenantKanjiName = `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`;
  const {t} = useTranslation();
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const initRecordData = Object.assign(data, {
    fkUser: tenant?.tenantCode ? tenant?.tenantCode : '',
    familyName: reporterName,
    serviceType: firstServicePlan,
    reporter: selectedStaff?.staffCode,
  });
  const recordDataRef = useRef<TBathRecordData>(initRecordData);
  const [recordData, setRecordData] = useState<TBathRecordData>(initRecordData);
  const isEdit = Boolean(recordData?.id);

  const handleRecordData = (bathRecordData: TBathRecordData) => {
    setRecordData(bathRecordData);
    recordDataRef.current = bathRecordData;
  };

  
  useEffect(() => {
    if (isEdit) {
      handleRecordData(inputData);
    }
  }, [data, isEdit, isShowPopover, firstServicePlan]);

  const recordStatus = useMemo(
    () =>
      getStatuOfRecord(
        isEdit,
        recordData.isSynced !== undefined ? recordData.isSynced : true,
        recordData.isAPRecord !== undefined ? recordData.isAPRecord : false,
        recordData.fkUser!,
        recordData.recordDate,
        recordData.reporter!,
      ),
    [isEdit, recordData],
  );

  const handleSaveRecord = useCallback(
    async (isClose?: boolean) => {
      const isSaveSuccess = await onSaveRecord({
        recordData: recordDataRef.current,
        tenant: tenant,
        isEdit: isEdit,
        isClose: isClose,
      });
      if (isSaveSuccess) {
        handleRecordData(initRecordData);
        hidePopover();
      }
    },
    [tenant, selectedStaff],
  );

  const hidePopover = () => {
    setIsShowPopover(false);
    handleRecordData(initRecordData);
    setEnableSaveButton(false);
  };

  const cancelSaveRecord = async () => {
    if (enableSaveButton) {
      handleAlertConfirm(
        async () => {
          await handleSaveRecord(true);
        },
        () => {
          hidePopover();
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
      handleRecordData({
        ...recordData,
        ...recordChange,
      });
      setEnableSaveButton(true);
    },
    [recordData],
  );

  const renderIconStatus = () => {
    if (recordStatus === RecordStatus.UnSync) {
      return (
        <FastImage
          style={styles.unSyncIcon}
          source={images.bathRecordUnsync}
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  const contentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.bathContentPopover}>
        <PopoverRecordHeader
          source={images.rinBath}
          recordName={t('bath.bottom_tab_label')}
          recordStatus={recordStatus}
          iconStatus={renderIconStatus()}
        />
        <BathRecordContent
          onChange={handleChangeRecord}
          data={recordData}
          enableEdit={
            recordStatus === RecordStatus.Create ||
            recordStatus === RecordStatus.UnSync
          }
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
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
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={!enableSaveButton}
        title={tenantKanjiName}
        subTitle={t('user_list.sama')}
        content={contentPopover()}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      {showButton && (
        <BaseButton onPress={openPopover}>
          <FastImage
            style={styles.recordInputIcon}
            source={images.rinBath}
            resizeMode="contain"
          />
        </BaseButton>
      )}
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
  unSyncIcon: {
    width: 23,
    height: 23,
    left: 20,
  },
});
