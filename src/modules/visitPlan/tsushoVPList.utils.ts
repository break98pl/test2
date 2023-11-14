import {PERCENTAGE_MATCH} from '@constants/constants';
import {DimensionValue} from 'react-native/types';
import {
  DaysInWeek,
  RegisterState,
  SateLiteInfo,
  TsushoResidentTenantItem,
} from './type';
import {Gender} from '@modules/tenant/tenant.type';
import {Colors} from '@themes/colors';
import moment from 'moment';
import {ResidentTenantInfo} from './type';
import {
  TEXT_ATTENDANCE_ABSENT,
  TEXT_ATTENDANCE_START,
} from '@database/models/recorded-data/cAttendanceData';
import i18n from 'i18next';
import {TEXT_NOT_HAVING} from '@database/models/residential-user-data/TodayAttendance';
import {RegisterAllModalType} from '@organisms/RegisterAllModal';

// used to calculate percentage value to style component
export const sumPercentageString = (inputString: string): DimensionValue => {
  const matches = inputString.match(PERCENTAGE_MATCH);

  if (!matches) {
    return '0%';
  }

  // Convert percentage strings to numbers and calculate the sum
  const sum = matches.reduce((acc, percentageStr) => {
    const percentage = parseFloat(percentageStr);
    return acc + percentage;
  }, 0);

  // Return the result as a percentage string
  return `${sum}%`;
};

export const getStateText = (stateId: string) => {
  let vpState = '---';
  switch (stateId) {
    case RegisterState.Start:
      vpState = 'tsusho_vp_list.doingVPState';
      break;
    case RegisterState.GoHome:
      vpState = 'tsusho_vp_list.doneVPState';
      break;
    case RegisterState.Leave:
      vpState = 'tsusho_vp_list.cancelVPState';
      break;
    case RegisterState.Cancel:
      vpState = 'tsusho_vp_list.cancelWhenDoingVPState';
      break;
    case RegisterState.Absent:
      vpState = 'tsusho_vp_list.absenceVPState';
      break;
    default:
      break;
  }
  return vpState;
};

/**
 * Get blured week day in tsusho resident
 *
 * @AppType Tsusho
 * @param weekDays
 */
const getBluredWeekDays = (weekDays?: string) => {
  if (weekDays) {
    const result = [];
    if (!weekDays.includes(DaysInWeek.Monday)) {
      result.push(DaysInWeek.Monday);
    }
    if (!weekDays.includes(DaysInWeek.Tuesday)) {
      result.push(DaysInWeek.Tuesday);
    }
    if (!weekDays.includes(DaysInWeek.Wednesday)) {
      result.push(DaysInWeek.Wednesday);
    }
    if (!weekDays.includes(DaysInWeek.Thursday)) {
      result.push(DaysInWeek.Thursday);
    }
    if (!weekDays.includes(DaysInWeek.Friday)) {
      result.push(DaysInWeek.Friday);
    }
    if (!weekDays.includes(DaysInWeek.Saturday)) {
      result.push(DaysInWeek.Saturday);
    }
    if (!weekDays.includes(DaysInWeek.Sunday)) {
      result.push(DaysInWeek.Sunday);
    }
    return result;
  }
  return [
    DaysInWeek.Monday,
    DaysInWeek.Tuesday,
    DaysInWeek.Wednesday,
    DaysInWeek.Thursday,
    DaysInWeek.Friday,
    DaysInWeek.Saturday,
    DaysInWeek.Sunday,
  ];
};

/**
 * Convert resident tenant data to UI Item
 *
 * @AppType Tsusho
 * @param residentTenant
 */
export const convertToResidentTenantUIItem = (
  residentTenant: ResidentTenantInfo,
  index: number,
): TsushoResidentTenantItem => {
  //Handle display Attendace
  const attendanceStateText = residentTenant.todayAttendance
    ? residentTenant.todayAttendance.showTextAttendance()
    : '';
  //Handle show startEndTime of service
  const isShowServiceTime = attendanceStateText !== TEXT_ATTENDANCE_ABSENT;

  const rehaDataUI = getRehaDataUI(residentTenant);

  return {
    id: `residentTenant-${index}`,
    user: {
      tenantCode: residentTenant.tenantCode,
      firstNameFurigana: residentTenant.firstNameFurigana,
      surnameFurigana: residentTenant.surnameFurigana,
      firstNameKanji: residentTenant.firstNameKanji,
      surnameKanji: residentTenant.surnameKanji,
      gender: residentTenant.gender === '男性' ? Gender.Male : Gender.Female,
      hasNotice: residentTenant.hasNotice,
      photoPath: residentTenant.photoPath,
      dayOfBirth: residentTenant.dayOfBirth,
      nursingLevel: residentTenant.nursingLevel,
    },
    careSchedule: {
      startTime: isShowServiceTime
        ? residentTenant.todayAttendance?.startTime
        : '',
      endTime: isShowServiceTime ? residentTenant.todayAttendance?.endTime : '',
      blurWeekdays: getBluredWeekDays(residentTenant.weekDayOfWeekPlanData),
    },
    monthlyPlanAndResult: {
      isHaveResult: residentTenant.todayAttendance?.hasMonthResults,
      isHaveMonthlyPlan: residentTenant.todayAttendance?.hasMonthPlan,
      isShowUnInsurrance: residentTenant.todayAttendance?.isUninsurance,
    },
    registerVPState: {
      stateText: attendanceStateText,
      //Need to convert stateText to state later
      isUnsync: residentTenant.hasUnsync ?? false,
      isHaveResult: residentTenant.todayAttendance?.hasMonthResults,
    },
    isSettled: residentTenant.todayAttendance?.hasSettled
      ? residentTenant.todayAttendance?.hasSettled
      : false,
    registerLetter: {
      isRegistered: residentTenant.todayAttendance?.hasLetter,
      isUnsync: false,
    },
    reha: rehaDataUI,
  };
};

const getRehaDataUI = (residentTenant: ResidentTenantInfo) => {
  //Handle display Reha
  const rehaProgressCount = residentTenant.todayExercise
    ? residentTenant.todayExercise.countExecedExcercise() +
      residentTenant.todayExercise.countCancedExcercise()
    : -1;
  return {
    isHaveRehaSchedule: residentTenant.todayExercise
      ? residentTenant.todayExercise?.hasSchedule()
      : false,
    numberOfDoneExercise: residentTenant.todayExercise
      ? residentTenant.todayExercise?.countExecedExcercise()
      : -1,
    numberOfPlannedExercise: residentTenant.todayExercise
      ? residentTenant.todayExercise?.countDetailSchedule()
      : -1,
    numberOfCreatedRehaRecords: rehaProgressCount,
    numberOfCancelExercise: residentTenant.todayExercise
      ? residentTenant.todayExercise?.countCancedExcercise()
      : -1,
    isUnsync: false,
  };
};

export const getStateColorText = (state: string, isHaveResult?: boolean) => {
  let color = Colors.BLACK;
  switch (state) {
    case i18n.t('tsusho_vp_list.doingVPState'):
    case i18n.t('tsusho_vp_list.doneVPState'):
    case i18n.t('tsusho_vp_list.homeChanged'):
      color = Colors.TEXT_SECONDARY;
      break;
    case i18n.t('tsusho_vp_list.cancelVPState'):
    case i18n.t('tsusho_vp_list.cancelWhenDoingVPState'):
      color = Colors.DEEP_PINK_COLOR;
      break;
    case i18n.t('tsusho_vp_list.absenceVPState'):
      if (isHaveResult) {
        color = Colors.DEEP_PINK_COLOR;
      } else {
        color = Colors.TEXT_SECONDARY;
      }
      break;
    default:
      color = Colors.TEXT_SECONDARY;
      break;
  }

  return color;
};

export const getNoteFromStatus = (status: string, isHaveResult?: boolean) => {
  switch (status) {
    case '---':
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
    case i18n.t('tsusho_vp_list.doingVPState'):
      return [
        'すでに「開始」記録は登録済みです。',
        '',
        '',
        '「開始」の記録が登録済みです。',
        '「開始」の記録が登録済みです。',
      ];
    case i18n.t('tsusho_vp_list.doneVPState'):
    case i18n.t('tsusho_vp_list.homeChanged'):
      return [
        'すでに「開始」記録は登録済みです。',
        'すでに「終了」記録は登録済みです。',
        '「終了」記録が登録済みです。',
        '「開始」の記録が登録済みです。',
        '「開始」の記録が登録済みです。',
      ];
    case i18n.t('tsusho_vp_list.cancelVPState'):
      return [
        'すでに「開始」記録は登録済みです。',
        '「中止」記録が登録済みです。',
        'すでに「中止」記録は登録済みです。',
        '「開始」の記録が登録済みです。',
        '「開始」の記録が登録済みです。',
      ];
    case i18n.t('tsusho_vp_list.cancelWhenDoingVPState'):
      return [
        '「キャンセル」記録が登録済みです。',
        '「開始」の記録がありません。',
        '「開始」の記録がありません。',
        'すでに「キャンセル」記録は登録済みです。',
        '「キャンセル」記録が登録済みです。',
      ];
    case i18n.t('tsusho_vp_list.absenceVPState'):
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

/**
 * Get sorted times based on the provided time property (either 'startTime' or 'endTime')
 *
 * @param listResidentTenant - List of resident tenants data to extract times from.
 * @param timeProp - Specifies the property to access for time. Can be 'startTime' or 'endTime'.
 * @returns Sorted array of unique time strings.
 */
const getSortedTimes = (
  listResidentTenant: ResidentTenantInfo[],
  timeProp: 'startTime' | 'endTime',
): string[] => {
  const times = listResidentTenant
    .map(item => item.todayAttendance?.[timeProp])
    .filter((time): time is string => time !== undefined);

  const uniqueTimes = [...new Set(times)];

  return uniqueTimes.sort((a, b) => {
    return moment(a, 'HH:mm').valueOf() - moment(b, 'HH:mm').valueOf();
  });
};

/**
 * Get sorted start times from a list of resident tenants data.
 *
 * @param listResidentTenant - List of resident tenants data to extract start times from.
 * @returns Sorted array of unique start time strings.
 */
export const getSortedStartTimes = (listResidentTenant: ResidentTenantInfo[]) =>
  getSortedTimes(listResidentTenant, 'startTime');

/**
 * Get sorted end times from a list of resident tenants data.
 *
 * @param listResidentTenant - List of resident tenants data to extract end times from.
 * @returns Sorted array of unique end time strings.
 */
export const getSortedEndTimes = (listResidentTenant: ResidentTenantInfo[]) =>
  getSortedTimes(listResidentTenant, 'endTime');

/**
 * Get list head quater name from head quater satelite
 *
 * @param listSateLite - List of satelite
 * @returns  Array of unique name strings.
 */
export const getListNameOfSatelite = (listSatelite: SateLiteInfo[]) => {
  return listSatelite.map(item => item.name);
};

/**
 * Convert hours to minutes
 *
 * @param timeStr - hours by string. Ex: 16:30
 * @returns minutes
 */
export const timeToMinutes = (timeStr: string) => {
  if (!timeStr) {
    return -Infinity;
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Extracts the text portion after the first period in a given string.
 * If no period exists, returns the original string.
 *
 * @param s - The input string to be processed.
 * @returns The text after the first period, or the original string if no period exists.
 */
export const extractText = (s: string): string => {
  const parts = s.split('.');
  if (parts.length > 1) {
    return parts[1].trim();
  } else {
    return s;
  }
};

/**
 * check if checkbox is show or not in register all modal
 * @param item - item passed in
 * @param registerModalType - register all modal type
 * @returns boolean type to check if item passed in can register all or not
 */
export const checkIfItemCanRegisterAll = (
  item: TsushoResidentTenantItem,
  registerModalType: RegisterAllModalType,
) => {
  switch (registerModalType) {
    case RegisterAllModalType.StartRegister:
      if (item.registerVPState.stateText === TEXT_NOT_HAVING) {
        return true;
      }
      return false;

    case RegisterAllModalType.EndRegister:
      if (item.registerVPState.stateText === TEXT_ATTENDANCE_START) {
        return true;
      }
      return false;
    default:
      return true;
  }
};
