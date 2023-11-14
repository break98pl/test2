import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';

/**
 * class old name: cTyuuiJikou
 */
export class cUserWarningData {
  strUpdateKey?: string;
  strFullName?: string; //StrSeimei
  StrFK_Key?: string;
  strDate?: string; //StrNengappi
  strSeqNumber?: string; //StrSeqBangou
  strClassification?: string; //StrBunnrui
  strReporter?: string; //StrHoukokusya
  strCategory?: string; //StrKubun
  strContent?: string; //StrNaiyou

  constructor() {}

  getData(ad: cDataClass[]) {
    const control: cUserControls = new cUserControls();
    const parser: cDataClass = new cDataClass();

    this.strUpdateKey = parser.getDataValueFromKeyAndTargetArray(
      '更新キー',
      ad,
    );
    this.strFullName = parser.getDataValueFromKeyAndTargetArray('姓名', ad);
    this.StrFK_Key = parser.getDataValueFromKeyAndTargetArray('FK_利用者', ad);
    this.strDate = parser.getDataValueFromKeyAndTargetArray('年月日', ad);
    this.strSeqNumber = parser.getDataValueFromKeyAndTargetArray('Seq番号', ad);
    this.strClassification = parser.getDataValueFromKeyAndTargetArray(
      '分類',
      ad,
    );
    this.strReporter = parser.getDataValueFromKeyAndTargetArray('報告者', ad);
    this.strCategory = parser.getDataValueFromKeyAndTargetArray('区分', ad);
    this.strContent = control.GetVBLineCode(
      parser.getDataValueFromKeyAndTargetArray('内容', ad),
    );
  }

  compareBySeqBanngou(argAnother: cUserWarningData) {
    const w_iSeqSelf = parseInt(this.strSeqNumber, 10);
    const w_iSeqAnother = parseInt(argAnother.strSeqNumber, 10);

    let result;
    if (w_iSeqSelf < w_iSeqAnother) {
      result = 1;
    } else if (w_iSeqSelf > w_iSeqAnother) {
      result = -1;
    } else {
      result = 0;
    }

    return result;
  }
}
