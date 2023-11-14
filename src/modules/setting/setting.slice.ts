import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@store/config';
import {
  FetchTimeType,
  ServerConnectionInfo,
  SettingState,
  SettingOption,
} from '@modules/setting/setting.type';

const initialState: SettingState = {
  isFetching: false,
  loginSettings: [],
  fetchTime: FetchTimeType.TwoWeek,
  isCardexDefault: false,
  isUseTemplateExcretion: false,
  isElapsedDefault: true,
  isAllowMultipleOptions: true,
  isShowedSaveButton: false,
  isNotDistinctionProvisionTimeAndOutside: false,
  isShowCareManagerElapsedJutaku: false,
  isShowCareManagerElapsedTakino: false,
  isShowCareManagerElapsedTsusho: false,
  additionalServices: [],
  FILESTREAM: false,
};

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    addServerSettings: (
      state,
      action: PayloadAction<{setting: ServerConnectionInfo}>,
    ) => {
      state.loginSettings.push(action.payload.setting);
    },
    setFetchTime: (
      state,
      action: PayloadAction<{fetchTime: FetchTimeType}>,
    ) => {
      state.fetchTime = action.payload.fetchTime;
    },
    toggleChange: (state, action: PayloadAction<{type: SettingOption}>) => {
      switch (action.payload.type) {
        case SettingOption.CardexDefault: {
          state.isCardexDefault = !state.isCardexDefault;
          break;
        }
        case SettingOption.UseTemplateExcretion: {
          state.isUseTemplateExcretion = !state.isUseTemplateExcretion;
          break;
        }
        case SettingOption.ElapsedDefault: {
          state.isElapsedDefault = !state.isElapsedDefault;
          break;
        }
        case SettingOption.AllowMultipleOptions: {
          state.isAllowMultipleOptions = !state.isAllowMultipleOptions;
          break;
        }
        case SettingOption.ShowSaveButton: {
          state.isShowedSaveButton = !state.isShowedSaveButton;
          break;
        }
        case SettingOption.NotDistinctionProvisionTimeAndOutside: {
          state.isNotDistinctionProvisionTimeAndOutside =
            !state.isNotDistinctionProvisionTimeAndOutside;
          break;
        }
        case SettingOption.ShowCareManagerElapsedJutaku: {
          state.isShowCareManagerElapsedJutaku =
            !state.isShowCareManagerElapsedJutaku;
          break;
        }
        case SettingOption.ShowCareManagerElapsedTakino: {
          state.isShowCareManagerElapsedTakino =
            !state.isShowCareManagerElapsedTakino;
          break;
        }
        case SettingOption.ShowCareManagerElapsedTsusho: {
          state.isShowCareManagerElapsedTsusho =
            !state.isShowCareManagerElapsedTsusho;
          break;
        }
        default:
          break;
      }
    },
    removeConnectionInfoById: (state, action: PayloadAction<{id: number}>) => {
      const index = state.loginSettings.findIndex(
        e => e.id === action.payload.id,
      );
      if (index > -1) {
        state.loginSettings.splice(index, 1);
      }
    },
    setSettingFetching: (state, action: PayloadAction<{fetching: boolean}>) => {
      state.isFetching = action.payload.fetching;
    },
    setAdditionalServices: (
      state,
      action: PayloadAction<{additionalServices: string[]}>,
    ) => {
      state.additionalServices = action.payload.additionalServices;
    },
    setFileStream: (state, action: PayloadAction<{fileStream: boolean}>) => {
      state.FILESTREAM = action.payload.fileStream;
    },
  },
});

export const {
  addServerSettings,
  setFetchTime,
  toggleChange,
  removeConnectionInfoById,
  setSettingFetching,
  setAdditionalServices,
  setFileStream,
} = settingSlice.actions;

export const selectFetchTime = (state: RootState) => state.setting.fetchTime;
export const selectIsCardexDefault = (state: RootState) =>
  state.setting.isCardexDefault;
export const selectIsUseTemplateExcretion = (state: RootState) =>
  state.setting.isUseTemplateExcretion;
export const selectIsElapsedDefault = (state: RootState) =>
  state.setting.isElapsedDefault;
export const selectIsAllowMultipleOptions = (state: RootState) =>
  state.setting.isAllowMultipleOptions;
export const selectIsShowedSaveButton = (state: RootState) =>
  state.setting.isShowedSaveButton;
export const selectIsNotDistinctionProvisionTimeAndOutside = (
  state: RootState,
) => state.setting.isNotDistinctionProvisionTimeAndOutside;
export const selectIsShowCareManagerProfileJutaku = (state: RootState) =>
  state.setting.isShowCareManagerElapsedJutaku;
export const selectIsShowCareManagerProfileTakino = (state: RootState) =>
  state.setting.isShowCareManagerElapsedTakino;
export const selectIsShowCareManagerProfileTsusho = (state: RootState) =>
  state.setting.isShowCareManagerElapsedTsusho;
export const selectLoginSettings = (state: RootState): ServerConnectionInfo[] =>
  state.setting.loginSettings;
export const selectSettingFetching = (state: RootState): boolean =>
  state.setting.isFetching;

export default settingSlice.reducer;
