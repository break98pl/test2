export class cOneRecordData {
  sortKey?: string;
  dataArray?: any[];
  dataObject?: any;
  dataString?: string;

  constructor() {
    this.sortKey = '';
    this.dataArray = [];
    this.dataObject = undefined;
    this.dataString = '';
  }

  initWithNameAndDataClass(n: string, dataClass: any) {
    this.sortKey = n;
    this.dataObject = dataClass;
  }

  compareInfo(aInfo1: cOneRecordData, aInfo2: cOneRecordData) {
    if (aInfo1.sortKey === aInfo2.sortKey) {
      return 0;
    }
    return aInfo1.sortKey.localeCompare(aInfo2.sortKey);
  }
}
