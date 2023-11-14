import {cSuperReportDataClass} from './cSuperReportDataClass';

export class cElapsedDataShisetsu extends cSuperReportDataClass {
  staffCode?: string; //職員コード - SyokuinCode
  updateScreenID?: string; //設定画面ID
  serviceName?: string;
  seqNumber?: string;
  name?: string;
  date?: string;
  time?: string;
  emphasedPrintingOption?: string;
  printingOption?: string;
  place?: string;
  classification?: string;
  syncError?: string;
  postingPeriodDate?: string;
  periodSelectItem?: number;
  reporter?: string;
  supportCourse?: string;
  isAttendance?: string;
  isShortTerm?: string;
  isTsusho?: string;
  havePhotos?: string;
  photoBinaryKey?: string;
  informationPublic?: string;
  sortCreationTime?: string;
  recordUpdateInformation?: string;
  recordCreationInformation?: string;
  photoDataUpdateFlag?: string;
  fkUser?: string;
  updateUserInformation?: string;

  constructor() {
    super();
    this.newFlag = '0';
    this.updateFlag = '0';
    this.photoDataUpdateFlag = '0';
  }

  getUpdateDict() {
    this.updateDict = {};
    if (this.fkUser) {
      this.updateDict['FK_利用者'] = this.fkUser;
    }
    if (this.updateScreenID) {
      this.updateDict['設定画面ID'] = this.updateScreenID;
    }
    if (this.updateKey) {
      this.updateDict['更新キー'] = this.updateKey;
    }
    if (this.updateUserInformation) {
      this.updateDict['更新ユーザー情報'] = this.updateUserInformation;
    }
    if (this.serviceName) {
      this.updateDict['サービス名称'] = this.serviceName;
    }
    if (this.seqNumber) {
      this.updateDict['Seq番号'] = this.seqNumber;
    }
    if (this.name) {
      this.updateDict['姓名'] = this.name;
    }
    if (this.date) {
      this.updateDict['年月日'] = this.date;
    }
    if (this.time) {
      this.updateDict['時刻'] = this.time;
    }
    if (this.emphasedPrintingOption) {
      this.updateDict['強調印字オプション'] = this.emphasedPrintingOption;
    }
    if (this.printingOption) {
      this.updateDict['印刷オプション'] = this.printingOption;
    }
    if (this.staffCode) {
      this.updateDict['職員コード'] = this.staffCode;
    }
    if (this.updateFlag) {
      this.updateDict['変更フラグ'] = this.updateFlag;
    }
    if (this.newFlag) {
      this.updateDict['新規フラグ'] = this.newFlag;
    }
    if (this.syncError) {
      this.updateDict['送信エラー'] = this.syncError;
    }
    if (this.postingPeriodDate) {
      this.updateDict['掲載期限日'] = this.postingPeriodDate;
    }
    if (this.periodSelectItem) {
      this.updateDict['期間_選択項目'] = this.periodSelectItem;
    }
    if (this.place) {
      this.updateDict['場所'] = this.place;
    }
    if (this.classification) {
      this.updateDict['分類'] = this.classification;
    }
    if (this.reporter) {
      this.updateDict['報告者'] = this.reporter;
    }
    if (this.supportCourse) {
      this.updateDict['支援経過内容'] = this.supportCourse;
    }
    if (this.isAttendance) {
      this.updateDict['Is入所'] = this.isAttendance;
    }
    if (this.isShortTerm) {
      this.updateDict['Is短期'] = this.isShortTerm;
    }
    if (this.isTsusho) {
      this.updateDict['Is通所'] = this.isTsusho;
    }
    if (this.havePhotos) {
      this.updateDict['写真あり'] = this.havePhotos;
    }
    if (this.photoBinaryKey) {
      this.updateDict['写真バイナリキー'] = this.photoBinaryKey;
    }
    if (this.informationPublic) {
      this.updateDict['情報公開'] = this.informationPublic;
    }
    if (this.sortCreationTime) {
      this.updateDict['ソート用作成時刻'] = this.sortCreationTime;
    }
    if (this.recordUpdateInformation) {
      this.updateDict['レコード更新情報'] = this.recordUpdateInformation;
    }
    if (this.recordCreationInformation) {
      this.updateDict['レコード作成情報'] = this.recordCreationInformation;
    }
    if (this.photoDataUpdateFlag) {
      this.updateDict['写真データ変更フラグ'] = this.photoDataUpdateFlag;
    }
    return this.updateDict;
  }
}
