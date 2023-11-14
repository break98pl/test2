import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cOrderData} from './cOrderData';
import {cSuperReportDataClass} from './cSuperReportDataClass';
import {DBOperation_Residence} from '@modules/resident/resident.service';

export enum ASSIGN_RECORD_KIND {
  AS_CHECKIN = 1,
  AS_CHECKOUT = 2,
  AS_ORDER = 3,
  AS_SIGNATURE = 9,
  AS_INSTRUCTION = 11,
}

export class cAssignReportData extends cSuperReportDataClass {
  signaturePhotoKey?: string;
  recordKind?: ASSIGN_RECORD_KIND;
  staffId?: string;
  orderDataList: cOrderData[];
  managerInstruction?: string;

  constructor() {
    super();
  }

  dateCreateColumn() {
    return '記録日時';
  }

  tableNameForClass() {
    return 'T_AP_チェックインチェックアウト記録';
  }

  naiyoString() {
    let s = '';
    switch (this.recordKind) {
      case ASSIGN_RECORD_KIND.AS_CHECKIN:
        s = this.createCheckinRecordContent();
        break;
      case ASSIGN_RECORD_KIND.AS_CHECKOUT:
        s = this.createCheckoutRecordContent();
        break;
      case ASSIGN_RECORD_KIND.AS_ORDER:
        s = this.createOrderRecordContent();
        break;
      case ASSIGN_RECORD_KIND.AS_SIGNATURE:
        s = this.createSignContent();
        break;
      case ASSIGN_RECORD_KIND.AS_INSTRUCTION:
        s = this.createInstructionContent();
        break;
      default:
        break;
    }
    return s;
  }
  createCheckinRecordContent() {
    return 'チェックイン';
  }
  createCheckoutRecordContent() {
    return 'チェックアウト';
  }
  createOrderRecordContent() {
    let ret = '';
    if (this.orderDataList.length > 0) {
      this.orderDataList.sort((a, b) => a.displayOrder - b.displayOrder);
      let idx = 0;
      this.orderDataList.forEach(obj => {
        ret = `${ret}【オーダーグループ】${obj.orderGroupName}\n【オーダー】${
          obj.orderName
        }\n【実施状況】${obj.isChecked ? '実施' : '未実施'}`;
        if (obj.memo && obj.memo !== '') {
          ret = `${ret}\n【メモ】${obj.memo}`;
        }
        idx += 1;
        if (idx === this.orderDataList.length) {
          ret = `${ret}\n--------------------------------------\n`;
        }
      });
    }
    return ret;
  }
  createSignContent() {
    return '';
  }

  createInstructionContent() {
    return this.managerInstruction ?? '';
  }

  coloredNaiyoString(keyWords: string[]) {}

  getRecordKindText() {
    return this.getRecordKindTextForKind(this.recordKind);
  }

  getRecordKindTextForKind(recordKind: ASSIGN_RECORD_KIND) {
    let ret = '';
    switch (recordKind) {
      case ASSIGN_RECORD_KIND.AS_CHECKIN:
        ret = 'チェックイン／チェックアウト';
        break;
      case ASSIGN_RECORD_KIND.AS_CHECKOUT:
        ret = 'チェックイン／チェックアウト';
        break;
      case ASSIGN_RECORD_KIND.AS_ORDER:
        ret = 'オーダー記録';
        break;
      case ASSIGN_RECORD_KIND.AS_SIGNATURE:
        ret = '利用者署名';
        break;
      case ASSIGN_RECORD_KIND.AS_INSTRUCTION:
        ret = '責任者指示';
        break;
      default:
        break;
    }
    return ret;
  }

  getRecordKindIconName() {
    return this.getRecordKindIconNameWithKind(this.recordKind);
  }

  getRecordKindIconNameWithKind(recordKind: ASSIGN_RECORD_KIND) {
    let ret = '';
    switch (recordKind) {
      case ASSIGN_RECORD_KIND.AS_CHECKIN:
        ret = 'ast_checkin_tama';
        break;
      case ASSIGN_RECORD_KIND.AS_CHECKOUT:
        ret = 'ast_checkout_tama';
        break;
      case ASSIGN_RECORD_KIND.AS_ORDER:
        ret = 'ast_order_tama';
        break;
      case ASSIGN_RECORD_KIND.AS_SIGNATURE:
        ret = 'ast_signature_tama';
        break;
      case ASSIGN_RECORD_KIND.AS_INSTRUCTION:
        ret = 'ast_instruction_tama';
        break;
      default:
        break;
    }
    return ret;
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

    sqlString = `SELECT * FROM ${this.tableNameForClass()} WHERE レコード削除情報 IS NULL `;
    sqlString = `${sqlString}AND (${this.dateCreateColumn()} < '${strToDate}' AND ${this.dateCreateColumn()} >= '${strFromDate}' ) AND チェック種別 IN (1,2,3,9,10,11)`;

    const dbLogic: DBOperation_Residence = new DBOperation_Residence();

    const arrFkKeys: string[] = fk_key
      ? [fk_key]
      : await dbLogic.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL([]);

    if (arrFkKeys.length > 0) {
      const strWhere = `AND FK_利用者 IN (${arrFkKeys
        .map(a => `'${a}'`)
        .join(',')})`;
      sqlString = `${sqlString}${strWhere}`;
    }

    return sqlString;
  }

  reportType() {
    return this.getRecordKindTextForKind(this.recordKind);
  }

  reportImageFileName() {
    return this.getRecordKindIconNameWithKind(this.recordKind);
  }

  reportDate() {
    // return `${this.strTargetDate.subStr(0, 10).format('YYYY-MM-DD')}T00:00:00`;
  }

  reportTime() {
    // return [cDataClass dateStringToTime:this.strTargetDate];
  }

  displayReportTime() {
    // return [this.strTargetDate substringWithRange:NSMakeRange(11,5)];
  }

  tenantKey() {
    return this.fkKey;
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

  reporterCode() {
    return this.reporterData.staffCode;
  }

  serviceName() {
    const control: cUserControls = new cUserControls();
    return control.getServiceName(this.serviceType);
  }
}
