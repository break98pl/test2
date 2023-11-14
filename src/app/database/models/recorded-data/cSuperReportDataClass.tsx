import moment from 'moment';

import {DBOperation} from '@modules/operation/operation.service';
import {DBOperation_Residence} from '@modules/resident/resident.service';
import {DBOperation_SmallMulti} from '@database/DBOperation_SmallMulti';
import {AppType} from '@modules/setting/setting.type';
import {cUserData} from '../various-registration-information-data/cUserData';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {SettingService} from '@modules/setting/setting.service';
import {
  executeMultiQuery,
  executeSelectQuery,
  getDBConnection,
} from '@database/helper';
import _ from 'lodash';
import {TenantDB} from '@modules/tenant/tenant.db';

export class cSuperReportDataClass {
  updateDict?: {[key: string]: any};
  makeUpdateDataArray?: {[key: string]: any}[];

  imgFlag?: boolean;
  imgFlagSet?: string;
  fkKey?: string; //FK_Key
  reporterData?: cUserData; //reporterdata
  serviceType?: string;

  ASUpdateKey?: string;
  isASRecord?: boolean;

  cachedFileName?: string;
  updateKey?: string; //UpdateKey

  updateFlag?: string; //henkoFuragu
  newFlag?: string; //shinkiFuragu
  strSendErrMsg?: string;
  recDeleteInfo?: string;
  recUpdateInfo?: string;
  recUpdateUserInfo?: string;
  recCreateInfo?: string;
  recCreateScreenID?: string;

  unsynthesizedTenantName?: string;
  isSynthesized?: boolean;

  // report with memo
  imgPeriodIconName?: any;
  viewingPeriod?: number;
  expireDate?: string;
  formatedExpiredDatesString?: string;

  //from Tsusho
  serviceStartTime?: string;
  serviceEndTime?: string;

  constructor() {
    // this.updateDict = {};
    // this.makeUpdateDataArray = [];
  }

  dateCreateColumn() {
    return '';
  }

  tableNameForClass() {
    return '';
  }

  async getSqlStringForGettingDataFromServerForFK(
    fk_key: string | null,
    from_date: Date | null,
    to_date: Date | null,
    reported: boolean,
    timeForReported: string | null,
  ) {
    let sqlString;
    const nowDate = new Date();
    let toDate = to_date ? to_date : new Date();

    toDate = moment(toDate).add(1, 'day').toDate();

    const fromDate = from_date
      ? from_date
      : SettingService.getDataDaysFromUserDefault();

    const strNowDate =
      timeForReported && timeForReported !== ''
        ? timeForReported
        : moment(nowDate).format('YYYY-MM-DD');
    const strFromDate = moment(fromDate).format('YYYY-MM-DD');
    const strToDate = moment(toDate).format('YYYY-MM-DD');

    sqlString = `SELECT * FROM ${this.tableNameForClass()} WHERE レコード削除情報 IS NULL `;

    if (reported) {
      sqlString = `${sqlString}AND ((${this.dateCreateColumn()} < '${strToDate}' AND ${this.dateCreateColumn()} >= '${strFromDate}' ) OR (掲載期限日 >= '${strNowDate}' AND 期間_選択項目 IS NOT NULL )) `;
    } else {
      sqlString = `${sqlString}AND (${this.dateCreateColumn()} < '${strToDate}' AND ${this.dateCreateColumn()} >= '${strFromDate}' ) AND (掲載期限日 IS NULL OR 掲載期限日<'${strNowDate}') `;
    }

    const dbLogic: DBOperation = new DBOperation();
    const dbLogicR: DBOperation_Residence = new DBOperation_Residence();
    const dbLogicM: DBOperation_SmallMulti = new DBOperation_SmallMulti();

    const {appType} = getReduxStates('authentication') as AuthState;

    const arrFkKeys: string[] = fk_key
      ? [fk_key]
      : appType === AppType.JUTAKU
      ? await dbLogicR.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL([])
      : appType === AppType.TAKINO
      ? await dbLogicM.getFK_KeyDistinctByTenantDataTBL()
      : appType === AppType.TSUSHO
      ? await dbLogic.getDistinctFK_KeysFromPlanAndResultTables()
      : await TenantDB.findAllTenantIDs();

    if (arrFkKeys.length > 0) {
      const strWhere = `AND FK_利用者 IN (${arrFkKeys
        .map(a => `'${a}'`)
        .join(',')})`;
      sqlString = `${sqlString}${strWhere}`;
    }

    return sqlString;
  }

  async getObjectWithKey(key: string, tableName: string) {
    try {
      const db = await getDBConnection();
      // console.log('db: ', db);
      if (db) {
        const query = `SELECT * FROM ${tableName} WHERE 更新キー = '${key}'`;
        // console.log('open db finished');
        const result = await executeSelectQuery(db, query, 'getObjectWithKey');
        if (result && result.length > 0) {
          return result[0];
        }
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }

  async saveDataRecord(tableName: string, record: any) {
    try {
      const db = await getDBConnection();
      if (db) {
        const keys: string[] = [];
        const values: any[] = [];
        const columnsSetStr: any[] = [];
        Object.keys(record).map(key => {
          let value = record[key];
          if (value === undefined || value === null) {
            value = 'NULL';
          }
          if (_.isString(value) && value.indexOf("'") >= 0) {
            value = value.replace(/'/g, "''");
          }
          if (_.isBoolean(value)) {
            value = value ? 1 : 0;
          }
          keys.push(key);
          values.push(
            _.isString(value) && value !== 'NULL' ? `'${value}'` : value,
          );
          if (key !== 'key') {
            columnsSetStr.push(
              `${key}=${
                _.isString(value) && value !== 'NULL' ? `'${value}'` : value
              }`,
            );
          }
        });

        let batch: string[] = [];
        const key = '更新キー';
        if (record[key]) {
          // update
          const conflictObj = await this.getObjectWithKey(
            record[key],
            tableName,
          );
          if (conflictObj) {
            batch = [
              `UPDATE ${tableName} SET ${columnsSetStr.join(
                ',',
              )} WHERE 更新キー = '${record[key]}'`,
            ];
          } else {
            batch = [
              `INSERT OR IGNORE INTO ${tableName} (${keys.join(
                ',',
              )}) VALUES (${values.join(',')})`,
            ];
          }
        } else {
          //create
          batch = [
            `INSERT OR IGNORE INTO ${tableName} (${keys.join(
              ',',
            )}) VALUES (${values.join(',')})`,
          ];
        }
        try {
          const result = await executeMultiQuery(db, batch, 'saveDataRecord');
          return result;
        } catch (error) {
          console.error('Error at saveDataRecord: ', error);
          return error;
        }
      }
    } catch (error) {
      console.error('error: ', error);
    }
  }
  deleteDataTable = async (tableName: string) => {
    const updateKeyColumn = '更新キー';
    const db = await getDBConnection();
    const deleteQuery = `DELETE from ${tableName} where ${updateKeyColumn} = '${this.updateKey}'`;
    return db.executeSql(deleteQuery);
  };
}
