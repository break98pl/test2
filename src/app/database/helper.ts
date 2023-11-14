import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {
  InsertDBFailedError,
  OpenDatabaseError,
} from '@modules/errors/error.type';
import {FileService} from '@modules/files/file.service';
import _ from 'lodash';

enablePromise(true);

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  try {
    return openDatabase({name: 'fcp4.sqlite', createFromLocation: 1});
  } catch (e) {
    console.error('Error at getDBConnection: ', e);
    throw new OpenDatabaseError();
  }
};

// export const createTable = async (db: SQLiteDatabase, tableName: string) => {
//   // create table if not exists
//   const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
//         value TEXT NOT NULL
//     );`;
//
//   await db.executeSql(query);
// };
//
// export const deleteTable = async (db: SQLiteDatabase, tableName: string) => {
//   const query = `drop table ${tableName}`;
//
//   await db.executeSql(query);
// };

export const executeSelectQuery = async (
  db: SQLiteDatabase,
  query: string,
  functionName: string,
): Promise<any[]> => {
  try {
    const rows: any[] = [];
    const results = await db.executeSql(query);

    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        rows.push(result.rows.item(index));
      }
    });
    return rows;
  } catch (error) {
    FileService.writeLogSQL(query, functionName);
    console.error(`executeSelectQuery error: ${error}`, query);
    return [];
  }
};

export const executeMultiQuery = async (
  db: SQLiteDatabase,
  queries: string[],
  functionName: string,
) => {
  try {
    return await db.transaction(tx => {
      queries.map(query => tx.executeSql(query));
    });
  } catch (err) {
    FileService.writeLogSQL(`${queries}`, functionName);
    throw new InsertDBFailedError();
  }
};

export const getObjectWithKey = async (
  tableName: string,
  key: string,
  primaryKey = '更新キー',
) => {
  try {
    const db = await getDBConnection();
    if (db) {
      const query = `SELECT * FROM ${tableName} WHERE ${primaryKey} = '${key}'`;
      const result = await executeSelectQuery(db, query, 'getObjectWithKey');
      if (result && result.length > 0) {
        return result[0];
      }
    }
  } catch (error) {
    console.error('error: ', error);
  }
};

export const saveDataRecord = async (tableName: string, record: any) => {
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

        const conflictObj = await getObjectWithKey(tableName, record[key]);

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
};

export const deleteDataTable = async (
  tableName: string,
  key: string,
  updateKeyColumn = '更新キー',
) => {
  const db = await getDBConnection();
  const deleteQuery = `DELETE from ${tableName} where ${updateKeyColumn} = '${key}'`;
  return db.executeSql(deleteQuery);
};
