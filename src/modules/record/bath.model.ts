import {
  deleteDataTable,
  executeSelectQuery,
  getDBConnection,
  saveDataRecord,
} from '@database/helper';
import {TableName} from '@database/type';
import {IBathRecord} from '@hooks/useHandleBathRecord';
import {TextListItem} from '@organisms/SelectionList';
export namespace BathModel {
  /********************************* Get command     *********************************/
  /***** Constants *****/
  const DisplayMember: string = 'DM';
  const ValueMember: string = 'VM';
  const MasterBathStyleTableName: string = 'M_記録設定_選択項目';
  const MasterBathStyleColumnName_Display: string = '値';
  const MasterBathStyleColumnName_Value: string = 'PK_選択項目';
  const Table_Name = TableName.BathRecord;
  const Time_Value_Column_Name = '入浴時刻';
  const User_Code_Column_Name = 'FK_利用者';
  const FK_Column_Name = '更新キー';

  /***** Master *****/
  /* Master */
  /**
   * Get master bath style in db
   * @returns
   */
  export const GetMasterBathStyle = async (): Promise<TextListItem[]> => {
    const db = await getDBConnection();
    let strQuery: string = `SELECT 
    ${MasterBathStyleColumnName_Display} AS ${DisplayMember},
    ${MasterBathStyleColumnName_Value} AS ${ValueMember} 
    FROM ${MasterBathStyleTableName}  
    WHERE [レコード削除情報] IS NULL AND [項目名] = '入浴記録_入浴方法' 
    ORDER BY 登録seq番号 DESC`;
    const records = await executeSelectQuery(
      db,
      strQuery,
      'GetMasterBathStyle',
    );
    const outputData: TextListItem[] = [];
    if (records && records.length > 0) {
      records.forEach((item, index): void => {
        const newTool: TextListItem = {
          id: item[ValueMember] ? item[ValueMember] : index,
          label: item[DisplayMember] ? item[DisplayMember] : '',
        };
        outputData.push(newTool);
      });
    }
    return outputData;
  };
  const convertBathFields = (item: IBathRecord) => {
    const itemConvert: {[key: string]: any} = {};
    if (item.fkUser) {
      itemConvert['FK_利用者'] = item.fkUser;
    }

    if (item.updateKey) {
      itemConvert['更新キー'] = item.updateKey;
    }

    if (item.targetDate) {
      itemConvert['対象年月日'] = item.targetDate;
    }

    if (item.timeZone) {
      itemConvert['時間帯'] = item.timeZone;
    }

    if (item.bathTime) {
      itemConvert['入浴時刻'] = item.bathTime;
    }

    if (item.bathMethod) {
      itemConvert['入浴方法'] = item.bathMethod;
    }

    if (item.takingBath) {
      itemConvert['入浴実施'] = item.takingBath;
    }

    if (item.memo) {
      itemConvert['メモ'] = item.memo;
    }

    if (item.settingScreenId) {
      itemConvert['設定画面ID'] = item.settingScreenId;
    }

    if (item.staffCode) {
      itemConvert['職員コード'] = item.staffCode;
    }

    if (item.staffName) {
      itemConvert['職員名'] = item.staffName;
    }

    if (item.familyName) {
      itemConvert['職員名'] = item.familyName;
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

    if (item.postingPeriodDate) {
      itemConvert['掲載期限日'] = item.postingPeriodDate;
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

    if (item.contactEmailGroupName) {
      itemConvert['連絡メール_グループ名'] = item.contactEmailGroupName;
    }

    return itemConvert;
  };
  /**
   * Save record to db
   * @param item
   */
  export const save = async (item: IBathRecord) => {
    const dataSave = convertBathFields(item);
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
    console.log(str);
    if (records && records.length > 0) {
      return false;
    } else {
      return true;
    }
  };
  /********************************* Execute command *********************************/
}
