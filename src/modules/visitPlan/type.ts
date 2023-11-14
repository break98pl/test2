import {TodayExcretion} from '@database/models/recorded-data/functional-training/TodayExcretion';
import {TodayExercise} from '@database/models/recorded-data/functional-training/TodayExercise';
import {ScheduleTime} from '@database/models/residential-user-data/ScheduleTime';
import {TodayAttendance} from '@database/models/residential-user-data/TodayAttendance';
import {cDataWeekPlan} from '@database/models/residential-user-data/cDataWeekPlan';
import {cMonthPlanData} from '@database/models/residential-user-data/cMonthPlan';
import {cResultsData} from '@database/models/residential-user-data/cResultsData';
import {TenantInfo} from '@modules/tenant/tenant.type';
import {TsushoCareScheduleItemProps} from '@molecules/TsushoCareScheduleItem';
import {TsushoRegisterVPStateItemProps} from '@molecules/TsushoRegisterVPStateItem';
import {TsushoVPRegisterLetterProps} from '@molecules/TsushoVPRegisterLetterItem';
import {TsushoVPRehaItemProps} from '@molecules/TsushoVPRehaItem';
import {TsushoMonthlyPlanAndResultItemProps} from '@molecules/TsushoMonthyPlanAndResultItem';
import {DimensionValue} from 'react-native';
import {RegisterAllModalType} from '@organisms/RegisterAllModal';

export enum DaysInWeek {
  Monday = '月',
  Tuesday = '火',
  Wednesday = '水',
  Thursday = '木',
  Friday = '金',
  Saturday = '土',
  Sunday = '日',
}

// todo: remove later
export enum RecordType {
  Bath = 'bathRecord',
  Vital = 'vitalRecord',
  Excretion = 'excretionRecord',
  Elapsed = 'elapsedRecord',
  // shisetsu meal
  SubMeal = 'subMealRecord',
  MainMeal = 'mainMealRecord',
  OtherDrink = 'otherDrinkRecord',
  // tsusho
  Reha = 'rehaRecord',
  Attendance = 'attendanceRecord',
  Letter = 'letterRecord',
  // other systems
  Drug = 'drugRecord',
  SensorDevice = 'sensorDeviceRecord',
  ProtectBath = 'protectBathRecord',
  ProtectProgress = 'protectProgressRecord',
  ProtectEventNotification = 'protectEventNotificationRecord',
  ProtectVital = 'protectVitalRecord',
  ProtectExcretion = 'protectExcretionRecord',
  ProtectMeasurement = 'protectMeasurementRecord',
}

export enum RegisterState {
  Start = 'start',
  GoHome = 'goHome',
  Leave = 'leave',
  Cancel = 'cancel',
  Absent = 'absent',
}

export type TsushoResidentTenantItem = {
  id: string;
  user: TenantInfo;
  careSchedule: TsushoCareScheduleItemProps;
  monthlyPlanAndResult: TsushoMonthlyPlanAndResultItemProps;
  registerVPState: TsushoRegisterVPStateItemProps;
  isSettled: boolean;
  registerLetter: TsushoVPRegisterLetterProps;
  reha: TsushoVPRehaItemProps;
};

export type TsushoVPcolWidthsType = {
  userInfo: DimensionValue;
  careSchedule: DimensionValue;
  weeklySchedule: DimensionValue;
  result: DimensionValue;
  registerVPState: DimensionValue;
  settled: DimensionValue;
  registerLetter: DimensionValue;
  reha: DimensionValue;
  recordListNavigation: DimensionValue;
  check?: DimensionValue;
};

export interface TsushoVPState {
  registerAllData: TsushoResidentTenantItem[];
  startRegisterAllItems: TsushoResidentTenantItem[];
  endRegisterAllItems: TsushoResidentTenantItem[];
  registerAllModalTypeOpening: RegisterAllModalType;
  isReload: boolean;
  isShowReha: boolean;
  tsushoVPcolWidths: TsushoVPcolWidthsType;
  tsushoVPRegisterAllColWidths: TsushoVPcolWidthsType;
  startTimeItems: string[];
  endTimeItems: string[];
  startTimeFilterItems: string[];
  endTimeFilterItems: string[];
  headquartersSTItems: SateLiteInfo[];
  headquartersSTFilterItems: SateLiteInfo[];
  tsushoResidentTenantCount: number;
  isFilterByResident: boolean;
  isFilterByCareFocusing: boolean;
  filteringCharacter: string;
  listVisitPlans: TsushoResidentTenantItem[];
}

export interface ResidentTenantInfo extends TenantInfo {
  weekDayOfWeekPlanData?: string;
  currentMonthResultData?: cResultsData;
  currentMonthPlanData?: cMonthPlanData;
  currentWeekPlan?: cDataWeekPlan;
  currentReportDataList?: any[];
  todayAttendance?: TodayAttendance;
  todayExercise?: TodayExercise;
  todayExcretion?: TodayExcretion;
  dateCareReportUpdate?: Date;
  serviceTime?: ScheduleTime;
  scheduleTime?: ScheduleTime;
  baseResidentialTenantData?: ResidentTenantInfo;
  hasUnsync?: boolean;
}

export interface TsushoFilterType {
  listFilteredStartTime: string[];
  listFilteredEndTime: string[];
  listFilteredHeadquarters: SateLiteInfo[];
  isFilterByResident: boolean;
  isFilterByCareFocusing: boolean;
  filteringCharacter: string;
}

export interface SateLiteInfo {
  officeKey: string;
  sateliteKey: string;
  serviceType: number;
  name: string;
}
