import {DBOperation} from '@modules/operation/operation.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';
import {cUserData} from '../various-registration-information-data/cUserData';
import {cSuperReportDataClass} from './cSuperReportDataClass';

export class cExcretionData extends cSuperReportDataClass {
  updateUser?: string;
  settingScreenId?: string; // SetteiGamenID
  name?: string; // Simei
  recordTime?: string; // KirokuNitiji
  incontinence?: string; // Sikkin
  excretionTool?: string; // HaisetuYogu
  urinationAmount?: string; // Hainyoryo
  urinationForm?: string; // HainyoKeitai
  defecationAmount?: string; // Haibenryo
  defecationForm?: string; // HaibenKeitai
  memo?: string;
  reporter?: string; // kirokusya
  setNo?: number;

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
    if (this.settingScreenId) {
      this.updateDict['設定画面ID'] = this.settingScreenId;
    }
    if (this.name) {
      this.updateDict['氏名'] = this.name;
    }
    if (this.recordTime) {
      this.updateDict['記録日時'] = this.recordTime;
    }
    if (this.incontinence) {
      this.updateDict['失禁'] = this.incontinence;
    }
    if (this.excretionTool) {
      this.updateDict['排泄用具'] = this.excretionTool;
    }
    if (this.urinationAmount) {
      this.updateDict['排尿量'] = this.urinationAmount;
    }

    if (this.urinationForm) {
      this.updateDict['排尿形態'] = this.urinationForm;
    }

    if (this.defecationAmount) {
      this.updateDict['排便量'] = this.defecationAmount;
    }
    if (this.defecationForm) {
      this.updateDict['排便形態'] = this.defecationForm;
    }

    if (this.memo) {
      this.updateDict['コメント'] = this.memo;
    }
    if (this.reporter) {
      this.updateDict['記録者'] = this.reporter;
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

    if (this.setNo >= 0) {
      this.updateDict['セットNo'] = this.setNo;
    }

    this.updateDict['期間_選択項目'] = this.viewingPeriod;

    return this.updateDict;
  }

  updateIconDict() {
    this.updateDict = {};

    if (this.fkKey) {
      this.updateDict['FK_利用者'] = this.fkKey;
    }

    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
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

    if (this.incontinence) {
      this.updateDict['失禁'] = this.incontinence;
    }

    if (this.excretionTool) {
      this.updateDict['排泄用具'] = this.excretionTool;
    }

    if (this.urinationAmount) {
      this.updateDict['排尿量'] = this.urinationAmount;
    }

    if (this.urinationForm) {
      this.updateDict['排尿形態'] = this.urinationForm;
    }

    if (this.defecationAmount) {
      this.updateDict['排便量'] = this.defecationAmount;
    }
    if (this.defecationForm) {
      this.updateDict['排便形態'] = this.defecationForm;
    }

    if (this.memo) {
      this.updateDict['コメント'] = this.memo;
    }

    if (this.reporter) {
      this.updateDict['記録者'] = this.reporter;
    }

    if (this.updateFlag) {
      this.updateDict['変更フラグ'] = this.updateFlag;
    }

    if (this.newFlag) {
      this.updateDict['新規フラグ'] = this.newFlag;
    }

    if (this.strSendErrMsg) {
      this.updateDict['送信エラー'] = this.strSendErrMsg;
    }

    if (this.setNo) {
      this.updateDict['セットNo'] = this.setNo;
    }

    if (this.expireDate) {
      this.updateDict['掲載期限日'] = this.expireDate;
    }

    if (this.setNo >= 0) {
      this.updateDict['セットNo'] = this.setNo;
    }

    this.updateDict['期間_選択項目'] = this.viewingPeriod;

    return this.updateDict;
  }

  tableName() {
    return 'T_日常業務_排泄記録';
  }

  getExcretionData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();

    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);

    this.fkKey = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.settingScreenId = parser.getDataValueFromKeyAndTargetArray(
      '設定画面ID',
      ad,
    );
    this.name = parser.getDataValueFromKeyAndTargetArray('氏名', ad);
    this.recordTime = parser.getDataValueFromKeyAndTargetArray('記録日時', ad);
    this.incontinence = parser.getDataValueFromKeyAndTargetArray('失禁', ad);
    this.excretionTool = parser.getDataValueFromKeyAndTargetArray(
      '排泄用具',
      ad,
    );
    this.urinationAmount = parser.getDataValueFromKeyAndTargetArray(
      '排尿量',
      ad,
    );
    this.urinationForm = parser.getDataValueFromKeyAndTargetArray(
      '排尿形態',
      ad,
    );
    this.defecationAmount = parser.getDataValueFromKeyAndTargetArray(
      '排便量',
      ad,
    );
    this.defecationForm = parser.getDataValueFromKeyAndTargetArray(
      '排便形態',
      ad,
    );
    this.memo = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('コメント', ad),
    );
    this.reporter = parser.getDataValueFromKeyAndTargetArray('記録者', ad);
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
    this.setNo = parseInt(
      parser.getDataValueFromKeyAndTargetArray('セットNo', ad),
      10,
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

    if (this.recordTime) {
      postArrayObjects.push(this.recordTime);
      postArrayKeys.push('記録日時');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('記録日時');
    }

    if (this.incontinence) {
      postArrayObjects.push(this.incontinence);
      postArrayKeys.push('失禁');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('失禁');
    }

    if (this.excretionTool) {
      postArrayObjects.push(this.excretionTool);
      postArrayKeys.push('排泄用具');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('排泄用具');
    }

    if (this.urinationAmount) {
      postArrayObjects.push(this.urinationAmount);
      postArrayKeys.push('排尿量');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('排尿量');
    }

    if (this.urinationForm) {
      postArrayObjects.push(this.urinationForm);
      postArrayKeys.push('排尿形態');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('排尿形態');
    }

    if (this.defecationAmount) {
      postArrayObjects.push(this.defecationAmount);
      postArrayKeys.push('排便量');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('排便量');
    }

    if (this.defecationForm) {
      postArrayObjects.push(this.defecationForm);
      postArrayKeys.push('排便形態');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('排便形態');
    }

    if (this.memo) {
      postArrayObjects.push(this.memo);
      postArrayKeys.push('コメント');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('コメント');
    }

    if (this.reporter) {
      postArrayObjects.push(this.reporter);
      postArrayKeys.push('記録者');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('記録者');
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

    // !!!: ASP側がintを処理出来ないため、送信時のみ文字列に変換する
    if (this.viewingPeriod >= 0) {
      postArrayObjects.push(`${this.viewingPeriod}`);
      postArrayKeys.push('期間_選択項目');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('期間_選択項目');
    }
    postArrayObjects.push('4');
    postArrayKeys.push('設定画面ID');

    if (this.setNo != 0 || this.fkKey !== '') {
      postArrayObjects.push(`${this.setNo}`);
      postArrayKeys.push('セットNo');
    } else {
      postArrayObjects.push('0');
      postArrayKeys.push('セットNo');
    }

    return [postArrayObjects, postArrayKeys];
  }

  getNaiyoWithoutmemo() {
    let s = '';

    if (this.excretionTool.length !== 0) {
      s = `${s}【排泄用具】`;
      s = `${s}${this.excretionTool.replace(/\t/g, ' ')}`;
      s = `${s}\n`;
    }
    if (this.incontinence === '1') {
      s = `${s}　失禁　`;
      s = `${s}\n\n`;
    }
    if (this.urinationAmount.length !== 0) {
      s = `${s}【排尿量】`;
      s = `${s}${this.urinationAmount}`;
    } else {
      s = `${s}【排尿】`;
      s = `${s}なし`;
    }

    if (s.indexOf('排尿') >= 0) {
      s = `${s}\n\n`;
    }

    if (this.urinationForm.length !== 0) {
      s = `${s}【排尿形態】`;
      s = `${s}${this.urinationForm}`;
    }
    if (this.defecationAmount.length !== 0) {
      s = `${s}【排便量】`;
      s = `${s}${this.defecationAmount}`;
    } else {
      s = `${s}【排便】`;
      s = `${s}なし`;
    }
    if (this.defecationForm.length !== 0) {
      s = `${s}【排便形態】`;
      s = `${s}${this.defecationForm}`;
    }
    return s;
  }

  naiyoString() {
    let s = '';
    s = `${s}${this.getNaiyoWithoutmemo()}`;

    if (this.memo.length !== 0) {
      s = `${s}\n\nメモ：\n------------------\n`;
      s = `${s}${this.memo}`;
    }

    return s;
  }

  coloredNaiyoString(keyWords: string[]) {}

  stringBunlui() {
    return '排泄';
  }

  imageBunlui() {
    return 'ast_haisetsu_tama_koushin';
  }

  stringTimestamp() {
    const control: cUserControls = new cUserControls();
    return control.dateTimeJapanStyleFromString(this.recordTime);
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
    return control.DateFormatterFromString2Date(this.recordTime);
  }

  reportType() {
    return '排泄記録';
  }

  reportImageFileName() {
    return 'ast_haisetsu_tama';
  }

  reportDate() {
    return `${this.recordTime.substr(0, 10)}T00:00:00`;
  }

  reportTime() {
    const parser: cDataClass = new cDataClass();
    return parser.dateStringToTime(this.recordTime);
  }

  displayReportTime() {
    return this.reportTime();
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

  serviceName() {
    const control: cUserControls = new cUserControls();
    return control.getServiceName(this.serviceType);
  }

  async getIconData(whereDict: string) {
    const dbLogic: DBOperation = new DBOperation();
    const iconArrayData = await dbLogic.excretionSelectQuery(whereDict);

    return iconArrayData;
  }

  reporterCode() {
    return this.reporterData.staffCode;
  }

  dateCreateColumn() {
    return '記録日時';
  }

  tableNameForClass() {
    return 'T_日常業務_排泄記録';
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

  getSqlStringForGettingIconDataFromServer() {
    return 'SELECT レコード削除情報,更新キー,セットNo,セット名,排泄用具,排尿量,排尿形態,排便量,排便形態,コメント,失禁,フィールド1,フィールド2,フィールド3,フィールド4,フィールド5,フィールド6,登録seq番号,更新ユーザー情報,レコード作成情報 FROM M_記録設定_排泄アイコン WHERE レコード削除情報 IS NULL ';
  }
}
