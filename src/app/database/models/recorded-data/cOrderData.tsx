import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {DBOperation_Residence} from '@modules/resident/resident.service';

export class cOrderData {
  orderName?: string;
  orderGroupName?: string;
  isChecked?: boolean;
  memo?: string;
  displayOrder?: number;

  constructor() {}

  dateCreateColumn() {
    return '記録日時';
  }

  tableNameForClass() {
    return 'T_AP_オーダー記録';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
  ) {
    const control: cUserControls = new cUserControls();

    let sqlString;
    let toDate = to_date ? to_date : new Date();

    toDate = moment(toDate).add(1, 'day').toDate();

    const fromDate = from_date
      ? from_date
      : control.GetDataDaysFromUserDefault();

    const strFromDate = moment(fromDate).format('YYYY-MM-DD');
    const strToDate = moment(toDate).format('YYYY-MM-DD');

    sqlString =
      'SELECT T_AP_オーダー記録.FK_AP_更新キー, T_AP_オーダー記録.オーダー記録更新キー, T_AP_オーダー記録.オーダーグループ名, T_AP_オーダー記録.実施有無, T_AP_オーダー記録.オーダー名, T_AP_オーダー記録.備考, T_AP_オーダー記録.表示順, T_AP_オーダー記録.更新キー, T_AP_オーダー記録.更新ユーザー情報, T_AP_オーダー記録.レコード作成情報, T_AP_オーダー記録.レコード削除情報, T_AP_オーダー記録.レコード更新情報 FROM T_AP_オーダー記録 LEFT JOIN T_AP_チェックインチェックアウト記録 ON T_AP_オーダー記録.FK_AP_更新キー = T_AP_チェックインチェックアウト記録.AP_更新キー WHERE T_AP_チェックインチェックアウト記録.レコード削除情報 IS NULL';
    sqlString = `${sqlString} AND (T_AP_チェックインチェックアウト記録.記録日時 < '${strToDate}' AND T_AP_チェックインチェックアウト記録.記録日時 >= '${strFromDate}') `;

    const dbLogic: DBOperation_Residence = new DBOperation_Residence();

    const arrFkKeys: string[] = fk_key
      ? [fk_key]
      : await dbLogic.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL([]);

    if (arrFkKeys.length > 0) {
      const strWhere = `AND T_AP_チェックインチェックアウト記録.FK_利用者 IN (${arrFkKeys
        .map(a => `'${a}'`)
        .join(',')})`;
      sqlString = `${sqlString}${strWhere}`;
    }

    return sqlString;
  }
}
