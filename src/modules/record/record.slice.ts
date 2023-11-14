import {createSlice, PayloadAction, prepareAutoBatched} from '@reduxjs/toolkit';
import {
  OtherSystemDisplaySetting,
  RecordSetting,
  RecordSliceState,
  SettingsSelectItem,
  VitalRecordSetting,
} from '@modules/record/record.type';
import {RootState} from '@store/config';
import {INITIAL_VITAL_RECORD_SETTING} from '@modules/record/record.constant';

const initialState: RecordSliceState = {
  recordSetting: {
    otherSystemDisplay: [],
    vital: INITIAL_VITAL_RECORD_SETTING,
    classificationTemplateList: [],
    placeTemplateList: [],
    classificationKeyList: [],
    placeKeyList: [],
    waterList: [],
  },
  careListSortedBy: 'desc',
  holidays: [],
};

const recordSlice = createSlice({
  name: 'record',
  initialState,
  reducers: {
    setRecordSetting: {
      reducer: (
        state,
        action: PayloadAction<{recordSetting: RecordSetting}>,
      ) => {
        state.recordSetting = action.payload.recordSetting;
      },
      prepare: prepareAutoBatched<{recordSetting: RecordSetting}>(),
    },
    setCareListSortedBy: (
      state,
      action: PayloadAction<{sortedBy: 'asc' | 'desc'}>,
    ) => {
      state.careListSortedBy = action.payload.sortedBy;
    },
    setHolidays: {
      reducer: (state, action: PayloadAction<string[]>) => {
        state.holidays = action.payload;
      },
      prepare: prepareAutoBatched<string[]>(),
    },
    setClassificationTemplateList: (
      state,
      {payload}: PayloadAction<{classificationList: SettingsSelectItem[]}>,
    ) => {
      state.recordSetting.classificationTemplateList =
        payload.classificationList;
    },
    setPlaceTemplateList: (
      state,
      {payload}: PayloadAction<{placeList: SettingsSelectItem[]}>,
    ) => {
      state.recordSetting.placeTemplateList = payload.placeList;
    },
    setClassificationKeyList: (
      state,
      {payload}: PayloadAction<{classificationList: SettingsSelectItem[]}>,
    ) => {
      state.recordSetting.classificationKeyList = payload.classificationList;
    },
    setPlaceKeyList: (
      state,
      {payload}: PayloadAction<{placeList: SettingsSelectItem[]}>,
    ) => {
      state.recordSetting.placeKeyList = payload.placeList;
    },
    setWaterList: (
      state,
      {payload}: PayloadAction<{waterList: SettingsSelectItem[]}>,
    ) => {
      state.recordSetting.waterList = payload.waterList;
    },
  },
});

export const {
  setRecordSetting,
  setCareListSortedBy,
  setClassificationTemplateList,
  setPlaceTemplateList,
  setClassificationKeyList,
  setPlaceKeyList,
  setHolidays,
  setWaterList,
} = recordSlice.actions;

export const selectOtherSystemDisplaySettings = (
  state: RootState,
): OtherSystemDisplaySetting[] => state.record.recordSetting.otherSystemDisplay;
export const selectVitalSetting = (state: RootState): VitalRecordSetting =>
  state.record.recordSetting.vital;
export const selectRecordSetting = (state: RootState): RecordSetting =>
  state.record.recordSetting;
export const selectCareListSortedBy = (state: RootState): 'asc' | 'desc' => {
  return state.record.careListSortedBy;
};
export const selectHolidays = (state: RootState): string[] => {
  return state.record.holidays;
};

export default recordSlice.reducer;
