import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';
import {cUserData} from '../various-registration-information-data/cUserData';
import {cSuperReportDataClass} from './cSuperReportDataClass';

export class cBitalData extends cSuperReportDataClass {
  updateUser?: string; // UpdateUser
  settingScreenId?: string; // SetteiGamenID
  name?: string; // Simei
  recordTime?: string; // KirokuNitiji
  pulse?: string; // Myakuhaku
  breath?: string; // Kokyuu
  bloodPressureHigh?: string; // Ketsuatsu_Kou
  bloodPressureLow?: string; // Ketsuatsu_Tei
  temperature?: string; // Taion
  oxygenSaturation?: string; // Sanso
  weight?: string; // Taijyu
  memo?: string; // Memo
  staffCode?: string; // SyokuinCode
  staffName?: string; // SyokuinMei
  contactMailGroupName?: string; // RenrakuMailGroupMei

  blPartnerId?: string; // renkeiID
  isBlPartnerRecord?: boolean; // isRenkeiRecord

  constructor() {
    super();
  }

  getUpdateDict() {
    this.updateDict = {};
    if (this.fkKey) {
      this.updateDict['FK_利用者'] = this.fkKey;
    }

    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
    }

    if (this.staffCode) {
      this.updateDict['職員コード'] = this.staffCode;
    }

    if (this.staffName) {
      this.updateDict['職員名'] = this.staffName;
    }

    if (this.settingScreenId) {
      this.updateDict['設定画面ID'] = this.settingScreenId;
    }

    if (this.name) {
      this.updateDict['氏名'] = this.name;
    }

    if (this.recordTime) {
      this.updateDict['記録日時'] = this.recordTime;
    }

    if (this.pulse) {
      this.updateDict['脈拍'] = this.pulse;
    }

    if (this.breath) {
      this.updateDict['呼吸'] = this.breath;
    }

    if (this.bloodPressureHigh) {
      this.updateDict['血圧_高'] = this.bloodPressureHigh;
    }

    if (this.bloodPressureLow) {
      this.updateDict['血圧_低'] = this.bloodPressureLow;
    }

    if (this.temperature) {
      this.updateDict['体温'] = this.temperature;
    }

    if (this.oxygenSaturation) {
      this.updateDict['酸素'] = this.oxygenSaturation;
    }
    if (this.weight) {
      this.updateDict['体重'] = this.weight;
    }

    if (this.memo) {
      this.updateDict['コメント'] = this.memo;
    }

    if (this.contactMailGroupName) {
      this.updateDict['連絡メールグループ名'] = this.contactMailGroupName;
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
    return 'T_日常業務_バイタル';
  }

  getBitalData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.fkKey = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.staffCode = parser.getDataValueFromKeyAndTargetArray('職員コード', ad);
    this.staffName = parser.getDataValueFromKeyAndTargetArray('職員名', ad);
    this.settingScreenId = parser.getDataValueFromKeyAndTargetArray(
      '設定画面ID',
      ad,
    );
    this.name = parser.getDataValueFromKeyAndTargetArray('氏名', ad);
    this.recordTime = parser.getDataValueFromKeyAndTargetArray('記録日時', ad);
    this.pulse = parser.getDataValueFromKeyAndTargetArray('脈拍', ad);
    this.breath = parser.getDataValueFromKeyAndTargetArray('呼吸', ad);
    this.bloodPressureHigh = parser.getDataValueFromKeyAndTargetArray(
      '血圧_高',
      ad,
    );
    this.bloodPressureLow = parser.getDataValueFromKeyAndTargetArray(
      '血圧_低',
      ad,
    );
    this.temperature = parser.getDataValueFromKeyAndTargetArray('体温', ad);
    this.oxygenSaturation = parser.getDataValueFromKeyAndTargetArray(
      '酸素',
      ad,
    );
    this.weight = parser.getDataValueFromKeyAndTargetArray('体重', ad);
    this.memo = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('コメント', ad),
    );
    this.contactMailGroupName = parser.getDataValueFromKeyAndTargetArray(
      '連絡メールグループ名',
      ad,
    );
    this.serviceType = parser.getDataValueFromKeyAndTargetArray(
      'サービス種類',
      ad,
    );
    this.expireDate = parser.getDataValueFromKeyAndTargetArray(
      '掲載期限日',
      ad,
    );
    this.viewingPeriod = parseInt(
      parser.getDataValueFromKeyAndTargetArray('期間_選択項目', ad),
      10,
    );
    this.ASUpdateKey = parser.getDataValueFromKeyAndTargetArray(
      'AP_更新キー',
      ad,
    );
    this.blPartnerId = parser.getDataValueFromKeyAndTargetArray('連携先ID', ad);

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
    if (this.recordTime) {
      postArrayObjects.push(this.recordTime);
      postArrayKeys.push('記録日時');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('記録日時');
    }
    if (this.pulse) {
      postArrayObjects.push(this.pulse);
      postArrayKeys.push('脈拍');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('脈拍');
    }
    if (this.breath) {
      postArrayObjects.push(this.breath);
      postArrayKeys.push('呼吸');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('呼吸');
    }
    if (this.bloodPressureHigh) {
      postArrayObjects.push(this.bloodPressureHigh);
      postArrayKeys.push('血圧_高');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('血圧_高');
    }
    if (this.bloodPressureLow) {
      postArrayObjects.push(this.bloodPressureLow);
      postArrayKeys.push('血圧_低');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('血圧_低');
    }
    if (this.temperature) {
      postArrayObjects.push(this.temperature);
      postArrayKeys.push('体温');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('体温');
    }
    if (this.oxygenSaturation) {
      postArrayObjects.push(this.oxygenSaturation);
      postArrayKeys.push('酸素');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('酸素');
    }
    if (this.weight) {
      postArrayObjects.push(this.weight);
      postArrayKeys.push('体重');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('体重');
    }
    if (this.memo) {
      postArrayObjects.push(this.memo);
      postArrayKeys.push('コメント');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('コメント');
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
      postArrayObjects.push(`${this.viewingPeriod}`);
      postArrayKeys.push('期間_選択項目');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('期間_選択項目');
    }

    postArrayObjects.push('4');
    postArrayKeys.push('設定画面ID');

    return [postArrayObjects, postArrayKeys];
  }

  stringFormatTaijyuForDisplay() {
    const tmpTaijyu = parseFloat(this.weight);
    return tmpTaijyu.toFixed(1);
  }

  stringFormatTaijyuForListView() {
    if (this.weight.endsWith('.0')) {
      return parseInt(this.weight, 10);
    }
    return this.stringFormatTaijyuForDisplay();
  }

  recordDateTime() {
    return moment(this.recordTime).toDate();
  }

  dateCreateColumn() {
    return '記録日時';
  }

  tableNameForClass() {
    return 'T_日常業務_バイタル';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
    timeForReported: string | null,
  ) {
    // const control: cUserControls = new cUserControls();

    // let sqlString;
    // const nowDate = new Date();
    // let toDate = to_date ? to_date : new Date();

    // toDate = moment(toDate).add(1, 'day').toDate();

    // const fromDate = from_date
    //   ? from_date
    //   : control.GetDataDaysFromUserDefault();

    // const strNowDate =
    //   timeForReported && timeForReported !== ''
    //     ? timeForReported
    //     : moment(nowDate).format('YYYY-MM-DD');
    // const strFromDate = moment(fromDate).format('YYYY-MM-DD');
    // const strToDate = moment(toDate).format('YYYY-MM-DD');

    // sqlString = `SELECT * FROM ${this.tableNameForClass()} WHERE レコード削除情報 IS NULL `;

    // if (reported) {
    //   sqlString = `${sqlString}AND ((${this.dateCreateColumn()} < '${strToDate}' AND ${this.dateCreateColumn()} >= '${strFromDate}' ) OR (掲載期限日 >= '${strNowDate}' AND 期間_選択項目 IS NOT NULL )) `;
    // } else {
    //   sqlString = `${sqlString}AND (${this.dateCreateColumn()} < '${strToDate}' AND ${this.dateCreateColumn()} >= '${strFromDate}' )AND (掲載期限日 IS NULL OR 掲載期限日<'${strNowDate}') `;
    // }

    // const dbLogic: DBOperation = new DBOperation();
    // const dbLogicR: DBOperation_Residence = new DBOperation_Residence();
    // const dbLogicM: DBOperation_SmallMulti = new DBOperation_SmallMulti();

    // const arrFkKeys: string[] = fk_key
    //   ? [fk_key]
    //   : global.appType === APP_TYPE.JUTAKU
    //   ? await dbLogicR.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL([])
    //   : global.appType === APP_TYPE.TAKINO
    //   ? await dbLogicM.getFK_KeyDistinctByTenantDataTBL()
    //   : await dbLogic.getUserID();

    // if (arrFkKeys.length > 0) {
    //   const strWhere = `AND FK_利用者 IN (${arrFkKeys
    //     .map((a) => `'${a}'`)
    //     .join(',')})`;
    //   sqlString = `${sqlString}${strWhere}`;
    // }

    return super.getSqlStringForGettingDataFromServerForFK(
      fk_key,
      from_date,
      to_date,
      reported,
      timeForReported,
    );
  }
}
