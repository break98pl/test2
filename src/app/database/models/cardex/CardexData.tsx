import {cExcretionIconData} from '../cExcretionIconData';
import {cBitalData} from '../recorded-data/cBitalData';
import {TodayAttendance} from '../residential-user-data/TodayAttendance';
import {cOvernightData} from '../various-registration-information-data/cOvernightData';

export enum STAY_OUT {
  STAY_OUT_NONE, //外泊無し
  STAY_OUT_START, //外泊出
  STAY_OUT_MIDDLE, //外泊中
  STAY_OUT_END, //外泊戻り
}

export enum GOING_OUT {
  GOING_OUT_NONE, //外出無し
  GOING_OUT_START, //外出出
  GOING_OUT_MIDDLE, //外出中
  GOING_OUT_END, //外出戻り
  GOING_OUT_START_END, //外出出戻り
  GOING_CONSULT_START, //受診出
  GOING_CONSULT_MIDDLE, //受診中
  GOING_CONSULT_END, //受診戻り
  GOING_CONSULT_START_END, //受診出戻り
  GOING_MEETING_START, //面会出
  GOING_MEETING_MIDDLE, //面会中
  GOING_MEETING_END, //面会戻り
  GOING_MEETING_START_END, //面会出戻り
}

export enum UNINSURED {
  UNINSURED_INSURED, //保険適用
  UNINSURED_START, //保険外開始
  UNINSURED_MIDDLE, //保険外時間中
  UNINSURED_END, //保険外終了
}

export enum LIVING_STATE {
  LIVING_NOT, //未入所
  LIVING_BEFORE_ENTERING, //入所前直前
  LIVING_IN_MIDDLE, //入所中
  LIVING_AFTER_LEAVING, //入所終了直後
}

export enum CARDEX_PERIOD {
  THREE_HOURS, //1マス15分
  SIX_HOURS, //1マス30分
  TWELVE_HOURS, //１マス1時間
  OneDay, //1マス2時間
  OneWeek, //1マス12時間
  TOW_WEEKS, //1マス1日
  FOUR_WEEKS, //1マス2日(データセルは１日セル数が倍)
}

export enum FILTER_REPORT_TYPE {
  FILTER_MEMO,
  FILTER_PROCESS,
  FILTER_MEAL,
  FILTER_BATH,
  FILTER_VITAL,
  FILTER_EXCRETION,
}

export enum SERVICE_STATE {
  SERVICE_NONE, // 1 << 0,
  SERVICE_VISITING_START, // = 1 << 1,
  SERVICE_VISITING_IN_MIDDLE, // = 1 << 2,
  SERVICE_VISITING_END, // = 1 << 3,
  SERVICE_VISITING_START_END, // = 1 << 4,
  SERVICE_COMING_START, // = 1 << 5,
  SERVICE_COMING_IN_MIDDLE, // = 1 << 6,
  SERVICE_COMING_END, // = 1 << 7,
  SERVICE_COMING_START_END, // = 1 << 8,
  SERVICE_STAYING_START, // = 1 << 9,
  SERVICE_STAYING_IN_MIDDLE, // = 1 << 10,
  SERVICE_STAYING_END, // = 1 << 11,
  SERVICE_STAYING_START_END, // = 1 << 12,
  SERVICE_STAYING_BEFORE_START, // = 1 << 13,
  SERVICE_STAYING_BEFORE_END, // = 1 << 14,
  SERVICE_STAYING_BEFORE_IN_MIDDLE, // = 1 << 15,
  SERVICE_STAYING_BEFORE_START_END, // = 1 << 16,
  SERVICE_SHORTING_START, // = 1 << 17,
  SERVICE_SHORTING_IN_MIDDLE, // = 1 << 18,
  SERVICE_SHORTING_END, // = 1 << 19,
  SERVICE_SHORTING_START_END, // = 1 << 20,
}

export class CardexData {
  // Tsusho
  startDate?: string;
  endDate?: string;
  dataCount?: number;
  hasMemo?: boolean;
  hasUnSendReport?: boolean;
  stayOutState?: STAY_OUT;
  goingOutState?: GOING_OUT;
  livingState?: LIVING_STATE;
  unInsuredState?: UNINSURED;
  serviceState?: SERVICE_STATE;
  reportType?: number;
  noReport?: boolean;
  hasSchedule?: boolean;
  arrStringKey?: any[];
  typeForMemo?: FILTER_REPORT_TYPE;
  excretionIconSetNum?: number;
  excretionIconData?: cExcretionIconData;
  averageMealAmount?: number;
  totalAmountHydration?: number;
  aVitalForACardex?: cBitalData;
  overNightData?: cOvernightData;
  arrOverNightData?: any[];
  arrMonthlyResult?: any[];
  arrMonthlyResultPreviousDay?: any[];
  weekDayOfCellStartDate?: string;
  strStartYearMonth?: string;
  anAttendance?: TodayAttendance;

  // Shisetsu
  waterAmountHydration?: number;
  mealAmountHydration?: number;

  constructor() {}
}
