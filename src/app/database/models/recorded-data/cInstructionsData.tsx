import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {DBOperation_Residence} from '@modules/resident/resident.service';

export class cInstructionsData {
  constructor() {}

  dateCreateColumn() {
    return '記録日時';
  }

  tableNameForClass() {
    return 'T_AP_責任者指示';
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
      'SELECT T_AP_責任者指示.FK_AP_更新キー, T_AP_責任者指示.指示内容, T_AP_責任者指示.指示ユーザー, T_AP_責任者指示.指示日時, T_AP_責任者指示.更新キー, T_AP_責任者指示.レコード作成情報, T_AP_責任者指示.レコード更新情報, T_AP_責任者指示.レコード削除情報, T_AP_責任者指示.更新ユーザー情報 FROM T_AP_責任者指示 LEFT JOIN T_AP_チェックインチェックアウト記録 ON T_AP_責任者指示.FK_AP_更新キー = T_AP_チェックインチェックアウト記録.AP_更新キー WHERE T_AP_チェックインチェックアウト記録.レコード削除情報 IS NULL';
    sqlString = `${sqlString} AND (T_AP_責任者指示.指示日時 < '${strToDate}' AND T_AP_責任者指示.指示日時 >= '${strFromDate}' ) `;

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
