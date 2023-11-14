import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {AppType} from '@modules/setting/setting.type';

export class cRecordSetting_Selection {
  itemName?: string; //KoumokuMei
  recordSqlNumber?: string; //TourokuSeqNo
  value?: string;
  pkSelection?: number;
  historyInfo?: number;

  constructor() {}

  getSqlStringForGettingDataFromServer() {
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType !== AppType.SHISETSHU) {
      return 'SELECT レコード削除情報,レコード更新情報,更新キー,項目名,選択項目,値,登録seq番号,履歴情報,更新ユーザー情報,レコード作成情報 FROM M_記録設定_選択項目 WHERE レコード削除情報 IS NULL';
    } else {
      return 'SELECT レコード削除情報,レコード更新情報,更新キー,項目名,PK_選択項目,値,登録seq番号,履歴情報,更新ユーザー情報,レコード作成情報 FROM M_記録設定_選択項目 WHERE レコード削除情報 IS NULL ';
    }
  }

  tableName() {
    return 'M_記録設定_選択項目';
  }

  setJSONArray() {
    const postArrayObjects: any[] = [];
    const postArrayKeys: string[] = [];

    if (this.itemName.length > 0 || this.itemName !== '') {
      postArrayObjects.push(this.itemName);
      postArrayKeys.push('項目名');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('項目名');
    }

    if (this.value.length > 0 || this.value !== '') {
      postArrayObjects.push(this.value);
      postArrayKeys.push('値');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('値');
    }

    if (this.recordSqlNumber.length > 0 || this.recordSqlNumber !== '') {
      postArrayObjects.push(this.recordSqlNumber);
      postArrayKeys.push('登録seq番号');
    } else {
      postArrayObjects.push('(null)');
      postArrayKeys.push('登録seq番号');
    }

    postArrayObjects.push('2');
    postArrayKeys.push('履歴情報');

    return [postArrayObjects, postArrayKeys];
  }
}
