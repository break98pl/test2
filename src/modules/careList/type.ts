import {Source} from 'react-native-fast-image';

export enum TodayPlanType {
  MealInstruction,
  MealInstructionContact,
  TodayOvernightSleepingOut,
  OvernightSleepingOutAndReturnToday,
  WillGoOvernightSleepingOutToday,
  ReturnTodayThenGoSleepOvernightToday,
  GoOutAndReturnInDay,
  MeetFamily,
  MeetDoctor,
  Visit,
  Commute,
  OvernightStay,
  ShortTermStay,
  HasOvernightStayYesterday,
  Nursing,
  Caring,
  None,
}

// TODO: Remove unused type
export enum RecordType {
  Bath = 'bathRecord',
  Vital = 'vitalRecord',
  Excretion = 'excretionRecord',
  Elapsed = 'elapsedRecord',
  // shisetsu meal
  SubMeal = 'subMealRecord',
  MainMeal = 'mainMealRecord',
  Meal = 'mealRecord',
  OtherDrink = 'otherDrinkRecord',
  // tsusho
  Reha = 'rehaRecord',
  Attendance = 'attendanceRecord',
  Letter = 'letterRecord',
  // jutaku
  CheckIn = 'checkInRecord',
  CheckOut = 'checkOutRecord',
  Order = 'orderRecord',
  Signature = 'signatureRecord',
  Instruction = 'instructionRecord',
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

export type OtherDrinkDetails = {
  drinkAmount: string;
  drinkContent: string;
};

export type SubMealDetails = {
  snack: string;
  drinkAmount: string;
};

export type MainMealDetails = {
  mainMeal: string;
  subMeal: string;
  soupAmount: string;
  drink: string;
};

export type ExcretionDetails = {
  equipment: string;
  isOutOfControl: boolean;
  urinationAmount: string;
  stateOfUrination: string;
  amountOfDefecation: string;
  stateOfDefecation: string;
};

export type BathDetails = {
  BathingState: string;
  BathingMethod: string;
};

export type VitalDetails = {
  pulse: string;
  breathing: string;
  lowBloodPressure: string;
  highBloodPressure: string;
  temperature: string;
  oxygenSaturation: string;
  weight: string;
};

export type ElapsedDetails = {
  place: string;
  content: string;
  isHaveElapsedPhoto: boolean;
  photo?: Source;
};

export type LetterDetails = {
  letterContent: string;
};

export type RehaDetails = {
  rehaMode: RehaMode;
  content: string;
  cancelReason: string;
  sets: string;
  startTime: string;
  endTime: string;
  description: string;
  stateOfDone: string;
  chargeInfo: string;
};

export type AttendanceDetails = {
  recordTime: string;
};

export type RecordDetails =
  | OtherDrinkDetails
  | SubMealDetails
  | MainMealDetails
  | ExcretionDetails
  | BathDetails
  | VitalDetails
  | ElapsedDetails
  | LetterDetails
  | RehaDetails
  | AttendanceDetails;

export enum RehaMode {
  IsDone,
  IsCancelled,
  IsJustToCharge,
}

export type CareListItem = {
  isUnsync: boolean;
  time: string;
  recordType: RecordType;
  recordName: string;
  memo: string;
  isPreventedToSync?: boolean; // for tsusho records

  details: RecordDetails;
};

export type CareListSectionHeader = {
  date: Date;
  isHoliday: boolean;
  todayPlans: TodayPlanType[];
};

export type CareListSectionData = {
  headerData: CareListSectionHeader;
  data: CareListItem[];
};

export enum Occupations {
  CareGiver = 'careGiver',
  Nurse = 'nurse',
  Therapist = 'therapist',
  NurseCareSupportStaff = 'nurseCareSupportStaff',
  SupportCounselor = 'supportCounselor',
  RegisterDietitian = 'registerDietitian',
  Doctor = 'doctor',
  FacilityDirector = 'facilityDirector',
  Other = 'other',
}
