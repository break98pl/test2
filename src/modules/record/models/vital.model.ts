import {saveDataRecord} from '@database/helper';
import {TableName} from '@database/type';

interface VitalTable {
  recordDeletionInformation?: string;
  recordUpdateInformation?: string;
  updateKey: string;
  settingScreenId?: string;
  fkUser?: string;
  name?: string;
  recordTime?: string;
  pulse?: string;
  breath?: string;
  bloodPressureHigh?: string;
  bloodPressureLow?: string;
  bodyTemperature?: string;
  oxygen?: string;
  bodyWeight?: string;
  comment?: string;
  staffCode?: string;
  staffName?: string;
  contactEmailGroupName?: string;
  contactMailGroupName?: string;
  homeVisitNursingRecordBookIiKey?: string;
  updateUserInformation?: string;
  recordCreationInformation?: string;
  newFlag?: string;
  updateFlag?: string;
  serviceType?: string;
  cooperationId?: string;
  apUpdateKey?: string;
  sendingError?: string;
  periodSelectItem?: string;
  postingPeriodDate?: string;
}

const VITAL_TABLE_COLUMN: VitalTable = {
  recordDeletionInformation: 'レコード削除情報',
  recordUpdateInformation: 'レコード更新情報',
  updateKey: '更新キー',
  settingScreenId: '設定画面ID',
  fkUser: 'FK_利用者',
  name: '氏名',
  recordTime: '記録日時',
  pulse: '脈拍',
  breath: '呼吸',
  bloodPressureHigh: '血圧_高',
  bloodPressureLow: '血圧_低',
  bodyTemperature: '体温',
  oxygen: '酸素',
  bodyWeight: '体重',
  comment: 'コメント',
  staffCode: '職員コード',
  staffName: '職員名',
  contactEmailGroupName: '連絡メール_グループ名',
  contactMailGroupName: '連絡メールグループ名',
  homeVisitNursingRecordBookIiKey: '訪問看護記録書Ⅱキー',
  updateUserInformation: '更新ユーザー情報',
  recordCreationInformation: 'レコード作成情報',
  newFlag: '新規フラグ',
  updateFlag: '変更フラグ',
  serviceType: 'サービス種類',
  cooperationId: '連携先ID',
  apUpdateKey: 'AP_更新キー',
  sendingError: '送信エラー',
  periodSelectItem: '期間_選択項目',
  postingPeriodDate: '掲載期限日',
};

export namespace VitalDB {
  /**
   * Insert or Update into Vital table .
   */
  export const saveDataVital = async (saveData: VitalTable) => {
    const convertData = {};
    Object.keys(saveData).map(column => {
      //@ts-ignore
      convertData[VITAL_TABLE_COLUMN[column]] = saveData[column];
    });
    return await saveDataRecord(TableName.VitalRecord, convertData);
  };
}
