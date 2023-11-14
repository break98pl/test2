import {TodayPlanType} from '@modules/careList/type';
import {FetchTimeType} from '@modules/setting/setting.type';
import {images} from './images';
import {RecordInput} from '@molecules/PopoverRecordButton';
import {TextListItem} from '@organisms/SelectionList';
import {MealType} from '@molecules/PopoverRecordMeal';
import {RecordType} from '@modules/record/record.type';

export const DEMO_ADDRESS = 'fcp-demo.fc-cloud.jp';
export const ASP_DIRECTORY = 'fcportable_asp_v2/fcp_sql_access.aspx';

export const TABLENAME_WEEKPLAN = 'T_予定管理_居宅週間';

export const TABLENAME_MONTHPLAN = 'T_予定管理_居宅月間';
export const TABLENAME_MONTHPLAN_UNIT = 'T_予定管理_月単位情報';

export const TABLENAME_MONTHRESULT = 'T_実績管理_居宅_月間';
export const TABLENAME_MONTHRESULT_UNIT = 'T_実績管理_月単位情報';
// export const TABLENAME_UNINSURANCE = 'M_登録情報_保険外サービス_201910';

export const TABLENAME_MYCOMPANY = 'M_登録情報_自社';

// regex
export const ONE_OR_TWO_DIGIT_NUMBER = /^\d{1,2}$/; // valid if value is a number which has 1 or 2 digits
export const PERCENTAGE_MATCH = /(\d+(\.\d+)?)%/g;

export const fetchTimeList = [
  {
    type: FetchTimeType.OneDay,
    text: 'setting.one_day',
  },
  {
    type: FetchTimeType.ThreeDay,
    text: 'setting.three_day',
  },
  {
    type: FetchTimeType.OneWeek,
    text: 'setting.one_week',
  },
  {
    type: FetchTimeType.TwoWeek,
    text: 'setting.two_week',
  },
  {
    type: FetchTimeType.OneMonth,
    text: 'setting.one_month',
  },
];

export const JPAlphabet = {
  all: ['すべて'],
  line1: ['あ', 'い', 'う', 'え', 'お'],
  line2: ['か', 'き', 'く', 'け', 'こ'],
  line3: ['さ', 'し', 'す', 'せ', 'そ'],
  line4: ['た', 'ち', 'つ', 'て', 'と'],
  line5: ['な', 'に', 'ぬ', 'ね', 'の'],
  line6: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  line7: ['ま', 'み', 'む', 'め', 'も'],
  line8: ['や', '', 'ゆ', '', 'よ'],
  line9: ['ら', 'り', 'る', 'れ', 'ろ'],
  line10: ['わ', '', 'を', '', 'ん'],
  other: ['その他'],
};

// care list header today plan badge types
// special group of today plans
export const mealBadgeTypes = [
  TodayPlanType.MealInstruction,
  TodayPlanType.MealInstructionContact,
];

export const sleepOutBadgeType = [
  TodayPlanType.TodayOvernightSleepingOut,
  TodayPlanType.OvernightSleepingOutAndReturnToday,
  TodayPlanType.WillGoOvernightSleepingOutToday,
  TodayPlanType.ReturnTodayThenGoSleepOvernightToday,
];

// badges types for each app (tsusho will not have any types)
export const shisetsuBadgeTypes = [
  mealBadgeTypes,
  // this three go out types cannot appear at the same day
  sleepOutBadgeType,
];

export const jutakuBadgeTypes = [
  // this three go out types cannot appear at the same day
  sleepOutBadgeType,
  TodayPlanType.GoOutAndReturnInDay,
  TodayPlanType.MeetFamily,
  TodayPlanType.MeetDoctor,
];

// login with 小規模多機能 (small multi functions) service in takino app
export const takinoSmallServiceBadgeTypes = [
  TodayPlanType.Visit,
  TodayPlanType.Commute,
  TodayPlanType.OvernightStay,
  TodayPlanType.ShortTermStay,
];

// login with 看護小規模多機能 (nursing multi functions) service in takino app
export const takinoNursingServiceBadgeTypes = [
  TodayPlanType.Nursing,
  TodayPlanType.Caring,
  TodayPlanType.Commute,
  TodayPlanType.OvernightStay,
];

export const HIRAGANA_ALPHABET = [
  ['あ', 'い', 'う', 'え', 'お'],
  ['か', 'き', 'く', 'け', 'こ'],
  ['さ', 'し', 'す', 'せ', 'そ'],
  ['た', 'ち', 'つ', 'て', 'と'],
  ['な', 'に', 'ぬ', 'ね', 'の'],
  ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ['ま', 'み', 'む', 'め', 'も'],
  ['や', 'ゆ', 'よ'],
  ['ら', 'り', 'る', 'れ', 'ろ'],
  ['わ', 'を', 'ん'],
];

export const FULL_WIDTH_KATAKANA_ALPHABET = [
  ['ア', 'イ', 'ウ', 'エ', 'オ'],
  ['カ', 'キ', 'ク', 'ケ', 'コ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ'],
  ['ヤ', 'ユ', 'ヨ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ'],
  ['ワ', 'ヲ', 'ン'],
];

export const HALF_WIDTH_KATAKANA_ALPHABET = [
  ['ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ'],
  ['ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ'],
  ['ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ'],
  ['ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ'],
  ['ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ'],
  ['ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ'],
  ['ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ'],
  ['ﾔ', 'ﾕ', 'ﾖ'],
  ['ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ'],
  ['ﾜ', 'ｦ', 'ﾝ'],
];

export const MIX_KATAKANA_CHARACTERS = [
  ['ア', 'イ', 'ウ', 'エ', 'オ', 'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ'],
  ['カ', 'キ', 'ク', 'ケ', 'コ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ'],
  ['サ', 'シ', 'ス', 'セ', 'ソ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ'],
  ['タ', 'チ', 'ツ', 'テ', 'ト', 'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ'],
  ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ'],
  ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ'],
  ['マ', 'ミ', 'ム', 'メ', 'モ', 'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ'],
  ['ヤ', 'ユ', 'ヨ', 'ﾔ', 'ﾕ', 'ﾖ'],
  ['ラ', 'リ', 'ル', 'レ', 'ロ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ'],
  ['ワ', 'ヲ', 'ン', 'ﾜ', 'ｦ', 'ﾝ'],
];

export const unSyncRecordList = [
  {
    type: RecordType.Elapsed,
    icon: images.elapsedRecordUnsync,
  },
  {
    type: RecordType.Meal,
    icon: images.subMealRecordUnsync,
  },
  {
    type: RecordType.Vital,
    icon: images.vitalRecordUnsync,
  },
  {
    type: RecordType.Excretion,
    icon: images.excretionRecordUnsync,
  },
  {
    type: RecordType.Bath,
    icon: images.bathRecordUnsync,
  },
];

export const inputRecordList = [
  {
    type: RecordInput.Bath,
  },
  {
    type: RecordInput.Excretion,
  },
  {
    type: RecordInput.Vital,
  },
  {
    type: RecordInput.Meal,
  },
  {
    type: RecordInput.Elapsed,
  },
];

export const TIME_24H_FORMAT = 'HH:mm';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DATE_WEEKDAY_FORMAT = 'YYYY年MM月DD日（dd）';
export const DATETIME_WEEKDAY_FORMAT = 'YYYY年MM月DD日（dd）HH:mm';
export const DATETIME_LATEST_SYNC_FORMAT = 'MM/DD HH:mm';
export const DATABASE_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const DATE_ISO_FORMAT = 'YYYY-MM-DDT00:00:00';
export const DATE_TIME_PHOTO_FORMAT = 'YYYYMMDDHHmmss';
export const DATETIME_CARE_LIST_FORMAT = 'MMMMDo (dd)';
export const JP_HEISEI_DATE_FORMAT = 'NNNNyy年MM月DD日';

export const volumeDishList = [
  {
    id: '0',
    label: '完食',
  },
  {
    id: '1',
    label: '90%',
  },
  {
    id: '2',
    label: '80%',
  },
  {
    id: '3',
    label: '70%',
  },
  {
    id: '4',
    label: '60%',
  },
  {
    id: '5',
    label: '1/2',
  },
  {
    id: '6',
    label: '40%',
  },
  {
    id: '7',
    label: '30%',
  },
  {
    id: '8',
    label: '20%',
  },
  {
    id: '9',
    label: '10%',
  },
  {
    id: '10',
    label: '二口',
  },
  {
    id: '11',
    label: '一口',
  },
  {
    id: '12',
    label: '×',
  },
  {
    id: '13',
    label: '',
  },
];

export const soupList = [
  {
    id: '0',
    label: '直接入力',
  },
  {
    id: '1',
    label: '300',
  },
  {
    id: '2',
    label: '250',
  },
  {
    id: '3',
    label: '200',
  },
  {
    id: '4',
    label: '180',
  },
  {
    id: '5',
    label: '160',
  },
  {
    id: '6',
    label: '150',
  },
  {
    id: '7',
    label: '140',
  },
  {
    id: '8',
    label: '120',
  },
  {
    id: '9',
    label: '100',
  },
  {
    id: '10',
    label: '80',
  },
  {
    id: '11',
    label: '75',
  },
  {
    id: '12',
    label: '60',
  },
  {
    id: '13',
    label: '40',
  },
  {
    id: '14',
    label: '20',
  },
  {
    id: '15',
    label: '×',
  },
  {
    id: '16',
    label: '',
  },
];

export const teaList = [
  {
    id: '0',
    label: '直接入力',
  },
  {
    id: '1',
    label: '300',
  },
  {
    id: '2',
    label: '250',
  },
  {
    id: '3',
    label: '200',
  },
  {
    id: '4',
    label: '180',
  },
  {
    id: '5',
    label: '160',
  },
  {
    id: '6',
    label: '150',
  },
  {
    id: '7',
    label: '140',
  },
  {
    id: '8',
    label: '120',
  },
  {
    id: '9',
    label: '100',
  },
  {
    id: '10',
    label: '80',
  },
  {
    id: '11',
    label: '60',
  },
  {
    id: '12',
    label: '40',
  },
  {
    id: '13',
    label: '20',
  },
  {
    id: '14',
    label: '×',
  },
  {
    id: '15',
    label: '',
  },
];

export const snackVolumeList = [
  {
    id: '0',
    label: '完食',
  },
  {
    id: '1',
    label: '90%',
  },
  {
    id: '2',
    label: '80%',
  },
  {
    id: '3',
    label: '60%',
  },
  {
    id: '4',
    label: '1/2',
  },
  {
    id: '5',
    label: '40%',
  },
  {
    id: '6',
    label: '20%',
  },
  {
    id: '7',
    label: '10%',
  },
  {
    id: '8',
    label: '×',
  },
  {
    id: '9',
    label: '',
  },
];

export const mealTypeList: TextListItem[] = [
  {
    id: MealType.Breakfast,
    label: 'popover.meal_breakfast',
  },
  {
    id: MealType.AmSnack,
    label: 'popover.meal_am_snack',
  },
  {
    id: MealType.Lunch,
    label: 'popover.meal_lunch',
  },
  {
    id: MealType.PmSnack,
    label: 'popover.meal_pm_snack',
  },
  {
    id: MealType.Dinner,
    label: 'popover.meal_dinner',
  },
  {
    id: MealType.Drink,
    label: 'popover.meal_drink',
  },
];

export enum VitalPopoverField {
  DATE,
  REPORTER = 1,
  PULSE,
  BREATHING,
  HIGH_BLOOD_PRESSURE,
  LOW_BLOOD_PRESSURE,
  BODY_TEMPERATURE,
  OXY_SATURATION,
  WEIGHT,
  MEMO,
  REPORT,
}

export const DEFAULT_VALUE_VITAL_DATA = {
  PULSE: {MIN: 0, MAX: 300},
  BREATHING: {MIN: 0, MAX: 200},
  HIGH_BLOOD_PRESSURE: {MIN: 0, MAX: 300},
  LOW_BLOOD_PRESSURE: {MIN: 0, MAX: 300},
  BODY_TEMPERATURE: {MIN: 0, MAX: 42.5},
  OXY_SATURATION: {MIN: 0, MAX: 100},
  WEIGHT: {MIN: 0, MAX: 199},
};
export const INITIAL_TIME = '00:00';
export const MORNING_TIME = '07:00';
export const AM_SNACK_TIME = '10:00';
export const LUNCH_TIME = '12:00';
export const PM_SNACK_TIME = '15:00';
export const DINNER_TIME = '18:00';

//  【小規模多機能】
//Get ID in tenant.constant.ts
export const serviceTypeListOne = [
  {
    id: '-1',
    label: '（未設定）', // Not set
  },
  {
    id: '6',
    label: '訪問', // Visit
  },
  {
    id: '7',
    label: '通い', // Commute
  },
  {
    id: '8',
    label: '宿泊', // Stay overnight
  },
  {
    id: '10',
    label: '短期', // Short-term stay
  },
];

//  【看護多機能】
export const serviceTypeListTwo = [
  {
    id: '-1',
    label: '（未設定）', // Not set
  },
  {
    id: '9',
    label: '訪看', // Nursing
  },
  {
    id: '6',
    label: '訪介', // Caring
  },
  {
    id: '7',
    label: '通い ', // Commute
  },
  {
    id: '8',
    label: '宿泊', // Stay overnight
  },
  {
    id: '10',
    label: '短期', // Short-term stay
  },
];
export const numbericCharacter = /[^0-9]/g;
