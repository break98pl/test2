import {StyleSheet, View} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import SlideTabButtons from '@molecules/SlideTabButtons';
import CareListFilterOptionsButton from './CareListFilterOptionsButton';
import {useTranslation} from 'react-i18next';
import SimpleBackButton from '@molecules/SimpleBackButton';
import CreateNewRecordButton from '@organisms/CreateNewRecordButton';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';
import useVisible from '@hooks/useVisible';
import CareListFilterModal, {
  CareListFilterModalRef,
} from '@organisms/CareListFilterModal';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  filterOptionsInitData,
  resetCareListFilterOptions,
  selectCooperationRecords,
  selectCurrentCareTenant,
  selectIsFiltering,
  setFilterCooperationRecords,
  setFilterElapsedClassificationValues,
  setFilterOtherSystemNameValues,
  setFilterReporterValues,
  setIsShowAPFilterOptions,
  setIsShowMedicationFilter,
} from '@modules/careList/careList.slice';
import {RecordDB} from '@modules/record/record.db';
import {RecordSetting, RecordType} from '@modules/record/record.type';
import {RecordService} from '@modules/record/record.service';
import {
  selectAppType,
  selectAuthState,
  selectChoseServiceName,
  selectDemoMode,
  setListLoginServiceNames,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {AuthService} from '@modules/authentication/auth.service';
import {getUserLabel} from '@modules/tenant/tenant.utils';

const CareListNavBar = () => {
  const dispatch = useAppDispatch();

  // global states
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const filterCooperationOptions = useAppSelector(selectCooperationRecords);
  const {dbName, serverName} = useAppSelector(selectAuthState);
  const isDemoMode = useAppSelector(selectDemoMode);
  const {records: allTenantRecords = []} =
    useAppSelector(selectCurrentCareTenant) ?? {};
  const isFiltering = useAppSelector(selectIsFiltering);

  // texts
  const {t} = useTranslation();

  const careListTabText = t('care_list.commonCareListTab');
  const vitalGraphTabText = t('care_list.vitalGraphTab');
  const weightAndExcreteTabText = t('care_list.weightAndExcreteTab');
  const bodyWeightTabText = t('care_list.bodyWeightTab');
  const backScreenText = t(getUserLabel(appType, serviceName), {
    text: t('care_list.backToUserListPrefix'),
  });

  // states
  const [chosenTabIndex, setChosenTabIndex] = useState(0);

  const {
    isVisible: isShowFilterOptionsTooltip,
    showComponent: showFilterOptionsTooltip,
    hideComponent: hideFilterOptionsTooltip,
  } = useVisible();

  const {
    isVisible: isShowCareListFilterModal,
    showComponent: showCareListFilterModal,
    hideComponent: hideCareListFilterModal,
  } = useVisible();

  // refs
  const careListFilterModalRef = useRef<CareListFilterModalRef>(null);

  useEffect(() => {
    generateFilterData().then();
  }, []);

  useEffect(() => {
    if (allTenantRecords.length) {
      updateAPFilterOptions();
    }
  }, [allTenantRecords]);

  /**
   * generate filter data
   */
  const generateFilterData = async () => {
    const careListRecordSetting: RecordSetting | null =
      await RecordService.getCareListRecordSetting();
    const elapsedClassificationFilterValues =
      await RecordDB.findAllFilterElapsedClassificationValues();
    const reporterValues = await RecordDB.findAllFilterReporterValues();
    const otherSystemNameValues = careListRecordSetting.otherSystemDisplay.map(
      item => {
        return item.collaborationDeviceName ?? '';
      },
    );
    const isShowMedicationFilterOption =
      await RecordDB.isHasMedicationRecords();

    let jutakuServices;
    if (appType === AppType.JUTAKU && !isDemoMode) {
      jutakuServices = await AuthService.getServicesForJutakuAndTsusho(
        serverName,
        dbName,
        appType,
      );
    }

    dispatch(
      setFilterElapsedClassificationValues(elapsedClassificationFilterValues),
    );
    dispatch(setFilterReporterValues(reporterValues));
    dispatch(setFilterOtherSystemNameValues(otherSystemNameValues));
    dispatch(setIsShowMedicationFilter(isShowMedicationFilterOption));
    if (filterCooperationOptions === null) {
      dispatch(setFilterCooperationRecords(otherSystemNameValues));
    }
    if (jutakuServices) {
      const jutakuServiceItems = jutakuServices.map(item => ({
        id: item.serviceCode,
        label: item.serviceName,
      }));

      dispatch(setListLoginServiceNames(jutakuServiceItems));
    }
  };

  /**
   * update is show AP record filter options or not
   */
  const updateAPFilterOptions = () => {
    const isShowAPFilter = allTenantRecords.some(
      record =>
        record.type === RecordType.APCheckin ||
        record.type === RecordType.APCheckout ||
        record.type === RecordType.APInstruction ||
        record.type === RecordType.APLeaveNote ||
        record.type === RecordType.APOrder ||
        record.type === RecordType.APSignature,
    );

    if (isShowAPFilter) {
      dispatch(setIsShowAPFilterOptions(isShowAPFilter));
    }
  };

  /**
   * called when user choose to open filter modal
   */
  const onChooseAdvancedFilterOption = () => {
    hideFilterOptionsTooltip();
    showCareListFilterModal();
  };

  /**
   * called when user choose reset filter option
   */
  const onChooseResetFilterOption = () => {
    hideFilterOptionsTooltip();

    if (isFiltering) {
      setTimeout(() => {
        dispatch(resetCareListFilterOptions({resetAll: false}));
        careListFilterModalRef.current?.resetFilterValue(filterOptionsInitData);
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* back button */}
      <SimpleBackButton backText={backScreenText} />

      {/* tab navigation */}
      <View>
        <SlideTabButtons
          tabContents={[
            careListTabText,
            vitalGraphTabText,
            bodyWeightTabText,
            weightAndExcreteTabText,
          ]}
          textStyle={styles.tabText}
          tabWidth={100}
          tabHeight={25}
          chosenTabIndex={chosenTabIndex}
          setChosenTabIndex={setChosenTabIndex}
        />
      </View>

      <View style={styles.filterAndNewRecordContainer}>
        {/* open tooltip to handle filtering */}
        <CareListFilterOptionsButton
          isVisible={isShowFilterOptionsTooltip}
          onCloseButtonPress={hideFilterOptionsTooltip}
          onShowTooltipButtonPress={showFilterOptionsTooltip}
          onChooseAdvancedFilterOption={onChooseAdvancedFilterOption}
          onChooseDefaultFilterOption={onChooseResetFilterOption}
        />

        {/* create new records button */}
        <CreateNewRecordButton />
      </View>

      <CareListFilterModal
        ref={careListFilterModalRef}
        isVisible={isShowCareListFilterModal}
        onCloseModal={hideCareListFilterModal}
        onSaveFilter={hideCareListFilterModal}
      />
    </View>
  );
};

export default memo(CareListNavBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomColor: Colors.GRAY_PH,
    borderBottomWidth: 1,
    height: 50,
  },
  tabText: {
    fontSize: FontSize.SMALL,
    color: Colors.PRIMARY,
  },
  filterAndNewRecordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
