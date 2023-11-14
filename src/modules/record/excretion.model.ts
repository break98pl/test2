import {
  deleteDataTable,
  executeSelectQuery,
  getDBConnection,
  saveDataRecord,
} from '@database/helper';
import {MasterItems} from './masterItem';
import {IExcretionTemplate} from '@organisms/ExcretionRecordTemplate';
import {IExcretionRecord} from '@hooks/useHandleExcretionRecord';
import {TableName} from '@database/type';

export namespace ExcretionModel {
  /***** Constants *****/
  const Table_Name = TableName.ExcretionRecord;
  const Time_Value_Column_Name = '記録日時';
  const User_Code_Column_Name = 'FK_利用者';
  const FK_Column_Name = '更新キー';

  /***** Excretion Template *****/

  /**
   * Get excretion temple from db
   * @returns
   */
  export const getExcretionTemplate = async () => {
    let strQuery = `SELECT 
          更新キー,
          セットNo,
          セット名,
          排泄用具,
          排尿量,
          排尿形態,
          排便量,
          排便形態,
          コメント,
          失禁,
          フィールド1,
          フィールド2,
          フィールド3,
          フィールド4,
          フィールド5,
          フィールド6,
          登録seq番号
          FROM M_記録設定_排泄アイコン 
          ORDER BY 登録seq番号`;
    const database = await getDBConnection();
    const records = await executeSelectQuery(
      database,
      strQuery,
      'excretionSelectQuery',
    );
    const arrData: IExcretionTemplate[] = [];
    if (records && records.length > 0) {
      records.forEach(record => {
        const excretionIconData: IExcretionTemplate = {
          id: MasterItems.getValueForKey(record, '更新キー', ''),
          setNo: MasterItems.getValueForKey(record, 'セットNo', 0),
          setName: MasterItems.getValueForKey(record, 'セット名', ''),
          excretionTool: MasterItems.getValueForKey(record, '排泄用具', ''),
          urineQuantity: MasterItems.getValueForKey(record, '排尿量', ''),
          urineStatus: MasterItems.getValueForKey(record, '排尿形態', ''),
          faeceQuantity: MasterItems.getValueForKey(record, '排便量', ''),
          faeceStatus: MasterItems.getValueForKey(record, '排便形態', ''),
          memo: MasterItems.getValueForKey(record, 'コメント', ''),
          urineLeak: MasterItems.getValueForKey(record, '失禁', ''),
          field1: MasterItems.getValueForKey(record, 'フィールド1', ''),
          field2: MasterItems.getValueForKey(record, 'フィールド2', ''),
          field3: MasterItems.getValueForKey(record, 'フィールド3', ''),
          field4: MasterItems.getValueForKey(record, 'フィールド4', ''),
          field5: MasterItems.getValueForKey(record, 'フィールド5', ''),
          field6: MasterItems.getValueForKey(record, 'フィールド6', ''),
          seq: MasterItems.getValueForKey(record, '登録seq番号', 0),
        };
        arrData.push(excretionIconData);
      });
    }
    return arrData;
  };
  const convertFields = (item: IExcretionRecord) => {
    const itemConvert: {[key: string]: any} = {};
    if (item.fkUser) {
      itemConvert['FK_利用者'] = item.fkUser;
    }

    if (item.updateKey) {
      itemConvert['更新キー'] = item.updateKey;
    }

    if (item.targetDate) {
      itemConvert['掲載期限日'] = item.targetDate;
    }

    if (item.urineVolume) {
      itemConvert['排尿量'] = item.urineVolume;
    }

    if (item.urineStatus) {
      itemConvert['排尿形態'] = item.urineStatus;
    }

    if (item.defecationVolume) {
      itemConvert['排便量'] = item.defecationVolume;
    }

    if (item.defecationStatus) {
      itemConvert['排便形態'] = item.defecationStatus;
    }

    if (item.setNo) {
      itemConvert['セットNo'] = item.setNo;
    }

    if (item.incontinence) {
      itemConvert['失禁'] = item.incontinence === 'あり' ? true : false;
    }

    if (item.excretionTools) {
      itemConvert['排泄用具'] = item.excretionTools;
    }

    if (item.recordDate) {
      itemConvert['記録日時'] = item.recordDate;
    }

    if (item.memo) {
      itemConvert['コメント'] = item.memo;
    }

    if (item.settingScreenId) {
      itemConvert['設定画面ID'] = item.settingScreenId;
    }

    if (item.staffCode) {
      itemConvert['職員コード'] = item.staffCode;
    }

    // if (item.staffName) {
    //   itemConvert['職員名'] = item.staffName;
    // }

    if (item.familyName) {
      itemConvert['氏名'] = item.familyName;
    }

    if (item.updateFlag) {
      itemConvert['変更フラグ'] = item.updateFlag;
    }

    if (item.newFlag) {
      itemConvert['新規フラグ'] = item.newFlag;
    }

    if (item.serviceType) {
      itemConvert['サービス種類'] = item.serviceType;
    }

    if (item.syncError) {
      itemConvert['送信エラー'] = item.syncError;
    }

    if (item.periodSelectedItem) {
      itemConvert['期間_選択項目'] = item.periodSelectedItem;
    }
    if (item.apUpdateKey) {
      itemConvert['AP_更新キー'] = item.apUpdateKey;
    }

    if (item.recordDeletionInformation) {
      itemConvert['レコード削除情報'] = item.recordDeletionInformation;
    }

    if (item.recordUpdateInformation) {
      itemConvert['レコード更新情報'] = item.recordUpdateInformation;
    }

    if (item.updateUserInformation) {
      itemConvert['更新ユーザー情報'] = item.updateUserInformation;
    }

    if (item.recordCreationInformation) {
      itemConvert['レコード作成情報'] = item.recordCreationInformation;
    }

    return itemConvert;
  };
  /**
   * Save record to db
   * @param item
   */
  export const save = async (item: IExcretionRecord) => {
    const dataSave = convertFields(item);
    await saveDataRecord(Table_Name, dataSave);
  };
  /**
   * Delete record in db
   * @param item
   */
  export const deleteItem = async (id: string) => {
    await deleteDataTable(Table_Name, id);
  };

  /**
   * Delete record in db
   * @param item
   */
  export const CheckConflictRecordDate = async (
    time: string,
    userCode: string,
    unikey: string,
  ): Promise<boolean> => {
    let str = `SELECT * 
    FROM ${Table_Name} 
    WHERE ${User_Code_Column_Name} = '${userCode}' AND  ${Time_Value_Column_Name} = '${time}' AND ${FK_Column_Name} <> '${unikey}'`;
    const database = await getDBConnection();
    const records = await executeSelectQuery(
      database,
      str,
      'isConflictRecordDate',
    );
    if (records && records.length > 0) {
      return false;
    } else {
      return true;
    }
  };
  /********************************* Execute command *********************************/
}
