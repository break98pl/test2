import moment from 'moment';

import {DBOperation} from '@modules/operation/operation.service';
import {DBOperation_Residence} from '@modules/resident/resident.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {AppType} from '@modules/setting/setting.type';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
export class cIngestion {
  logInUserName?: string; //職員名
  logInUserID?: string; //職員コード
  rowNumber?: string; //行番号
  scheduledIngestionDate?: string; //投薬予定日
  ingestionTimeType?: string; //投薬時間区分
  sortNumOfIngestionTimeType?: string; //投薬区分表示順
  timeDefinitionType?: number; //時間設定種別
  startTime1?: string; //開始時間1
  endTime1?: string; //終了時間1
  startTime2?: string; //開始時間2
  endTime2?: string; //終了時間2
  startTime3?: string; //開始時間3
  endTime3?: string; //終了時間3
  timeInterval?: number; //時間間隔
  ingestionMemo?: string; //投薬メモ
  scheduleFlag?: string; //予定フラグ
  resultFlag?: string; //実績フラグ
  resultType?: number; //実績種別
  ingestionDate?: string; //投薬日時
  reason?: string; //理由
  reasonControlCode?: string; //理由管理番号
  specialMention?: string; //特記事項
  logicalDeleteFlag?: string; //論理削除フラグ

  /**
   * Shisetsu only
   */
  content?: string;

  constructor() {}

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
  ) {
    const control: cUserControls = new cUserControls();

    let sqlString = '';
    let toDate = to_date ? to_date : new Date();

    const fromDate = from_date
      ? from_date
      : control.GetIntervalBeginDateFromDate(toDate);

    const strFromDate = moment(fromDate).format('YYYY-MM-DD');
    const strToDate = moment(toDate).add(1, 'day').format('YYYY-MM-DD');

    sqlString =
      'SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,FK_利用者,利用者_姓,利用者_名,職員コード,投薬させた職員の姓,投薬させた職員の名,行番号,投薬予定日,投薬時間区分,投薬時間区分表示順,時間設定種別,開始時間1,終了時間1,開始時間2,終了時間2,開始時間3,終了時間3,時間間隔,投薬メモ,予定フラグ,実績フラグ,実績種別,投薬日時,理由,理由管理番号,特記事項,論理削除フラグ FROM T_服やっくん服薬情報 WHERE レコード削除情報 IS NULL ';

    sqlString = `${sqlString}  AND (投薬日時 < '${strToDate}' AND 投薬日時 >= '${strFromDate}') `;

    const dbLogic: DBOperation = new DBOperation();
    const dbLogicR: DBOperation_Residence = new DBOperation_Residence();
    const {appType} = getReduxStates('authentication') as AuthState;

    const arrFkKeys: string[] = fk_key
      ? [fk_key]
      : appType === AppType.JUTAKU
      ? await dbLogicR.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL([])
      : await dbLogic.getUserID();

    if (arrFkKeys.length > 0) {
      const strWhere = `AND FK_利用者 IN (${arrFkKeys
        .map(a => `'${a}'`)
        .join(',')})`;
      sqlString = `${sqlString}${strWhere}`;
    }

    return sqlString;
  }

  getSqlStringForGettingControlTable() {
    return 'SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,ユーザID,前回アップロード日時_利用者,前回アップロード日時_職員,前回ダウンロード日時_服薬 FROM K_服やっくん連携 WHERE レコード削除情報　IS NULL ';
  }

  /**
   * not implemented yet (don't have in shishetsu)
   */
  stringFromIngestionResult() {}

  /**
   * not implemented yet (only have in shishetsu)
   */
  canShowRecordIngestion() {}
}
