export enum AppType {
  UNKNOWN,
  SHISETSHU,
  JUTAKU,
  TAKINO,
  TSUSHO,
}

export enum TakinoServiceType {
  DEFAULT = '小規模多機能',
  KANGO = '看護小規模多機能',
}

export interface Service {
  serviceCode: string;
  serviceName: string;
  serviceType: string | null;
}

export interface ServerConnectionInfo {
  id: number;
  protocol: string;
  serverName: string;
  dbName: string;
  service: Service | null;
  appType: AppType;
}

export enum SettingOption {
  CardexDefault = 0,
  NotDistinctionProvisionTimeAndOutside = 1,
  UseTemplateExcretion = 2,
  ElapsedDefault = 3,
  AllowMultipleOptions = 4,
  ShowSaveButton = 5,
  ShowCareManagerElapsedJutaku = 6,
  ShowCareManagerElapsedTakino = 7,
  ShowCareManagerElapsedTsusho = 8,
}

/**
 * Represent the period of time the data will be fetched.
 */
export enum FetchTimeType {
  OneDay = '1d',
  ThreeDay = '3d',
  OneWeek = '1w',
  TwoWeek = '2w',
  OneMonth = '1m',
}

/**
 * Type of redux setting state.
 */
export interface SettingState {
  isFetching: boolean;
  loginSettings: ServerConnectionInfo[];
  selectedLoginInfo?: ServerConnectionInfo;
  additionalServices: string[];
  FILESTREAM: boolean;
  fetchTime: FetchTimeType;
  isCardexDefault: boolean;
  isUseTemplateExcretion: boolean;
  isElapsedDefault: boolean;
  isAllowMultipleOptions: boolean;
  isShowedSaveButton: boolean;
  isNotDistinctionProvisionTimeAndOutside: boolean; // Setting only TSUSHO
  isShowCareManagerElapsedJutaku: boolean;
  isShowCareManagerElapsedTakino: boolean;
  isShowCareManagerElapsedTsusho: boolean;
}
