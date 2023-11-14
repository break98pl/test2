import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@store/config';
import {DataUserRecordVital, VitalType} from './vital.type';
import {dataVitalUser} from './dummyData';

const initialState: VitalType = {
  lastestDataVitalUser: {} as DataUserRecordVital,
  isBluetoothData: false,
  selectedId: -1,
};

const vitalSlice = createSlice({
  name: 'vital',
  initialState,
  reducers: {
    fetchDataVital: state => {
      state.lastestDataVitalUser = dataVitalUser.data[0];
    },
    addDataVital: (state, {payload}: PayloadAction<DataUserRecordVital>) => {
      state.lastestDataVitalUser = payload;
    },
    setIsBluetoothData: (state, {payload}: PayloadAction<boolean>) => {
      state.isBluetoothData = payload;
    },
    incrementSelectedId: state => {
      state.selectedId = state.selectedId + 1;
    },
    subSelectedId: state => {
      state.selectedId = state.selectedId - 1;
    },
    setSelectedId: (state, {payload}: PayloadAction<number>) => {
      state.selectedId = payload;
    },
  },
});

export const selectDataLastestVital = (state: RootState) =>
  state.vital.lastestDataVitalUser;
export const getIsBluetoothData = (state: RootState) =>
  state.vital.isBluetoothData;
export const getSelectedId = (state: RootState) => state.vital.selectedId;

export const {
  fetchDataVital,
  addDataVital,
  setIsBluetoothData,
  incrementSelectedId,
  subSelectedId,
  setSelectedId,
} = vitalSlice.actions;

export default vitalSlice.reducer;
