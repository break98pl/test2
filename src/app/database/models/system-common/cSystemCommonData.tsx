import moment from 'moment';

import {DBOperation} from '@modules/operation/operation.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';

export class cSystemCommonData {
  // common db
  c0UpdateKey?: string;
  c1PartnerId?: string;
  c2LinkageFileId?: string;
  c3LinkageFileSubId?: string;
  c4PKUser?: string;
  c5DateTimeRecord?: string;
  c6StaffCode?: string;
  c7OriginalItem01?: string;
  c8OriginalItem02?: string;
  c9OriginalItem03?: string;
  c10OriginalItem04?: string;
  c11OriginalItem05?: string;
  c12OriginalItem06?: string;
  c13OriginalItem07?: string;
  c14OriginalItem08?: string;
  c15UniqueItem09?: string;
  c16OriginalItem10?: string;
  c17UniqueItem11?: string;
  c18OriginalItem12?: string;
  c19OriginalItem13?: string;
  c20OriginalItem14?: string;
  c21UniqueItem15?: string;
  c22UniqueItem16?: string;
  c23OriginalItem17?: string;
  c24UniqueItem18?: string;
  c25OriginalItem19?: string;
  c26OriginalItem20?: string;
  c27UniqueItem21?: string;
  c28OriginalItem22?: string;
  c29OriginalItem23?: string;
  c30OriginalItem24?: string;
  c31UniqueItem25?: string;
  c32UniqueItem26?: string;
  c33UniqueItem27?: string;
  c34UniqueItem28?: string;
  c35OriginalItem29?: string;
  c36OriginalItem30?: string;
  c37RecordCreationInfo?: string;
  c38RecordUpdateInfo?: string;
  c39RecordDeletionInfo?: string;
  c40UpdateUserInfo?: string;

  // of ReportWithMemoProtocol
  readonly reportType?: string;
  readonly reportImageFileName?: string;
  readonly reportDate?: string;
  readonly reportTime?: string;
  readonly displayReportTime?: string;
  readonly tenantKey?: string;
  readonly subject?: string;
  readonly reporterName?: string;
  readonly reporterJob?: string;
  readonly reporterCode?: string;

  // common UI
  sortDate?: string;
  content?: string;
  reporter?: string;
  imageFileName?: string;
  systemName?: string;
  // @property (nonatomic) IBOutlet NSString *datal;

  constructor() {
    this.c0UpdateKey = '';
    this.c1PartnerId = '';
    this.c2LinkageFileId = '';
    this.c3LinkageFileSubId = '';
    this.c4PKUser = '';
    this.c5DateTimeRecord = '';
    this.c6StaffCode = '';
    this.c7OriginalItem01 = '';
    this.c8OriginalItem02 = '';
    this.c9OriginalItem03 = '';
    this.c10OriginalItem04 = '';
    this.c11OriginalItem05 = '';
    this.c12OriginalItem06 = '';
    this.c13OriginalItem07 = '';
    this.c14OriginalItem08 = '';
    this.c15UniqueItem09 = '';
    this.c16OriginalItem10 = '';
    this.c17UniqueItem11 = '';
    this.c18OriginalItem12 = '';
    this.c19OriginalItem13 = '';
    this.c20OriginalItem14 = '';
    this.c21UniqueItem15 = '';
    this.c22UniqueItem16 = '';
    this.c23OriginalItem17 = '';
    this.c24UniqueItem18 = '';
    this.c25OriginalItem19 = '';
    this.c26OriginalItem20 = '';
    this.c27UniqueItem21 = '';
    this.c28OriginalItem22 = '';
    this.c29OriginalItem23 = '';
    this.c30OriginalItem24 = '';
    this.c31UniqueItem25 = '';
    this.c32UniqueItem26 = '';
    this.c33UniqueItem27 = '';
    this.c34UniqueItem28 = '';
    this.c35OriginalItem29 = '';
    this.c36OriginalItem30 = '';
    this.c37RecordCreationInfo = '';
    this.c38RecordUpdateInfo = '';
    this.c39RecordDeletionInfo = '';
    this.c40UpdateUserInfo = '';

    this.reportType = '';
    this.reportImageFileName = '';
    this.reportDate = '';
    this.reportTime = '';
    this.displayReportTime = '';
    this.tenantKey = '';
    this.subject = '';
    this.reporterName = '';
    this.reporterJob = '';
    this.reporterCode = '';

    this.sortDate = '';
    this.content = '';
    this.reporter = '';
    this.imageFileName = '';
    this.systemName = '';
  }

  getSqlStringForGettingM_連携DataFromServer() {
    return "SELECT * FROM M_連携 WHERE レコード削除情報 IS NULL AND 表示フラグ = '1'";
  }

  getSqlStringForGettingM_連携_独自項目DataFromServer() {
    return 'SELECT 更新キー,連携先ID,連携ファイルID,独自項目_ID,独自項目_名称,独自項目_型,独自項目_単位,表示フラグ,レコード作成情報,レコード更新情報,レコード削除情報 FROM M_連携_独自項目 WHERE レコード削除情報 IS NULL ';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
  ) {
    const control: cUserControls = new cUserControls();

    let sqlString = '';
    let toDate = to_date ? to_date : new Date();

    toDate = moment(toDate).add(1, 'day').toDate();

    const fromDate = from_date
      ? from_date
      : control.GetIntervalBeginDateFromDate(toDate);

    const strFromDate = moment(fromDate).format('YYYY-MM-DD');
    const strToDate = moment(toDate).format('YYYY-MM-DD');

    sqlString =
      'SELECT 更新キー,連携先ID,連携ファイルID,連携ファイルSUBID,PK_利用者,記録日時,職員コード,独自項目_01,独自項目_02,独自項目_03,独自項目_04,独自項目_05,独自項目_06,独自項目_07,独自項目_08,独自項目_09,独自項目_10,独自項目_11,独自項目_12,独自項目_13,独自項目_14,独自項目_15,独自項目_16,独自項目_17,独自項目_18,独自項目_19,独自項目_20,独自項目_21,独自項目_22,独自項目_23,独自項目_24,独自項目_25,独自項目_26,独自項目_27,独自項目_28,独自項目_29,独自項目_30,レコード作成情報,レコード更新情報,レコード削除情報,更新ユーザー情報 FROM T_記録_共通 WHERE レコード削除情報 IS NULL ';

    sqlString = `${sqlString}AND (記録日時 < '${strToDate}' AND 記録日時 >= '${strFromDate}' ) `;

    const dbLogic: DBOperation = new DBOperation();

    const arrFkKeys: string[] = fk_key ? [fk_key] : await dbLogic.getUserID();

    if (arrFkKeys.length > 0) {
      const strWhere = `AND PK_利用者 IN (${arrFkKeys
        .map(a => `'${a}'`)
        .join(',')})`;
      sqlString = `${sqlString}${strWhere}`;
    }

    return sqlString;
  }
}
