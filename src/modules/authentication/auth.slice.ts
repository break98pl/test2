import {createSlice, PayloadAction, prepareAutoBatched} from '@reduxjs/toolkit';
import {RootState} from '@store/config';
import {DEMO_ADDRESS} from '@constants/constants';
import {AuthState, StaffModel} from '@modules/authentication/auth.type';
import {
  AppType,
  ServerConnectionInfo,
  Service,
} from '@modules/setting/setting.type';
import {TextListItem} from '@organisms/SelectionList';

const initialState: AuthState = {
  isFetching: false,
  isAuthenticated: false,
  selectedSettingConnectionId: -1,
  protocol: 'https',
  serverName: DEMO_ADDRESS,
  dbName: '',
  service: null,
  appType: AppType.UNKNOWN,
  selectedStaff: null,
  isDemoMode: false,
  isShowDemoDatabaseInput: false,
  canChangeServiceAtLoginScreen: false,
  latestSyncTime: new Date().toISOString(),
  appTypeOfPreviousLogin: AppType.UNKNOWN,
  serviceOfPreviousLogin: null,
  listLoginServiceNames: [],
};

const AuthSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setAuthInfo: (
      state,
      {payload}: PayloadAction<{connectionInfo: ServerConnectionInfo}>,
    ) => {
      const connectionInfo = JSON.parse(JSON.stringify(payload.connectionInfo));
      state.selectedSettingConnectionId = connectionInfo.id;
      state.protocol = connectionInfo.protocol;
      state.serverName = connectionInfo.serverName;
      state.dbName = connectionInfo.dbName;
      state.service = connectionInfo.service;
      state.appType = connectionInfo.appType;
    },
    setIsAuthenticated: (state, {payload}: PayloadAction<{value: boolean}>) => {
      state.isAuthenticated = payload.value;
    },
    setSelectedStaff: (
      state,
      action: PayloadAction<{value: StaffModel | null}>,
    ) => {
      state.selectedStaff = action.payload.value;
    },
    setService: (state, action: PayloadAction<{service: Service}>) => {
      state.service = action.payload.service;
    },
    setDBName: (state, action: PayloadAction<{dbName: string}>) => {
      state.dbName = action.payload.dbName;
    },
    setAppType: (state, action: PayloadAction<{appType: AppType}>) => {
      state.appType = action.payload.appType;
    },
    setIsFetching: (state, action: PayloadAction<{isFetching: boolean}>) => {
      state.isFetching = action.payload.isFetching;
    },
    setShowDemoDatabaseInput: (
      state,
      action: PayloadAction<{showDBInput: boolean}>,
    ) => {
      state.isShowDemoDatabaseInput = action.payload.showDBInput;
    },
    setIsDemoMode: (state, action: PayloadAction<{isDemoMode: boolean}>) => {
      state.isDemoMode = action.payload.isDemoMode;
    },
    toggleShowDemoDBInput: state => {
      state.isShowDemoDatabaseInput = !state.isShowDemoDatabaseInput;
    },
    setCanChangeServiceAtLoginScreen: (
      state,
      action: PayloadAction<{value: boolean}>,
    ) => {
      state.canChangeServiceAtLoginScreen = action.payload.value;
    },
    setLatestSyncTime: {
      reducer: (state, action: PayloadAction<{time: string}>) => {
        state.latestSyncTime = action.payload.time;
      },
      prepare: prepareAutoBatched<{time: string}>(),
    },
    setAppTypeOfPreviousLogin: (
      state,
      action: PayloadAction<{appType: AppType}>,
    ) => {
      state.appTypeOfPreviousLogin = action.payload.appType;
    },
    setServiceOfPreviousLogin: (
      state,
      action: PayloadAction<{service: Service | null}>,
    ) => {
      state.serviceOfPreviousLogin = action.payload.service;
    },
    setListLoginServiceNames: (
      state,
      action: PayloadAction<TextListItem[]>,
    ) => {
      state.listLoginServiceNames = action.payload;
    },
  },
});

export const {
  setIsAuthenticated,
  setAuthInfo,
  setSelectedStaff,
  setService,
  setDBName,
  setAppType,
  setIsFetching,
  setShowDemoDatabaseInput,
  setIsDemoMode,
  toggleShowDemoDBInput,
  setCanChangeServiceAtLoginScreen,
  setLatestSyncTime,
  setAppTypeOfPreviousLogin,
  setServiceOfPreviousLogin,
  setListLoginServiceNames,
} = AuthSlice.actions;

export const selectAuthState = (state: RootState): AuthState =>
  state.authentication;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.authentication.isAuthenticated;
export const selectServerName = (state: RootState): string =>
  state.authentication.serverName;
export const selectChoseServiceType = (state: RootState): string =>
  state.authentication.service?.serviceType ?? '';
export const selectChoseServiceName = (state: RootState): string =>
  state.authentication.service?.serviceName ?? '';
export const selectChoseService = (state: RootState): Service | null =>
  state.authentication.service;
export const selectDemoMode = (state: RootState): boolean =>
  state.authentication.isDemoMode;
export const selectDBName = (state: RootState): string =>
  state.authentication.dbName;
export const selectSelectedStaff = (state: RootState): StaffModel | null =>
  state.authentication.selectedStaff;
export const selectAppType = (state: RootState): AppType =>
  state.authentication.appType;
export const selectSelectedConnectionSettingId = (state: RootState): number =>
  state.authentication.selectedSettingConnectionId;
export const selectFetching = (state: RootState): boolean =>
  state.authentication.isFetching;
export const selectCanChangeServiceAtLoginScreen = (
  state: RootState,
): boolean => state.authentication.canChangeServiceAtLoginScreen;
export const selectLatestSyncTime = (state: RootState): string =>
  state.authentication.latestSyncTime;
export const selectListLoginServiceNames = (state: RootState): TextListItem[] =>
  state.authentication.listLoginServiceNames;

export default AuthSlice.reducer;
