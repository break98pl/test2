import {AppType, Service} from '@modules/setting/setting.type';
import {cUserData} from '@database/models/various-registration-information-data/cUserData';
import {TextListItem} from '@organisms/SelectionList';

export interface GroupModel {
  name: string;
  count: number;
  staffs: cUserData[];
}

export interface StaffModel {
  firstName: string;
  firstNameF: string;
  lastName: string;
  lastNameF: string;
  staffCode: string;
  password: string;
  jobs?: string[];
}

export interface PlaceholderConfig {
  serverAddress?: string;
  serviceType?: string;
  serviceName?: string;
  dbName?: string;
  staff?: StaffModel | null;
  password?: string;
}

export interface AuthState {
  isDemoMode: boolean;
  isFetching: boolean;
  isAuthenticated: boolean;
  protocol: string;
  serverName: string;
  dbName: string;
  appType: AppType;
  service: Service | null;
  isShowDemoDatabaseInput: boolean;
  selectedStaff: StaffModel | null;
  listLoginServiceNames: TextListItem[];

  /**
   * Represent the id of setting connection selected by user.
   * In terms of UI, the connection list is shown in the tooltip of "ServerConnectionInput" component.
   */
  selectedSettingConnectionId: number;

  /**
   * Check whether the user is able to change the service name at Login screen or not.
   */
  canChangeServiceAtLoginScreen: boolean;

  /**
   * The lasted time after fetching or saving data successfully
   */
  latestSyncTime: string;
  /**
   * App type of previous login session.
   * It's not be persisted.
   */
  appTypeOfPreviousLogin: AppType;

  /**
   * Service of previous login session.
   * It's not be persisted.
   */
  serviceOfPreviousLogin: Service | null;
}

export interface APIModelForInitAppData {
  type: number;
  tableName: string;
  query: string;
  notDelete?: boolean;
}
