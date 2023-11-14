import moment from 'moment';

import {DBOperation} from '@modules/operation/operation.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cSuperReportDataClass} from './cSuperReportDataClass';
import {TableName} from '@database/type';

export enum AttendanceState {
  StateInProgress, //提供中
  StateCancelled, //キャンセル
  StateAbsence, //欠席
  StateAborted, //中止
  StateEnded, //終了
  StateSettled, //〆
  StateNon,
}

export const ATTEMDANCE_STATES = [
  '1.開始',
  '2.キャンセル',
  '3.欠席',
  '4.中止',
  '5.終了',
  '6.〆',
];

export const ATTENDANCE_SCREEN_ID = '7.デイ日別設定';

export const TEXT_ATTENDANCE_START = '提供中'; // Start
export const TEXT_ATTENDANCE_GO_HOME = '帰所'; // Go Home
export const TEXT_ATTENDANCE_LEAVE = '中止'; // Leave
export const TEXT_ATTENDANCE_CANCEL = 'キャンセル'; // Cancel
export const TEXT_ATTENDANCE_ABSENT = '欠席'; // Absent
export const TEXT_ATTENDANCE_GO_HOME_AND_CHANGE_TIME = '帰所（変）'; // Go Home & Change Time
export const TEXT_ATTENDANCE_NOT_REGISTER = '出席'; // equal with '---'
export const TEXT_ATTENDANCE_SETTLED = '〆';

export class cAttendanceData extends cSuperReportDataClass {
  updateScreenID?: string; //設定画面ID
  logInUserName?: string; //職員名
  logInUserID?: string; //職員コード
  visitorName?: string; //氏名
  targetDate?: string; //対象年月日
  recordDate?: string; //記録日時
  recordType?: string; //記録区分
  memo?: string; //メモ
  timeChangeStartTime?: string; //時間変更_開始時間
  timeChangeEndTime?: string; //時間変更_終了時間
  timeChangeDailyCare?: string; //時間変更_日常生活上の世話
  message?: string; //連絡事項

  constructor(dict?: {[key: string]: any}) {
    super();
    if (dict) {
      this.updateScreenID = dict['設定画面ID'] ? dict['設定画面ID'] : '';
      this.logInUserName = dict['職員名'] ? dict['職員名'] : '';
      this.logInUserID = dict['職員コード'] ? dict['職員コード'] : '';
      this.visitorName = dict['氏名'] ? dict['氏名'] : '';
      this.targetDate = dict['対象年月日'] ? dict['対象年月日'] : '';
      this.recordDate = dict['記録日時'] ? dict['記録日時'] : '';
      this.recordType = dict['記録区分'] ? dict['記録区分'] : '';
      this.memo = dict['メモ'] ? dict['メモ'] : '';
      this.timeChangeStartTime = dict['時間変更_開始時間']
        ? dict['時間変更_開始時間']
        : '';
      this.timeChangeEndTime = dict['時間変更_終了時間']
        ? dict['時間変更_終了時間']
        : '';
      this.timeChangeDailyCare = dict['時間変更_日常生活上の世話']
        ? dict['時間変更_日常生活上の世話']
        : '';
      this.message = dict['連絡事項'] ? dict['連絡事項'] : '';
      this.fkKey = dict['FK_利用者'] ? dict['FK_利用者'] : '';
      this.serviceStartTime = dict['サービス開始日時']
        ? dict['サービス開始日時']
        : '';
      this.serviceEndTime = dict['サービス終了日時']
        ? dict['サービス終了日時']
        : '';
    }
  }

  strTargetDate() {
    return this.targetDate;
  }

  strServiceUserName() {
    return this.visitorName;
  }

  setStrTargetDate(strTargetDate: string) {
    this.targetDate = strTargetDate;
  }

  getUpdateDict() {
    this.updateDict = {};

    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
    }

    if (this.updateScreenID) {
      this.updateDict['設定画面ID'] = this.updateScreenID;
    }

    if (this.serviceType) {
      this.updateDict['サービス種類'] = this.serviceType;
    }

    if (this.fkKey) {
      this.updateDict['FK_利用者'] = this.fkKey;
    }

    if (this.visitorName) {
      this.updateDict['氏名'] = this.visitorName;
    }

    if (this.targetDate) {
      this.updateDict['対象年月日'] = this.targetDate;
    }

    if (this.recordDate) {
      this.updateDict['記録日時'] = this.recordDate;
    }

    if (this.recordType) {
      this.updateDict['記録区分'] = this.recordType;
    }

    if (this.memo) {
      this.updateDict['メモ'] = this.memo;
    }

    if (this.timeChangeStartTime) {
      this.updateDict['時間変更_開始時間'] = this.timeChangeStartTime;
    }

    if (this.timeChangeEndTime) {
      this.updateDict['時間変更_終了時間'] = this.timeChangeEndTime;
    }

    if (this.timeChangeDailyCare) {
      this.updateDict['時間変更_日常生活上の世話'] = this.timeChangeDailyCare;
    }

    if (this.message) {
      this.updateDict['連絡事項'] = this.message;
    }

    if (this.logInUserID) {
      this.updateDict['職員コード'] = this.logInUserID;
    }

    if (this.logInUserName) {
      this.updateDict['職員名'] = this.logInUserName;
    }

    if (this.newFlag) {
      this.updateDict['新規フラグ'] = this.newFlag;
    }

    if (this.updateFlag) {
      this.updateDict['変更フラグ'] = this.updateFlag;
    }

    if (this.strSendErrMsg) {
      this.updateDict['送信エラー'] = this.strSendErrMsg;
    }

    return this.updateDict;
  }

  stateCode() {
    if (this.recordType === ATTEMDANCE_STATES[0]) {
      return AttendanceState.StateInProgress;
    } else if (this.recordType === ATTEMDANCE_STATES[1]) {
      return AttendanceState.StateCancelled;
    } else if (this.recordType === ATTEMDANCE_STATES[2]) {
      return AttendanceState.StateAbsence;
    } else if (this.recordType === ATTEMDANCE_STATES[3]) {
      return AttendanceState.StateAborted;
    } else if (this.recordType === ATTEMDANCE_STATES[4]) {
      return AttendanceState.StateEnded;
    } else if (this.recordType === ATTEMDANCE_STATES[5]) {
      return AttendanceState.StateSettled;
    }
    return AttendanceState.StateNon;
  }

  getStringBystateCode(state: AttendanceState) {
    return ATTEMDANCE_STATES[state];
  }

  displayAttendanceStateText() {
    switch (this.stateCode()) {
      case AttendanceState.StateInProgress:
        return TEXT_ATTENDANCE_START;
      case AttendanceState.StateCancelled:
        return TEXT_ATTENDANCE_CANCEL;
      case AttendanceState.StateAborted:
        return TEXT_ATTENDANCE_LEAVE;
      case AttendanceState.StateEnded:
        //FC仕様・時間変更があれば「帰所（変）」
        if (this.timeChangeStartTime && this.timeChangeStartTime.length > 0) {
          return TEXT_ATTENDANCE_GO_HOME_AND_CHANGE_TIME;
        } else {
          return TEXT_ATTENDANCE_GO_HOME;
        }
      case AttendanceState.StateAbsence:
        return TEXT_ATTENDANCE_ABSENT;
      case AttendanceState.StateSettled:
        return TEXT_ATTENDANCE_SETTLED;
      default:
        return '';
    }
  }

  tableName() {
    return 'T_日常業務_サービス開始終了記録';
  }

  setJSONArray() {
    const postArrayObjects: any[] = [];
    const postArrayKeys: string[] = [];

    if (
      this.updateKey &&
      this.updateKey.length !== 0 &&
      this.updateKey !== '' &&
      this.newFlag !== '1'
    ) {
      postArrayObjects.push(this.updateKey);
      postArrayKeys.push('更新キー');
    }

    if (this.serviceType) {
      postArrayObjects.push(this.serviceType);
      postArrayKeys.push('サービス種類');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('サービス種類');
    }

    postArrayObjects.push('4');
    postArrayKeys.push('設定画面ID');

    if (this.fkKey) {
      postArrayObjects.push(this.fkKey);
      postArrayKeys.push('FK_利用者');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('FK_利用者');
    }

    if (this.visitorName) {
      postArrayObjects.push(this.visitorName);
      postArrayKeys.push('氏名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('氏名');
    }

    if (this.targetDate) {
      postArrayObjects.push(this.targetDate);
      postArrayKeys.push('対象年月日');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('対象年月日');
    }

    if (this.recordDate) {
      postArrayObjects.push(this.recordDate);
      postArrayKeys.push('記録日時');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('記録日時');
    }

    if (this.recordType) {
      postArrayObjects.push(this.recordType);
      postArrayKeys.push('記録区分');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('記録区分');
    }

    if (this.memo) {
      postArrayObjects.push(this.memo);
      postArrayKeys.push('メモ');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('メモ');
    }

    if (this.timeChangeStartTime) {
      postArrayObjects.push(this.timeChangeStartTime);
      postArrayKeys.push('時間変更_開始時間');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('時間変更_開始時間');
    }

    if (this.timeChangeEndTime) {
      postArrayObjects.push(this.timeChangeEndTime);
      postArrayKeys.push('時間変更_終了時間');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('時間変更_終了時間');
    }

    if (this.timeChangeDailyCare) {
      postArrayObjects.push(this.timeChangeDailyCare);
      postArrayKeys.push('時間変更_日常生活上の世話');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('時間変更_日常生活上の世話');
    }

    if (this.message) {
      postArrayObjects.push(this.message);
      postArrayKeys.push('連絡事項');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('連絡事項');
    }

    if (this.logInUserID) {
      postArrayObjects.push(this.logInUserID);
      postArrayKeys.push('職員コード');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('職員コード');
    }

    if (this.logInUserName) {
      postArrayObjects.push(this.logInUserName);
      postArrayKeys.push('職員名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('職員名');
    }

    if (this.newFlag) {
      postArrayObjects.push(this.newFlag);
      postArrayKeys.push('新規フラグ');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('新規フラグ');
    }

    if (this.updateFlag) {
      postArrayObjects.push(this.updateFlag);
      postArrayKeys.push('変更フラグ');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('変更フラグ');
    }

    return [postArrayObjects, postArrayKeys];
  }

  stringBunlui() {
    return '出欠席';
  }

  naiyoString() {
    return `${this.recordType.split('.')[1]}\n${this.memo}`;
  }

  coloredNaiyoString(keyWords: string[]) {}

  imageBunlui() {
    return 'ast_shukketsu_koushin';
  }
  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    return control.dateTimeJapanStyleFromString(this.recordDate);
  }

  imagePhoto() {
    return undefined;
  }

  imageActiveity() {
    return undefined;
  }

  stringError() {
    return this.strSendErrMsg;
  }

  reporterName() {
    return this.reporterData.getUserNameString;
  }

  reporterCode() {
    return this.reporterData.staffCode;
  }

  dateRecord() {
    return moment(this.recordDate).format("yyyy-MM-dd'T'HH:mm:ss");
  }

  dateTarget() {
    return moment(this.targetDate).format("yyyy-MM-dd'T'HH:mm:ss");
  }

  getQueryForAttendanceFromDate(fromDate: Date, toDate: Date) {
    const strFromDate = `${moment(fromDate).format('YYYY-MM-DD')}T00:00:00`;
    const strToDate = `${moment(toDate).format('YYYY-MM-DD')}T23:59:59`;

    return `&fromdate=${strFromDate}&todate=${strToDate}`;
  }

  async GetQueryNowDeviceDateForAttendance() {
    const control: cUserControls = new cUserControls();
    const dbLogic: DBOperation = new DBOperation();

    const nowDate = new Date();
    let fromDate = moment(nowDate)
      .add(-control.getTermForGettingData(), 'seconds')
      .toDate();

    // Check if have any bath record, exercise record with target date is older than fromDate
    const soonestTargetDate =
      await dbLogic.getSoonestTargetDateForAttendanceWithUserFK();
    if (soonestTargetDate && soonestTargetDate < fromDate) {
      fromDate = soonestTargetDate;
    }

    return this.getQueryForAttendanceFromDate(fromDate, nowDate);
  }

  getQueryStringFromUsers(users: string, serviceNo: string, rangeDate: string) {
    const strUsers = users
      .split(',')
      .map(a => `'${a}'`)
      .join(',');

    const strDate = rangeDate.replace('&fromdate=', '').replace('todate=', '');
    const fromDate = strDate.split('&')[0];
    const toDate = strDate.split('&')[1];
    const serviceCodes: string[] = [serviceNo];
    if (serviceNo === '15') {
      serviceCodes.push('A5');
    } else if (serviceNo === '78') {
      serviceCodes.push('15', 'A5');
    }

    return `
      SELECT 設定画面ID,職員名,職員コード,氏名,対象年月日,記録日時,記録区分,メモ,時間変更_開始時間,時間変更_終了時間,時間変更_日常生活上の世話,連絡事項,FK_利用者,レコード削除情報,レコード更新情報,更新キー,サービス種類,サービス開始日時,サービス終了日時 
      FROM ${TableName.Attendance}
      WHERE FK_利用者 in (${strUsers}) AND
            レコード削除情報 IS NULL AND
            サービス種類 IN (${serviceCodes.map(e => `'${e}'`).join(',')}) AND
            対象年月日 >= '${fromDate}' AND
            対象年月日 <= '${toDate}'
      `;
  }

  async loadReporterData() {
    const dbOparation = new DBOperation();
    const reporter = this.logInUserID
      ? await dbOparation.getUserDataFromDBWithUserKey(this.logInUserID)
      : undefined;
    if (reporter) {
      this.reporterData = reporter;
    }
  }
}
