import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useState, useCallback, useRef, useEffect} from 'react';
import PopoverRecordHeader, {RecordStatus} from './PopoverRecordHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import ExcretionRecordContent, {
  TExcretionRecordData,
  TExcretionRecordDataChange,
} from '@organisms/ExcretionRecordContent';
import BaseButton from '@atoms/BaseButton';
import ExcretionRecordTemplate, {
  IExcretionTemplate,
} from '@organisms/ExcretionRecordTemplate';
import SlideTabButtons from './SlideTabButtons';
import RecordContentItem from './RecordContentItem';
import {selectIsUseTemplateExcretion} from '@modules/setting/setting.slice';
import BaseTooltip from '@templates/BaseTooltip';
import {images} from '@constants/images';
import {
  handleAlertConfirm,
  handleAlertNotCreateRecord,
} from '@modules/alerts/alert.ultils';
import {
  checkIsFutureDate,
  convertDateToDateTime,
} from '@modules/tenant/tenant.utils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {useAppSelector} from '@store/config';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';
import {TenantListItem} from '@modules/tenant/tenant.type';
import useHandleExcretionRecord from '@hooks/useHandleExcretionRecord';
import {getStatuOfRecord} from '@modules/record/record.utils';
import moment from 'moment';

const initialExcretionData: TExcretionRecordData = {
  id: '',
  recordDate: '',
  reporter: '',
  serviceType: '',
  incontinence: 'なし',
  excretionTool: '',
  excrete: '',
  urineVolume: '',
  urineStatus: '',
  defecationVolume: '',
  defecationStatus: '',
  memo: '',
  settingReport: '',
  excreteTools: [],
  settingScreenId: '',
  setNo: 0,
  periodSelectedItem: -1,
  familyName: '',
  updateUser: '',
  fkUser: '',
  updateUserInfor: '',
};

interface IPopoverRecordExcretionProps {
  firstServicePlan?: string;
  tenant?: TenantListItem;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  showButton?: boolean;
  style?: ViewStyle;
  data?: TExcretionRecordData;
}

const PopoverRecordExcretion = (props: IPopoverRecordExcretionProps) => {
  const {
    firstServicePlan = '',
    tenant,
    isShowPopover,
    setIsShowPopover,
    showButton = true,
    style,
    data = initialExcretionData,
  } = props;
  const inputData = {...data};
  const tenantKanjiName = `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`;

  const {t} = useTranslation();
  const [hideSlideTab, setHideSlideTab] = useState(false);
  const [tabRecordIndex, setRecordTabIndex] = useState(0);
  const [enableSaveButton, setEnableSaveButton] = useState<boolean>(false);
  const tabRecordList = [t('popover.template'), t('popover.key')];
  const isUseTemplateExcretion = useAppSelector(selectIsUseTemplateExcretion);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const initRecordData = Object.assign(data, {
    fkUser: tenant?.tenantCode ? tenant?.tenantCode : '',
    familyName: reporterName,
    serviceType: firstServicePlan,
    reporter: selectedStaff?.staffCode,
    recordDate: convertDateToDateTime(filteringDate).toISOString(),
  });

  const [recordData, _setRecordData] =
    useState<TExcretionRecordData>(initRecordData);

  const isEdit = Boolean(recordData?.id);

  const setRecordData = (_data: TExcretionRecordData) => {
    _setRecordData(_data);
    recordDataRef.current = _data;
  };

  const recordStatus = getStatuOfRecord(
    isEdit,
    recordData.isSynced !== undefined ? recordData.isSynced : true,
    recordData.isAPRecord !== undefined ? recordData.isAPRecord : false,
    recordData.fkUser!,
    recordData.recordDate,
    recordData.reporter!,
  );

  const {onSaveRecord} = useHandleExcretionRecord();

  const recordDataRef = useRef<TExcretionRecordData>(initRecordData);

  const isTemplate = tabRecordIndex === 0;

  const renderIconStatus = () => {
    if (recordStatus === RecordStatus.UnSync) {
      return (
        <FastImage
          style={styles.unSyncIcon}
          source={images.excretionRecordUnsync}
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  useEffect(() => {
    if (isEdit) {
      setRecordTabIndex(1);
      setHideSlideTab(true);
      setRecordData(inputData);
    }
  }, [data, isEdit, isShowPopover, firstServicePlan]);

  useEffect(() => {
    if (isTemplate) {
      setRecordData({...initRecordData, recordDate: recordData.recordDate});
    } else {
      setRecordData({...initRecordData, recordDate: recordData.recordDate});
    }
  }, [tabRecordIndex]);

  const hidePopover = () => {
    setIsShowPopover(false);
    setHideSlideTab(false);
    setRecordData(initRecordData);
    setEnableSaveButton(false);
  };

  const cancelSaveRecord = () => {
    if (enableSaveButton && !isTemplate) {
      handleAlertConfirm(
        () => {
          handleSaveRecord(true);
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
      if (!isUseTemplateExcretion) {
        setRecordTabIndex(1);
      } else {
        setRecordTabIndex(0);
      }
      setIsShowPopover(true);
    }
  };

  const handleChangeRecord = useCallback(
    (recordChange: TExcretionRecordDataChange) => {
      setRecordData({
        ...recordData,
        ...recordChange,
      });
      setEnableSaveButton(true);
    },
    [recordData],
  );

  //Handle save record to local storage
  const handleSaveRecord = async (
    isClose?: boolean,
    item?: IExcretionTemplate,
  ) => {
    const isSaveSuccess = await onSaveRecord({
      item: item,
      isEdit: isEdit,
      recordData: recordDataRef.current,
      tenant: tenant,
      isTemplate: isTemplate,
      isClose: isClose,
    });
    if (isSaveSuccess) {
      setRecordData(initRecordData);
      hidePopover();
    }
  };

  const templateInputContentPopover = () => {
    return (
      <View style={styles.excretionContentPopover}>
        <PopoverRecordHeader
          source={images.rinExcretion}
          label={t('popover.create_record_at')}
          showRecordDate
          showIcon={false}
          recordStatus={recordStatus}
          iconStatus={renderIconStatus()}
          defaultDate={
            recordData.recordDate
              ? moment(recordData.recordDate).toDate()
              : undefined
          }
          onConfirmDate={e =>
            setRecordData({...recordData, recordDate: e.toISOString()})
          }
        />
        <RecordContentItem
          style={styles.templateTabView}
          showLabel={false}
          disable>
          <SlideTabButtons
            tabWidth={130}
            tabHeight={25}
            tabContents={tabRecordList}
            chosenTabIndex={tabRecordIndex}
            setChosenTabIndex={setRecordTabIndex}
          />
        </RecordContentItem>
        <ExcretionRecordTemplate
          dataServicePlan={firstServicePlan}
          onSelectedItem={item => handleSaveRecord(false, item)}
        />
      </View>
    );
  };

  const keyInputContentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.excretionContentPopover}>
        <PopoverRecordHeader
          source={images.rinExcretion}
          recordName={t('popover.excretion_label')}
          recordStatus={recordStatus}
          iconStatus={renderIconStatus()}
          serviceCode={recordData.serviceCode}
        />
        {!hideSlideTab && isUseTemplateExcretion && (
          <RecordContentItem disable>
            <SlideTabButtons
              tabWidth={160}
              tabHeight={25}
              tabContents={tabRecordList}
              chosenTabIndex={tabRecordIndex}
              setChosenTabIndex={setRecordTabIndex}
            />
          </RecordContentItem>
        )}
        <ExcretionRecordContent
          data={recordData}
          onChange={handleChangeRecord}
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
        contentStyle={
          tabRecordIndex === 0
            ? styles.popoverTemplateStyle
            : styles.popoverContentStyle
        }
        leftButtonText={t('user_list.close')}
        rightButtonText={!isTemplate ? t('common.save') : ''}
        onLeftButtonPress={cancelSaveRecord}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={!enableSaveButton}
        title={tenantKanjiName}
        subTitle={t('user_list.sama')}
        content={
          tabRecordIndex === 0
            ? templateInputContentPopover()
            : keyInputContentPopover()
        }>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      {showButton && (
        <BaseButton onPress={openPopover}>
          <FastImage
            style={styles.recordInputIcon}
            source={images.rinExcretion}
            resizeMode="contain"
          />
        </BaseButton>
      )}
    </View>
  );
};

export default PopoverRecordExcretion;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -550,
    width: 590,
    position: 'absolute',
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  excretionContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 15,
  },
  popoverContentStyle: {
    width: 570,
    height: 730,
  },
  popoverTemplateStyle: {
    width: 330,
    height: 730,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  templateTabView: {
    alignItems: 'center',
  },
  unSyncIcon: {
    width: 23,
    height: 23,
    left: 20,
  },
});
