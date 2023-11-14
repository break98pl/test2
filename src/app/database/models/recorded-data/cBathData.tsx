import {
  cUserControls,
  OvernightData,
} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';
import {cTenantData} from '../various-registration-information-data/cTenantData';
import {cUserData} from '../various-registration-information-data/cUserData';
import {cSuperReportDataClass} from './cSuperReportDataClass';

export class cBathData extends cSuperReportDataClass {
  settingScreenId?: string; // SetteiGamenID
  name?: string; // Simei
  targetDate?: string; // TaisyoNengappi
  timeZone?: string; // Jikantai
  bathMethod?: string; // NyuyokuHouho
  bathTime?: string; //NyuyokuJikoku
  takingBath?: string; // NyuyokuJissi
  memo?: string;
  staffCode?: string; // SyokuinCode
  staffName?: string; // SyokuinMei
  myTenantData?: cTenantData;
  kanaName?: string; // kana_simei
  sortKeyRoomCodeTana?: string; // SortKeyHeyacodeKana
  roomName?: string; // heyameisyo
  IsEdited?: boolean;
  nowStatusOvernight?: OvernightData; // NowStatus_GAISYUTUGAIHAKU
  isRegisterAll?: boolean; // IsIkkatsu

  constructor() {
    super();
  }

  strTargetDate() {
    return this.targetDate;
  }

  strServiceUserName() {
    return this.kanaName;
  }

  setStrTargetDate(strTargetDate: string) {
    this.targetDate = strTargetDate;
  }

  getUpdateDict() {
    this.updateDict = {};
    if (this.fkKey) {
      this.updateDict['FK_利用者'] = this.fkKey;
    }

    if (this.name) {
      this.updateDict['氏名'] = this.name;
    }

    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
    }

    if (this.targetDate) {
      this.updateDict['対象年月日'] = this.targetDate;
    }

    if (this.timeZone) {
      this.updateDict['時間帯'] = this.timeZone;
    }

    if (this.bathTime) {
      this.updateDict['入浴時刻'] = this.bathTime;
    }

    if (this.bathMethod) {
      this.updateDict['入浴方法'] = this.bathMethod;
    }

    if (this.takingBath) {
      this.updateDict['入浴実施'] = this.takingBath;
    }

    if (this.memo) {
      this.updateDict['メモ'] = this.memo;
    }

    if (this.settingScreenId) {
      this.updateDict['設定画面ID'] = this.settingScreenId;
    }

    if (this.staffCode) {
      this.updateDict['職員コード'] = this.staffCode;
    }

    if (this.staffName) {
      this.updateDict['職員名'] = this.staffName;
    }

    if (this.updateFlag) {
      this.updateDict['変更フラグ'] = this.updateFlag;
    }

    if (this.newFlag) {
      this.updateDict['新規フラグ'] = this.newFlag;
    }

    if (this.serviceType) {
      this.updateDict['サービス種類'] = this.serviceType;
    }

    if (this.strSendErrMsg) {
      this.updateDict['送信エラー'] = this.strSendErrMsg;
    }

    if (this.expireDate) {
      this.updateDict['掲載期限日'] = this.expireDate;
    }

    this.updateDict['期間_選択項目'] = this.viewingPeriod;

    return this.updateDict;
  }

  tableName() {
    return 'T_日常業務_入浴記録';
  }

  getBathData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.fkKey = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.name = parser.getDataValueFromKeyAndTargetArray('氏名', ad);
    this.targetDate = parser.getDataValueFromKeyAndTargetArray(
      '対象年月日',
      ad,
    );
    this.timeZone = parser.getDataValueFromKeyAndTargetArray('時間帯', ad);
    this.bathTime = parser.getDataValueFromKeyAndTargetArray('入浴時刻', ad);
    this.bathMethod = parser.getDataValueFromKeyAndTargetArray('入浴方法', ad);
    this.takingBath = parser.getDataValueFromKeyAndTargetArray('入浴実施', ad);
    this.memo = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('メモ', ad),
    );
    this.settingScreenId = parser.getDataValueFromKeyAndTargetArray(
      '設定画面ID',
      ad,
    );
    this.staffCode = parser.getDataValueFromKeyAndTargetArray('職員コード', ad);
    this.staffName = parser.getDataValueFromKeyAndTargetArray('職員名', ad);
    this.serviceType = parser.getDataValueFromKeyAndTargetArray(
      'サービス種類',
      ad,
    );
    this.ASUpdateKey = parser.getDataValueFromKeyAndTargetArray(
      'AP_更新キー',
      ad,
    );

    this.reporterData = new cUserData();
    this.reporterData.getUserData(ad);
  }

  setJSONArray() {
    const postArrayObjects: any[] = [];
    const postArrayKeys: string[] = [];

    if (
      this.updateKey.length !== 0 &&
      this.updateKey !== '' &&
      this.newFlag !== '1'
    ) {
      postArrayObjects.push(this.updateKey);
      postArrayKeys.push('更新キー');
    }

    if (this.fkKey) {
      postArrayObjects.push(this.fkKey);
      postArrayKeys.push('FK_利用者');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('FK_利用者');
    }

    if (this.name) {
      postArrayObjects.push(this.name);
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

    if (this.timeZone) {
      postArrayObjects.push(this.timeZone);
      postArrayKeys.push('時間帯');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('時間帯');
    }

    if (this.bathTime) {
      postArrayObjects.push(this.bathTime);
      postArrayKeys.push('入浴時刻');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('入浴時刻');
    }

    if (this.bathMethod) {
      postArrayObjects.push(this.bathMethod);
      postArrayKeys.push('入浴方法');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('入浴方法');
    }

    if (this.takingBath) {
      postArrayObjects.push(this.takingBath);
      postArrayKeys.push('入浴実施');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('入浴実施');
    }

    if (this.memo) {
      postArrayObjects.push(this.memo);
      postArrayKeys.push('メモ');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('メモ');
    }

    if (this.staffCode) {
      postArrayObjects.push(this.staffCode);
      postArrayKeys.push('職員コード');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('職員コード');
    }

    if (this.staffName) {
      postArrayObjects.push(this.staffName);
      postArrayKeys.push('職員名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('職員名');
    }

    if (this.serviceType) {
      postArrayObjects.push(this.serviceType);
      postArrayKeys.push('サービス種類');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('サービス種類');
    }

    if (this.expireDate) {
      postArrayObjects.push(this.expireDate);
      postArrayKeys.push('掲載期限日');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('掲載期限日');
    }

    if (this.viewingPeriod >= 0) {
      postArrayObjects.push(this.viewingPeriod);
      postArrayKeys.push('期間_選択項目');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('期間_選択項目');
    }

    postArrayObjects.push('4');
    postArrayKeys.push('設定画面ID');

    return [postArrayObjects, postArrayKeys];
  }

  naiyoString() {
    let s = '';

    if (this.takingBath.length !== 0) {
      s = this.takingBath;
      s = `${s}\n\n`;
    }
    if (this.bathMethod.length !== 0) {
      s = `${s}【入浴方法】`;
      s = `${s}${this.bathMethod}`;
    }
    if (this.memo.length !== 0) {
      s = `${s}\n\n`;
      s = `${s}メモ：\n`;
      s = `${s}--------------------------------------\n`;
      s = `${s}${this.memo}`;
    }

    return s;
  }

  coloredNaiyoString(keyWords: string[]) {}

  getJikoku() {
    let DateString = '';

    DateString = this.targetDate.substr(0, 10);
    DateString = `${DateString}T`;

    if (this.timeZone === '午前') {
      DateString = `${DateString}10:00:00`;
    } else if (this.timeZone === '午後') {
      DateString = `${DateString}15:00:00`;
    } else {
      if (this.bathTime.length === 0) {
        DateString = `${DateString}00:00:00`;
      } else {
        return this.bathTime;
      }
    }

    return DateString;
  }

  stringBunlui() {
    return '入浴';
  }

  imageBunlui() {
    return 'ast_nyuyoku_tama_koushin';
  }

  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    if (this.bathTime === '') {
      return `${control.dateTimeJapanStyleFromStringNoTime(this.targetDate)} ${
        this.timeZone
      }`;
    }

    return control.dateTimeJapanStyleFromString(this.bathTime);
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

  recordDateTime() {
    const control: cUserControls = new cUserControls();
    return control.DateFormatterFromString2Date(this.getJikoku());
  }

  reportType() {
    return '入浴記録';
  }

  reportImageFileName() {
    return 'ast_nyuyoku_tama';
  }

  reportDate() {
    return this.targetDate;
  }

  reportTime() {
    const parser: cDataClass = new cDataClass();
    return parser.dateStringToTime(this.getJikoku());
  }

  displayReportTime() {
    if (!this.bathTime || this.bathTime.length === 0) {
      return this.timeZone;
    } else {
      return this.reportTime();
    }
  }

  tenantKey() {
    return this.fkKey;
  }

  memoOfReport() {
    return this.memo;
  }

  subject() {
    return this.naiyoString();
  }

  reporterName() {
    return this.reporterData.getUserNameString();
  }

  reporterJob() {
    return this.reporterData.userSyokusyuString();
  }

  reporterCode() {
    return this.reporterData.staffCode;
  }

  serviceName() {
    const control: cUserControls = new cUserControls();
    return control.getServiceName(this.serviceType);
  }

  dateCreateColumn() {
    return '対象年月日';
  }

  tableNameForClass() {
    return 'T_日常業務_入浴記録';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
    timeForReported: string | null,
  ) {
    return super.getSqlStringForGettingDataFromServerForFK(
      fk_key,
      from_date,
      to_date,
      reported,
      timeForReported,
    );
  }
}
