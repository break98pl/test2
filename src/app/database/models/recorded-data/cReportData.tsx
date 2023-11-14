import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {AppType} from '@modules/setting/setting.type';
import {cDataClass} from '../cDataClass';
import {cUserData} from '../various-registration-information-data/cUserData';
import {cSuperReportDataClass} from './cSuperReportDataClass';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';

export class cReportData extends cSuperReportDataClass {
  updateUser?: string; //UpdateUser
  ServiceName?: string;
  seqNo?: string;
  name?: string; //seimei
  birthDate?: string; //Nengappi
  time?: string; //Jikoku
  place?: string; //basyo
  classification?: string; //bunrui
  reporter?: string; //houkokusya
  content?: string; //Naiyo
  settingScreenID?: string; //settingScreenID
  photoKey?: string;
  photoData?: string;
  binaryTblupdateKey?: string; //binaryTbl_updateKey

  constructor() {
    super();
  }

  getUpdateDict() {
    this.updateDict = {};

    if (this.fkKey) {
      this.updateDict['FK_利用者'] = this.fkKey;
    }

    if (this.name) {
      this.updateDict['姓名'] = this.name;
    }

    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
    }

    if (this.birthDate) {
      this.updateDict['年月日'] = this.birthDate;
    }

    if (this.time) {
      this.updateDict['時刻'] = this.time;
    }

    if (this.classification) {
      this.updateDict['分類'] = this.classification;
    }

    if (this.place) {
      this.updateDict['場所'] = this.place;
    }

    if (this.content) {
      this.updateDict['支援経過内容'] = this.content;
    }

    if (this.reporter) {
      this.updateDict['報告者'] = this.reporter;
    }

    if (this.settingScreenID) {
      this.updateDict['設定画面ID'] = this.settingScreenID;
    }

    if (this.photoKey) {
      this.updateDict['写真バイナリキー'] = this.photoKey;
    }

    if (this.updateFlag) {
      this.updateDict['変更フラグ'] = this.updateFlag;
    }

    if (this.newFlag) {
      this.updateDict['新規フラグ'] = this.newFlag;
    }

    if (this.imgFlagSet) {
      this.updateDict['写真データ変更フラグ'] = this.imgFlagSet;
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

  getReportData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.fkKey = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.birthDate = parser.getDataValueFromKeyAndTargetArray('年月日', ad);
    this.time = parser.getDataValueFromKeyAndTargetArray('時刻', ad);
    this.classification = parser.getDataValueFromKeyAndTargetArray('分類', ad);
    this.place = parser.getDataValueFromKeyAndTargetArray('場所', ad);
    this.binaryTblupdateKey = parser.getDataValueFromKeyAndTargetArray(
      'T_バイナリ更新キー',
      ad,
    );
    this.content = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('支援経過内容', ad),
    );
    this.reporter = parser.getDataValueFromKeyAndTargetArray('報告者', ad);
    this.settingScreenID = parser.getDataValueFromKeyAndTargetArray(
      '設定画面ID',
      ad,
    );
    this.photoKey = parser.getDataValueFromKeyAndTargetArray('キー', ad); // kita2011/07/19
    this.photoData = parser.getDataValueFromKeyAndTargetArray('データ', ad); // kita2011/07/19
    this.reporterData = new cUserData();
    this.reporterData.getUserData(ad);
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

    if (this.name || this.name !== '') {
      postArrayObjects.push(this.name);
      postArrayKeys.push('姓名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('姓名');
    }

    if (this.fkKey) {
      postArrayObjects.push(this.fkKey);
      postArrayKeys.push('FK_利用者');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('FK_利用者');
    }

    if (this.birthDate) {
      postArrayObjects.push(this.birthDate);
      postArrayKeys.push('年月日');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('年月日');
    }

    if (this.time) {
      postArrayObjects.push(this.time);
      postArrayKeys.push('時刻');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('時刻');
    }

    if (this.classification) {
      postArrayObjects.push(this.classification);
      postArrayKeys.push('分類');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('分類');
    }

    if (this.place) {
      postArrayObjects.push(this.place);
      postArrayKeys.push('場所');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('場所');
    }

    if (this.content) {
      postArrayObjects.push(this.content);
      postArrayKeys.push('支援経過内容');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('支援経過内容');
    }

    if (this.reporter) {
      postArrayObjects.push(this.reporter);
      postArrayKeys.push('報告者');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('報告者');
    }

    postArrayObjects.push('4');
    postArrayKeys.push('設定画面ID');

    if (this.newFlag === '1') {
      postArrayObjects.push('1');
      postArrayKeys.push('印刷オプション');

      postArrayObjects.push('0');
      postArrayKeys.push('強調印字オプション');

      postArrayObjects.push('0');
      postArrayKeys.push('情報公開');
    }

    if (this.photoKey.length > 0) {
      postArrayObjects.push('1');
      postArrayKeys.push('写真あり');
    } else {
      postArrayObjects.push('0');
      postArrayKeys.push('写真あり');
    }

    if (this.photoKey) {
      postArrayObjects.push(this.photoKey);
      postArrayKeys.push('写真バイナリキー');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('写真バイナリキー');
    }
    if (this.serviceType) {
      postArrayObjects.push(this.serviceType);
      postArrayKeys.push('サービス種類');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('サービス種類');
    }

    postArrayObjects.push('提供');
    postArrayKeys.push('サービス名称');

    if (this.updateKey.length === 0 || this.newFlag === '1') {
      postArrayObjects.push('1');
      postArrayKeys.push('印刷オプション');
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

    return [postArrayObjects, postArrayKeys];
  }

  contentString() {
    let s = '';

    if (this.place.length > 0) {
      s = `${s}【場所】`;
      s = `${s}this.place`;
      s = `${s}\n\n`;
    }

    s = `${s}${this.content}`;

    return s;
  }

  coloredcontentString(keyWords: string[]) {}

  stringBunlui() {
    return '経過記録';
  }

  imageBunlui() {
    return 'ast_keikakiroku_tama_koushin';
  }
  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    return control.dateTimeJapanStyleFromString(this.time);
  }
  imagePhoto() {
    if (this.photoKey.length > 0) {
    }
    return undefined;
  }

  imageActivity() {
    return undefined;
  }

  stringError() {
    return this.strSendErrMsg;
  }

  recordDateTime() {
    const strDate = this.birthDate;
    const strTime = this.time;

    const tmpDate = moment(strDate).toDate();
    const tmpTime = moment(strTime).toDate();

    if (!tmpTime) {
      return tmpDate;
    }

    const retDate = moment(
      `${tmpDate.getFullYear()}-${tmpDate.getMonth()}-${tmpDate.getDay()}T${tmpTime.getHours()}:${tmpTime.getMinutes()}:${tmpTime.getSeconds()}`,
    ).toDate();

    return retDate;
  }

  reportType() {
    return this.classification;
  }

  reportImageFileName() {
    return 'ast_keikakiroku_tama';
  }

  reportDate() {
    return `${this.birthDate.substr(0, 10)}T00:00:00`;
  }

  reportTime() {
    const data: cDataClass = new cDataClass();
    return data.dateStringToTime(this.time);
  }

  displayReportTime() {
    return this.reportTime();
  }

  tenantKey() {
    return this.fkKey;
  }

  subject() {
    return this.contentString;
  }

  reporterName() {
    return this.reporterData.getUserNameString;
  }

  reporterJob() {
    return this.reporterData.userSyokusyuString;
  }

  reporterCode() {
    return this.reporterData.staffCode;
  }

  serviceName() {
    const control: cUserControls = new cUserControls();
    return control.getServiceName(this.serviceType);
  }

  dateCreateColumn() {
    return '年月日';
  }

  tableNameForClass() {
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType === AppType.SHISETSHU) {
      return 'T_経過記録';
    }
    return 'T_サービス計画_介護支援経過';
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

  getStringQueryImageFromKeys(keys: string[] | null): string | null {
    if (keys === null) {
      return null;
    }

    let query: string =
      'select キー, レコード更新情報, 更新キー, レコード作成情報 from T_バイナリ where キー in(';
    let keysString: string = '';

    for (let key of keys) {
      if (key !== null) {
        keysString += `'${key}', `;
      }
    }

    if (keysString === '') {
      return null;
    }

    query += keysString;
    query = query.substring(0, query.length - 2); // Removing the last ', '
    query += ')';

    return query;
  }
}
