import {Room, RoomReservation} from '@modules/resident/resident.type';
import {FCPRecord, MealPlan} from '@modules/record/record.type';

/**
 * Represent the priority order of Japanese character.
 */
export enum JapaneseCharacterSortingOrder {
  HalfWidthSmallKatakana = 1,
  SmallKatakana,
  FullWidthKatakana,
  HalfWidthKatakana,
  NotKatakana,
}

export enum SortingType {
  ByAlphabet,
  ByRoom,
  ByUnit,
  ByVisitPlan,
  ByCaringPlan,
  ByNursingPlan,
  ByCommutePlan,
  ByOvernightPlan,
  ByPreviousOvernightPlan,
  ByShortTermPlan,
}
export enum Gender {
  Male = '男性',
  Female = '女性',
}

export enum TodayPlanType {
  Unknown = 'unknown',

  // Only Shisetsu and Jutaku
  DayOuting = '外出', // Go out for the day and come back
  OvernightOuting = '外泊', // Go out and sleep over
  OvernightOutingDateOut = '外泊出',
  OvernightOutingInProgress = '外泊中',
  OvernightOutingDateBack = '外泊戻',

  // Only Jutaku
  MedicalExamination = '受診',
  HavingVisitors = '面会',

  // Only Takino
  Visit = '訪問',
  Caring = '訪介',
  Nursing = '訪看',
  Commute = '通い',
  OvernightStay = '宿泊',
  ShortTermStay = '短期',
  /* This is not a real service plan,
     it represents the virtual plan that indicates whether the tenant has
     slept overnight at the facility or not. */
  HasPreviousOvernightStay = '前泊あり',
}

export type FilteringCharacterType = 'all' | 'other' | string;

export interface FilteringConditions {
  filteringDate: string; // YYYY-MM-DD
  filteringCharacter: FilteringCharacterType;
}

export interface SortingConditions {
  sortBy: SortingType;
}

export interface TenantManagementState
  extends FilteringConditions,
    SortingConditions {
  allTenantsData: TenantListItem[];
  tenantSectionData: TenantListSection[];
}

export interface TenantInfo {
  tenantCode: string;
  surnameFurigana: string;
  firstNameFurigana: string;
  surnameKanji: string;
  firstNameKanji: string;
  gender: Gender;
  photoPath: string | null;
  hasNotice: boolean;
  dayOfBirth: string;
  nursingLevel: string;
  careFromDate: string;
  records: FCPRecord[];

  /* Only Shisetsu */
  mealPlans?: MealPlan[];

  /* Only Tsusho */
  hasAttention?: boolean;
  isNotKana?: boolean;
  kanaNameFullWidth?: string;
}

interface Plan {
  id: string;
  tenantCode?: string;
  startDate: string;
  endDate: string;
  planType: TodayPlanType;
}

/**
 * Represent today plan of Shisetsu and Jutaku.
 */
export interface GoingOutPlan extends Plan {
  isConfirmedStart: boolean;
  isConfirmedEnd: boolean;
  place: string;
  comment: string;
  reporterName: string;
  reportDate: string;

  // Only if "goingOutType" is OvernightOuting,
  // this status can be changed by the filtering date
  goingOutStatus?: TodayPlanType;
}

/**
 * Represent today plan of Takino.
 */
export interface ServicePlan extends Plan {}

export type TodayPlan = GoingOutPlan | ServicePlan;

export interface TenantListItem extends TenantInfo {
  /* --- Only Shisetsu and Jutaku --- */
  room?: Room;
  reservation?: RoomReservation;
  goingOutPlans?: GoingOutPlan[];

  /* --- Only Takino --- */
  servicePlans?: ServicePlan[];
  hasPreviousOvernightStay?: boolean;
}

export interface TenantListSection {
  id: string;
  title: string;
  data: TenantListItem[];
}

export interface BriefServicePlanItem {
  id: TodayPlanType;
  count: number;
}
