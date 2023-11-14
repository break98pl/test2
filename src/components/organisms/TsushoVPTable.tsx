import React, {useEffect, useRef, useState} from 'react';
import {FlatList} from 'react-native';
import {useAppDispatch, useAppSelector} from '@store/config';
import TsushoVPTableRow from './TsushoVPTableRow';
import {
  checkIfItemCanRegisterAll,
  convertToResidentTenantUIItem,
  getSortedEndTimes,
  getSortedStartTimes,
} from '@modules/visitPlan/tsushoVPList.utils';
import {
  selectAllTenantsData,
  selectFilteringDate,
} from '@modules/tenant/tenant.slice';
import {TsushoVisitPlanService} from '@modules/visitPlan/tsushoVPList.service';
import {
  selectEndTimeItems,
  selectFilteredEndTimeItems,
  selectFilteredHeadquartersSTItems,
  selectFilteredStartTimeItems,
  selectFilteringCharacter,
  selectIsFilterByCareFocusing,
  selectIsFilterByResident,
  selectStartTimeItems,
  setColWidths,
  setEndTimeItem,
  setIsShowReha,
  setStartTimeItem,
  setTsushoResidentTenantCount,
  resetTsushoVPState,
  setListVisitPlans,
  selectListVisitPlans,
  setRegisterAllData,
  setStartRegisterAllItems,
  setEndRegisterAllItems,
} from '@modules/visitPlan/tsushoVPList.slice';
import {
  ResidentTenantInfo,
  TsushoResidentTenantItem,
} from '@modules/visitPlan/type';
import LoadingModal from '@molecules/LoadingModal';
import {useTranslation} from 'react-i18next';
import {selectChoseServiceName} from '@modules/authentication/auth.slice';
import {RegisterAllModalType} from './RegisterAllModal';

const TsushoVisitPlanTable = () => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();
  const serviceName = useAppSelector(selectChoseServiceName);
  const allTenantsData = useAppSelector(selectAllTenantsData);
  const filteringDate = useAppSelector(selectFilteringDate);
  const filteringCharacter = useAppSelector(selectFilteringCharacter);
  const startTimeItems = useAppSelector(selectStartTimeItems);
  const endTimeItems = useAppSelector(selectEndTimeItems);
  const listFilteredStartTime = useAppSelector(selectFilteredStartTimeItems);
  const listFilteredEndTime = useAppSelector(selectFilteredEndTimeItems);
  const listFilteredHeadquarters = useAppSelector(
    selectFilteredHeadquartersSTItems,
  );
  const isFilterByResident = useAppSelector(selectIsFilterByResident);
  const isFilterByCareFocusing = useAppSelector(selectIsFilterByCareFocusing);
  const listVisitPlanData = useAppSelector(selectListVisitPlans);

  const [isLoading, setIsLoading] = useState(false);

  let refPreviousFilteringDate = useRef<string>('');

  const isFilteringDateChanged =
    filteringDate !== refPreviousFilteringDate.current;

  useEffect(() => {
    //reset Tsusho store when init screen
    dispatch(resetTsushoVPState([]));
    prepareTableCols();
  }, []);

  const prepareTableCols = () => {
    const isShowReha = !(t('tsusho_vp_list.noRehaService') === serviceName);
    dispatch(setIsShowReha(isShowReha));
    if (!isShowReha) {
      // hide reha service table col widths
      dispatch(
        setColWidths({
          userInfo: '20%',
          careSchedule: '11%',
          weeklySchedule: '12%',
          result: '12%',
          registerVPState: '13%',
          settled: '12%',
          registerLetter: '12%',
          reha: '0%',
          recordListNavigation: '8%',
        }),
      );
    } else {
      // show reha service table col widths
      dispatch(
        setColWidths({
          userInfo: '20%',
          careSchedule: '11%',
          weeklySchedule: '9%',
          result: '9%',
          registerVPState: '9%',
          settled: '9%',
          registerLetter: '9%',
          reha: '19%',
          recordListNavigation: '5%',
        }),
      );
    }
  };

  const getFilteredListVisitPlan = (listVisitPlan: ResidentTenantInfo[]) => {
    const filterOptions = {
      listFilteredStartTime: listFilteredStartTime,
      listFilteredEndTime: listFilteredEndTime,
      listFilteredHeadquarters,
      isFilterByResident,
      isFilterByCareFocusing,
      filteringCharacter,
    };
    return TsushoVisitPlanService.filterTsushoVisitPlanByOption(
      listVisitPlan,
      filterOptions,
    );
  };

  /**
   * Reset startTime - endTime options if list change
   * @param listVisitPlan - The generated list of visit plans
   */
  const handleResetStartTimeEndTimeWhenListChange = (
    listVisitPlan: ResidentTenantInfo[],
  ) => {
    const listStartTime = getSortedStartTimes(listVisitPlan);
    const listEndTime = getSortedEndTimes(listVisitPlan);
    // TODO: Update list startTime-EndTime when re-init data (fetch more,sync,...)
    if (
      listStartTime.length > startTimeItems.length ||
      isFilteringDateChanged
    ) {
      dispatch(setStartTimeItem(listStartTime));
    }
    if (listEndTime.length > endTimeItems.length || isFilteringDateChanged) {
      dispatch(setEndTimeItem(listEndTime));
    }
  };

  /**
   * Handle successful service call for generating visit plan list.
   * @param {ResidentTenantInfo[]} result - The generated list of visit plans
   */
  const handleGetListVisitPlanSuccess = (result: ResidentTenantInfo[]) => {
    const listFilteredVisitPlan = getFilteredListVisitPlan(result);

    // set all visit plans for register all modal
    setRegisterAllModalData(listFilteredVisitPlan);

    refPreviousFilteringDate.current = filteringDate;
    //Set visitplan list count
    dispatch(
      setTsushoResidentTenantCount({count: listFilteredVisitPlan.length}),
    );
    handleResetStartTimeEndTimeWhenListChange(result);
    let tsushoVpConvert: TsushoResidentTenantItem[] = [];
    listFilteredVisitPlan.forEach((e, index) => {
      tsushoVpConvert.push(convertToResidentTenantUIItem(e, index));
    });
    dispatch(setListVisitPlans(tsushoVpConvert));
  };

  /**
   * prepare data for register all modal
   * @param listFilteredVisitPlan - list of visit plan data filtered
   */
  const setRegisterAllModalData = (
    listFilteredVisitPlan: ResidentTenantInfo[],
  ) => {
    let registerAllData: TsushoResidentTenantItem[] = [];
    let startRegisterAllItems: TsushoResidentTenantItem[] = [];
    let endRegisterAllItems: TsushoResidentTenantItem[] = [];

    listFilteredVisitPlan.forEach((item, index) => {
      const convertedItem = convertToResidentTenantUIItem(item, index);

      registerAllData.push(convertedItem);

      if (
        checkIfItemCanRegisterAll(
          convertedItem,
          RegisterAllModalType.StartRegister,
        )
      ) {
        startRegisterAllItems.push(convertedItem);
      }

      if (
        checkIfItemCanRegisterAll(
          convertedItem,
          RegisterAllModalType.EndRegister,
        )
      ) {
        endRegisterAllItems.push(convertedItem);
      }
    });

    dispatch(setRegisterAllData(registerAllData));
    dispatch(setStartRegisterAllItems(startRegisterAllItems));
    dispatch(setEndRegisterAllItems(endRegisterAllItems));
  };

  /**
   * Handle get visitplan data errors.
   * @param {Error} err - Error object
   */
  const handleGetListVisitPlanError = (err: any) => {
    console.error(err, 'error when get list data tsusho');
  };

  /**
   * Load and filter visit plans based on various parameters.
   */
  const loadAndFilterVisitPlans = () => {
    dispatch(setListVisitPlans([]));
    setIsLoading(true);
    TsushoVisitPlanService.generateListVisitPlanDataForTsusho(
      allTenantsData,
      new Date(filteringDate),
    )
      .then(handleGetListVisitPlanSuccess)
      .catch(handleGetListVisitPlanError)
      .finally(() => setIsLoading(false));
  };

  useEffect(loadAndFilterVisitPlans, [
    filteringDate,
    allTenantsData,
    listFilteredStartTime,
    listFilteredEndTime,
    listFilteredHeadquarters,
    isFilterByResident,
    isFilterByCareFocusing,
    filteringCharacter,
  ]);

  /**
   * Render each row of the visit plan list.
   */
  const renderItem = ({
    item,
    index,
  }: {
    item: TsushoResidentTenantItem;
    index: number;
  }) => <TsushoVPTableRow key={index} data={item} rowIndex={index} />;

  return (
    <>
      <FlatList data={listVisitPlanData} renderItem={renderItem} />
      <LoadingModal type={'circle'} visible={isLoading} />
    </>
  );
};

export default TsushoVisitPlanTable;
