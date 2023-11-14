import {RecordStatus} from '@molecules/PopoverRecordHeader';

export interface ItemProps {
  id: number;
  title: string;
  unit?: string;
  hint?: {minVolume: string; maxVolume: string};
}

export interface DataUserRecordVital {
  id: string;
  date?: string;
  reporter: string;
  pulse: string;
  breathing: string;
  highBloodPressure: string;
  lowBloodPressure: string;
  bodyTemperature: string;
  oxygenSaturation: string;
  weight: string;
  memo: string;
  reportSetting: string;
  serviceType: string;
  isSynced?: boolean;
}
export interface DataUserChangeRecordVital {
  id?: string;
  date?: string;
  reporter?: string;
  pulse?: string;
  breathing?: string;
  highBloodPressure?: string;
  lowBloodPressure?: string;
  bodyTemperature?: string;
  oxygenSaturation?: string;
  weight?: string;
  memo?: string;
  reportSetting?: string;
  serviceType?: string;
  isSynced?: boolean;
}

export interface userRecordVital {
  name: string;
  statusRecord: RecordStatus;
  data: DataUserRecordVital[];
}

export interface VitalType {
  // dataUser: userRecordVital;
  lastestDataVitalUser: DataUserRecordVital;
  isBluetoothData: boolean;
  selectedId: number;
}

import {
  GoingOutPlan,
  ServicePlan,
  TenantInfo,
} from '@modules/tenant/tenant.type';
import {TsushoRegisterVPStateItemProps} from '@molecules/TsushoRegisterVPStateItem';

export type TVitalRecordData = {
  id: string;
  recordDate: string;
  pulse: string;
  respiratory: string;
  highBloodPressure: string;
  lowBloodPressure: string;
  temperature: string;
  saturation: string;
  weight: string;
  memo: string;
  isSynced?: boolean;
};

export interface VitalListItem extends TenantInfo {
  vital?: TVitalRecordData[];
  goingOutPlans?: GoingOutPlan[];
  registerVPState?: TsushoRegisterVPStateItemProps;

  /* --- Only Takino --- */
  servicePlans?: ServicePlan[];
  hasPreviousOvernightStay?: boolean;
}

export interface VitalListSection {
  id: string;
  title: string;
  data: VitalListItem[];
}

export interface TLatestVitalData {
  [key: string]: string | null | undefined;
}
