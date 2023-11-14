import _ from 'lodash';
import {ColorValue} from 'react-native';

import {images} from '@constants/images';
import {AppType} from '@modules/setting/setting.type';
import {
  Gender,
  JapaneseCharacterSortingOrder,
  SortingType,
  TodayPlanType,
} from './tenant.type';
import {
  DATE_FORMAT,
  HALF_WIDTH_KATAKANA_ALPHABET,
  HIRAGANA_ALPHABET,
  FULL_WIDTH_KATAKANA_ALPHABET,
} from '@constants/constants';
import {
  FULL_WIDTH_KATAKANA_REGEX,
  HALF_WIDTH_KATAKANA_REGEX,
  HALF_WIDTH_SMALL_KATAKANA_REGEX,
  SMALL_KATAKANA_REGEX,
} from '@modules/tenant/tenant.constant';
import {Colors} from '@themes/colors';
import {RegisterState} from '@modules/visitPlan/type';
import moment from 'moment';
import i18n from 'i18next';
import {ScreenName} from '@navigation/type';

export const getUserLabel = (appType: AppType, serviceName: string) => {
  let label: string;
  switch (appType) {
    case AppType.SHISETSHU:
      if (
        _.includes(
          ['特養', '老健', '介護医療院', '地域密着特養', '「入所者」'],
          serviceName,
        )
      ) {
        label = 'user_list.shisetsu_user_list';
        break;
      }
      label = 'user_list.shisetsu_user_list_2';
      break;
    case AppType.JUTAKU:
      label = 'user_list.jutaku_user_list';
      break;
    case AppType.TSUSHO:
      label = 'user_list.tsusho_user_list';
      break;
    case AppType.TAKINO:
      label = 'user_list.takino_user_list';
      break;
    default:
      label = 'user_list.shisetsu_user_list';
      break;
  }
  return label;
};

export const getLabelOfScreen = (
  routeName: string,
  appType: AppType,
  serviceName: string,
) => {
  switch (routeName) {
    case ScreenName.TenantList:
      if (appType === AppType.TSUSHO) {
        return i18n.t('tsusho_vp_list.screenTitle');
      }
      return i18n.t(getUserLabel(appType, serviceName), {text: '一覧'});
    case ScreenName.Meal:
      return i18n.t('meal.bottom_tab_label');
    case ScreenName.Vital:
      return i18n.t('care_list.backToVital');
    case ScreenName.Bath:
      return i18n.t('bath.bottom_tab_label');
    case ScreenName.Elapsed:
      return i18n.t('elapsed.bottom_tab_label');
    case ScreenName.Cardex:
      return i18n.t('cardex.bottom_tab_label');
    case ScreenName.Report:
      return i18n.t('report.bottom_tab_label');
    case ScreenName.Setting:
      return i18n.t('setting.bottom_tab_label');
    default:
      return '';
  }
};

export const getAppIcon = (appType?: AppType) => {
  switch (appType) {
    case AppType.SHISETSHU:
      return images.iconShisetsu;
    case AppType.JUTAKU:
      return images.iconJutaku;
    case AppType.TAKINO:
      return images.iconTakino;
    case AppType.TSUSHO:
      return images.tsusho40;
    default:
      return images.iconTakino;
  }
};

export const getTextFromFilterType = (sortedBy: SortingType) => {
  switch (sortedBy) {
    case SortingType.ByAlphabet:
      return 'user_list.arrange_alphabet';
    case SortingType.ByRoom:
      return 'user_list.arrange_room';
    case SortingType.ByUnit:
      return 'user_list.arrange_unit';
    case SortingType.ByVisitPlan:
      return 'user_list.arrange_visit_plan';
    case SortingType.ByCaringPlan:
      return 'user_list.arrange_caring_plan';
    case SortingType.ByNursingPlan:
      return 'user_list.arrange_nursing_plan';
    case SortingType.ByCommutePlan:
      return 'user_list.arrange_exam_plan';
    case SortingType.ByOvernightPlan:
      return 'user_list.arrange_sleep_plan';
    case SortingType.ByPreviousOvernightPlan:
      return 'user_list.arrange_previous_day_plan';
    case SortingType.ByShortTermPlan:
      return 'user_list.arrange_short_term_plan';
    default:
      return 'user_list.arrange_alphabet';
  }
};

/**
 * Get image source of going out plan
 *
 * @param type
 */
export const getIconTodayPlan = (
  type: TodayPlanType = TodayPlanType.Unknown,
) => {
  switch (type) {
    case TodayPlanType.OvernightOutingInProgress:
      return images.tpSleepOverInProgress;
    case TodayPlanType.OvernightOutingDateBack:
      return images.tpSleepOverDateBack;
    case TodayPlanType.OvernightOutingDateOut:
      return images.tpSleepOverDateOut;
    case TodayPlanType.DayOuting:
      return images.tpGoOut;
    case TodayPlanType.MedicalExamination:
      return images.tpMeetDoctor;
    case TodayPlanType.HavingVisitors:
      return images.tpMeetFamily;
    case TodayPlanType.Visit:
      return images.tpVisit;
    case TodayPlanType.Caring:
      return images.tpCaring;
    case TodayPlanType.Commute:
      return images.tpCommute;
    case TodayPlanType.OvernightStay:
      return images.tpStayOverNight;
    case TodayPlanType.ShortTermStay:
      return images.tpShortTermStay;
    case TodayPlanType.Nursing:
      return images.tpNursing;
    case TodayPlanType.HasPreviousOvernightStay:
      return images.previousOvernightPlan;
    default:
      return images.tpGoOut;
  }
};

/**
 * Convert the string from half-width katakana format into normal katakana format.
 *
 * @param str
 */
export const convertHalfWidthKatakanaToKatakana = (str: string) => {
  let result = '';
  const halfWidthKatakanaAlphabet = HALF_WIDTH_KATAKANA_ALPHABET.flat();
  const katakanaAlphabet = FULL_WIDTH_KATAKANA_ALPHABET.flat();

  for (const char of str) {
    result += katakanaAlphabet[halfWidthKatakanaAlphabet.indexOf(char)];
  }
  return result;
};

/**
 * Convert the string from hiragana format into half-width katakana format.
 *
 * @param str
 */
export const convertHiraganaToHalfWidthKatakana = (str: string) => {
  let result = '';
  const hiraganaAlphabet = HIRAGANA_ALPHABET.flat();
  const halfWidthKatakanaAlphabet = HALF_WIDTH_KATAKANA_ALPHABET.flat();

  for (const char of str) {
    result += halfWidthKatakanaAlphabet[hiraganaAlphabet.indexOf(char)];
  }
  return result;
};

/**
 * Get priority order of Japanese character.
 *
 * @param text
 */
const getJapaneseCharacterPriorityOrder = (
  text: string,
): JapaneseCharacterSortingOrder => {
  if (FULL_WIDTH_KATAKANA_REGEX.test(text)) {
    return JapaneseCharacterSortingOrder.FullWidthKatakana;
  } else if (HALF_WIDTH_KATAKANA_REGEX.test(text)) {
    return JapaneseCharacterSortingOrder.HalfWidthKatakana;
  } else if (SMALL_KATAKANA_REGEX.test(text)) {
    return JapaneseCharacterSortingOrder.SmallKatakana;
  } else if (HALF_WIDTH_SMALL_KATAKANA_REGEX.test(text)) {
    return JapaneseCharacterSortingOrder.HalfWidthSmallKatakana;
  } else {
    return JapaneseCharacterSortingOrder.NotKatakana;
  }
};

/**
 * Compare 2 Japanese strings using the following priority order:
 * 1/ Half-width small Katakana
 * 2/ Small Katakana
 * 3/ Full-width Katakana
 * 4/ Half-width Katakana
 * 5/ Not Katakana
 *
 * @param a
 * @param b
 */
export const compareJapaneseCharacter = (a: string, b: string) => {
  const collator = new Intl.Collator('ja-JP');
  const minLength = a.length < b.length ? a.length : b.length;

  for (let i = 0; i < minLength; i++) {
    if (a[i] === b[i]) {
      continue;
    }
    const aOrder = getJapaneseCharacterPriorityOrder(a[i]);
    const bOrder = getJapaneseCharacterPriorityOrder(b[i]);
    if (aOrder > bOrder) {
      return 1;
    } else if (aOrder < bOrder) {
      return -1;
    } else {
      return collator.compare(a[i], b[i]);
    }
  }

  if (a.length < b.length) {
    return -1;
  } else if (a.length > b.length) {
    return 1;
  } else {
    return 0;
  }
};

export const getStateColorText = (state: string, isHaveResult?: boolean) => {
  let color: ColorValue;

  switch (state) {
    case RegisterState.Start:
    case RegisterState.GoHome:
      color = Colors.TEXT_SECONDARY;
      break;
    case RegisterState.Leave:
    case RegisterState.Cancel:
      color = Colors.DEEP_PINK_COLOR;
      break;
    case RegisterState.Absent:
      if (isHaveResult) {
        color = Colors.DEEP_PINK_COLOR;
      } else {
        color = Colors.TEXT_SECONDARY;
      }
      break;
    default:
      color = Colors.BLACK;
      break;
  }

  return color;
};

export const getNoteFromStatus = (status: string, isHaveResult?: boolean) => {
  switch (status) {
    case '':
      if (isHaveResult) {
        return [
          '',
          '「開始」の記録がありません。',
          '「開始」の記録がありません。',
          '',
          '',
        ];
      } else {
        return [
          '実績はありません。',
          '実績はありません。',
          '実績はありません。',
          '実績はありません。',
          '',
        ];
      }
    case RegisterState.Start:
      return [
        'すでに「開始」記録は登録済みです。',
        '',
        '',
        '「開始」の記録が登録済みです。',
        '「開始」の記録が登録済みです。',
      ];
    case RegisterState.GoHome:
      return [
        'すでに「開始」記録は登録済みです。',
        'すでに「終了」記録は登録済みです。',
        '「終了」記録が登録済みです。',
        '「開始」の記録が登録済みです。',
        '「開始」の記録が登録済みです。',
      ];
    case RegisterState.Leave:
      return [
        'すでに「開始」記録は登録済みです。',
        '「中止」記録が登録済みです。',
        'すでに「中止」記録は登録済みです。',
        '「開始」の記録が登録済みです。',
        '「開始」の記録が登録済みです。',
      ];
    case RegisterState.Cancel:
      return [
        '「キャンセル」記録が登録済みです。',
        '「開始」の記録がありません。',
        '「開始」の記録がありません。',
        'すでに「キャンセル」記録は登録済みです。',
        '「キャンセル」記録が登録済みです。',
      ];
    case RegisterState.Absent:
      return [
        '実績はありません。',
        '実績はありません。',
        '実績はありません。',
        '実績はありません。',
        'すでに「欠席」記録は登録済みです。',
      ];
  }
  return [];
};

export const convertDateToDateTime = (date: string): Date => {
  if (moment(date).format(DATE_FORMAT) === moment().format(DATE_FORMAT)) {
    return moment().toDate();
  }
  return moment(date).toDate();
};

export const checkIsFutureDate = (date: string) => {
  if (moment(date).format(DATE_FORMAT) > moment().format(DATE_FORMAT)) {
    return true;
  }
  return false;
};

export const convertGenderOfTenant = (genderText: string) => {
  if (genderText === i18n.t('common.male')) {
    return Gender.Male;
  }
  return Gender.Female;
};

export const getPhotoSource = (path: string | null, gender: string) => {
  if (path) {
    return {
      uri: `file://${path}`,
    };
  } else {
    return gender === Gender.Male ? images.malePhoto : images.femalePhoto;
  }
};

export const GetSortingTypeName = (st: string): string => {
  let str: string = '';
  const sortingType: SortingType = Number(st);
  switch (sortingType) {
    case SortingType.ByVisitPlan:
      str = '訪問';
      break;
    case SortingType.ByCaringPlan:
      str = '訪介';
      break;
    case SortingType.ByNursingPlan:
      str = '訪看';
      break;
    case SortingType.ByCommutePlan:
      str = '通い';
      break;
    case SortingType.ByOvernightPlan:
      str = '宿泊';
      break;
    case SortingType.ByShortTermPlan:
      str = '短期';
      break;
    default:
      break;
  }
  return str;
};
