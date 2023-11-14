import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import PopoverRecordHeader, {RecordStatus} from './PopoverRecordHeader';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';
import {images} from '@constants/images';
import ContentPopoverRecordVital from './ContentPopoverRecordVital';
import HeaderBluetoothPopoverRecordVital from './HeaderBluetoothPopoverRecordVital';
import {
  addDataVital,
  getIsBluetoothData,
  setSelectedId,
} from '@modules/vital/vital.slice';
import {
  DataUserRecordVital,
  DataUserChangeRecordVital,
} from '@modules/vital/vital.type';
import {handleAlertConfirm} from '@modules/alerts/alert.ultils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {handleAlertNotCreateRecord} from '@modules/alerts/alert.ultils';
import {useAppDispatch, useAppSelector} from '@store/config';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';
import {TenantListItem} from '@modules/tenant/tenant.type';
import useHandleVitalRecord from '@hooks/useHandleVitalRecord';
import {
  convertVitalRecordToDataUserChangeRecordVital,
  getRecordStatus,
} from '@modules/record/record.utils';
import {RecordType, VitalRecord} from '@modules/record/record.type';

const initialData: DataUserRecordVital = {
  id: '',
  date: undefined,
  reporter: '',
  pulse: '',
  breathing: '',
  highBloodPressure: '',
  lowBloodPressure: '',
  bodyTemperature: '',
  oxygenSaturation: '',
  weight: '',
  memo: '',
  reportSetting: '',
  serviceType: '',
};

interface IPopoverRecordVitalProps {
  style?: ViewStyle;
  firstServicePlan?: string;
  data?: DataUserRecordVital;
  tenant?: TenantListItem;
  showButton?: boolean;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverRecordVital = (props: IPopoverRecordVitalProps) => {
  const {
    style,
    isShowPopover,
    setIsShowPopover,
    data = initialData,
    firstServicePlan = '',
    tenant,
    showButton = true,
  } = props;
  const dispatch = useAppDispatch();
  const {onSaveRecord} = useHandleVitalRecord();
  const {t} = useTranslation();
  const filteringDate = useAppSelector(selectFilteringDate);
  const isBluetooth = useAppSelector(getIsBluetoothData);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const tenantKanjiName = `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`;
  const initRecordData = {
    ...data,
    reporter: reporterName,
    serviceType: firstServicePlan,
  };
  const [vitalData, _setVitalData] =
    useState<DataUserRecordVital>(initRecordData);
  const isEdit = Boolean(vitalData?.id);
  const vitalDataRef = useRef<DataUserRecordVital>(initRecordData);
  const recordStatus = getRecordStatus(isEdit, vitalData.isSynced);
  const isChanged =
    JSON.stringify(vitalData) !== JSON.stringify(initRecordData);

  const setVitalData = (vitalRecordData: DataUserRecordVital) => {
    _setVitalData(vitalRecordData);
    vitalDataRef.current = vitalRecordData;
  };

  const handleChangeRecord = useCallback(
    (vitalDataChange: DataUserChangeRecordVital) => {
      setVitalData({
        ...vitalData,
        ...vitalDataChange,
      });
    },
    [vitalData],
  );

  const closePopover = () => {
    if (isChanged) {
      handleAlertConfirm(
        () => {
          handleSaveRecord();
        },
        () => {
          setVitalData(initRecordData);
          setIsShowPopover(false);
          dispatch(setSelectedId(-1));
        },
      );
    } else {
      setVitalData(initRecordData);
      setIsShowPopover(false);
    }
  };

  const openPopover = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowPopover(true);
    }
  };

  const handleSaveRecord = async () => {
    const isSuccess = await onSaveRecord({
      vitalData: vitalDataRef.current,
      tenant,
      isEdit,
    });
    if (isSuccess) {
      setIsShowPopover(false);
      dispatch(setSelectedId(-1));
      setVitalData(
        isEdit
          ? {
              ...initRecordData,
              ...vitalDataRef.current,
              isSynced: false,
            }
          : initRecordData,
      );
    }
  };

  const renderIconStatus = () => {
    if (recordStatus === RecordStatus.UnSync) {
      return (
        <FastImage
          style={styles.recordInputIcon}
          source={images.vitalRecordUnsync}
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  useEffect(() => {
    // fetch lastest Data Vital
    if (isShowPopover) {
      const records = tenant?.records;
      const lastVitalRecord = records?.filter(
        record => record.type === RecordType.Vital,
      )?.[0] as VitalRecord;
      dispatch(
        addDataVital(
          lastVitalRecord
            ? convertVitalRecordToDataUserChangeRecordVital(lastVitalRecord)
            : ({} as DataUserRecordVital),
        ),
      );
    }
  }, [isShowPopover]);

  const contentPopover = () => {
    return (
      <View style={styles.vitalContentPopover}>
        <View>
          <PopoverRecordHeader
            source={images.rinVital}
            recordName={t('popover.vital_label')}
            recordStatus={recordStatus}
            iconStatus={renderIconStatus()}
          />
        </View>
        {isBluetooth && <HeaderBluetoothPopoverRecordVital />}
        <ContentPopoverRecordVital
          vitalData={vitalData}
          updateVitalData={handleChangeRecord}
        />
      </View>
    );
  };

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <BaseTooltip
        showHeader
        isVisible={isShowPopover}
        placement="right"
        onClose={closePopover}
        closeOnBackgroundInteraction={false}
        closeOnContentInteraction={false}
        contentStyle={styles.popoverContentStyle}
        leftButtonText={t('user_list.close')}
        rightButtonText={t('common.save')}
        onLeftButtonPress={closePopover}
        title={tenantKanjiName}
        subTitle={t('user_list.sama')}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={!isChanged}
        content={contentPopover()}>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      {showButton && (
        <BaseButton onPress={openPopover}>
          <FastImage
            style={styles.recordInputIcon}
            source={images.rinVital}
            resizeMode="contain"
          />
        </BaseButton>
      )}
    </View>
  );
};

export default React.memo(PopoverRecordVital);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: -500,
    width: 540,
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  vitalContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 15,
    gap: 10,
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
