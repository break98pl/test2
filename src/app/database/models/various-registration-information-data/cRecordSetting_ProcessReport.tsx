import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {AppType} from '@modules/setting/setting.type';

export class cRecordSetting_ProcessReport {
  updateKey?: string;
  itemName?: string; //KoumokuMei
  registerSeqNumber?: string; //TourokuSeqNo
  value?: string;
  pkSelection?: number;
  historyInfo?: number;

  constructor() {}

  getSqlStringForGettingDataFromServer() {
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType !== AppType.SHISETSHU) {
      return 'SELECT レコード削除情報,レコード更新情報,更新キー,項目名,場所,選択項目,文例,登録seq番号,更新ユーザー情報,レコード作成情報 FROM M_記録設定_経過記録 WHERE レコード削除情報 IS NULL';
    } else {
      return 'SELECT レコード削除情報,レコード更新情報,更新キー,項目名,場所,FK_選択項目,文例,登録seq番号,更新ユーザー情報,レコード作成情報 FROM M_記録設定_経過記録 WHERE レコード削除情報 IS NULL ';
    }
  }

  tableName() {
    return 'M_記録設定_経過記録';
  }
}
