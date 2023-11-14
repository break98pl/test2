import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Screen from '@templates/Screen';
import CareListNavBar from '@organisms/CareListNavBar';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectCareListSortedBy,
  selectHolidays,
} from '@modules/record/record.slice';
import {
  selectCareTenantList,
  selectCurrentCareTenant,
  setCanFetchMoreCareList,
  setCanReloadCareList,
  selectFilterOptions,
} from '@modules/careList/careList.slice';
import {
  CareListSection,
  FCPRecord,
  MealPlan,
} from '@modules/record/record.type';
import {RecordService} from '@modules/record/record.service';
import moment from 'moment/moment';
import {DATE_FORMAT} from '@constants/constants';
import {
  FETCH_MORE_CARE_LIST_INTERVAL,
  OFFSET_Y_TO_FETCH_MORE_CARE_LIST,
  OFFSET_Y_TO_RELOAD_CARE_LIST,
} from '@modules/record/record.constant';
import {CareListLoadingType} from '@modules/careList/careList.type';
import CareListSwitchUserBar from '@organisms/CareListSwitchUserBar';
import LoadingModal from '@molecules/LoadingModal';
import CareListTableHeader from '@organisms/CareListTableHeader';
import CareListSectionList from '@organisms/CareListSectionList';
import CareListLoadingView from '@organisms/CareListLoadingView';
import {
  GoingOutPlan,
  ServicePlan,
  TenantListItem,
  TodayPlan,
} from '@modules/tenant/tenant.type';
import {TenantService} from '@modules/tenant/tenant.service';
import {setTenantData} from '@modules/tenant/tenant.slice';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';

const CareListScreen = () => {
  const dispatch = useAppDispatch();

  const appType = useAppSelector(selectAppType);
  const holidays = useAppSelector(selectHolidays);
  const sortedBy = useAppSelector(selectCareListSortedBy);
  const careTenantList = useAppSelector(selectCareTenantList);
  const currentCareTenant = useAppSelector(selectCurrentCareTenant);
  const {
    tenantCode = '',
    careFromDate = moment().format(DATE_FORMAT),
    records = [],
    goingOutPlans = [],
    servicePlans = [],
    mealPlans = [],
  } = currentCareTenant ?? {};
  const filterOptions = useAppSelector(selectFilterOptions);

  const loadingType = useRef<CareListLoadingType | null>(
    CareListLoadingType.InitialLoad,
  );
  const [loading, setLoading] = useState(true);
  const [careSections, setCareSections] = useState<CareListSection[]>([]);

  const loadingTypeOfListHeader =
    sortedBy === 'desc'
      ? CareListLoadingType.Reload
      : CareListLoadingType.LoadMore;
  const loadingTypeOfListFooter =
    sortedBy === 'desc'
      ? CareListLoadingType.LoadMore
      : CareListLoadingType.Reload;

  /**
   * Create data of care section list.
   *
   * Called when:
   *  1. User switches tenant.
   *  2. User changes filtering options.
   *  3. Records tenant changes.
   */
  useEffect(() => {
    if (tenantCode) {
      loadingType.current = CareListLoadingType.InitialLoad;
      setLoading(true);

      setTimeout(() => {
        const sections = RecordService.getCareListSections({
          fromDate: careFromDate,
          toDate: moment().format(DATE_FORMAT),
          sortedBy: sortedBy,
          filterOptions: filterOptions,
          records: records,
          todayPlans: goingOutPlans.length
            ? goingOutPlans
            : servicePlans.length
            ? servicePlans
            : [],
          holidays: holidays,
          mealPlans: mealPlans,
        });

        loadingType.current = null;
        setCareSections(sections);
        setLoading(false);
      }, 100);
    }
  }, [tenantCode, filterOptions, records]);

  /**
   * Sort care sections list.
   *
   * Called when user presses the sorting button on table header.
   */
  useEffect(() => {
    if (tenantCode && careSections.length) {
      const sortedSections = careSections.reverse().map(s => {
        s.data.reverse();
        return s;
      });
      setCareSections(sortedSections);
    }
  }, [sortedBy]);

  /**
   * Generate care list screen data.
   * Called when reloading or loading more care list data.
   */
  const generateCareListScreenData = useCallback(
    async (loadType: CareListLoadingType) => {
      if (!currentCareTenant || loadType === CareListLoadingType.InitialLoad) {
        return;
      }

      const fromDate =
        loadType === CareListLoadingType.LoadMore
          ? moment(careFromDate)
              .subtract(FETCH_MORE_CARE_LIST_INTERVAL, 'days')
              .format(DATE_FORMAT)
          : careFromDate;

      try {
        loadingType.current = loadType;
        setLoading(true);

        await RecordService.renewCareListDataOfTenant({
          tenantCode: tenantCode,
          startDate: fromDate,
          endDate: moment().format(DATE_FORMAT),
        });

        // Retrieve care list data of tenant
        const allRecordsOfTenant: FCPRecord[] =
          await RecordService.getAllRecords(tenantCode);
        const todayPlansOfTenant: TodayPlan[] =
          await TenantService.getTodayPlansOfTenant(tenantCode);
        const mealPlansOfTenant: MealPlan[] = await RecordService.getMealPlans(
          tenantCode,
        );

        const newTenantData: TenantListItem = {
          ...currentCareTenant,
          records: allRecordsOfTenant,
          careFromDate: fromDate,
        };
        if (appType === AppType.SHISETSHU) {
          newTenantData.mealPlans = mealPlansOfTenant;
          newTenantData.goingOutPlans = todayPlansOfTenant as GoingOutPlan[];
        } else if (appType === AppType.JUTAKU) {
          newTenantData.goingOutPlans = todayPlansOfTenant as GoingOutPlan[];
        } else if (appType === AppType.TAKINO) {
          newTenantData.servicePlans = todayPlansOfTenant as ServicePlan[];
        }

        const sections: CareListSection[] = RecordService.getCareListSections({
          fromDate: fromDate,
          toDate: moment().format(DATE_FORMAT),
          records: allRecordsOfTenant,
          todayPlans: todayPlansOfTenant,
          mealPlans: mealPlansOfTenant,
          sortedBy: sortedBy,
          holidays: holidays,
          filterOptions: filterOptions,
        });
        dispatch(setTenantData(newTenantData));

        setCareSections(sections);
      } catch (e) {
        console.error('Error at generateCareListScreenData: ', e);
      } finally {
        loadingType.current = null;
        setLoading(false);
      }
    },
    [currentCareTenant, sortedBy, holidays, filterOptions],
  );

  /**
   * Handle reloading or loading more care list data.
   */
  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const layoutHeight = e.nativeEvent.layoutMeasurement.height;
      const contentHeight = e.nativeEvent.contentSize.height;
      const isStartReached = offsetY <= 0;
      const isEndReached = offsetY + layoutHeight >= contentHeight;

      if (loading) {
        return;
      } else if (
        isStartReached &&
        Math.abs(offsetY) >= OFFSET_Y_TO_RELOAD_CARE_LIST
      ) {
        if (loadingTypeOfListHeader === CareListLoadingType.Reload) {
          dispatch(setCanReloadCareList(false));
        } else if (loadingTypeOfListHeader === CareListLoadingType.LoadMore) {
          dispatch(setCanFetchMoreCareList(false));
        }
        generateCareListScreenData(loadingTypeOfListHeader).then();
      } else if (
        isEndReached &&
        offsetY + layoutHeight >=
          contentHeight + OFFSET_Y_TO_FETCH_MORE_CARE_LIST
      ) {
        if (loadingTypeOfListFooter === CareListLoadingType.Reload) {
          dispatch(setCanReloadCareList(false));
        } else if (loadingTypeOfListFooter === CareListLoadingType.LoadMore) {
          dispatch(setCanFetchMoreCareList(false));
        }
        generateCareListScreenData(loadingTypeOfListFooter).then();
      }
    },
    [
      loading,
      loadingTypeOfListHeader,
      loadingTypeOfListFooter,
      generateCareListScreenData,
    ],
  );

  /**
   * Handle the animation of reloading and loading more component.
   */
  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const layoutHeight = event.nativeEvent.layoutMeasurement.height;
      const contentHeight = event.nativeEvent.contentSize.height;
      const isStartReached = offsetY <= 0;
      const isEndReached = offsetY + layoutHeight >= contentHeight;

      if (loading) {
        return;
      } else if (isStartReached) {
        if (Math.abs(offsetY) >= OFFSET_Y_TO_RELOAD_CARE_LIST) {
          if (loadingTypeOfListHeader === CareListLoadingType.Reload) {
            dispatch(setCanReloadCareList(true));
          } else if (loadingTypeOfListHeader === CareListLoadingType.LoadMore) {
            dispatch(setCanFetchMoreCareList(true));
          }
        } else {
          if (loadingTypeOfListHeader === CareListLoadingType.Reload) {
            dispatch(setCanReloadCareList(false));
          } else if (loadingTypeOfListHeader === CareListLoadingType.LoadMore) {
            dispatch(setCanFetchMoreCareList(false));
          }
        }
      } else if (isEndReached) {
        if (
          offsetY + layoutHeight >=
          contentHeight + OFFSET_Y_TO_FETCH_MORE_CARE_LIST
        ) {
          if (loadingTypeOfListFooter === CareListLoadingType.LoadMore) {
            dispatch(setCanFetchMoreCareList(true));
          } else if (loadingTypeOfListFooter === CareListLoadingType.Reload) {
            dispatch(setCanReloadCareList(true));
          }
        } else {
          if (loadingTypeOfListFooter === CareListLoadingType.LoadMore) {
            dispatch(setCanFetchMoreCareList(false));
          } else if (loadingTypeOfListFooter === CareListLoadingType.Reload) {
            dispatch(setCanReloadCareList(false));
          }
        }
      }
    },
    [loading, loadingTypeOfListHeader, loadingTypeOfListFooter],
  );

  return (
    <Screen
      barStyle="dark-content"
      enableSafeArea
      withBottomBar
      navBar={<CareListNavBar />}>
      <CareListSwitchUserBar careInfoList={careTenantList} />
      <CareListTableHeader />
      <CareListSectionList
        data={careSections}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEndDrag}
        ListHeaderComponent={
          <CareListLoadingView
            slot={'header'}
            careFromDate={careFromDate}
            loadType={loadingTypeOfListHeader}
            loading={loading && loadingType.current === loadingTypeOfListHeader}
          />
        }
        ListFooterComponent={
          <CareListLoadingView
            slot={'footer'}
            careFromDate={careFromDate}
            loadType={loadingTypeOfListFooter}
            loading={loading && loadingType.current === loadingTypeOfListFooter}
          />
        }
      />
      <LoadingModal
        type={
          loadingType.current === CareListLoadingType.InitialLoad
            ? 'circle'
            : 'none'
        }
        animationType={'none'}
        visible={loading}
      />
    </Screen>
  );
};

export default CareListScreen;
