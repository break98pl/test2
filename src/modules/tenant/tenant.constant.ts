import {SortingType} from '@modules/tenant/tenant.type';

export const SHISETSU_JUTAKU_SORTING_OPTIONS = [
  {
    id: SortingType.ByAlphabet.toString(),
    label: 'user_list.arrange_alphabet',
  },
  {
    id: SortingType.ByRoom.toString(),
    label: 'user_list.arrange_room',
  },
  {
    id: SortingType.ByUnit.toString(),
    label: 'user_list.arrange_unit',
  },
];

export const TAKINO_SORTING_OPTIONS = [
  {
    id: SortingType.ByAlphabet.toString(),
    label: 'user_list.arrange_alphabet',
  },
  {
    id: SortingType.ByVisitPlan.toString(),
    label: 'user_list.arrange_visit_plan',
  },
  {
    id: SortingType.ByCommutePlan.toString(),
    label: 'user_list.arrange_exam_plan',
  },
  {
    id: SortingType.ByOvernightPlan.toString(),
    label: 'user_list.arrange_sleep_plan',
  },
  {
    id: SortingType.ByPreviousOvernightPlan.toString(),
    label: 'user_list.arrange_previous_day_plan',
  },
  {
    id: SortingType.ByShortTermPlan.toString(),
    label: 'user_list.arrange_short_term_plan',
  },
];

export const TAKINO_KANTAKI_SORTING_OPTIONS = [
  {
    id: SortingType.ByAlphabet.toString(),
    label: 'user_list.arrange_alphabet',
  },
  {
    id: SortingType.ByNursingPlan.toString(),
    label: 'user_list.arrange_nursing_plan',
  },
  {
    id: SortingType.ByCaringPlan.toString(),
    label: 'user_list.arrange_caring_plan',
  },
  {
    id: SortingType.ByCommutePlan.toString(),
    label: 'user_list.arrange_exam_plan',
  },
  {
    id: SortingType.ByOvernightPlan.toString(),
    label: 'user_list.arrange_sleep_plan',
  },
  {
    id: SortingType.ByPreviousOvernightPlan.toString(),
    label: 'user_list.arrange_previous_day_plan',
  },
  {
    id: SortingType.ByShortTermPlan.toString(),
    label: 'user_list.arrange_short_term_plan',
  },
];

export const START_WITH_KATAKANA_CHARACTER_REGEX = /^[ア-ンｱ-ﾝ]/;
export const FULL_WIDTH_KATAKANA_REGEX = /^[ア-ン]*$/;
export const HALF_WIDTH_KATAKANA_REGEX = /^[ｱ-ﾝ]*$/;
export const SMALL_KATAKANA_REGEX = /^[ァ-ヮ]*$/;
export const HALF_WIDTH_SMALL_KATAKANA_REGEX = /^[ｧ-ｯ]*$/;

/**
 * Represent selected columns of going out plan.
 *
 * @tableName T_日常業務_外出外泊
 */
export const COLUMNS_TO_SELECT_GOING_OUT_PLAN = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者', // Tenant code
  '外出外泊_種別', // Going out type
  '開始日時', // Start time
  '終了日時', // End time
  '開始_確認済み', // Confirmed start time
  '終了_確認済み', // Confirmed end time
  '外出外泊先', // Going out place
  'コメント', // Comment
  '報告日時', // Report time
  '職員名', // Reporter name
];

/**
 * Represent selected columns of service plan.
 *
 * @tableName T_実績管理_居宅_月間
 */
export const COLUMNS_TO_SELECT_SERVICE_PLAN = [
  '更新キー', // Update key -> use it like ID
  'FK_利用者', // Tenant code
  'サービス開始日時', // Service start time
  'サービス終了日時', // Service end time
  '対象_個別項目01', // Service type
];
