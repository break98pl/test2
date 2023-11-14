import moment from 'moment';
import {
  AttendanceState,
  TEXT_ATTENDANCE_LEAVE,
  TEXT_ATTENDANCE_ABSENT,
  TEXT_ATTENDANCE_CANCEL,
  TEXT_ATTENDANCE_GO_HOME,
  TEXT_ATTENDANCE_START,
  TEXT_ATTENDANCE_SETTLED,
  TEXT_ATTENDANCE_GO_HOME_AND_CHANGE_TIME,
  cAttendanceData,
} from '../recorded-data/cAttendanceData';
import {ScheduleTime} from './ScheduleTime';
import {DBOperation} from '../../../../modules/operation/operation.service';
import {Colors} from '@themes/colors';
import {ResidentTenantInfo} from '@modules/visitPlan/type';

export const TEXT_HAVING = '◯';
export const TEXT_NOT_HAVING = '---';
export const TEXT_NOT_REGISTER_ATTENDANCE = '出席';
export const TEXT_SETTLED = '〆';
export const ATTEMDAMCE_STATES = [
  '1.開始',
  '2.キャンセル',
  '3.欠席',
  '4.中止',
  '5.終了',
  '6.〆',
];
/**
 * not available in Shisetsu
 */

export class TodayAttendance {
  hasWeekPlan?: boolean; //週間予定の有無
  hasMonthPlan?: boolean; //予定の有無
  hasMonthResults?: boolean; //実績の有無
  hasSettled?: boolean; //〆の記録の有無
  hasLetter?: boolean; //お便り記録の有無
  hidden?: boolean; //一覧に表示するか
  isUninsurance?: boolean; //保険外であるか
  unisuranceName?: string; //保険外サービス名称

  //FIXME: 2.9.67における8対応土壇場での仕様変更（新規記録サービスコード判定ロジックをログインサービスに戻す）のため、2プロパティの値取得をを実装ファイル側で捨てるに止める。本対応時にはこのプロパティ自体を削除すること
  uninsuredServiceNo?: string; //保険外単独サービス番号
  serviceType?: string; //サービス種類
  //---------------------------------------------FIXMEここまで

  textWeekPlan?: string; //列：週間
  textMonthPlan?: string; //列：予定
  textMonthResult?: string; //列：実績
  textSettle?: string; //列：〆
  textLetter?: string; //列：おたより
  textStartTime?: string; //列：開始終了時間
  textEndTime?: string; //列：開始終了時間
  latestAttendance?: cAttendanceData;
  colorForTodayAttendance?: string;

  startDateTime?: Date; //開始終了時間日付型
  endDateTime?: Date; //終了開始時間日付型

  /**
   * only available in Tshusho
   */
  startTime?: string;
  endTime?: string;
  selfDate?: Date;
  arrAttendances?: cAttendanceData[];

  constructor() {}

  showTextAttendance() {
    if (this.latestAttendance) {
      return this.latestAttendance.displayAttendanceStateText();
    } else {
      return TEXT_NOT_HAVING;
    }
  }

  getAttendanceTextColor() {
    const strAttendance = this.showTextAttendance();
    let result = Colors.BLACK;
    if (strAttendance === TEXT_ATTENDANCE_LEAVE) {
      result = Colors.DARK_RED;
    } else if (strAttendance === TEXT_ATTENDANCE_ABSENT) {
      result = this.hasMonthResults ? Colors.DARK_RED : Colors.TEXT_SECONDARY;
    } else if (strAttendance === TEXT_ATTENDANCE_START) {
      result = Colors.TEXT_SECONDARY;
    } else if (strAttendance === TEXT_ATTENDANCE_CANCEL) {
      result = Colors.DARK_RED;
    } else if (strAttendance === TEXT_ATTENDANCE_GO_HOME) {
      result = Colors.TEXT_SECONDARY;
    } else if (strAttendance === TEXT_ATTENDANCE_SETTLED) {
      result = Colors.BLACK;
    } else if (strAttendance === TEXT_ATTENDANCE_GO_HOME_AND_CHANGE_TIME) {
      result = Colors.TEXT_SECONDARY;
    }
    return result;
  }

  getStringBystateCode(state: AttendanceState): string {
    return ATTEMDAMCE_STATES[state];
  }

  async getTodaySettledReportWithTodayString(
    today: string,
    fk_key: string,
    serviceTime?: ScheduleTime,
  ): Promise<cAttendanceData[]> {
    const dbOperation = new DBOperation();
    const queryString =
      `T.FK_利用者= '${fk_key}' ` +
      `And SubStr(T.対象年月日,1,10) = '${today.substring(0, 10)}' ` +
      `And T.記録区分 = '${this.getStringBystateCode(
        AttendanceState.StateSettled,
      )}'`;

    const queryResult: cAttendanceData[] =
      await dbOperation.getListAttendanceFromDBWithCondition(queryString);

    const results: cAttendanceData[] = [];

    if (serviceTime) {
      for (let att of queryResult) {
        if (serviceTime.isMatchOrOverlapAttendance(att)) {
          results.push(att);
        }
      }
    } else {
      // Assign all values from queryResult to results
      results.push(...queryResult);
    }
    return results;
  }

  async getTodayReportWithTodayString(
    today: string,
    fk_key: string,
    withoutUnsync: boolean,
    serviceTime?: ScheduleTime,
  ): Promise<cAttendanceData[]> {
    const dbOperation = new DBOperation();

    let queryString = `T.FK_利用者= '${fk_key}' And SubStr(T.対象年月日,1,10) = '${today.substring(
      0,
      10,
    )}' And NOT T.記録区分 = '${this.getStringBystateCode(
      AttendanceState.StateSettled,
    )}'`;

    if (withoutUnsync) {
      queryString = `${queryString} AND 新規フラグ='0' AND 変更フラグ = '0'`;
    }

    const queryResult = await dbOperation.getListAttendanceFromDBWithCondition(
      queryString,
    );

    const results: cAttendanceData[] = [];

    if (serviceTime) {
      for (const att of queryResult) {
        if (serviceTime.isMatchOrOverlapAttendance(att)) {
          results.push(att);
        }
      }
    } else {
      return queryResult;
    }

    return results;
  }

  async initWithTodayDateString(
    today: string,
    FK_Key: string,
    serviceTime: ScheduleTime | undefined,
    residentTenant: ResidentTenantInfo,
  ) {
    const dbOperation = new DBOperation();
    this.selfDate = moment(today).toDate();
    const monthResultData = residentTenant.currentMonthResultData;
    this.hasMonthResults = monthResultData !== undefined;
    if (!this.startTime && this.hasMonthResults) {
      this.startTime = moment(monthResultData?.startTimeOfService).format(
        'HH:mm',
      );
      this.endTime = moment(monthResultData?.endTimeOfService).format('HH:mm');
    }
    this.isUninsurance = false;
    this.unisuranceName = '';
    if (this.hasMonthResults && monthResultData?.unInsuranceVisible) {
      this.isUninsurance = true;
      this.unisuranceName = monthResultData.unInsuranceName;
    }
    //今日、月間予定が存在するか
    const monthPlanData = residentTenant.currentMonthPlanData;
    this.hasMonthPlan = monthPlanData !== undefined;

    if (!this.startTime && this.hasMonthPlan) {
      this.startTime = moment(monthPlanData?.serviceStartDate).format('HH:mm');
      this.endTime = moment(monthPlanData?.serviceEndDate).format('HH:mm');
    }
    if (
      !monthResultData &&
      !this.isUninsurance &&
      this.hasMonthPlan &&
      monthPlanData?.unInsuranceIsVisible
    ) {
      this.isUninsurance = true;
      this.unisuranceName = monthPlanData.unInsuranceName;
    }

    //今日、週間予定が存在するか

    this.hasWeekPlan = residentTenant.currentWeekPlan !== undefined;
    const weekPlanData = residentTenant.currentWeekPlan;
    //提供時間の設定
    if (!this.startTime && this.hasWeekPlan) {
      this.startTime = moment(weekPlanData?.startDateOfService).format('HH:mm');
      this.endTime = moment(weekPlanData?.endDateOfService).format('HH:mm');
    }
    if (
      !monthResultData &&
      !monthPlanData &&
      !this.isUninsurance &&
      this.hasWeekPlan &&
      weekPlanData?.unInsuranceIsVisible
    ) {
      this.isUninsurance = true;
      this.unisuranceName = weekPlanData.unInsuranceName;
    }
    //今日の最新の記録を取得しておく

    const todayReports = await this.getTodayReportWithTodayString(
      today,
      FK_Key,
      false,
      serviceTime,
    );
    if (todayReports && todayReports.length > 0) {
      this.latestAttendance = todayReports[todayReports.length - 1];
    }

    //一覧に表示するか
    this.hidden = !(
      this.hasWeekPlan ||
      this.hasMonthPlan ||
      this.hasMonthResults
    );

    //今日、おたより記録が存在するか
    this.hasLetter = false;
    const todayLetters = await dbOperation.getLetterDataWithTodayString(
      today,
      FK_Key,
    );
    for (const letter of todayLetters) {
      if (
        serviceTime &&
        serviceTime.isMatchOrOverlap(
          letter.serviceStartTime,
          letter.serviceEndTime,
        )
      ) {
        this.hasLetter = true;
      }
    }
    //今日、締めの記録が存在するか
    const resultSettledReport = await this.getTodaySettledReportWithTodayString(
      today,
      FK_Key,
      serviceTime,
    );
    this.hasSettled = resultSettledReport.length > 0;
    return this;
  }
  initWithDateDict() {}
  getStrStartTime() {}
  getTodayWeekPlansWithTodayString() {}
  getTodayMonthPlansWithTodayString() {}
  getTodayMonthResultsWithTodayString() {}
}
