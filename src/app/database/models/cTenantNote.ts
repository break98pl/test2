import moment from 'moment';

export class cTenantNote {
  content: string | null; // 内容
  tenantCode: string | null; // FK_利用者
  reporter: string | null; // 報告者
  date: Date | null; // 年月日
  warningLever: string | null; // 区分
  warningCategory: string | null; // 分類
  sequenceNumber: number | null; // Seq番号

  constructor() {
    this.content = null;
    this.tenantCode = null;
    this.reporter = null;
    this.date = null;
    this.warningLever = null;
    this.warningCategory = null;
    this.sequenceNumber = null;
  }

  parseFromRawData(record: Record<string, string | null>) {
    if (record['内容']) {
      this.content = record['内容'];
    }
    if (record['FK_利用者']) {
      this.tenantCode = record['FK_利用者'];
    }
    if (record['報告者']) {
      this.reporter = record['報告者'];
    }
    if (record['年月日']) {
      this.date = moment(record['年月日']).toDate();
    }
    if (record['区分']) {
      this.warningLever = record['区分'];
    }
    if (record['分類']) {
      this.warningCategory = record['分類'];
    }
    if (record['Seq番号']) {
      this.sequenceNumber = +record['Seq番号'];
    }
  }
}
