import {RegisterAllModalType} from '@organisms/RegisterAllModal';
import {createSlice, PayloadAction, prepareAutoBatched} from '@reduxjs/toolkit';
import {RootState} from '@store/config';
import {
  SateLiteInfo,
  TsushoResidentTenantItem,
  TsushoVPcolWidthsType,
  TsushoVPState,
} from './type';

const initialState: TsushoVPState = {
  registerAllData: [],
  startRegisterAllItems: [],
  endRegisterAllItems: [],
  registerAllModalTypeOpening: RegisterAllModalType.StartRegister,
  isReload: false,
  isShowReha: true,
  tsushoVPcolWidths: {
    userInfo: '19%',
    careSchedule: '11%',
    weeklySchedule: '9%',
    result: '9%',
    registerVPState: '9%',
    settled: '9%',
    registerLetter: '9%',
    reha: '19%',
    recordListNavigation: '6%',
  },
  tsushoVPRegisterAllColWidths: {
    userInfo: '20%',
    careSchedule: '11%',
    weeklySchedule: '11%',
    result: '11%',
    registerVPState: '11%',
    settled: '11%',
    registerLetter: '11%',
    reha: '0%',
    check: '14%',
    recordListNavigation: '0%',
  },
  startTimeItems: [],
  endTimeItems: [],
  startTimeFilterItems: [],
  endTimeFilterItems: [],
  headquartersSTItems: [],
  headquartersSTFilterItems: [],
  tsushoResidentTenantCount: 0,
  isFilterByResident: false,
  isFilterByCareFocusing: false,
  filteringCharacter: 'all',
  listVisitPlans: [],
};

const tsushoVPSlice = createSlice({
  name: 'tsushoVPList',
  initialState,
  reducers: {
    setRegisterAllData: (
      state,
      action: PayloadAction<TsushoResidentTenantItem[]>,
    ) => {
      state.registerAllData = action.payload;
    },
    setIsReload: (state, action: PayloadAction<boolean>) => {
      state.isReload = action.payload;
    },
    setStartTimeItem: (state, action: PayloadAction<string[]>) => {
      state.startTimeItems = action.payload;
    },
    setEndTimeItem: (state, action: PayloadAction<string[]>) => {
      state.endTimeItems = action.payload;
    },
    setFilteredStartTimeItem: (state, action: PayloadAction<string[]>) => {
      state.startTimeFilterItems = action.payload;
    },
    setFilteredEndTimeItem: (state, action: PayloadAction<string[]>) => {
      state.endTimeFilterItems = action.payload;
    },
    setHeadquarterSTItem: {
      reducer: (state, action: PayloadAction<SateLiteInfo[]>) => {
        state.headquartersSTItems = action.payload;
      },
      prepare: prepareAutoBatched<SateLiteInfo[]>(),
    },
    setFilteringCharacter: (state, action: PayloadAction<string>) => {
      state.filteringCharacter = action.payload;
    },
    setFilteredHeadquarterSTItem: (
      state,
      action: PayloadAction<SateLiteInfo[]>,
    ) => {
      state.headquartersSTFilterItems = action.payload;
    },
    setIsFilterByResident: (state, action: PayloadAction<boolean>) => {
      state.isFilterByResident = action.payload;
    },
    setIsFilterByCareFocusing: (state, action: PayloadAction<boolean>) => {
      state.isFilterByCareFocusing = action.payload;
    },
    setIsShowReha: (state, action: PayloadAction<boolean>) => {
      state.isShowReha = action.payload;
    },
    setColWidths: (state, action: PayloadAction<TsushoVPcolWidthsType>) => {
      state.tsushoVPcolWidths = action.payload;
    },
    setTsushoResidentTenantCount: (
      state,
      action: PayloadAction<{count: number}>,
    ) => {
      state.tsushoResidentTenantCount = action.payload.count;
    },
    setStartRegisterAllItems: (
      state,
      action: PayloadAction<TsushoResidentTenantItem[]>,
    ) => {
      state.startRegisterAllItems = action.payload;
    },
    setEndRegisterAllItems: (
      state,
      action: PayloadAction<TsushoResidentTenantItem[]>,
    ) => {
      state.endRegisterAllItems = action.payload;
    },
    setRegisterAllModalTypeOpening: (
      state,
      action: PayloadAction<RegisterAllModalType>,
    ) => {
      state.registerAllModalTypeOpening = action.payload;
    },
    addStartTimeItem: (state, action: PayloadAction<string>) => {
      state.startTimeFilterItems.push(action.payload);
    },
    addEndTimeItem: (state, action: PayloadAction<string>) => {
      state.endTimeFilterItems.push(action.payload);
    },
    addStartRegisterAllItem: (
      state,
      action: PayloadAction<TsushoResidentTenantItem>,
    ) => {
      state.startRegisterAllItems.push(action.payload);
    },
    addEndRegisterAllItem: (
      state,
      action: PayloadAction<TsushoResidentTenantItem>,
    ) => {
      state.endRegisterAllItems.push(action.payload);
    },
    addAllStartRegisterAllItem: state => {
      state.startRegisterAllItems = state.registerAllData;
    },
    addAllEndRegisterAllItem: state => {
      state.endRegisterAllItems = state.registerAllData;
    },
    deleteStartTimeItem: (state, action: PayloadAction<string>) => {
      const index = state.startTimeFilterItems.indexOf(action.payload);
      if (index !== -1) {
        state.startTimeFilterItems.splice(index, 1);
      }
    },
    deleteEndTimeItem: (state, action: PayloadAction<string>) => {
      const index = state.endTimeFilterItems.indexOf(action.payload);
      if (index !== -1) {
        state.endTimeFilterItems.splice(index, 1);
      }
    },
    deleteStartRegisterAllItem: (
      state,
      action: PayloadAction<TsushoResidentTenantItem>,
    ) => {
      state.startRegisterAllItems = state.startRegisterAllItems.filter(
        item => item.id !== action.payload.id,
      );
    },
    deleteEndRegisterAllItem: (
      state,
      action: PayloadAction<TsushoResidentTenantItem>,
    ) => {
      state.endRegisterAllItems = state.endRegisterAllItems.filter(
        item => item.id !== action.payload.id,
      );
    },
    deleteAllStartRegisterAllItem: state => {
      state.startRegisterAllItems = [];
    },
    deleteAllEndRegisterAllItem: state => {
      state.endRegisterAllItems = [];
    },
    resetTsushoVPState: (state, action: PayloadAction<string[]>) => {
      const keysToKeep = action.payload;
      const newState = {...initialState};
      keysToKeep.forEach(key => {
        if (state.hasOwnProperty(key)) {
          // Using 'any' to bypass TypeScript's strict type checking
          (newState as any)[key] = (state as any)[key];
        }
      });

      return newState;
    },
    setListVisitPlans: (
      state,
      action: PayloadAction<TsushoResidentTenantItem[]>,
    ) => {
      state.listVisitPlans = action.payload;
    },
  },
});

export const {
  setRegisterAllData,
  setIsReload,
  setEndTimeItem,
  setHeadquarterSTItem,
  setFilteredHeadquarterSTItem,
  setStartTimeItem,
  setFilteredStartTimeItem,
  setFilteredEndTimeItem,
  setIsShowReha,
  setColWidths,
  setFilteringCharacter,
  setTsushoResidentTenantCount,
  setIsFilterByResident,
  setIsFilterByCareFocusing,
  setStartRegisterAllItems,
  setEndRegisterAllItems,
  setRegisterAllModalTypeOpening,
  addEndTimeItem,
  addStartTimeItem,
  addStartRegisterAllItem,
  addEndRegisterAllItem,
  addAllEndRegisterAllItem,
  addAllStartRegisterAllItem,
  deleteEndTimeItem,
  deleteStartTimeItem,
  deleteStartRegisterAllItem,
  deleteEndRegisterAllItem,
  deleteAllEndRegisterAllItem,
  deleteAllStartRegisterAllItem,
  resetTsushoVPState,
  setListVisitPlans,
} = tsushoVPSlice.actions;

export const selectRegisterAllData = (state: RootState) => {
  return state.tsushoVP.registerAllData;
};
export const selectStartRegisterAllItems = (state: RootState) => {
  return state.tsushoVP.startRegisterAllItems;
};
export const selectEndRegisterAllItems = (state: RootState) => {
  return state.tsushoVP.endRegisterAllItems;
};
export const selectStartTimeItems = (state: RootState) => {
  return state.tsushoVP.startTimeItems;
};
export const selectEndTimeItems = (state: RootState) => {
  return state.tsushoVP.endTimeItems;
};
export const selectFilteredStartTimeItems = (state: RootState) => {
  return state.tsushoVP.startTimeFilterItems;
};
export const selectFilteredEndTimeItems = (state: RootState) => {
  return state.tsushoVP.endTimeFilterItems;
};
export const selectHeadquartersSTItems = (state: RootState) => {
  return state.tsushoVP.headquartersSTItems;
};
export const selectFilteredHeadquartersSTItems = (state: RootState) => {
  return state.tsushoVP.headquartersSTFilterItems;
};
export const selectIsShowReha = (state: RootState) => {
  return state.tsushoVP.isShowReha;
};
export const selectIsFilterByResident = (state: RootState) => {
  return state.tsushoVP.isFilterByResident;
};
export const selectIsFilterByCareFocusing = (state: RootState) => {
  return state.tsushoVP.isFilterByCareFocusing;
};
export const selectTsushoVPColWidths = (state: RootState) => {
  return state.tsushoVP.tsushoVPcolWidths;
};
export const selectTsushoVPRegisterAllColWidths = (state: RootState) => {
  return state.tsushoVP.tsushoVPRegisterAllColWidths;
};
export const selectIsReload = (state: RootState) => {
  return state.tsushoVP.isReload;
};
export const selectTsushoResidentTenantCount = (state: RootState) =>
  state.tsushoVP.tsushoResidentTenantCount;

export const selectFilteringCharacter = (state: RootState) =>
  state.tsushoVP.filteringCharacter;
export const selectRegisterAllModalTypeOpening = (state: RootState) =>
  state.tsushoVP.registerAllModalTypeOpening;

export const selectListVisitPlans = (state: RootState) =>
  state.tsushoVP.listVisitPlans;

export default tsushoVPSlice.reducer;
