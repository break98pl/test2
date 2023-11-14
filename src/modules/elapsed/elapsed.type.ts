import {
  GoingOutPlan,
  ServicePlan,
  TenantInfo,
} from '@modules/tenant/tenant.type';
import {TsushoRegisterVPStateItemProps} from '@molecules/TsushoRegisterVPStateItem';

export type TElapsedRecordData = {
  id: string;
  recordDate: string;
  placeTemplate: string;
  placeKey: string;
  classification: string;
  reporter: string;
  serviceType: string;
  registerPhoto: string;
  content: string;
  settingReport: string;
  isAssign?: boolean;
  isSynced?: boolean;
};

export type TElapsedRecordDataChange = {
  id?: string;
  recordDate?: string;
  placeTemplate?: string;
  placeKey?: string;
  classification?: string;
  reporter?: string;
  serviceType?: string;
  registerPhoto?: string;
  content?: string;
  settingReport?: string;
};

export interface ElapsedListItem extends TenantInfo {
  goingOutPlans?: GoingOutPlan[];
  elapsedRecords?: TElapsedRecordData[];
  registerVPState?: TsushoRegisterVPStateItemProps;
  isSettled?: boolean;

  /* --- Only Takino --- */
  servicePlans?: ServicePlan[];
  hasPreviousOvernightStay?: boolean;
}

export interface ElapsedListSection {
  id: string;
  title: string;
  data: ElapsedListItem[];
}
