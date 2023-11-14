import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PopoverRecordHeader, {RecordStatus} from './PopoverRecordHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import ElapsedRecordContent from '@organisms/ElapsedRecordContent';
import RecordContentItem from './RecordContentItem';
import SlideTabButtons from './SlideTabButtons';
import ElapsedRecordTemplate from '@organisms/ElapsedRecordTemplate';
import BaseButton from '@atoms/BaseButton';
import {images} from '@constants/images';
import BaseTooltip from '@templates/BaseTooltip';
import {
  selectIsAllowMultipleOptions,
  selectIsElapsedDefault,
} from '@modules/setting/setting.slice';
import {
  handleAlertChooseAtLeastOne,
  handleAlertConfirm,
  handleAlertNotCreateRecord,
} from '@modules/alerts/alert.ultils';
import BaseText from '@atoms/BaseText';
import {
  selectAppType,
  selectChoseServiceName,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {getUserLabel} from '@modules/tenant/tenant.utils';
import {
  TElapsedRecordData,
  TElapsedRecordDataChange,
} from '@modules/elapsed/elapsed.type';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {useAppSelector} from '@store/config';
import {TenantListItem} from '@modules/tenant/tenant.type';
import useHandleElapsedRecord from '@hooks/useHandleElapsedRecord';
import {getRecordStatus} from '@modules/record/record.utils';

const initialElapsedData: TElapsedRecordData = {
  id: '',
  recordDate: '',
  placeTemplate: '',
  placeKey: '',
  classification: '',
  reporter: '',
  serviceType: '',
  registerPhoto: '',
  content: '',
  settingReport: '',
};

interface IPopoverRecordElapsedProps {
  style?: ViewStyle;
  registerAllButton?: boolean;
  arrowStyle?: ViewStyle;
  allowRegister?: boolean;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  data?: TElapsedRecordData;
  count?: number;
  notAllowEditDate?: boolean;
  firstServicePlan?: string;
  tenant?: TenantListItem;
  showButton?: boolean;
}

const PopoverRecordElapsed = (props: IPopoverRecordElapsedProps) => {
  const {
    style,
    registerAllButton,
    arrowStyle,
    allowRegister = true,
    isShowPopover,
    setIsShowPopover,
    data = initialElapsedData,
    count = 0,
    notAllowEditDate,
    firstServicePlan = '',
    tenant,
    showButton = true,
  } = props;

  const {t} = useTranslation();
  const tabRecordList = [t('popover.template'), t('popover.key')];
  const isElapsedDefault = useAppSelector(selectIsElapsedDefault);
  const isAllowMultipleOptions = useAppSelector(selectIsAllowMultipleOptions);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [tabRecordIndex, setRecordTabIndex] = useState(0);
  const [hideSlideTab, setHideSlideTab] = useState(false);
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const initRecordData = {
    ...data,
    reporter: reporterName,
    serviceType: firstServicePlan,
  };
  const [recordData, _setRecordData] =
    useState<TElapsedRecordData>(initRecordData);
  const recordDataRef = useRef<TElapsedRecordData>(initRecordData);
  const isTemplate = tabRecordIndex === 0;
  const isEdit = Boolean(recordData?.id);
  const recordStatus = getRecordStatus(isEdit, recordData.isSynced);
  const tenantKanjiName = `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`;

  const {onSaveRecord} = useHandleElapsedRecord();

  const setRecordData = (elapsedRecordData: TElapsedRecordData) => {
    _setRecordData(elapsedRecordData);
    recordDataRef.current = elapsedRecordData;
  };

  useEffect(() => {
    if (isEdit) {
      setRecordTabIndex(1);
      setHideSlideTab(true);
      setRecordData(data);
    }
  }, [data, isEdit]);

  useEffect(() => {
    setRecordData(initRecordData);
  }, [tabRecordIndex]);

  const hidePopover = () => {
    setIsShowPopover(false);
    setHideSlideTab(false);
    setRecordData(initRecordData);
    if (!isAllowMultipleOptions) {
      setIsMultipleChoice(false);
    }
    if (!isElapsedDefault) {
      setRecordTabIndex(0);
    }
  };

  const cancelSaveRecord = () => {
    if (JSON.stringify(recordData) !== JSON.stringify(initRecordData)) {
      handleAlertConfirm(
        () => {
          hidePopover();
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
    if (!allowRegister) {
      handleAlertChooseAtLeastOne(
        t(getUserLabel(appType, serviceName), {text: ''}),
      );
    } else if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowPopover(true);
      if (isElapsedDefault) {
        setRecordTabIndex(0);
      } else {
        setRecordTabIndex(1);
      }
      if (isAllowMultipleOptions) {
        setIsMultipleChoice(true);
      } else {
        setIsMultipleChoice(false);
      }
    }
  };

  const handleChangeRecord = useCallback(
    (recordChange: TElapsedRecordDataChange) => {
      setRecordData({
        ...recordData,
        ...recordChange,
      });
    },
    [recordData],
  );

  const handleSaveRecord = useCallback(async () => {
    const isChangePhoto =
      data.registerPhoto !== recordDataRef.current.registerPhoto;
    const isSaveSuccess = await onSaveRecord({
      recordData: recordDataRef.current,
      tenant,
      isEdit,
      isTemplate,
      isChangePhoto,
    });
    if (isSaveSuccess) {
      setRecordData(initRecordData);
      hidePopover();
    }
  }, [tenant, hideSlideTab, appType, isTemplate, selectedStaff]);

  const renderIconStatus = () => {
    if (recordStatus === RecordStatus.UnSync) {
      return (
        <FastImage
          style={styles.unSyncIcon}
          source={images.elapsedRecordUnsync}
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  const templateInputContentPopover = () => {
    return (
      <View style={styles.elapsedContentPopover}>
        <PopoverRecordHeader
          source={images.rinElapsed}
          recordName={t('elapsed.bottom_tab_label')}
          recordStatus={getRecordStatus(isEdit, recordData.isSynced)}
          iconStatus={renderIconStatus()}
        />
        <RecordContentItem
          style={styles.templateTabView}
          showLabel={false}
          disable>
          <View style={styles.tabsViewHeader}>
            <SlideTabButtons
              tabWidth={160}
              tabHeight={25}
              tabContents={tabRecordList}
              chosenTabIndex={tabRecordIndex}
              setChosenTabIndex={setRecordTabIndex}
            />
            <BaseButton
              onPress={() => {
                setIsMultipleChoice(!isMultipleChoice);
              }}
              textStyle={
                isMultipleChoice ? styles.selectedText : styles.unSelectedText
              }
              style={
                isMultipleChoice ? styles.selectedView : styles.unSelectedView
              }
              text={t('popover.multiple_choice')}
            />
          </View>
        </RecordContentItem>
        <ElapsedRecordTemplate
          data={recordData}
          onChange={handleChangeRecord}
          isMultipleChoice={isMultipleChoice}
          onChangeTab={setRecordTabIndex}
          onClose={hidePopover}
          onSave={handleSaveRecord}
          notAllowEditDate={registerAllButton || notAllowEditDate}
        />
      </View>
    );
  };

  const keyInputContentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.elapsedContentPopover}>
        <PopoverRecordHeader
          source={images.rinElapsed}
          recordName={t('elapsed.bottom_tab_label')}
          recordStatus={recordStatus}
          iconStatus={renderIconStatus()}
        />
        {!hideSlideTab && (
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
        <ElapsedRecordContent
          data={recordData}
          onChange={handleChangeRecord}
          notAllowEditDate={registerAllButton || notAllowEditDate}
        />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <BaseTooltip
        arrowStyle={arrowStyle}
        showHeader
        isVisible={isShowPopover}
        placement={registerAllButton ? 'center' : 'right'}
        onClose={hidePopover}
        closeOnBackgroundInteraction={false}
        closeOnContentInteraction={false}
        contentStyle={StyleSheet.compose(
          styles.popoverContentStyle,
          registerAllButton && styles.positionShowRegisterAll,
        )}
        leftButtonText={t('common.close')}
        rightButtonText={!isTemplate ? t('common.save') : ''}
        onLeftButtonPress={cancelSaveRecord}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={
          JSON.stringify(recordData) === JSON.stringify(initRecordData)
        }
        title={
          registerAllButton
            ? t('elapsed.button_register_title')
            : tenantKanjiName
        }
        subTitle={registerAllButton ? '' : t('user_list.sama')}
        content={
          isTemplate ? templateInputContentPopover() : keyInputContentPopover()
        }>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      {showButton && (
        <>
          {registerAllButton ? (
            <BaseButton onPress={openPopover} style={styles.registerAllBtn}>
              <BaseText
                size="xxLarge"
                color={Colors.TEXT_PRIMARY}
                text={t('elapsed.register_all')}
              />
            </BaseButton>
          ) : (
            <BaseButton onPress={openPopover}>
              <FastImage
                style={styles.recordInputIcon}
                source={images.rinElapsed}
                resizeMode="contain"
              />
              {count > 0 && (
                <View style={styles.scheduleCount}>
                  <BaseText
                    weight="medium"
                    size="xSmall"
                    text={count.toString()}
                  />
                </View>
              )}
            </BaseButton>
          )}
        </>
      )}
    </View>
  );
};

export default React.memo(PopoverRecordElapsed);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -400,
    width: 440,
    position: 'absolute',
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  elapsedContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 15,
  },
  popoverContentStyle: {
    width: 570,
    height: 700,
  },
  positionShowRegisterAll: {
    left: 250,
    top: 25,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  tabsViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },
  selectedView: {
    backgroundColor: Colors.BLUE,
    width: 80,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unSelectedView: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: Colors.WHITE,
  },
  unSelectedText: {
    color: Colors.PRIMARY,
  },
  templateTabView: {
    alignItems: 'center',
  },
  registerAllBtn: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.TEXT_PRIMARY,
    borderRadius: 4,
    borderStyle: 'solid',
    borderWidth: 0.5,
    width: 101,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleCount: {
    width: 18,
    height: 18,
    borderRadius: 18,
    position: 'absolute',
    borderWidth: 0.7,
    borderColor: Colors.BLACK,
    backgroundColor: Colors.WHITE,
    right: -5,
    top: -3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unSyncIcon: {
    width: 23,
    height: 23,
    left: 20,
  },
});
