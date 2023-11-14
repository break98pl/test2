import {
  GoingOutPlan,
  ServicePlan,
  TodayPlan,
} from '@modules/tenant/tenant.type';

export enum RecordType {
  Elapsed = 'Elapsed',
  Meal = 'Meal',
  Vital = 'Vital',
  Excretion = 'Excretion',
  Bath = 'Bath',
  Letter = 'Letter',
  Attendance = 'Attendance',
  Reha = 'Reha',
  Medication = 'Medication',
  OtherSystem = 'OtherSystem',
  APCheckin = '1',
  APCheckout = '2',
  APOrder = '3',
  APSignature = '9',
  APLeaveNote = '10',
  APInstruction = '11',
  Unknown = 'Unknown',
}

export enum MealCategory {
  Breakfast = '朝食',
  Lunch = '昼食',
  Dinner = '夕食',
  AmSnack = 'amおやつ',
  PmSnack = 'pmおやつ',
  OtherDrink = 'その他水分摂取',
}

export enum BathCategory {
  Morning = '午前',
  Afternoon = '午後',
  Custom = '時刻入力',
}

export enum BathCategorySortingOrder {
  Custom = 1,
  Default,
}

export enum TsushoRecordSortingOrder {
  Start = 1,
  Reha,
  Cancellation,
  Absence,
  Stopping,
  End,
  Letter,
  Settled,
}

/**
 * Represent the order of fcp record in case 2 records have the same record time.
 */
export enum FCPRecordSortingOrder {
  Starting = 1,
  Elapsed,
  Meal,
  Vital,
  Excretion,
  CustomTimeBath,
  MorningBath,
  AfternoonBath,
  Reha,
  Cancellation,
  Absence,
  Stopping,
  Ending,
  Letter,
  Settled,
  Medication,
  OtherSystem,
  APCheckin,
  APCheckout,
  APOrder,
  APSignature,
  APLeaveNote,
  APInstruction,
}

export enum AttendanceCategory {
  Starting = '1.開始',
  Cancellation = '2.キャンセル',
  Absence = '3.欠席',
  Stopping = '4.中止',
  Ending = '5.終了',
  Settled = '6.〆',
}

export enum MedicationCategory {
  AfterLunch = '昼食後',
  AfterDinner = '夕食後',
  Unknown = 'Unknown',
}

export interface RecordReporter {
  name: string;
  jobs: string[];
  code?: string;
}

export interface MealResult {
  stapleFood: string | null;
  sideFood: string | null;
  soupVolume: string | null;
  teaVolume: string | null;
  snackFood: string | null;
  snackDrink: string | null;
  otherDrink: string | null;
  otherDrinkType: string | null;
}

export interface VitalResult {
  pulse: string | null;
  breathe: string | null;
  weight: string | null;
  temperature: string | null;
  systolicBloodPressure: string | null;
  diastolicBloodPressure: string | null;
  oxygenSaturation: string | null;
}

export interface ExcretionResult {
  equipment: string | null;
  urineOutput: string | null;
  urineForm: string | null;
  fecalOutput: string | null;
  fecalForm: string | null;
  isUncontrolled: boolean;
}

export interface BathResult {
  bathStyle: string | null;
  isDone: boolean;
}
export interface VPInfoOfRecord {
  startTime: string | null;
  endTime: string | null;

  // VP start time and end time can be changed in Attendance record with type "終了"
  // These below keys are only for Tsusho
  modifiedStartTime?: string | null;
  modifiedEndTime?: string | null;
  isCareForDailyLife?: boolean;
}

export interface APOrderService {
  id: string;
  name: string;
  groupName: string;
  isFinish: boolean;
  note: string | null;
  displayOrder: number;
}

export interface BaseRecord {
  id: string;
  time: string;
  type: RecordType;
  note: string | null;
  isSynced: boolean;
  reporter: RecordReporter;
  serviceCode: string | null;
  tenantCode: string;
}

export interface ElapsedRecord extends BaseRecord {
  type: RecordType.Elapsed;
  targetDate: string;
  place: string;
  category: string;
  photoPath: string | null;
  warningDueDate: string | null;
  serviceType?: string;
  isAPRecord: boolean; // check if this is a record of Assign Portable
}

export interface MealRecord extends BaseRecord {
  type: RecordType.Meal;
  category: MealCategory;
  result: MealResult;
  warningDueDate: string | null;
  isAPRecord: boolean; // check if this is a record of Assign Portable
}

export interface VitalRecord extends BaseRecord {
  type: RecordType.Vital;
  result: VitalResult;
  warningDueDate: string | null;
  isAPRecord: boolean; // check if this is a record of Assign Portable
}

export interface ExcretionRecord extends BaseRecord {
  type: RecordType.Excretion;
  result: ExcretionResult;
  warningDueDate: string | null;
  isAPRecord: boolean; // check if this is a record of Assign Portable
  targetDate?: string;
}

export interface BathRecord extends BaseRecord {
  type: RecordType.Bath;
  category: BathCategory;
  result: BathResult;
  timeZone?: string;
  targetDate?: string;
  warningDueDate: string | null;
  isAPRecord: boolean; // check if this is a record of Assign Portable
}

export interface MedicationRecord extends BaseRecord {
  type: RecordType.Medication;
  category: MedicationCategory;
  scheduleFlag: boolean;
  scheduledDate: string;
  achievementFlag: boolean;
  achievementType: string;
}

export interface OtherSystemRecord extends BaseRecord {
  type: RecordType.OtherSystem;
  deviceName: string;
  uniqueItem01: string | null;
  uniqueItem02: string | null;
  uniqueItem03: string | null;
  uniqueItem04: string | null;
  uniqueItem05: string | null;
  uniqueItem06: string | null;
  uniqueItem07: string | null;
  uniqueItem08: string | null;
  uniqueItem09: string | null;
  uniqueItem10: string | null;
  uniqueItem11: string | null;
  uniqueItem12: string | null;
  uniqueItem13: string | null;
  uniqueItem14: string | null;
  uniqueItem15: string | null;
  uniqueItem16: string | null;
  uniqueItem17: string | null;
  uniqueItem18: string | null;
  uniqueItem19: string | null;
  uniqueItem20: string | null;
  uniqueItem21: string | null;
  uniqueItem22: string | null;
  uniqueItem23: string | null;
  uniqueItem24: string | null;
  uniqueItem25: string | null;
  uniqueItem26: string | null;
  uniqueItem27: string | null;
  uniqueItem28: string | null;
  uniqueItem29: string | null;
  uniqueItem30: string | null;
}

export interface APCheckinRecord extends BaseRecord {
  type: RecordType.APCheckin;
}

export interface APCheckoutRecord extends BaseRecord {
  type: RecordType.APCheckout;
}

export interface APLeaveNoteRecord extends BaseRecord {
  type: RecordType.APLeaveNote;
}

export interface APInstructionRecord extends BaseRecord {
  type: RecordType.APInstruction;
}

export interface APSignatureRecord extends BaseRecord {
  type: RecordType.APSignature;
  signaturePhotoPath: string | null;
}

export interface APOrderRecord extends BaseRecord {
  type: RecordType.APOrder;
  services: APOrderService[];
}

/* --------------------------- Only Tsusho --------------------------- */
export interface LetterRecord extends BaseRecord {
  type: RecordType.Letter;
  visitPlan: VPInfoOfRecord;
}

export interface AttendanceRecord extends BaseRecord {
  type: RecordType.Attendance;
  category: AttendanceCategory;
  visitPlan: VPInfoOfRecord;
}

export enum RehaExerciseStatus {
  Finished = '2.実施',
  Cancelled = '3.中止',
  Unknown = 'Unknown',
}

export enum RehaPaymentType {
  None = '1.なし',
  TypeY = '2.加算Ⅰイ',
  TypeO = '3.加算Ⅰロ',
}

export interface RegisteredExercise {
  name: string;
  category1: string | null;
  category2: string | null;
  description: string | null;
  isShowBorgScale: boolean;
  notice: string | null;
  targetAmount: string | null;
  targetSet: string | null;
  targetStrength: string | null;
}

export interface ExerciseResult {
  amount: string | null;
  set: string | null;
  strength: string | null;
  borgScale: string | null;
  achievementLevel: string | null;
}

export interface RehaExercise {
  id: string;
  status: RehaExerciseStatus;
  startTime?: string | null;
  endTime?: string | null;
  note: string | null;
  registeredInfo: RegisteredExercise;
  result?: ExerciseResult;
  cancellationReason?: string | null;
  reporter: RecordReporter;
}

export interface RehaRecord extends Omit<BaseRecord, 'reporter'> {
  type: RecordType.Reha;
  paymentType: RehaPaymentType;
  exercises: RehaExercise[];
  visitPlan: VPInfoOfRecord;
  warningDueDate: string | null;
}
/* ------------------------------------------------------------------- */

export type FCPRecord =
  | ElapsedRecord
  | MealRecord
  | VitalRecord
  | ExcretionRecord
  | BathRecord
  | LetterRecord
  | AttendanceRecord
  | RehaRecord
  | MedicationRecord
  | OtherSystemRecord
  | APCheckinRecord
  | APCheckoutRecord
  | APSignatureRecord
  | APLeaveNoteRecord
  | APOrderRecord
  | APInstructionRecord;

export interface CareSectionHeaderData {
  date: string;
  isHoliday: boolean;
  goingOutPlans?: GoingOutPlan[];
  servicePlans?: ServicePlan[];
  hasPreviousOvernightStay?: boolean;
  mealPlans?: MealPlan[];
}

export interface CareListSection {
  headerData: CareSectionHeaderData;
  data: FCPRecord[];
}

export interface RecordGettingConfig {
  tenantCode: string;
  startDate: string;
  endDate: string;
}
/* ------------------------ Record slice type ---------------------*/

export enum MealPlanManagementId {
  Ticket = 1,
  ContactForm,
}

export interface MealPlan {
  id: string;
  managementId: MealPlanManagementId | null;
  tenantCode: string;
  usedService: string | null;
  classification: string | null;
  startingReason: string | null;
  changingReason: string | null;
  cancellationReason: string | null;
  startDate: string | null;
  endDate: string | null;
  startTimeCategory: string | null;
  endTimeCategory: string | null;
  mealType?: string | null;
  hasFunctionalFoods?: string | null;
  stapleFoodType: string | null;
  stapleFoodAmount: string | null;
  noteForEatingBread: string | null;
  sideFoodType: string | null;
  eatingAids: string | null;
  medicalCondition: string | null;
  remarks: string | null;
  precautions: string | null;
  createdAt: string;
}

export interface CareListScreenConfig {
  fromDate: string;
  toDate: string;
  sortedBy: 'asc' | 'desc';
  filterOptions: CareListFilterOptions;
  records: FCPRecord[];
  todayPlans: TodayPlan[];
  holidays: string[];

  // Only Shisetsu
  mealPlans?: MealPlan[];
}

export interface OtherSystemDisplaySetting {
  collaborationId: string;
  collaborationFileId: string;
  collaborationDeviceName: string | null;
  displaySetting: Record<string, string>;
}

export interface VitalRecordSetting {
  bodyTemperatureUpperLimit: string | null;
  bodyTemperatureLowerLimit: string | null;
  breatheUpperLimit: string | null;
  breatheLowerLimit: string | null;
  pulseUpperLimit: string | null;
  pulseLowerLimit: string | null;
  systolicBloodPressureUpperLimit: string | null;
  systolicBloodPressureLowerLimit: string | null;
  diastolicBloodPressureUpperLimit: string | null;
  diastolicBloodPressureLowerLimit: string | null;
  spO2UpperLimit: string | null;
  spO2LowerLimit: string | null;
}

export interface MealRecordSetting {
  breakfastTime: string;
  lightBreakfastTime: string;
  lunchTime: string;
  lightLunchTime: string;
  dinnerTime: string;
}

export interface RecordSetting {
  vital: VitalRecordSetting;
  otherSystemDisplay: OtherSystemDisplaySetting[];
  classificationTemplateList: SettingsSelectItem[];
  placeTemplateList: SettingsSelectItem[];
  classificationKeyList: SettingsSelectItem[];
  placeKeyList: SettingsSelectItem[];
  waterList: SettingsSelectItem[];
}

export interface RecordSliceState {
  recordSetting: RecordSetting;
  careListSortedBy: 'asc' | 'desc';
  holidays: string[];
}

export interface CareListTenantInfo {
  tenantCode: string;
  kanjiName: string;
  furiganaName: string;
  dateOfBirth: string;
  photoPath?: string | null;
  age: number;
  isWarning: boolean;
  nursingLevel: string;
  building?: string;
  floor: string;
  room: string;
  unit: string;
  gender: string;
  validityPeriod: string;
  fromDateOfCareList: string;
}

export enum SlideTabFilterContent {
  NotDisplay = 'notDisplay',
  Display = 'display',
  HaveMemo = 'haveMemo',
  All = 'all',
}

export type CareListFilterRecords = {
  elapsed: string;
  vital: string;
  meal: string;
  excretion: string;
  bath: string;
  reha: string;
  letter: string;
  attendance: string;
  medication: string;
  APcheckInAndCheckOut: string;
  APInstruction: string;
  APOrder: string;
  APSignature: string;
  APLeaveNote: string;
};

export type CareListFilterOccupations = {
  careGiver: string;
  nurse: string;
  therapist: string;
  nurseCareSupportStaff: string;
  supportCounselor: string;
  registerDietitian: string;
  doctor: string;
  facilityDirector: string;
  other: string;
};

export type CareListFilterOptions = {
  searchNoteText: string;
  records: CareListFilterRecords;
  occupations: CareListFilterOccupations;
  elapsedClassification: string;
  reporter: string;
  loginService: string;
  cooperationRecords: string[] | null;
};

export interface CareListManagementState {
  isFiltering: boolean;
  isShowAPFilterOptions: boolean;
  isCheckAllCooperationRecords: boolean;
  filterReporterNameValues: string[];
  filterOptions: CareListFilterOptions;
  filterElapsedClassificationValues: string[];
  filterReporterValues: RecordReporter[];
  filterOtherSystemNameValues: string[];
  filterHiddenReporterJobs: string[];
  isShowMedicationFilter: boolean;
  canReloadCareList: boolean;
  canFetchMoreCareList: boolean;
  currentCareTenant: string | null;
}

export interface SettingsSelectItem {
  value: string;
  registrationSeqNumber: number;
  pkSelectedItem: number;
  selectedItem: number;
}

export interface MealTimeDB {
  timeBreakfast: string;
  timeAmSnack: string;
  timeLunch: string;
  timePmSnack: string;
  timeDinner: string;
}
