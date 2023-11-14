import {
  executeSelectQuery,
  getDBConnection,
  saveDataRecord,
} from '@database/helper';
import {MealTimeDB, SettingsSelectItem} from '../record.type';
import {
  COLUMNS_TO_MEAL_TIME,
  COLUMNS_TO_SETTINGS_SELECT_ITEM,
} from '../record.constant';
import {TableName} from '@database/type';

interface MealTable {
  recordDeletionInformation?: string;
  recordUpdateInformation?: string;
  updateKey: string;
  settingScreenId?: string;
  fkUser?: string;
  userName?: string;
  targetDate?: string;
  mealCategory?: string;
  mealMainDish?: string;
  mealSideDish?: string;
  mealSoup?: string;
  mealTea?: string;
  snackSnack?: string;
  snackDrink?: string;
  otherWaterIntakeTime?: string;
  otherWaterIntakeMoisture?: string;
  otherWaterIntakeContents?: string;
  memo?: string;
  staffCode?: string;
  staffName?: string;
  updateUserInformation?: string;
  recordCreationInformation?: string;
  newFlag?: string;
  updateFlag?: string;
  serviceType?: string;
  mealingTime?: string;
  syncError?: string;
  periodSelectItem?: string;
  postingPeriodDate?: string;
  apUpdateKey?: string;
}

const MEAL_TABLE_COLUMN: MealTable = {
  recordDeletionInformation: 'レコード削除情報',
  recordUpdateInformation: 'レコード更新情報',
  updateKey: '更新キー',
  settingScreenId: '設定画面ID',
  fkUser: 'FK_利用者',
  userName: '利用者名',
  targetDate: '対象年月日',
  mealCategory: '食事摂取_区分',
  mealMainDish: '食事_主食',
  mealSideDish: '食事_副食',
  mealSoup: '食事_汁物',
  mealTea: '食事_お茶類',
  snackSnack: 'おやつ_おやつ',
  snackDrink: 'おやつ_飲み物',
  otherWaterIntakeTime: 'その他水分摂取_時刻',
  otherWaterIntakeMoisture: 'その他水分摂取_水分',
  otherWaterIntakeContents: 'その他水分摂取_内容',
  memo: 'メモ',
  staffCode: '職員コード',
  staffName: '職員名',
  updateUserInformation: '更新ユーザー情報',
  recordCreationInformation: 'レコード作成情報',
  newFlag: '新規フラグ',
  updateFlag: '変更フラグ',
  serviceType: 'サービス種類',
  mealingTime: '食事摂取_時刻',
  syncError: '送信エラー',
  periodSelectItem: '期間選択項目',
  postingPeriodDate: '掲載期限日',
  apUpdateKey: 'AP_更新キー',
};

export namespace MealDB {
  /**
   * Create query string to get water type record from SQLite.
   */
  export const getQueryStringForWaterTypeList = () => {
    return `SELECT ${COLUMNS_TO_SETTINGS_SELECT_ITEM.join(
      ',',
    ).toString()} FROM ${
      TableName.RecordOption
    } WHERE レコード削除情報 IS NULL AND M_記録設定_選択項目.項目名 = 'その他水分摂取_内容' ORDER BY 登録Seq番号 DESC`;
  };
  /**
   * Create query string to get time meal record from SQLite.
   */
  export const getQueryStringForTimeMealRecord = () => {
    return `SELECT ${COLUMNS_TO_MEAL_TIME.join(',').toString()} FROM ${
      TableName.InitialInformation
    }`;
  };
  /**
   * Get water type list records from SQLite .
   */
  export const findWaterTypeListRecords = async (): Promise<
    SettingsSelectItem[]
  > => {
    const db = await getDBConnection();
    let query: string = getQueryStringForWaterTypeList();
    const records: SettingsSelectItem[] = await executeSelectQuery(
      db,
      query,
      'findWaterTypeListRecords',
    );
    return records;
  };

  /**
   * Insert or Update into Meal table .
   */
  export const saveDataMeal = async (saveData: MealTable) => {
    const convertData = {};
    Object.keys(saveData).map(column => {
      //@ts-ignore
      convertData[MEAL_TABLE_COLUMN[column]] = saveData[column];
    });
    return await saveDataRecord(TableName.MealInTakeRecord, convertData);
  };

  /**
   * Get time meal record from SQLite .
   */
  export const findTimeMealRecordFromDB = async (): Promise<MealTimeDB> => {
    const db = await getDBConnection();
    let query: string = getQueryStringForTimeMealRecord();
    const records: MealTimeDB[] = await executeSelectQuery(
      db,
      query,
      'findTimeMealRecordFromDB',
    );
    return records?.[0];
  };
}
