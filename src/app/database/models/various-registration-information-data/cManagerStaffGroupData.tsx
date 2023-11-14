import {cDataClass} from '../cDataClass';
/**
 * class old name: cKaniMailGroup
 */
export class cManagerStaffGroupData {
  updateKey?: string;
  validFlag?: string;
  groupName?: string;
  groupNameKana?: string;
  staffCode?: string;
  staffName?: string;
  comment?: string;

  constructor() {}

  getGroupData(ad: cDataClass[]) {
    const parser: cDataClass = new cDataClass();
    this.updateKey = parser.getDataValueFromKeyAndTargetArray('更新キー', ad);
    this.validFlag = parser.getDataValueFromKeyAndTargetArray('有効フラグ', ad);
    this.groupName = parser.getDataValueFromKeyAndTargetArray('グループ名', ad);
    this.groupNameKana = parser.getDataValueFromKeyAndTargetArray(
      'グループ名_カナ',
      ad,
    );
    this.staffCode = parser.getDataValueFromKeyAndTargetArray('職員コード', ad);
    this.staffName = parser.getDataValueFromKeyAndTargetArray('職員名', ad);
    this.comment = parser.getDataValueFromKeyAndTargetArray('コメント', ad);
  }
}
