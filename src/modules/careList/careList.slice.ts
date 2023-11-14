import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import _ from 'lodash';
import {RootState} from '@store/config';
import {
  CareListFilterOptions,
  CareListManagementState,
  SlideTabFilterContent,
  RecordReporter,
} from '@modules/record/record.type';
import {
  selectAllTenantsData,
  selectTenantSectionData,
} from '@modules/tenant/tenant.slice';
import {TenantListItem, TenantListSection} from '@modules/tenant/tenant.type';

export const filterOptionsInitData: CareListFilterOptions = {
  searchNoteText: '',
  records: {
    elapsed: SlideTabFilterContent.Display,
    vital: SlideTabFilterContent.All,
    meal: SlideTabFilterContent.All,
    excretion: SlideTabFilterContent.All,
    bath: SlideTabFilterContent.All,
    reha: SlideTabFilterContent.Display,
    letter: SlideTabFilterContent.Display,
    attendance: SlideTabFilterContent.Display,
    medication: SlideTabFilterContent.Display,
    APcheckInAndCheckOut: SlideTabFilterContent.Display,
    APInstruction: SlideTabFilterContent.Display,
    APOrder: SlideTabFilterContent.Display,
    APSignature: SlideTabFilterContent.Display,
    APLeaveNote: SlideTabFilterContent.Display,
  },
  occupations: {
    careGiver: SlideTabFilterContent.Display,
    nurse: SlideTabFilterContent.Display,
    therapist: SlideTabFilterContent.Display,
    nurseCareSupportStaff: SlideTabFilterContent.Display,
    supportCounselor: SlideTabFilterContent.Display,
    registerDietitian: SlideTabFilterContent.Display,
    doctor: SlideTabFilterContent.Display,
    facilityDirector: SlideTabFilterContent.Display,
    other: SlideTabFilterContent.Display,
  },
  elapsedClassification: '',
  reporter: '',
  loginService: '',
  cooperationRecords: null,
};

const initialState: CareListManagementState = {
  // use values in this object to filtering
  isFiltering: false,
  isShowAPFilterOptions: false,
  isCheckAllCooperationRecords: true,
  filterOptions: filterOptionsInitData,
  filterElapsedClassificationValues: [],
  filterReporterValues: [],
  filterOtherSystemNameValues: [],
  filterHiddenReporterJobs: [],
  isShowMedicationFilter: false,
  canReloadCareList: false,
  canFetchMoreCareList: false,
  currentCareTenant: null,
};

const careListSlice = createSlice({
  name: 'careList',
  initialState,
  reducers: {
    setCanReloadCareList: (state, action: PayloadAction<boolean>) => {
      state.canReloadCareList = action.payload;
    },
    setCanFetchMoreCareList: (state, action: PayloadAction<boolean>) => {
      state.canFetchMoreCareList = action.payload;
    },
    setCurrentCareTenant: (state, action: PayloadAction<string | null>) => {
      state.currentCareTenant = action.payload;
    },
    setFilterOptions: (state, action: PayloadAction<CareListFilterOptions>) => {
      state.filterOptions = action.payload;
    },
    setIsFiltering: (state, action: PayloadAction<boolean>) => {
      state.isFiltering = action.payload;
    },
    setIsShowAPFilterOptions: (state, action: PayloadAction<boolean>) => {
      state.isShowAPFilterOptions = action.payload;
    },
    setIsCheckAllCooperations: (state, action: PayloadAction<boolean>) => {
      state.isCheckAllCooperationRecords = action.payload;
    },
    setFilterCooperationRecords: (state, action: PayloadAction<string[]>) => {
      state.filterOptions.cooperationRecords = action.payload;
    },
    setFilterElapsedClassificationValues: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.filterElapsedClassificationValues = action.payload;
    },
    setFilterReporterValues: (
      state,
      action: PayloadAction<RecordReporter[]>,
    ) => {
      state.filterReporterValues = action.payload;
    },
    setFilterOtherSystemNameValues: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.filterOtherSystemNameValues = action.payload;
    },
    setIsShowMedicationFilter: (state, action: PayloadAction<boolean>) => {
      state.isShowMedicationFilter = action.payload;
    },
    addFilterHiddenReporterJob: (state, action: PayloadAction<string>) => {
      const jobToAdd = action.payload;
      const canAdd = !state.filterHiddenReporterJobs.some(
        item => item === jobToAdd,
      );

      if (canAdd) {
        state.filterHiddenReporterJobs.push(jobToAdd);
      }
    },
    deleteFilterHiddenReporterJob: (state, action: PayloadAction<string>) => {
      const nameToDelete = action.payload;

      state.filterHiddenReporterJobs = state.filterHiddenReporterJobs.filter(
        name => name !== nameToDelete,
      );
    },
    resetCareListFilterOptions: (
      state,
      action: PayloadAction<{resetAll: boolean}>,
    ) => {
      const {resetAll} = action.payload;

      if (resetAll) {
        state.filterOptions = filterOptionsInitData;
        state.isShowAPFilterOptions = false;
      } else {
        state.filterOptions = filterOptionsInitData;
      }
    },
  },
});

export const {
  setCanReloadCareList,
  setCanFetchMoreCareList,
  setCurrentCareTenant,
  setFilterOptions,
  setIsFiltering,
  setFilterCooperationRecords,
  setFilterElapsedClassificationValues,
  setFilterReporterValues,
  setFilterOtherSystemNameValues,
  setIsShowMedicationFilter,
  setIsShowAPFilterOptions,
  setIsCheckAllCooperations,
  addFilterHiddenReporterJob,
  deleteFilterHiddenReporterJob,
  resetCareListFilterOptions,
} = careListSlice.actions;

export const selectCanReloadCareList = (state: RootState): boolean => {
  return state.careList.canReloadCareList;
};
export const selectCanFetchMoreCareList = (state: RootState): boolean => {
  return state.careList.canFetchMoreCareList;
};

export const selectCareTenantList = createSelector(
  selectTenantSectionData,
  (tenantSections: TenantListSection[]): TenantListItem[] => {
    return _.unionBy(tenantSections.map(s => s.data).flat(), 'tenantCode');
  },
);

const selectCurrentTenantCodeOfCareList = (state: RootState): string | null => {
  return state.careList.currentCareTenant;
};

export const selectCurrentCareTenant = createSelector(
  selectAllTenantsData,
  selectCurrentTenantCodeOfCareList,
  (
    allTenantsData: TenantListItem[],
    tenantCode: string | null,
  ): TenantListItem | null => {
    return allTenantsData.find(e => e.tenantCode === tenantCode) ?? null;
  },
);

export const selectIsFiltering = (state: RootState) => {
  return state.careList.isFiltering;
};
export const selectFilterOptions = (state: RootState) => {
  return state.careList.filterOptions;
};
export const selectSearchNoteText = (state: RootState) => {
  return state.careList.filterOptions.searchNoteText;
};
export const selectElapsedClassification = (state: RootState) => {
  return state.careList.filterOptions.elapsedClassification;
};
export const selectReporter = (state: RootState) => {
  return state.careList.filterOptions.reporter;
};
export const selectLoginService = (state: RootState) => {
  return state.careList.filterOptions.loginService;
};
export const selectRecords = (state: RootState) => {
  return state.careList.filterOptions.records;
};
export const selectOccupations = (state: RootState) => {
  return state.careList.filterOptions.occupations;
};
export const selectCooperationRecords = (state: RootState) => {
  return state.careList.filterOptions.cooperationRecords;
};
export const selectFilterElapsedClassificationValues = (state: RootState) => {
  return state.careList.filterElapsedClassificationValues;
};
export const selectFilterReporterValues = (state: RootState) => {
  return state.careList.filterReporterValues;
};
export const selectFilterOtherSystemNameValues = (state: RootState) => {
  return state.careList.filterOtherSystemNameValues;
};
export const selectIsShowMedicationFilter = (state: RootState) => {
  return state.careList.isShowMedicationFilter;
};
export const selectIsShowAPFilterOptions = (state: RootState) => {
  return state.careList.isShowAPFilterOptions;
};
export const selectIsCheckAllCooperations = (state: RootState) => {
  return state.careList.isCheckAllCooperationRecords;
};
export const selectFilterHiddenReportJobs = (state: RootState) => {
  return state.careList.filterHiddenReporterJobs;
};

export default careListSlice.reducer;
