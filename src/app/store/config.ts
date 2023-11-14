import logger from 'redux-logger';
import {
  autoBatchEnhancer,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import careListReducer from '@modules/careList/careList.slice';
import tsushoVPListReducer from '@modules/visitPlan/tsushoVPList.slice';
import settingReducer from '@modules/setting/setting.slice';
import authReducer from '@modules/authentication/auth.slice';
import tenantReducer from '@modules/tenant/tenant.slice';
import recordReducer from '@modules/record/record.slice';
import vitalReducer from '@modules/vital/vital.slice';

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [],
};

const settingPersistConfig = {
  key: 'setting',
  storage: AsyncStorage,
  blacklist: ['isFetching'],
};

const authPersistConfig = {
  key: 'authentication',
  storage: AsyncStorage,
  whitelist: [
    'dbName',
    'service',
    'appType',
    'protocol',
    'serverName',
    'appTypeOfPreviousLogin',
    'serviceOfPreviousLogin',
    'selectedSettingConnectionId',
    'canChangeServiceAtLoginScreen',
  ],
};

const tenantPersistConfig = {
  key: 'tenant',
  storage: AsyncStorage,
  whitelist: ['sortBy'],
};

const rootReducer = combineReducers({
  tsushoVP: tsushoVPListReducer,
  careList: careListReducer,
  setting: persistReducer(settingPersistConfig, settingReducer),
  authentication: persistReducer(authPersistConfig, authReducer),
  tenant: persistReducer(tenantPersistConfig, tenantReducer),
  record: recordReducer,
  vital: vitalReducer,
});
const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([logger]),
  enhancers: defaultEnhancers => {
    return defaultEnhancers.concat(autoBatchEnhancer());
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export const persistor = persistStore(store);
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
