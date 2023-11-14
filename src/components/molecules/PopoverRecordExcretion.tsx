import {StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
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
import ExcretionRecordTemplate from '@organisms/ExcretionRecordTemplate';
import SlideTabButtons from './SlideTabButtons';
import RecordContentItem from './RecordContentItem';
import {selectIsUseTemplateExcretion} from '@modules/setting/setting.slice';
import BaseTooltip from '@templates/BaseTooltip';
import {images} from '@constants/images';
import {
  handleAlertConfirm,
  handleAlertNotCreateRecord,
  handleAlertSave,
} from '@modules/alerts/alert.ultils';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {useAppSelector} from '@store/config';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';

const initialExcretionData: TExcretionRecordData = {
  recordDate: new Date().toISOString(),
  reporter: '山下 達郎',
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
};

interface IPopoverRecordExcretionProps {
  tenantKanjiName?: string;
  firstServicePlan?: string;
}

const PopoverRecordExcretion = (props: IPopoverRecordExcretionProps) => {
  const {tenantKanjiName = '', firstServicePlan = ''} = props;
  const {t} = useTranslation();
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [tabRecordIndex, setRecordTabIndex] = useState(0);
  const tabRecordList = [t('popover.template'), t('popover.key')];
  const isUseTemplateExcretion = useAppSelector(selectIsUseTemplateExcretion);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const [recordData, setRecordData] = useState<TExcretionRecordData>(
    Object.assign(initialExcretionData, {
      reporter: reporterName,
      serviceType: firstServicePlan,
    }),
  );

  const hidePopover = () => {
    setIsShowPopover(false);
    setRecordData(initialExcretionData);
  };

  const cancelSaveRecord = () => {
    if (JSON.stringify(recordData) !== JSON.stringify(initialExcretionData)) {
      handleAlertConfirm(
        () => {
          setIsShowPopover(false);
          setRecordData(initialExcretionData);
        },
        () => {
          setIsShowPopover(false);
          setRecordData(initialExcretionData);
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
      setRecordData(state => ({...state, ...recordChange}));
    },
    [],
  );

  // TODO: handle save record
  const handleSaveRecord = () => {
    handleAlertSave(
      () => {
        hidePopover();
      },
      () => null,
    );
  };

  const templateInputContentPopover = () => {
    return (
      <View style={styles.excretionContentPopover}>
        <PopoverRecordHeader
          source={images.rinExcretion}
          label={t('popover.create_record_at')}
          showRecordDate
          showIcon={false}
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
        <ExcretionRecordTemplate onClose={hidePopover} />
      </View>
    );
  };

  const keyInputContentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.excretionContentPopover}>
        <PopoverRecordHeader
          source={images.rinExcretion}
          recordName={t('popover.excretion_label')}
          recordStatus={RecordStatus.UnSync}
        />
        {isUseTemplateExcretion && (
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
        />
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
        contentStyle={
          tabRecordIndex === 0
            ? styles.popoverTemplateStyle
            : styles.popoverContentStyle
        }
        leftButtonText={t('user_list.close')}
        rightButtonText={t('common.save')}
        onLeftButtonPress={cancelSaveRecord}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={
          JSON.stringify(recordData) === JSON.stringify(initialExcretionData)
        }
        title={tenantKanjiName}
        subTitle={t('user_list.sama')}
        content={
          tabRecordIndex === 0
            ? templateInputContentPopover()
            : keyInputContentPopover()
        }>
        <View style={styles.targetShowTooltip} />
      </BaseTooltip>
      <BaseButton onPress={openPopover}>
        <FastImage
          style={styles.recordInputIcon}
          source={images.rinExcretion}
          resizeMode="contain"
        />
      </BaseButton>
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
    height: 700,
  },
  popoverTemplateStyle: {
    width: 330,
    height: 700,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  templateTabView: {
    alignItems: 'center',
  },
});
