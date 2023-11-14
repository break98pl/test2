import i18n, {t} from 'i18next';
import moment from 'moment';
import {IconName, images} from '@constants/images';
import {
  DATABASE_DATETIME_FORMAT,
  TIME_24H_FORMAT,
  serviceTypeListOne,
  serviceTypeListTwo,
} from '@constants/constants';
import {
  AttendanceCategory,
  BathCategory,
  BathRecord,
  ElapsedRecord,
  FCPRecord,
  FCPRecordSortingOrder,
  MealCategory,
  MealRecord,
  MealRecordSetting,
  RecordType,
  SettingsSelectItem,
  VitalRecord,
} from '@modules/record/record.type';
import {TextListItem} from '@organisms/SelectionList';
import {RoomReservation} from '@modules/resident/resident.type';
import {
  GoingOutPlan,
  TenantListItem,
  TenantManagementState,
  TodayPlanType,
} from '@modules/tenant/tenant.type';
import {SLEEP_OVER_DATA} from './record.constant';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {AppType} from '@modules/setting/setting.type';
import {handleAlertContentConfirm} from '@modules/alerts/alert.ultils';
import {TElapsedRecordData} from '@modules/elapsed/elapsed.type';
import {RecordStatus} from '@molecules/PopoverRecordHeader';
import {TBathRecordData} from '@organisms/BathRecordContent';
import {TMealRecordData} from '@organisms/MealRecordContent';
import {DataUserRecordVital} from '@modules/vital/vital.type';
const {selectedStaff, appType, service} = getReduxStates(
  'authentication',
) as AuthState;
const {allTenantsData} = getReduxStates('tenant') as TenantManagementState;
/**
 * Get default record time of meal record by its category.
 *
 * @param mealTargetDate
 * @param mealRecordSetting
 * @param mealCategory
 */
export const getDefaultMealTime = (
  mealTargetDate: string | null,
  mealCategory: MealCategory | null,
  mealRecordSetting: MealRecordSetting | null,
): string => {
  if (mealTargetDate) {
    if (!mealRecordSetting || !mealCategory) {
      return mealTargetDate;
    }
    switch (mealCategory) {
      case MealCategory.Breakfast:
        return moment(mealTargetDate)
          .set({
            hour: moment(mealRecordSetting.breakfastTime, TIME_24H_FORMAT).get(
              'hour',
            ),
            minute: 0,
          })
          .format(DATABASE_DATETIME_FORMAT);
      case MealCategory.Lunch:
        return moment(mealTargetDate)
          .set({
            hour: moment(mealRecordSetting.lunchTime, TIME_24H_FORMAT).get(
              'hour',
            ),
            minute: 0,
          })
          .format(DATABASE_DATETIME_FORMAT);
      case MealCategory.Dinner:
        return moment(mealTargetDate)
          .set({
            hour: moment(mealRecordSetting.dinnerTime, TIME_24H_FORMAT).get(
              'hour',
            ),
            minute: 0,
          })
          .format(DATABASE_DATETIME_FORMAT);
      case MealCategory.AmSnack:
        return moment(mealTargetDate)
          .set({
            hour: moment(
              mealRecordSetting.lightBreakfastTime,
              TIME_24H_FORMAT,
            ).get('hour'),
            minute: 0,
          })
          .format(DATABASE_DATETIME_FORMAT);
      case MealCategory.PmSnack:
        return moment(mealTargetDate)
          .set({
            hour: moment(mealRecordSetting.lightLunchTime, TIME_24H_FORMAT).get(
              'hour',
            ),
            minute: 0,
          })
          .format(DATABASE_DATETIME_FORMAT);
      default:
        return mealTargetDate;
    }
  } else {
    return '';
  }
};

/**
 * Returned time to compare 2 records.
 *
 * @param record
 */
const timeToCompareOf = (record: FCPRecord) => {
  if (
    record.type === RecordType.Attendance &&
    record.category === AttendanceCategory.Starting
  ) {
    return record.visitPlan.startTime ?? '';
  } else if (
    record.type === RecordType.Letter ||
    record.type === RecordType.Attendance ||
    record.type === RecordType.Reha
  ) {
    return record.visitPlan.endTime ?? '';
  } else {
    return record.time;
  }
};

/**
 * Compare 2 FCP record.
 *
 * @param recordA
 * @param recordB
 * @param sortBy
 */
export const compareFCPRecordTime = (
  recordA: FCPRecord,
  recordB: FCPRecord,
  sortBy: 'asc' | 'desc',
): number => {
  let timeA: string = timeToCompareOf(recordA);
  let timeB: string = timeToCompareOf(recordB);
  const result = sortBy === 'asc' ? 1 : -1;

  if (timeA > timeB) {
    return result;
  } else if (timeA < timeB) {
    return -result;
  } else {
    const aSortingOrder: FCPRecordSortingOrder = getSortingOrderForFCPRecord(
      recordA.type,
      recordA.type === RecordType.Bath || recordA.type === RecordType.Attendance
        ? recordA.category
        : undefined,
    );
    const bSortingOrder: FCPRecordSortingOrder = getSortingOrderForFCPRecord(
      recordB.type,
      recordB.type === RecordType.Bath || recordB.type === RecordType.Attendance
        ? recordB.category
        : undefined,
    );
    if (aSortingOrder < bSortingOrder) {
      return -result;
    } else if (aSortingOrder > bSortingOrder) {
      return result;
    } else {
      return 0;
    }
  }
};

/**
 * Get attendance category text.
 *
 * @param attendanceCategory
 */
export const getAttendanceCategoryText = (
  attendanceCategory: AttendanceCategory,
) => {
  switch (attendanceCategory) {
    case AttendanceCategory.Starting:
      return '開始';
    case AttendanceCategory.Cancellation:
      return 'キャンセル';
    case AttendanceCategory.Absence:
      return '欠席';
    case AttendanceCategory.Stopping:
      return '中止';
    case AttendanceCategory.Ending:
      return '終了';
    case AttendanceCategory.Settled:
      return '〆';
    default:
      return '';
  }
};

/**
 * Get value of time column in care list screen.
 *
 * @param record
 */
export const getRecordTimeText = (record: FCPRecord): string => {
  if (
    (record.type === RecordType.Meal &&
      record.category !== MealCategory.OtherDrink) ||
    (record.type === RecordType.Bath && record.category !== BathCategory.Custom)
  ) {
    return record.category!;
  } else if (
    record.type === RecordType.Letter ||
    record.type === RecordType.Reha
  ) {
    return '';
  } else if (record.type === RecordType.Attendance) {
    return record.category === AttendanceCategory.Ending &&
      record.visitPlan.modifiedEndTime &&
      record.visitPlan.modifiedEndTime
      ? `${getAttendanceCategoryText(record.category)}(${i18n.t(
          'care_list.change',
        )})`
      : getAttendanceCategoryText(record.category);
  } else {
    return record.time ? moment(record.time).format(TIME_24H_FORMAT) : '';
  }
};

/**
 * Get value of classification column in care list screen.
 *
 * @param record
 */
export const getRecordNameText = (record: FCPRecord) => {
  switch (record.type) {
    case RecordType.Elapsed:
      return record.category;
    case RecordType.Meal:
      return '食事/水分摂取記録';
    case RecordType.Vital:
      return 'バイタル記録';
    case RecordType.Excretion:
      return '排泄記録';
    case RecordType.Bath:
      return '入浴記録';
    case RecordType.Letter:
      return 'お使り';
    case RecordType.Attendance:
      return '出欠席';
    case RecordType.Reha:
      return '訓練記録';
    case RecordType.Medication:
      return '服薬記録';
    case RecordType.OtherSystem:
      return record.deviceName;
    case RecordType.APCheckin:
      return 'チェックイン/チェックアウト';
    case RecordType.APCheckout:
      return 'チェックイン/チェックアウト';
    case RecordType.APLeaveNote:
      return '申し送り';
    case RecordType.APSignature:
      return '利用者署名';
    case RecordType.APOrder:
      return 'オーダー記録';
    case RecordType.APInstruction:
      return '責任者指示';
    default:
      return '';
  }
};

const getItemIconByType = (deviceName: string): IconName => {
  switch (deviceName) {
    case 'ココヘルパ':
      return 'nursingItem';
    case 'まもる～の（測定記録）':
      return 'sensorItem';
    default:
      return 'unknownItem';
  }
};

/**
 * Get image name of record.
 *
 * @param recordType
 * @param isSynced
 * @param deviceType Only for ItemRecord.
 */
export const getRecordIconName = (
  recordType: RecordType,
  isSynced: boolean,
  deviceType: string = '',
): IconName | null => {
  switch (recordType) {
    case RecordType.Elapsed:
      return isSynced ? 'elapsedRecord' : 'elapsedRecordUnsync';
    case RecordType.Meal:
      return isSynced ? 'mainMealRecord' : 'mainMealRecordUnsync';
    case RecordType.Vital:
      return isSynced ? 'vitalRecord' : 'vitalRecordUnsync';
    case RecordType.Excretion:
      return isSynced ? 'excretionRecord' : 'excretionRecordUnsync';
    case RecordType.Bath:
      return isSynced ? 'bathRecord' : 'bathRecordUnsync';
    case RecordType.Letter:
      return isSynced ? 'letterRecord' : 'letterRecordUnsync';
    case RecordType.Attendance:
      return isSynced ? 'attendanceRecord' : 'attendanceRecordUnsync';
    case RecordType.Reha:
      return isSynced ? 'rehaRecord' : 'rehaRecordUnsync';
    case RecordType.Medication:
      return 'drugRecord';
    case RecordType.OtherSystem:
      return getItemIconByType(deviceType);
    case RecordType.APCheckin:
      return 'apRecordCheckin';
    case RecordType.APCheckout:
      return 'apRecordCheckout';
    case RecordType.APSignature:
      return 'apRecordSignature';
    case RecordType.APOrder:
      return 'apRecordOrder';
    case RecordType.APLeaveNote:
    case RecordType.APInstruction:
      return 'apRecordInstructionAndLeaveNote';
    default:
      return null;
  }
};

/**
 * Get Food percentage text.
 *
 * @param percentage
 */
export const getFoodPercentageText = (percentage: string | null): string => {
  if (!percentage) {
    return '';
  } else if (percentage === '100') {
    return '完食';
  } else if (percentage === '50') {
    return '1/2';
  } else if (percentage === '5') {
    return '二口';
  } else if (percentage === '2') {
    return '一口';
  } else if (percentage === '0') {
    return 'x';
  } else {
    return `${percentage}%`;
  }
};

/**
 * Get drink volume text.
 *
 * @param volume
 */
export const getDrinkVolumeText = (volume: string | null): string => {
  if (!volume) {
    return '';
  } else if (volume === '0') {
    return 'x';
  } else {
    return volume;
  }
};

/**
 * Get record sync icon by record type.
 *
 * @param recordType
 */
export const getRecordSyncImage = (recordType: RecordType) => {
  switch (recordType) {
    case RecordType.Elapsed:
      return images.elapsedRecord;
    case RecordType.Meal:
      return images.mainMealRecord;
    case RecordType.Vital:
      return images.vitalRecord;
    case RecordType.Excretion:
      return images.excretionRecord;
    case RecordType.Bath:
      return images.bathRecord;
    case RecordType.Letter:
      return images.letterRecord;
    case RecordType.Attendance:
      return images.attendanceRecord;
    case RecordType.Reha:
      return images.rehaRecord;
    case RecordType.Medication:
      return images.drugRecord;
    case RecordType.OtherSystem:
    case RecordType.APCheckin:
    case RecordType.APCheckout:
    case RecordType.APSignature:
    case RecordType.APLeaveNote:
    case RecordType.APOrder:
    case RecordType.APInstruction:
    default:
      return null;
  }
};

/**
 * Get record un-sync icon by record type.
 *
 * @param recordType
 */
export const getRecordUnSyncImage = (recordType: RecordType) => {
  switch (recordType) {
    case RecordType.Elapsed:
      return images.elapsedRecordUnsync;
    case RecordType.Meal:
      return images.mainMealRecordUnsync;
    case RecordType.Vital:
      return images.vitalRecordUnsync;
    case RecordType.Excretion:
      return images.excretionRecordUnsync;
    case RecordType.Bath:
      return images.bathRecordUnsync;
    case RecordType.Letter:
      return images.letterRecordUnsync;
    case RecordType.Attendance:
      return images.attendanceRecordUnsync;
    case RecordType.Reha:
      return images.rehaRecordUnsync;
    case RecordType.Medication:
    case RecordType.OtherSystem:
    case RecordType.APCheckin:
    case RecordType.APCheckout:
    case RecordType.APSignature:
    case RecordType.APLeaveNote:
    case RecordType.APOrder:
    case RecordType.APInstruction:
    default:
      return null;
  }
};

/**
 * Get sorting order of Bath record by its category.
 * Used when 2 bath records have the same record time.
 *
 * @param bathCategory
 */
const getSortingOrderForBathRecord = (bathCategory: BathCategory) => {
  if (bathCategory === BathCategory.Morning) {
    return FCPRecordSortingOrder.MorningBath;
  } else if (bathCategory === BathCategory.Afternoon) {
    return FCPRecordSortingOrder.AfternoonBath;
  } else {
    return FCPRecordSortingOrder.CustomTimeBath;
  }
};

/**
 * Get sorting order of Attendance record by its category.
 * Used when 2 attendance records have the same record time.
 *
 * @param attendanceCategory
 */
const getSortingOrderForAttendanceRecord = (
  attendanceCategory: AttendanceCategory,
): FCPRecordSortingOrder => {
  switch (attendanceCategory) {
    case AttendanceCategory.Starting:
      return FCPRecordSortingOrder.Starting;
    case AttendanceCategory.Cancellation:
      return FCPRecordSortingOrder.Cancellation;
    case AttendanceCategory.Absence:
      return FCPRecordSortingOrder.Absence;
    case AttendanceCategory.Stopping:
      return FCPRecordSortingOrder.Stopping;
    case AttendanceCategory.Ending:
      return FCPRecordSortingOrder.Ending;
    case AttendanceCategory.Settled:
      return FCPRecordSortingOrder.Settled;
    default:
      throw new Error(
        'getSortingOrderForAttendanceRecord method: Invalid attendance category!',
      );
  }
};

/**
 * Get sorting order of FCP record.
 * Used when 2 records have the same record time.
 *
 * @param recordType
 * @param recordCategory
 */
const getSortingOrderForFCPRecord = (
  recordType: RecordType,
  recordCategory?: BathCategory | AttendanceCategory,
) => {
  switch (recordType) {
    case RecordType.Elapsed:
      return FCPRecordSortingOrder.Elapsed;
    case RecordType.Meal:
      return FCPRecordSortingOrder.Meal;
    case RecordType.Vital:
      return FCPRecordSortingOrder.Vital;
    case RecordType.Excretion:
      return FCPRecordSortingOrder.Excretion;
    case RecordType.Bath:
      return getSortingOrderForBathRecord(recordCategory as BathCategory);
    case RecordType.Letter:
      return FCPRecordSortingOrder.Letter;
    case RecordType.Attendance:
      return getSortingOrderForAttendanceRecord(
        recordCategory as AttendanceCategory,
      );
    case RecordType.Reha:
      return FCPRecordSortingOrder.Reha;
    case RecordType.Medication:
      return FCPRecordSortingOrder.Medication;
    case RecordType.OtherSystem:
      return FCPRecordSortingOrder.OtherSystem;
    case RecordType.APCheckin:
      return FCPRecordSortingOrder.APCheckin;
    case RecordType.APCheckout:
      return FCPRecordSortingOrder.APCheckout;
    case RecordType.APOrder:
      return FCPRecordSortingOrder.APOrder;
    case RecordType.APSignature:
      return FCPRecordSortingOrder.APSignature;
    case RecordType.APLeaveNote:
      return FCPRecordSortingOrder.APLeaveNote;
    case RecordType.APInstruction:
      return FCPRecordSortingOrder.APInstruction;
    default:
      throw new Error(
        'getSortingOrderForFCPRecord method: Invalid record type!',
      );
  }
};

/**
 * Convert SettingsSelectItem To TextListItem.
 * @param settingsSelectItems
 */
export const convertSettingsSelectItemToTextListItem = (
  settingsSelectItems: SettingsSelectItem[],
): TextListItem[] => {
  return settingsSelectItems?.map(item => ({
    id: `${item.pkSelectedItem || item.registrationSeqNumber}`,
    label: item.value,
  }));
};

/**
 * Check is nyusyo now
 * @param reservation
 * @param recordDate
 */

const isAdmissionNow = (
  reservation: RoomReservation,
  recordDate: moment.MomentInput,
): boolean => {
  const rDate = moment(recordDate, DATABASE_DATETIME_FORMAT);
  const beforeDate = moment(reservation.startDate, DATABASE_DATETIME_FORMAT);
  const afterDate = moment(reservation.endDate, DATABASE_DATETIME_FORMAT);
  return rDate.isBetween(beforeDate, afterDate);
};

/**
 * get Gaisyutu Gaihaku Jyotai
 * @param goingOutPlans
 * @param recordDate
 * @param appType
 * @param isDayOnly
 */

const getGoingOutType = (
  goingOutPlans: GoingOutPlan[],
  recordDate: moment.MomentInput,
  applicationType: AppType,
  isDayOnly: boolean = false,
) => {
  const {
    IS_GO_OUT,
    IS_GO_OUT_AND_OUT,
    IS_GO_OUT_AND_BACK,
    IS_SLEEP_OVER,
    IS_NONE,
    IS_GO_OUT_MEET_DOCTOR,
    IS_GO_OUT_MEETING,
  } = SLEEP_OVER_DATA;
  const rDate = moment(recordDate);
  goingOutPlans?.forEach(goingOutPlan => {
    const beforeDate = moment(goingOutPlan.startDate);
    const afterDate = moment(goingOutPlan.endDate);
    if (rDate.isBetween(beforeDate, afterDate)) {
      if (moment(beforeDate).isSame(afterDate, 'days')) {
        if (applicationType === AppType.JUTAKU) {
          if (goingOutPlan.planType === TodayPlanType.MedicalExamination) {
            return IS_GO_OUT_MEET_DOCTOR;
          } else if (goingOutPlan.planType === TodayPlanType.HavingVisitors) {
            return IS_GO_OUT_MEETING;
          }
        }
        return IS_GO_OUT;
      } else {
        if (moment(rDate).isSame(beforeDate, 'days')) {
          return IS_GO_OUT_AND_OUT;
        } else if (moment(rDate).isSame(afterDate, 'days') && isDayOnly) {
          return IS_GO_OUT_AND_BACK;
        } else if (
          moment(rDate).isSameOrAfter(afterDate, 'days') &&
          !isDayOnly
        ) {
          return IS_GO_OUT_AND_BACK;
        } else {
          return IS_SLEEP_OVER;
        }
      }
    }
  });
  return IS_NONE;
};

export const checkTimeAlertWhenSaveRecord = async (
  tenant: TenantListItem,
  recordDate: moment.MomentInput,
): Promise<boolean> => {
  let msgFuzai;
  let isOnlyMsgJutaku = false;
  let isConfirmed = true;
  if ([AppType.SHISETSHU, AppType.JUTAKU].includes(appType)) {
    if (isAdmissionNow(tenant?.reservation!, recordDate)) {
      const gd = getGoingOutType(tenant?.goingOutPlans!, recordDate, appType);
      switch (gd) {
        case SLEEP_OVER_DATA.IS_SLEEP_OVER:
          msgFuzai = '外泊中';
          break;
        case SLEEP_OVER_DATA.IS_GO_OUT:
          msgFuzai = '外出中';
          break;
        case SLEEP_OVER_DATA.IS_GO_OUT_MEET_DOCTOR:
          msgFuzai = '受診中';
          isOnlyMsgJutaku = true;
          break;
        case SLEEP_OVER_DATA.IS_GO_OUT_MEETING:
          msgFuzai = '面会中';
          isOnlyMsgJutaku = true;
          break;
      }
    } else {
      msgFuzai = '(スケジュールなし)';
    }
  }
  if (msgFuzai) {
    if (isOnlyMsgJutaku) {
      isConfirmed = await handleAlertContentConfirm(
        `入居者は、YYYY年M月DD日（Weekday）HH:MM時点では${msgFuzai}中ですが、設定を強行しますか？`,
      );
    } else {
      isConfirmed = await handleAlertContentConfirm(
        `は、YYYY年M月DD日（Weekday）HH:MM時点では不在 ${msgFuzai} ですが、設定を強行しますか？`,
      );
    }
  }
  return isConfirmed;
};

export const convertElapsedRecordToTElapsedRecordData = (
  elapsedRecord: ElapsedRecord,
): TElapsedRecordData => {
  const {
    category,
    id,
    isSynced,
    note,
    photoPath,
    place,
    reporter,
    time,
    serviceType,
  } = elapsedRecord;
  return {
    id,
    recordDate: time,
    placeTemplate: place,
    placeKey: place,
    classification: category,
    reporter: reporter.name!,
    registerPhoto: photoPath || '',
    content: note!,
    settingReport: '',
    isSynced,
    serviceType: serviceType || '',
  };
};

export const convertRecordToTBathRecordData = (
  bathRecord: BathRecord,
): TBathRecordData => {
  const {
    id,
    isSynced,
    note,
    reporter,
    time,
    result,
    serviceCode,
    isAPRecord,
    category,
    targetDate,
  } = bathRecord;
  //Get list service for Takino by serviceName
  const lstServicename: TextListItem[] =
    service?.serviceName === t('care_list.smallMultiFunctionsService')
      ? serviceTypeListOne
      : serviceTypeListTwo;
  const isExist = lstServicename.filter(e => e.id === serviceCode);
  return {
    id: id,
    timeValue:
      category === BathCategory.Custom
        ? moment(time, DATABASE_DATETIME_FORMAT).toDate()
        : new Date(''),
    settingReport: targetDate ? targetDate : '',
    memo: note ? note : '',
    reporter: reporter.code ? reporter.code : '',
    familyName: reporter.name!,
    recordDate: time,
    serviceType: isExist.length > 0 ? isExist[0].label : '',
    isSynced: isSynced,
    timeZone: category ? category : BathCategory.Custom,
    bathMethod: result.bathStyle ? result.bathStyle : '',
    bathStatus: result.isDone ? t('common.perform') : t('popover.un_done'),
    isAPRecord: isAPRecord,
  };
};

export const getRecordStatus = (
  isEdit: boolean,
  isSynced: boolean | undefined,
  type: number,
) => {
  if (type === 1) {
    return RecordStatus.NotEdit;
  } else if (type === 2) {
    return RecordStatus.DoneAndNotEdit;
  } else if (typeof isSynced === 'boolean' && !isSynced) {
    return RecordStatus.UnSync;
  }
  return RecordStatus.Create;
};

export const getStatuOfRecord = (
  isEdit: boolean,
  isSync: boolean,
  isAPrecord: boolean,
  fkUser: string,
  recordDate: string,
  staffCode: string,
): RecordStatus => {
  const tenant = allTenantsData.find(i => i.tenantCode === fkUser);
  const isSettled =
    appType === AppType.TSUSHO &&
    tenant?.records.find(
      e =>
        e.type === 'Attendance' &&
        e.visitPlan.endTime?.includes(recordDate.substring(0, 10)) &&
        e.category.includes(t('common.settled')),
    ) !== undefined;
  if (isEdit && (staffCode !== selectedStaff?.staffCode || isAPrecord)) {
    return RecordStatus.NotEdit;
  } else if (isSettled) {
    return RecordStatus.DoneAndNotEdit;
  } else if (!isSync) {
    return RecordStatus.UnSync;
  } else {
    return RecordStatus.Create;
  }
};

export const getRecordDateInitial = () => {};
/** get record type key by record type to match record type key in care list slice to filter
 * @param passedType record type
 * @returns record type key
 */
export const parseRecordTypeKey = (passedType: RecordType) => {
  const typeString = passedType.toString().toLowerCase();

  if (/\d/.test(typeString)) {
    // if type is AP (enum value contains number)
    switch (passedType) {
      case RecordType.APCheckin:
      case RecordType.APCheckout:
        return 'APcheckInAndCheckOut';
      case RecordType.APInstruction:
        return 'APInstruction';
      case RecordType.APOrder:
        return 'APOrder';
      case RecordType.APSignature:
        return 'APSignature';
      case RecordType.APLeaveNote:
        return 'APLeaveNote';
    }
  }
  return typeString;
};

export const convertMealRecordToTMealRecordData = (
  mealRecord: MealRecord,
): TMealRecordData => {
  const {category, id, note, reporter, result, time, isSynced} = mealRecord;
  return {
    id,
    recordDate: time,
    reporter: reporter.name!,
    serviceType: '',
    mealType: category,
    timeValue: moment(time).format(TIME_24H_FORMAT),
    mainDish: result.stapleFood || '',
    subDish: result.sideFood || '',
    soupVolume: result.soupVolume || '',
    teaVolume: result.teaVolume || '',
    snackVolume: result.snackFood || '',
    drinkVolume: result.snackDrink || '',
    waterVolume: result.otherDrink || '',
    waterType: result.otherDrinkType || '',
    memo: note || '',
    settingReport: '',
    isSynced,
  };
};

/**
 * check format data of bodyTemperature or weight
 * @param input
 * @returns boolean
 */
export const hasNoTextAfterDecimal = (input: string) => {
  return /^[^.]*\.$/.test(input);
};

export const convertVitalRecordToDataUserChangeRecordVital = (
  vitalRecord: VitalRecord,
): DataUserRecordVital => {
  const {id, isSynced, note, reporter, result, time} = vitalRecord;
  return {
    id,
    date: time!,
    isSynced,
    reporter: reporter.name!,
    pulse: result.pulse!,
    breathing: result.breathe!,
    highBloodPressure: result.systolicBloodPressure!,
    lowBloodPressure: result.diastolicBloodPressure!,
    bodyTemperature: result.temperature!,
    oxygenSaturation: result.oxygenSaturation!,
    weight: result.weight!,
    memo: note!,
    reportSetting: '',
    serviceType: '',
  };
};
