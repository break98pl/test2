import {cDataClass} from '../cDataClass';

export class cHistoryData {
  updateKey?: string;
  itemName?: string; //KoumokuMei
  registerSeqNo?: string; //TourokuSeqNo
  Value?: string;

  constructor() {}

  getHistoryData(ad: cDataClass[]) {
    const parser: cDataClass = new cDataClass();
    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.itemName = parser.getDataValueFromKeyAndTargetArray('項目名', ad);
    this.registerSeqNo = parser.getDataValueFromKeyAndTargetArray(
      '登録Seq番号',
      ad,
    );
    this.Value = parser.getDataValueFromKeyAndTargetArray('値', ad);
  }
}
