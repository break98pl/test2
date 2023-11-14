export class cExcretionIconData {
  setNum?: number;
  setNo?: number;
  setName?: string;
  urineLeak?: string; //Sikkin
  excretionTool?: string; //HaisetuYogu
  urineQuantity?: string; //Hainyoryo
  urineStatus?: string; //HainyoKeitai
  faeceQuantity?: string; //Haibenryo
  faeceStatus?: string; //HaibenKeitai
  memo?: string;

  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  seq?: number;

  constructor() {
    this.setNo = -1;
    this.setNum = -1;
    this.setName = '';
    this.urineLeak = '';
    this.excretionTool = '';
    this.urineQuantity = '';
    this.faeceQuantity = '';
    this.urineStatus = '';
    this.faeceStatus = '';
    this.memo = '';
    this.field1 = '';
    this.field2 = '';
    this.field3 = '';
    this.field4 = '';
    this.field5 = '';
    this.field6 = '';
    this.seq = -1;
  }

  getSqlStringForGettingIconDataFromServer() {
    const sqlString =
      'SELECT レコード削除情報,更新キー,セットNo,セット名,排泄用具,排尿量,排尿形態,排便量,排便形態,コメント,失禁,フィールド1,フィールド2,フィールド3,フィールド4,フィールド5,フィールド6,登録seq番号,更新ユーザー情報,レコード作成情報 FROM M_記録設定_排泄アイコン WHERE レコード削除情報 IS NULL ';

    return sqlString;
  }
}
