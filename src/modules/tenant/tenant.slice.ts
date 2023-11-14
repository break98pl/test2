import {
  createSelector,
  createSlice,
  PayloadAction,
  prepareAutoBatched,
} from '@reduxjs/toolkit';
import {
  SortingType,
  TenantListItem,
  TenantListSection,
  TenantManagementState,
} from './tenant.type';
import {RootState} from '@store/config';
import moment from 'moment';
import {DATABASE_DATETIME_FORMAT, DATE_FORMAT} from '@constants/constants';
import {FCPRecord} from '@modules/record/record.type';

const initialState: TenantManagementState = {
  allTenantsData: [],
  tenantSectionData: [],
  filteringCharacter: 'all',
  sortBy: SortingType.ByAlphabet,
  filteringDate: moment().format(DATABASE_DATETIME_FORMAT),
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setSortingOption: (
      state,
      action: PayloadAction<{sortedBy: SortingType}>,
    ) => {
      state.sortBy = action.payload.sortedBy;
    },
    setFilteringDate: (state, action: PayloadAction<{date: string}>) => {
      state.filteringDate = action.payload.date;
    },
    setAllTenantsData: {
      reducer: (
        state,
        action: PayloadAction<{allTenants: TenantListItem[]}>,
      ) => {
        state.allTenantsData = action.payload.allTenants;
      },
      prepare: prepareAutoBatched<{allTenants: TenantListItem[]}>(),
    },
    updateTenantStatesWhenLogout: state => {
      state.allTenantsData = [];
      state.filteringCharacter = 'all';
      state.filteringDate = moment().format(DATE_FORMAT);
    },
    setFilteringCharacter: (state, action: PayloadAction<{char: string}>) => {
      state.filteringCharacter = action.payload.char;
    },
    setTenantSectionList: (
      state,
      action: PayloadAction<{tenantSections: TenantListSection[]}>,
    ) => {
      state.tenantSectionData = action.payload.tenantSections;
    },
    setTenantData: {
      reducer: (state, action: PayloadAction<TenantListItem>) => {
        const tenant = action.payload;
        const index = state.allTenantsData.findIndex(
          e => e.tenantCode === tenant.tenantCode,
        );
        if (index > -1) {
          state.allTenantsData[index] = tenant;
        } else {
          state.allTenantsData.push(tenant);
        }
      },
      prepare: prepareAutoBatched<TenantListItem>(),
    },
    updateRecordOfSelectedTenant: (
      state,
      {payload}: PayloadAction<{fcpRecord?: FCPRecord}>,
    ) => {
      const fcpRecord = payload.fcpRecord;
      const tenants = state.allTenantsData.filter(
        tenant => tenant.tenantCode === fcpRecord?.tenantCode,
      );
      tenants.forEach(tenant => {
        const indexTenant = state.allTenantsData.findIndex(
          e => e.tenantCode === tenant?.tenantCode,
        );
        if (indexTenant > -1) {
          const indexRecord = state.allTenantsData[
            indexTenant
          ].records.findIndex(record => record.id === payload.fcpRecord?.id);
          if (indexRecord > -1) {
            // update
            state.allTenantsData[indexTenant].records[indexRecord] = {
              ...state.allTenantsData[indexTenant].records[indexRecord],
              ...payload.fcpRecord,
            };
          } else {
            //insert
            state.allTenantsData[indexTenant].records.push(payload.fcpRecord!);
          }
        }
      });
    },
    deleteRecordOfSelectedTenant: (
      state,
      {payload}: PayloadAction<{tenantCode: string; id: string}>,
    ) => {
      const tenants = state.allTenantsData.filter(
        tenant => tenant.tenantCode === payload.tenantCode,
      );
      tenants.forEach(tenant => {
        const indexTenant = state.allTenantsData.findIndex(
          e => e.tenantCode === tenant.tenantCode,
        );
        if (indexTenant > -1) {
          state.allTenantsData[indexTenant].records = state.allTenantsData[
            indexTenant
          ].records.filter(record => {
            return record.id !== payload.id;
          });
        }
      });
    },
  },
});

export const {
  setSortingOption,
  setFilteringDate,
  setAllTenantsData,
  setFilteringCharacter,
  updateTenantStatesWhenLogout,
  setTenantSectionList,
  setTenantData,
  updateRecordOfSelectedTenant,
  deleteRecordOfSelectedTenant,
} = tenantSlice.actions;

export const selectSortingOption = (state: RootState) => state.tenant.sortBy;
export const selectFilteringDate = (state: RootState) =>
  state.tenant.filteringDate;
export const selectFilteringCharacter = (state: RootState) =>
  state.tenant.filteringCharacter;
export const selectAllTenantsData = (state: RootState) =>
  state.tenant.allTenantsData;
export const selectTenantSectionData = (
  state: RootState,
): TenantListSection[] => state.tenant.tenantSectionData;
export const selectAppTenantCount = createSelector(
  selectTenantSectionData,
  tenantSections => {
    const tenantCodes = tenantSections
      .map(section => section.data)
      .flat()
      .map(tenant => tenant.tenantCode);
    const uniqueCodes = Array.from(new Set(tenantCodes));
    return uniqueCodes.length;
  },
);

export default tenantSlice.reducer;
