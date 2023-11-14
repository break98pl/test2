import moment from 'moment';

import axiosClient from '@modules/api/api.service';
import {cDataClass} from '@database/models/cDataClass';
import {cExcretionIconData} from '@database/models/cExcretionIconData';
import {cVitalControlData} from '@database/models/various-registration-information-data/cVitalControlData';
import {cExerciseDetailSchedule} from '@database/models/various-registration-information-data/reha/cExerciseDetailSchedule';
import {AppType, SettingState} from '@modules/setting/setting.type';
import {
  executeMultiQuery,
  executeSelectQuery,
  getDBConnection,
} from '@database/helper';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {FileService} from '@modules/files/file.service';
import {TableName} from '@database/type';
import {cMonthPlanData} from '@database/models/residential-user-data/cMonthPlan';
import {cResultsData} from '@database/models/residential-user-data/cResultsData';
import {cDataWeekPlan} from '@database/models/residential-user-data/cDataWeekPlan';
import {ScheduleTime} from '@database/models/residential-user-data/ScheduleTime';
import {cExerciseBaseSchedule} from '@database/models/various-registration-information-data/reha/cExerciseBaseSchedule';
import {cExerciseBaseReport} from '@database/models/recorded-data/functional-training/cExerciseBaseReport';
import {cUserData} from '@database/models/various-registration-information-data/cUserData';
import {cExerciseDetailReport} from '@database/models/recorded-data/functional-training/cExerciseDetailReport';
import {CustomSatelite} from '@database/models/customSateLite';

// fixme: move to feature constant
export const TBLNAME_CAREREPORT = 'T_サービス計画_介護支援経過';
export const TBLNAME_VITALREPORT = 'T_日常業務_バイタル';
export const TBLNAME_BATHINGREPORT = 'T_日常業務_入浴記録';
export const TBLNAME_EXCRETIONREPORT = 'T_日常業務_排泄記録';
export const TBLNAME_MEALREPORT = 'T_日常業務_食事摂取記録';

export class DBOperation {
  constructor() {}

  // fixme: Move to helper
  async hasUpdatedRecForFkkey(fk_key: string, tblname: string) {
    const database = await getDBConnection();

    const strQuery = `SELECT COUNT(*) as count FROM ${tblname} WHERE (新規フラグ = 1 or 変更フラグ = 1) AND FK_利用者 = '${fk_key}' `;

    const records = await executeSelectQuery(
      database,
      strQuery,
      'isResidedAsElderlyFkKey',
    );
    const counts = records.map(it => it.count);
    let isUpdate;
    counts.forEach(count => {
      if (count !== null && count !== undefined) {
        isUpdate = count;
      }
    });

    return isUpdate !== null && isUpdate !== undefined;
  }

  // fixme: move to user service
  async getUserID() {
    const database = await getDBConnection();
    let strQuery = 'select PK_利用者 as uId from M_利用者_個人';
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType === AppType.SHISETSHU) {
      strQuery =
        'select distinct T_施設利用管理_部屋予約.FK_利用者 as uId from T_施設利用管理_部屋予約 ';
    }

    const records = await executeSelectQuery(database, strQuery, 'getUserID');
    const userIdArray = records.map(it => it.uId);
    return userIdArray.length > 0 ? userIdArray : [];
  }

  // fixme: move to login or staff service.
  getLoginStaffPermissionConditionService(service: string) {
    const sv_num = parseInt(service, 10);
    let strQuery = ' ';
    switch (sv_num) {
      case 5:
        strQuery = `${strQuery}AND (m.権限_高齢者専用住宅版 = '1' OR m.権限_Admin ='1')`;
        break;

      case 11:
        strQuery = `${strQuery}AND (m.権限_訪問介護 = '1' OR m.権限_Admin ='1')`;
        break;
      case 12:
        strQuery = `${strQuery}AND (m.権限_訪問入浴 = '1' OR m.権限_Admin ='1')`;
        break;
      case 13:
        strQuery = `${strQuery}AND (m.権限_訪問看護 = '1' OR m.権限_Admin ='1')`;
        break;
      case 14:
        strQuery = `${strQuery}AND (m.権限_訪問リハ = '1' OR m.権限_Admin ='1')`;
        break;
      case 17:
        strQuery = `${strQuery}AND (m.権限_福祉用具 = '1' OR m.権限_Admin ='1')`;
        break;
      case 31:
        strQuery = `${strQuery}AND (m.権限_療養指導 = '1' OR m.権限_Admin ='1')`;
        break;
      case 71:
        strQuery = `${strQuery}AND (m.権限_夜間訪問 = '1' OR m.権限_Admin ='1')`;
        break;
      case 76:
        strQuery = `${strQuery}AND (m.権限_定期巡回随時訪問介護看護 = '1' OR m.権限_Admin ='1')`;
        break;

      case 15:
        strQuery = `${strQuery}AND (m.権限_通所介護 = '1' OR m.権限_Admin ='1')`;
        break;
      case 16:
        strQuery = `${strQuery}AND (m.権限_通所リハ = '1' OR m.権限_Admin ='1')`;
        break;
      case 72:
        strQuery = `${strQuery}AND (m.権限_認知通所 = '1' OR m.権限_Admin ='1')`;
        break;
      case 78:
        strQuery = `${strQuery}AND (m.権限_地域通所 = '1' OR m.権限_Admin ='1')`;
        break;
      default:
        strQuery = `${strQuery}AND (m.権限_居宅介護支援版 = '1' OR m.権限_訪問介護 = '1' OR m.権限_訪問入浴 = '1' OR m.権限_訪問看護 = '1' OR m.権限_訪問リハ = '1' OR m.権限_通所介護 = '1' OR m.権限_通所リハ = '1' OR m.権限_福祉用具 = '1' OR m.権限_夜間訪問 = '1' OR m.権限_認知通所 = '1' OR m.権限_小規模多 = '1' OR m.権限_療養指導 = '1' OR m.権限_認知GH = '1' OR m.権限_特定施設 = '1' OR m.権限_短期生活 = '1' OR m.権限_短期老健 = '1' OR m.権限_保健施設 = '1' OR m.権限_福祉施設 ='1' OR m.権限_Admin ='1')`;
        break;
    }
    return strQuery;
  }

  getLoginStaffPermissionConditionForMulti(licenseChar: string) {
    let condtionStr;
    if (licenseChar === 'X') {
      condtionStr = "AND (m.権限_複合型サービス = '1' OR m.権限_Admin ='1')";
    } else {
      //小規模
      condtionStr = "AND (m.権限_小規模多 = '1' OR m.権限_Admin ='1')";
    }
    return condtionStr;
  }

  async columnsOfTable(database: any, tableName: string) {
    const query = `PRAGMA table_info('${tableName}');`;

    const records = await executeSelectQuery(database, query, 'columnsOfTable');
    const columns: string[] = records.map(it => it.name);
    return columns;
  }

  async deleteDataTable(tableName: string) {
    const database = await getDBConnection();

    const dQuery = `delete from ${tableName};`;
    await executeSelectQuery(database, dQuery, 'deleteDataTable');
  }

  async deleteDataTableWithCondition(tableName: string, condition: string) {
    const database = await getDBConnection();

    const dQuery = `delete from ${tableName} where ${condition};`;
    await executeSelectQuery(database, dQuery, 'deleteDataTableWithCondition');
  }

  async insertTable(tableName: string, items: any[]) {
    const database = await getDBConnection();

    const columns = await this.columnsOfTable(database, tableName);

    const queries: string[] = [];
    items.forEach(item => {
      let sql = `insert into ${tableName}(`;
      const keys = Object.keys(item);
      const validKeys: string[] = [];
      keys.forEach(k => {
        if (
          columns.indexOf(k) >= 0 &&
          item[k] !== undefined &&
          item[k] !== null
        ) {
          validKeys.push(k);
        }
      });
      if (tableName === 'T_入居管理_入居期間管理_部屋予約情報') {
        validKeys.push('ベッド番号');
      }
      if (tableName === TableName.MonthlyResult) {
        validKeys.push('FK_サテライト');
      }
      sql = `${sql}${validKeys.join(', ')})`;
      sql = `${sql} values(`;
      const values: string[] = [];
      for (const key of validKeys) {
        if (
          tableName === 'T_入居管理_入居期間管理_部屋予約情報' &&
          key === 'FK_部屋コード' &&
          item[key]
        ) {
          const sValue: string = item[key];
          values.push(`'${sValue.substr(0, 8)}'`);
        } else if (
          tableName === 'T_入居管理_入居期間管理_部屋予約情報' &&
          key === 'ベッド番号' &&
          item['FK_部屋コード']
        ) {
          const sValue: string = item['FK_部屋コード'];
          values.push(`'${sValue.substr(9, sValue.length - 9)}'`);
        } else {
          let val = item[key];
          if (key === '更新ユーザー情報' && typeof val === 'string') {
            val = val.replace(/\\/g, '¥');
          }
          if (
            [
              '内容',
              '支援経過内容',
              '病名',
              '備考',
              '注意事項',
              '文例',
            ].includes(key) &&
            typeof val === 'string'
          ) {
            val = val.replace(/\v/g, '\n').trimEnd();
          } else {
            if (val === undefined) {
              values.push("''");
            } else {
              values.push(typeof val === 'string' ? `'${val}'` : `${val}`);
            }
          }
        }
      }
      sql = `${sql}${values.join(', ')});`;
      queries.push(sql);
    });
    if (queries.length > 0) {
      const records = await executeMultiQuery(database, queries, 'insertTable');
    }
  }

  async insertDbWithJsonDict(tableName: string, items: any[]) {
    const database = await getDBConnection();
    if (!database) {
      return;
    }

    const columns = await this.columnsOfTable(database, tableName);

    if (tableName !== 'T_バイナリ') {
      const dQuery = `delete from ${tableName};`;
      await executeSelectQuery(database, dQuery, 'insertDbWithJsonDict');

      const queries: string[] = [];
      items.forEach(item => {
        let sql = `insert into ${tableName}(`;
        const keys = Object.keys(item);
        const validKeys: string[] = [];
        keys.forEach(k => {
          if (
            columns.indexOf(k) >= 0 &&
            item[k] !== undefined &&
            item[k] !== null
          ) {
            validKeys.push(k);
          }
        });
        if (tableName === 'T_入居管理_入居期間管理_部屋予約情報') {
          validKeys.push('ベッド番号');
        }
        sql = `${sql}${validKeys.join(', ')})`;
        sql = `${sql} values(`;
        const values: string[] = [];
        for (const key of validKeys) {
          if (
            tableName === 'T_入居管理_入居期間管理_部屋予約情報' &&
            key === 'FK_部屋コード' &&
            item[key]
          ) {
            const sValue: string = item[key];
            values.push(`'${sValue.substr(0, 8)}'`);
          } else if (
            tableName === 'T_入居管理_入居期間管理_部屋予約情報' &&
            key === 'ベッド番号' &&
            item['FK_部屋コード']
          ) {
            const sValue: string = item['FK_部屋コード'];
            values.push(`'${sValue.substring(9, sValue.length)}'`);
          } else {
            let val = item[key];
            if (key === '更新ユーザー情報' && typeof val === 'string') {
              val = val.replace(/\\/g, '¥');
            }
            if (
              [
                '内容',
                '支援経過内容',
                '病名',
                '備考',
                '注意事項',
                '文例',
                'コメント',
              ].includes(key) &&
              typeof val === 'string'
            ) {
              val = val.replace(/\v/g, '\n').trimEnd();
            }
            if (['値', '場所'].includes(key)) {
              val = val.replace(/&c_/g, ',');
            }
            values.push(typeof val === 'string' ? `'${val}'` : `${val}`);
          }
        }
        sql = `${sql}${values.join(', ')});`;
        queries.push(sql);
      });
      if (queries.length > 0) {
        const records = await executeMultiQuery(
          database,
          queries,
          'insertDbWithJsonDict',
        );
      }
    } else {
      const checkPhotos = await this.loadAllPhoto();
      let insertItems: any[] = [];
      const updateItems: any[] = [];
      if (checkPhotos.length === 0) {
        insertItems = items;
      } else {
        items.forEach(item => {
          const photoKey: string = item['キー'];
          const idx = checkPhotos.map(c => c['キー']).indexOf(photoKey);
          if (idx < 0) {
            insertItems.push(item);
          } else {
            if (
              item['レコード作成情報'] !==
                checkPhotos[idx]['レコード作成情報'] ||
              (!checkPhotos[idx]['データ'] && item['データ'])
            ) {
              updateItems.push(item);
            }
          }
        });
      }
      if (insertItems.length > 0) {
        await this.insertBinaryToDbWithJsonDict('T_バイナリ', insertItems);
      }
      if (updateItems.length > 0) {
        await this.updateBinaryToDbWithJsonDict('T_バイナリ', updateItems);
      }
    }
  }

  /**
   * Save photo to documents directory.
   */
  savePhotosToDocuments = async () => {};

  async insertBinaryToDbWithJsonDict(tableName: string, items: any[]) {
    const database = await getDBConnection();

    const columns = await this.columnsOfTable(database, tableName);
    const dataKeyIndex = columns.findIndex(c => c === 'データ');
    columns.splice(dataKeyIndex, 1);

    const queries: string[] = [];
    items.forEach(item => {
      let sql = `insert into ${tableName}(`;
      const keys = Object.keys(item);
      const validKeys: string[] = [];
      keys.forEach(k => {
        if (
          columns.indexOf(k) >= 0 &&
          item[k] !== undefined &&
          item[k] !== null
        ) {
          validKeys.push(k);
        }
      });
      sql = `${sql}${validKeys.join(', ')})`;
      sql = `${sql} values(`;
      const values: string[] = [];
      for (let index = 0; index < validKeys.length; index++) {
        const val = item[validKeys[index]];
        values.push(typeof val === 'string' ? `'${val}'` : `${val}`);
      }
      sql = `${sql}${values.join(', ')});`;
      queries.push(sql);
    });
    if (queries.length > 0) {
      const records = await executeMultiQuery(
        database,
        queries,
        'insertBinaryToDbWithJsonDict',
      );
    }

    const photoList = items
      .filter(e => e['データ'])
      .map(e => ({
        key: e['キー'],
        data: e['データ'],
      }));
    await Promise.all(
      photoList.map(photo => FileService.createImage(photo.key, photo.data)),
    );
  }

  async updateBinaryToDbWithJsonDict(tableName: string, items: any[]) {
    const database = await getDBConnection();

    const columns = await this.columnsOfTable(database, tableName);
    const dataKeyIndex = columns.findIndex(c => c === 'データ');
    columns.splice(dataKeyIndex, 1);

    const queries: string[] = [];
    items.forEach(item => {
      let sql = `update ${tableName} set `;
      const keys = Object.keys(item);
      const validKeys: string[] = [];
      keys.forEach(k => {
        if (
          columns.indexOf(k) >= 0 &&
          item[k] !== undefined &&
          item[k] !== null
        ) {
          validKeys.push(k);
        }
      });

      const values: string[] = [];
      for (let index = 0; index < validKeys.length; index++) {
        const val = item[validKeys[index]];
        if (typeof val === 'string') {
          values.push(`${validKeys[index]} = '${val}'`);
        } else {
          values.push(`${validKeys[index]} = ${val}`);
        }
      }
      sql = `${sql}${values.join(', ')} where キー = '${item['キー']}';`;
      queries.push(sql);
    });
    if (queries.length > 0) {
      const records = await executeMultiQuery(
        database,
        queries,
        'updateBinaryToDbWithJsonDict',
      );
    }
    const photoList = items
      .filter(e => e['データ'])
      .map(e => ({
        key: e['キー'],
        data: e['データ'],
      }));
    await Promise.all(
      photoList.map(photo => FileService.createImage(photo.key, photo.data)),
    );
  }

  async hasTableOnServer(tableName: string) {
    let blnRet = false;

    const strSql = `SELECT id FROM sysobjects where sysobjects.name = '${tableName}'`;
    const response = await axiosClient.doQueryOnSqlServer(strSql);

    if (
      response.key === 200 &&
      response.data &&
      response.data.ROOT &&
      response.data.ROOT.sysschobjs$
    ) {
      blnRet = true;
    }

    return blnRet;
  }

  async getArrayPhotoKey() {
    const database = await getDBConnection();

    const strQuery =
      'SELECT 写真バイナリキー FROM T_経過記録 AS REC  LEFT JOIN T_バイナリ AS BIN on REC.写真バイナリキー = BIN.キー WHERE 写真バイナリキー IS NOT NULL AND (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < REC.レコード更新情報)';
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getArrayPhotoKey',
    );
    const photos: string[] = records.map(it => it['写真バイナリキー']);
    return photos;
  }

  async getArrayUsersPhotoKey() {
    const database = await getDBConnection();

    // const query =
    //   'SELECT T_バイナリ.キー FROM T_バイナリ, M_利用者_個人 WHERE  (T_バイナリ.レコード更新情報 <> T_バイナリ.最新日時 or T_バイナリ.最新日時 is null) and T_バイナリ.キー = M_利用者_個人.写真データKey';

    const strQuery =
      'SELECT 写真データKey FROM M_利用者_個人 AS REC LEFT JOIN T_バイナリ AS BIN on REC.写真データKey = BIN.キー WHERE 写真データKey IS NOT NULL AND (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < REC.レコード更新情報)';
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getArrayUsersPhotoKey',
    );
    const photos: string[] = records.map(it => it['写真データKey']);

    return photos;
  }

  async getArrayReportPhotoKey(appType: AppType) {
    const database = await getDBConnection();
    let strQuery: string;
    let keyPhoto = '写真バイナリキー';
    if (appType === AppType.SHISETSHU) {
      strQuery =
        'SELECT 写真バイナリキー FROM T_経過記録 AS REC LEFT JOIN T_バイナリ AS BIN on REC.写真バイナリキー = BIN.キー WHERE 写真バイナリキー IS NOT NULL AND (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < REC.レコード更新情報)';
    }
    if (appType === AppType.TSUSHO) {
      //Need to replace
      strQuery =
        'SELECT 写真バイナリキー FROM T_サービス計画_介護支援経過 AS REC LEFT JOIN T_バイナリ AS BIN on REC.写真バイナリキー = BIN.キー WHERE 写真バイナリキー IS NOT NULL AND (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < REC.レコード更新情報)';
    } else {
      strQuery =
        'SELECT 写真バイナリキー FROM T_サービス計画_介護支援経過 AS REC LEFT JOIN T_バイナリ AS BIN on REC.写真バイナリキー = BIN.キー WHERE 写真バイナリキー IS NOT NULL AND (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < REC.レコード更新情報)';
    }
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getArrayReportPhotoKey',
    );

    const photos: string[] = records.map(it => it[keyPhoto]);

    return photos;
  }

  async getArrayASPhotoKey() {
    const database = await getDBConnection();

    const strQuery =
      'SELECT FK_署名画像キー FROM T_AP_チェックインチェックアウト記録 AS REC LEFT JOIN T_バイナリ AS BIN on REC.FK_署名画像キー = BIN.キー WHERE FK_署名画像キー IS NOT NULL AND (BIN.キー IS NULL OR BIN.データ IS NULL OR BIN.lastSyncImage < REC.レコード更新情報)';
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getArrayASPhotoKey',
    );
    const photos: string[] = records.map(it => it['FK_署名画像キー']);
    return photos;
  }

  async loadAllPhoto() {
    const database = await getDBConnection();
    const strQuery = 'select * from T_バイナリ';

    return await executeSelectQuery(database, strQuery, 'loadAllPhoto');
  }

  GetQueryDateRangeForPlans() {
    // moment.locale('ja');
    // moment.tz.setDefault('Asia/Tokyo');

    const {fetchTime: Days} = getReduxStates('setting') as SettingState;
    const date = new Date();
    let startDate = new Date();
    let endDate = new Date();
    if (Days === '3d') {
      startDate = moment(date)
        .add(-3 * 24 * 60 * 60, 'seconds')
        .toDate();
      endDate = moment(date)
        .add(3 * 24 * 60 * 60, 'seconds')
        .toDate();
    } else if (Days === '1w') {
      startDate = moment(date)
        .add(-7 * 24 * 60 * 60, 'seconds')
        .toDate();
      endDate = moment(date)
        .add(7 * 24 * 60 * 60, 'seconds')
        .toDate();
    } else if (Days === '2w') {
      startDate = moment(date)
        .add(-14 * 24 * 60 * 60, 'seconds')
        .toDate();
      endDate = moment(date)
        .add(14 * 24 * 60 * 60, 'seconds')
        .toDate();
    } /*else if (Days === '20d') {
      startDate = moment(date)
        .add(-20 * 24 * 60 * 60, 'seconds')
        .toDate();
      endDate = moment(date)
        .add(20 * 24 * 60 * 60, 'seconds')
        .toDate();
    }*/ else if (Days === '1m') {
      startDate = moment(date)
        .add(-30 * 24 * 60 * 60, 'seconds')
        .toDate();
      endDate = moment(date)
        .add(30 * 24 * 60 * 60, 'seconds')
        .toDate();
    } /*else if (Days === '3m') {
      startDate = moment(date)
        .add(-90 * 24 * 60 * 60, 'seconds')
        .toDate();
      endDate = moment(date)
        .add(90 * 24 * 60 * 60, 'seconds')
        .toDate();
    }*/
    return [startDate, endDate] as const;
  }

  getNyukyoDataQueryString(arraySelectedRoom: string[]) {
    let roomCodesStr = '';
    if (arraySelectedRoom.length > 0) {
      roomCodesStr = `AND LEFT(FK_部屋コード, 8) IN (${arraySelectedRoom
        .map(a => `'${a}'`)
        .join(',')})`;
    }

    const [startDate, endDate] = this.GetQueryDateRangeForPlans();
    const fromDate = `${moment(startDate).format('YYYY/MM/DD')} 00:00:00`;
    const toDate = `${moment(endDate).format('YYYY/MM/DD')} 23:59:59`;

    return `SELECT レコード更新情報, 更新キー, 更新ユーザー情報, レコード作成情報, FK_部屋コード, 名称,予約確定フラグ, 開始日, 終了日, FK_利用者, 利用者名,性別, 保険者番号, 被保険者番号, 担当者コード, 担当者名,申込みケアマネ氏名, 申込み支援事業所名, 予約有効期限, 送迎区分, ベッドの種類, 利用形態, 初期加算を算定フラグ, 多床室摘要理由 FROM T_入居管理_入居期間管理_部屋予約情報 WHERE (レコード削除情報 IS NULL OR レコード削除情報 = '') AND 開始日 <= '${toDate}' AND 終了日 >= '${fromDate}' ${roomCodesStr}`;
  }

  async getDistinctFK_KeysFromPlanAndResultTables() {
    const strQuery =
      'SELECT DISTINCT FK_利用者 as fkKey FROM T_予定管理_居宅月間 UNION SELECT DISTINCT FK_利用者 FROM T_予定管理_居宅週間 UNION SELECT DISTINCT FK_利用者 FROM T_実績管理_居宅_月間';

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getDistinctFK_KeysFromPlanAndResultTables',
    );
    return records.map(it => it.fkKey);
  }

  async removeDuplicatedExerciseBaseReport() {
    const strQuery =
      'SELECT FK_利用者,対象年月日 FROM(SELECT COUNT(対象年月日) AS CNT,FK_利用者,対象年月日,サービス開始日時 FROM T_日常業務_機能訓練記録01_基本 Group by FK_利用者,対象年月日,サービス開始日時) WHERE CNT > 1';

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strQuery,
      'removeDuplicatedExerciseBaseReport',
    );

    await Promise.all(
      records.map(async record => {
        await executeSelectQuery(
          database,
          `DELETE FROM T_日常業務_機能訓練記録01_基本 WHERE FK_利用者='${record['FK_利用者']}' AND 対象年月日 = '${record['対象年月日']}' AND 新規フラグ='0' AND 変更フラグ='0'`,
          'removeDuplicatedExerciseBaseReport',
        );
      }),
    );
  }

  async removeDuplicatedExerciseDetailReport() {
    const strSql =
      "DELETE FROM T_日常業務_機能訓練記録02_詳細 WHERE 更新キー=((SELECT 更新キー FROM (SELECT COUNT(更新キー) AS CNT ,更新キー FROM T_日常業務_機能訓練記録02_詳細 Group by 更新キー ) WHERE CNT >1)) AND 新規フラグ='0' AND 変更フラグ='0' ";
    const database = await getDBConnection();
    await executeSelectQuery(
      database,
      strSql,
      'removeDuplicatedExerciseDetailReport',
    );
  }

  async removeDuplicatedNewExerciseDetailReport() {
    const strSql =
      "DELETE FROM T_日常業務_機能訓練記録02_詳細 WHERE PK_機能訓練記録_詳細 IN ((SELECT PK_機能訓練記録_詳細 FROM (SELECT COUNT(FK_機能訓練記録_基本) AS CNT, FK_機能訓練記録_基本, PK_機能訓練記録_詳細  FROM T_日常業務_機能訓練記録02_詳細 Group by FK_機能訓練記録_基本,PK_機能訓練記録_詳細,表示SEQ番号 ) WHERE CNT >1) ) AND 新規フラグ='0' AND 変更フラグ='0' ";
    const database = await getDBConnection();
    await executeSelectQuery(
      database,
      strSql,
      'removeDuplicatedNewExerciseDetailReport',
    );
  }

  async removeScheduleDeletedReport() {
    const strSql =
      'DELETE FROM T_日常業務_機能訓練記録02_詳細 WHERE NOT EXISTS (SELECT * FROM T_サービス計画_提供_機能訓練計画書02_詳細 WHERE T_日常業務_機能訓練記録02_詳細.FK_機能訓練計画書_詳細 = PK_機能訓練計画書_詳細)';
    const database = await getDBConnection();
    await executeSelectQuery(database, strSql, 'removeScheduleDeletedReport');
  }

  /*
 機能訓練記録の親と繋がっていないT_日常業務_機能訓練記録02_詳細データを削除

 親に同じキーを持つものがいない
 かつ
 FK_機能訓練記録_基本 がマイナス
 */
  async removeNonParentData() {
    const strSql =
      'DELETE FROM T_日常業務_機能訓練記録02_詳細 WHERE NOT EXISTS ( SELECT * FROM T_日常業務_機能訓練記録01_基本 WHERE T_日常業務_機能訓練記録01_基本.PK_機能訓練記録_基本 = T_日常業務_機能訓練記録02_詳細.FK_機能訓練記録_基本 ) ';
    const database = await getDBConnection();
    await executeSelectQuery(database, strSql, 'removeNonParentData');
  }

  async getUniqueFkPlanBasesFromReportBase() {
    return await this.getUniqueFkPlanBasesFromReportBaseWithUserFK([]);
  }

  async getUniqueFkPlanBasesFromReportBaseWithUserFK(arrFkKeys: string[]) {
    let strQuery =
      'SELECT DISTINCT FK_機能訓練計画書_基本 as fkKey FROM T_日常業務_機能訓練記録01_基本';
    const database = await getDBConnection();

    if (arrFkKeys && arrFkKeys.length > 0) {
      const strWhere = `WHERE FK_利用者 IN (${arrFkKeys.join(',')})`;
      strQuery = `${strQuery} ${strWhere}`;
    }

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getUniqueFkPlanBasesFromReportBaseWithUserFK',
    );

    const fkKeys: string[] = records.map(it => it.fkKey);

    return fkKeys;
  }

  async getUniqueFkPlanBases() {
    return await this.getUniqueFkPlanBasesWithUserFK([]);
  }

  async getUniqueFkPlanBasesWithUserFK(arrFkKeys: string[]) {
    let strQuery =
      'SELECT DISTINCT PK_機能訓練計画書_基本 as fkKey FROM T_サービス計画_提供_機能訓練計画書01_基本';
    const database = await getDBConnection();

    if (arrFkKeys && arrFkKeys.length > 0) {
      const strWhere = `WHERE FK_利用者 IN (${arrFkKeys.join(',')})`;
      strQuery = `${strQuery} ${strWhere}`;
    }

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getUniqueFkPlanBasesWithUserFK',
    );

    const fkKeys: string[] = records.map(it => it.fkKey);

    return fkKeys;
  }

  async getUniqueFkReportBases() {
    const strQuery =
      'SELECT DISTINCT PK_機能訓練記録_基本 as fkKey FROM T_日常業務_機能訓練記録01_基本';
    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getUniqueFkReportBases',
    );

    const fkKeys: string[] = records.map(it => it.fkKey);

    return fkKeys;
  }

  async getUniqueFkReportBasesWithFkKey(
    fkKey: string,
    startDate: string,
    endDate: string,
    reported: boolean,
    strDateForReport: string,
  ) {
    let strSql = `SELECT DISTINCT PK_機能訓練記録_基本 as fkKey FROM T_日常業務_機能訓練記録01_基本 WHERE FK_利用者='${fkKey}'`;
    if (reported) {
      strSql = `${strSql} AND ((対象年月日 < '${endDate}' AND 対象年月日 >= '${startDate}' ) OR (掲載期限日 >= '${strDateForReport}' AND 期間_選択項目 IS NOT NULL )) `;
    } else {
      strSql = `${strSql} AND (対象年月日 < '${endDate}' AND 対象年月日 >= '${startDate}') AND (掲載期限日 IS NULL OR 掲載期限日 < '${strDateForReport}') `;
    }

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strSql,
      'getUniqueFkReportBasesWithFkKey',
    );

    const fkKeys: string[] = records.map(it => it.fkKey);

    return fkKeys;
  }

  async getSoonestTargetDateForAttendanceWithUserFK(userFK: string) {
    let soonestDate: Date | null = null;
    let query = 'SELECT 対象年月日 FROM T_日常業務_機能訓練記録01_基本';
    if (userFK && userFK.length > 0) {
      query = `${query} WHERE FK_利用者 = '${userFK}'`;
    }

    query = `${query} UNION SELECT 対象年月日 FROM T_日常業務_入浴記録`;
    if (userFK && userFK.length > 0) {
      query = `${query} WHERE FK_利用者 = '${userFK}'`;
    }

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      query,
      'getSoonestTargetDateForAttendanceWithUserFK',
    );

    if (records && records.length > 0) {
      records.forEach(record => {
        const dateStr: string = record['対象年月日'];
        if (dateStr && dateStr.length > 0) {
          const targetDate = moment(dateStr).toDate();
          if (!soonestDate || targetDate < soonestDate) {
            soonestDate = targetDate;
          }
        }
      });
    }

    //max day to get:100 day from now;
    const maxDayReport = 99;
    const maxFromDate = moment(new Date())
      .add(-(maxDayReport + 1) * 24 * 60 * 60, 'seconds')
      .toDate();

    if (soonestDate && soonestDate < maxFromDate) {
      soonestDate = maxFromDate;
    }

    return soonestDate;
  }

  async getExerciseDetailScheduleWithFkScheduleNum(fk_sc_num: number) {
    const query = `SELECT T.PK_機能訓練計画書_詳細,T.FK_機能訓練計画書_基本,T.FK_計画基準,T.FK_利用者,T.利用者_氏名,T.表示SEQ番号,T.FK_訓練内容,T.目標_強度,T.目標_量,T.目標_セット,T.特記事項 as note,M.有効フラグ,M.訓練内容名,M.カテゴリ1,M.カテゴリ2,M.単位_強度,M.単位_量,M.単位_セット,M.ボルグスケールを表示する,M.特記事項 as exerciseNote FROM T_サービス計画_提供_機能訓練計画書02_詳細 AS T LEFT JOIN M_登録情報_機能訓練_訓練内容 AS M ON T.FK_訓練内容 = M.PK_訓練内容 WHERE FK_機能訓練計画書_基本 = ${fk_sc_num} ORDER BY 表示SEQ番号`;
    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      query,
      'getExerciseDetailScheduleWithFkScheduleNum',
    );

    const returnArray: cExerciseDetailSchedule[] = [];
    records.forEach(record => {
      const arrayClass: cDataClass[] = [];

      const keys: string[] = Object.keys(record);
      keys.forEach(key => {
        const c: cDataClass = new cDataClass();
        c.KeyName = key;
        c.DataValue = record[key];
        if (record[key]) {
          arrayClass.push(c);
        }
      });

      const data: cExerciseDetailSchedule = new cExerciseDetailSchedule();
      data.getData(arrayClass);
      returnArray.push(data);
    });

    return returnArray;
  }

  async hasNewOrUpdatedRecordWithFkKey(fk_key: string, tableName: string) {
    const query = `select 新規フラグ,変更フラグ from '${tableName}' where FK_利用者 = '${fk_key}' `;
    let isNew = '';
    let isUpdate = '';

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      query,
      'hasNewOrUpdatedRecordWithFkKey',
    );

    if (records && records.length > 0) {
      isNew = records[0]['新規フラグ'];
      isUpdate = records[1]['変更フラグ'];
    }

    if (isNew === '1' || isUpdate === '1') {
      return true;
    } else {
      return false;
    }
  }

  async hasNewOrUpdatedRecordOnVitalRecordWithFkKey(
    fk_key: string,
    target_date: Date,
  ) {
    let strQuery = `SELECT COUNT(*) as count FROM T_日常業務_バイタル WHERE FK_利用者 = '${fk_key}' AND (新規フラグ = '1'  OR 変更フラグ = '1') `;

    if (target_date) {
      const strBuff = `AND T_日常業務_バイタル.記録日時 <= '${moment(
        target_date,
      )
        .endOf('days')
        .format(
          "YYYY-MM-DD'T'HH:mm:ss",
        )}' AND T_日常業務_バイタル.記録日時 >= '${moment(target_date)
        .startOf('days')
        .format("YYYY-MM-DD'T'HH:mm:ss")}'`;
      strQuery = `${strQuery}${strBuff}`;
    }

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strQuery,
      'hasNewOrUpdatedRecordWithFkKey',
    );

    if (records && records.length > 0) {
      const count = parseInt(records[0].count, 10);
      if (count > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getValueForKey(dic: any, key: string, defaultValue: any) {
    return dic[key] === undefined || dic[key] === null
      ? defaultValue
      : dic[key];
  }

  async getSeigyoTeisuu() {
    const seigyoTeisuu: cVitalControlData = new cVitalControlData();
    const strQuery =
      'SELECT M_初期値情報.食事_おやつ,M_初期値情報.バイタル_初期値_脈拍_適正下限値,M_初期値情報.バイタル_初期値_脈拍_適正上限値,M_初期値情報.バイタル_初期値_呼吸_適正下限値,M_初期値情報.バイタル_初期値_呼吸_適正上限値,M_初期値情報.バイタル_初期値_血圧_適正下限値,M_初期値情報.バイタル_初期値_血圧_適正上限値,M_初期値情報.バイタル_初期値_体温_適正下限値,M_初期値情報.バイタル_初期値_体温_適正上限値,M_初期値情報.バイタル_初期値_酸素_適正下限値,M_初期値情報.バイタル_初期値_酸素_適正上限値,M_初期値情報.排泄記録_排泄用具_項目名,M_初期値情報.食事時間_朝食,M_初期値情報.食事時間_amおやつ,M_初期値情報.食事時間_昼食,M_初期値情報.食事時間_pmおやつ,M_初期値情報.食事時間_夕食,M_初期値情報.経過記録_内容_FCP入力方法,M_初期値情報.経過記録_履歴保存,M_初期値情報.バイタル_初期値_血圧低_適正下限値,M_初期値情報.バイタル_初期値_血圧低_適正上限値,夜勤_終了時刻,レポート掲載期間1,レポート掲載期間2,レポート掲載期間3 FROM M_初期値情報';

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getSeigyoTeisuu',
    );

    if (records && records.length > 0) {
      records.forEach(record => {
        seigyoTeisuu.mealBreak = this.getValueForKey(record, '食事_おやつ', '');

        seigyoTeisuu.pulseLow = this.getValueForKey(
          record,
          'バイタル_初期値_脈拍_適正下限値',
          '60',
        );
        seigyoTeisuu.pulseMax = this.getValueForKey(
          record,
          'バイタル_初期値_脈拍_適正上限値',
          '80',
        );

        seigyoTeisuu.breathLow = this.getValueForKey(
          record,
          'バイタル_初期値_呼吸_適正下限値',
          '20',
        );
        seigyoTeisuu.breathMax = this.getValueForKey(
          record,
          'バイタル_初期値_呼吸_適正上限値',
          '40',
        );

        seigyoTeisuu.bloodPressureLow = this.getValueForKey(
          record,
          'バイタル_初期値_血圧_適正下限値',
          '80',
        );
        seigyoTeisuu.bloodPressureMax = this.getValueForKey(
          record,
          'バイタル_初期値_血圧_適正上限値',
          '110',
        );

        seigyoTeisuu.temperatureLow = this.getValueForKey(
          record,
          'バイタル_初期値_体温_適正下限値',
          '36.0',
        );
        seigyoTeisuu.temperatureMax = this.getValueForKey(
          record,
          'バイタル_初期値_体温_適正上限値',
          '37.0',
        );

        seigyoTeisuu.oxygenLow = this.getValueForKey(
          record,
          'バイタル_初期値_酸素_適正下限値',
          '96',
        );
        seigyoTeisuu.oxygenMax = this.getValueForKey(
          record,
          'バイタル_初期値_酸素_適正上限値',
          '99',
        );

        seigyoTeisuu.excretionTool = this.getValueForKey(
          record,
          '排泄記録_排泄用具_項目名',
          '',
        );
        seigyoTeisuu.mealTimeBreakFast = this.getValueForKey(
          record,
          '食事時間_朝食',
          '',
        );
        seigyoTeisuu.mealTimeAmSnack = this.getValueForKey(
          record,
          '食事時間_amおやつ',
          '',
        );
        seigyoTeisuu.mealTimeLunch = this.getValueForKey(
          record,
          '食事時間_昼食',
          '',
        );
        seigyoTeisuu.mealTimePmSnack = this.getValueForKey(
          record,
          '食事時間_pmおやつ',
          '',
        );
        seigyoTeisuu.mealTimeSupper = this.getValueForKey(
          record,
          '食事時間_夕食',
          '',
        );

        seigyoTeisuu.elapsedContentInputMethod = this.getValueForKey(
          record,
          '経過記録_内容_FCP入力方法',
          '',
        );
        seigyoTeisuu.processElapseSaveHistory = this.getValueForKey(
          record,
          '経過記録_履歴保存',
          '',
        );
        seigyoTeisuu.lowBloodPressureLow = this.getValueForKey(
          record,
          'バイタル_初期値_血圧低_適正下限値',
          '50',
        );
        seigyoTeisuu.highBloodMax = this.getValueForKey(
          record,
          'バイタル_初期値_血圧低_適正上限値',
          '100',
        );
        seigyoTeisuu.nightDutyEndTime = this.getValueForKey(
          record,
          '夜勤_終了時刻',
          '',
        );
        seigyoTeisuu.reportPeriod1 = this.getValueForKey(
          record,
          'レポート掲載期間1',
          '3',
        );
        seigyoTeisuu.mealTimePmSnack = this.getValueForKey(
          record,
          'レポート掲載期間2',
          '7',
        );
        seigyoTeisuu.mealTimePmSnack = this.getValueForKey(
          record,
          'レポート掲載期間3',
          '30',
        );
      });
    }

    return seigyoTeisuu;
  }

  /**
   *  Get list Month Plan
   *  @param whereString
   */

  getListMonthPlansWittQueryCondition = async (whereString: string) => {
    const database = await getDBConnection();
    const strQuery = `SELECT FK_利用者, 利用者名, サービス開始日時, サービス終了日時, 対象_個別項目01, 対象_個別項目02, 対象_個別項目03, 対象_個別項目04, 課金名称, 保険外単独専用_サービス種類, 通所日付別で表示対象とする, FK_サテライト FROM T_予定管理_居宅月間 WHERE ${whereString}`;
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getListMonthPlansWittQueryCondition',
    );
    const result: cMonthPlanData[] = [];
    if (records && Array.isArray(records) && records.length > 0) {
      records.forEach(record => {
        const plan = new cMonthPlanData(record);
        result.push(plan);
      });
    }
    return result;
  };

  /**
   *  Get list Month Result
   *  @param whereString
   */

  getListMonthResultsWithQueryCondition = async (whereString: string) => {
    const database = await getDBConnection();
    const strQuery = `SELECT FK_利用者,  サービス開始日時, サービス終了日時, 課金名称, 保険外単独専用_サービス種類, 通所日付別で表示対象とする, 対象_サービス種類, 対象_個別項目04, FK_サテライト FROM T_実績管理_居宅_月間  WHERE ${whereString}`;
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getListMonthResultsWithQueryCondition',
    );
    const result: cResultsData[] = [];
    if (records && Array.isArray(records) && records.length > 0) {
      records.forEach(record => {
        const data = new cResultsData(record);
        result.push(data);
      });
    }
    return result;
  };

  /**
   *  Get list week plan
   *  @param whereString
   */
  getListOfWeekPlanFromDBWithCondition = async (whereString: string) => {
    //ヂパンジャん 2012/06/08https://bee.backlog.jp/view/IPAPP-473 ----->>>
    const database = await getDBConnection();
    const strQuery = `Select T_予定管理_居宅週間.FK_利用者,T_予定管理_居宅週間.対象_曜日,T_予定管理_居宅週間.サービス開始日時,T_予定管理_居宅週間.サービス終了日時,T_予定管理_月単位情報.ケアプラン_対象年月,T_予定管理_居宅週間.課金名称,T_予定管理_居宅週間.保険外単独専用_サービス種類,T_予定管理_居宅週間.通所日付別で表示対象とする,T_予定管理_居宅週間.FK_サテライト from T_予定管理_居宅週間 left join T_予定管理_月単位情報 on T_予定管理_居宅週間.FK_プラン_メイン = T_予定管理_月単位情報.PK_プラン_メイン where ${whereString}`;
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getlistOfWeekPlanFromDB',
    );
    const result: cDataWeekPlan[] = [];
    if (records && Array.isArray(records) && records.length > 0) {
      records.forEach(record => {
        const data = new cDataWeekPlan(record);
        result.push(data);
      });
    }
    return result;

    //ヂパンジャん 2012/06/08https://bee.backlog.jp/view/IPAPP-473 -----<<<
  };

  async hasUnsyncedAttendanceByLoginUserForFkKey(
    loginUserID: string,
    tenantCode: string,
    targetDate: string,
    serviceTime: ScheduleTime,
  ) {
    const database = await getDBConnection();
    let strCount;
    let strQuery = `
        SELECT COUNT(*) 
        FROM T_日常業務_サービス開始終了記録 
        WHERE 職員コード == '${loginUserID}' 
        AND FK_利用者 == '${tenantCode}' 
        AND (新規フラグ=='1' OR 変更フラグ=='1') 
        AND 対象年月日 = '${targetDate}' 
        AND (サービス開始日時 IS NULL OR (サービス開始日時 >= '${serviceTime.startTime}' AND サービス開始日時 <= '${serviceTime.endTime}' OR サービス終了日時 >= '${serviceTime.startTime}' and サービス終了日時 <= '${serviceTime.endTime}'))
    `;

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getlistOfWeekPlanFromDB',
    );
    if (records && records.length > 0) {
      strCount = records[0]['COUNT(*)'];
      return parseInt(strCount, 10) > 0;
    } else {
      return false;
    }
  }

  async excretionSelectQuery(dict: string) {
    let strQuery =
      'SELECT M_記録設定_排泄アイコン.セットNo,M_記録設定_排泄アイコン.セット名,M_記録設定_排泄アイコン.排泄用具,M_記録設定_排泄アイコン.排尿量,M_記録設定_排泄アイコン.排尿形態,M_記録設定_排泄アイコン.排便量,M_記録設定_排泄アイコン.排便形態,M_記録設定_排泄アイコン.コメント,M_記録設定_排泄アイコン.失禁,M_記録設定_排泄アイコン.フィールド1,M_記録設定_排泄アイコン.フィールド2,M_記録設定_排泄アイコン.フィールド3,M_記録設定_排泄アイコン.フィールド4,M_記録設定_排泄アイコン.フィールド5,M_記録設定_排泄アイコン.フィールド6,M_記録設定_排泄アイコン.登録seq番号 FROM M_記録設定_排泄アイコン ';
    if (dict && dict !== '') {
      strQuery = `${strQuery} where ${dict}`;
    }
    strQuery = `${strQuery} order by 登録seq番号 `;

    const database = await getDBConnection();

    const records = await executeSelectQuery(
      database,
      strQuery,
      'excretionSelectQuery',
    );

    const arrayUserData: cExcretionIconData[] = [];

    if (records && records.length > 0) {
      records.forEach(record => {
        const excretionIconData: cExcretionIconData = new cExcretionIconData();
        excretionIconData.setNo = this.getValueForKey(record, 'セットNo', 0);
        excretionIconData.setName = this.getValueForKey(record, 'セット名', '');
        excretionIconData.excretionTool = this.getValueForKey(
          record,
          '排泄用具',
          '',
        );
        excretionIconData.urineQuantity = this.getValueForKey(
          record,
          '排尿量',
          '',
        );
        excretionIconData.urineStatus = this.getValueForKey(
          record,
          '排尿形態',
          '',
        );
        excretionIconData.faeceQuantity = this.getValueForKey(
          record,
          '排便量',
          '',
        );
        excretionIconData.faeceStatus = this.getValueForKey(
          record,
          '排便形態',
          '',
        );
        excretionIconData.memo = this.getValueForKey(record, 'コメント', '');
        excretionIconData.urineLeak = this.getValueForKey(record, '失禁', '');
        excretionIconData.field1 = this.getValueForKey(
          record,
          'フィールド1',
          '',
        );
        excretionIconData.field2 = this.getValueForKey(
          record,
          'フィールド2',
          '',
        );
        excretionIconData.field3 = this.getValueForKey(
          record,
          'フィールド3',
          '',
        );
        excretionIconData.field4 = this.getValueForKey(
          record,
          'フィールド4',
          '',
        );
        excretionIconData.field5 = this.getValueForKey(
          record,
          'フィールド5',
          '',
        );
        excretionIconData.field6 = this.getValueForKey(
          record,
          'フィールド6',
          '',
        );
        excretionIconData.seq = this.getValueForKey(record, '登録seq番号', 0);
        arrayUserData.push(excretionIconData);
      });
    }

    //sqlite3_close(db);
    return arrayUserData;
  }

  async getExerciseBaseScheduleWithFkUser(
    fk_user: string,
    selectedDate: string,
  ): Promise<cExerciseBaseSchedule | null> {
    const result = new cExerciseBaseSchedule();
    result.initWithFkUser(fk_user);
    const database = await getDBConnection();
    let strQuery = `SELECT PK_機能訓練計画書_基本, FK_計画基準, 計画書番号, FK_利用者, 利用者_氏名, 開始日, 終了日, 評価, 特記事項 FROM T_サービス計画_提供_機能訓練計画書01_基本 WHERE FK_利用者 = '${fk_user}' AND 開始日 <= '${selectedDate}' ORDER BY 開始日 desc, PK_機能訓練計画書_基本 desc LIMIT 1`;

    // Assuming you have a way to execute SQL in TypeScript environment
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getExerciseBaseScheduleWithFkUser',
    );
    if (records && Array.isArray(records) && records.length > 0) {
      result.pkBasePlanNumber = records[0].PK_機能訓練計画書_基本;
      result.fkPlanBase = records[0].FK_計画基準;
      result.planNumber = records[0].計画書番号;
      result.fkVisitor = records[0].FK_利用者;
      result.fkVisitorName = records[0].利用者_氏名;
      result.startDate = records[0].開始日;
      result.endDate = records[0].終了日;
      result.assessment = records[0].評価;
      result.note = records[0].特記事項;
      // Check if endDate is already over, return null
      if (result.endDate) {
        const endDate = new Date(result.endDate);
        const selected = new Date(selectedDate);
        if (selected > endDate) {
          const newResult = new cExerciseBaseSchedule();
          newResult.initWithFkUser(fk_user);
          return newResult;
        }
      }
    }
    return result;
  }

  async getExerciseBaseReportWithFkUser(
    fk_user: string,
    strViewDate: string,
    baseScheduleKey: number,
    serviceTime: ScheduleTime,
  ): Promise<cExerciseBaseReport | null> {
    const data = new cExerciseBaseReport();
    await data.initWithFkKey(fk_user, strViewDate);
    data.fkExercisePlanBase = baseScheduleKey;
    const database = await getDBConnection();
    let strQuery = `SELECT 更新キー, PK_機能訓練記録_基本, FK_機能訓練計画書_基本, FK_利用者, 
                    利用者_氏名, 対象年月日, 報告者, 記録日時, 実施状況, 特記事項, 
                    機能訓練加算を算定, 新規フラグ, 変更フラグ, 送信エラー, サービス種類,
                    掲載期限日, 期間_選択項目, サービス開始日時, サービス終了日時
                    FROM T_日常業務_機能訓練記録01_基本
                    WHERE FK_利用者 = '${fk_user}' AND 対象年月日 = '${strViewDate}' AND FK_機能訓練計画書_基本 = ${baseScheduleKey}`;

    if (serviceTime) {
      strQuery += ` AND (サービス開始日時 IS NULL OR (サービス開始日時 >= '${serviceTime.startTime}' AND サービス開始日時 <= '${serviceTime.endTime}' OR サービス終了日時 >= '${serviceTime.startTime}' and サービス終了日時 <= '${serviceTime.endTime}'))`;
    }

    strQuery += ' ORDER BY 記録日時 desc, PK_機能訓練記録_基本 desc LIMIT 1';

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getExerciseBaseReportWithFkUser',
    );
    if (records && Array.isArray(records) && records.length > 0) {
      await Promise.all(
        records.map(async record => {
          data.updateKey = record['更新キー'] || '';
          data.pkExerciseBase = record['PK_機能訓練記録_基本'] || 0;
          data.fkExercisePlanBase = record['FK_機能訓練計画書_基本'] || 0;
          data.fkKey = record['FK_利用者'] || '';
          data.userName = record['利用者_氏名'] || '';
          data.targetDate = record['対象年月日'] || '';
          data.reporterId = record['報告者'] || '';
          data.timeStamp = record['記録日時'] || '';
          data.execStatus = record['実施状況'] || '';
          data.note = record['特記事項'] || '';
          data.isChargeForExercise = record['機能訓練加算を算定'] || '';
          data.newFlag = record['新規フラグ'] || '';
          data.updateFlag = record['変更フラグ'] || '';
          data.strSendErrMsg = record['送信エラー'] || '';
          data.serviceType = record['サービス種類'] || '';
          data.expireDate = record['掲載期限日'] || '';
          data.viewingPeriod = record['期間_選択項目'] || -1;
          data.serviceStartTime = record['サービス開始日時'] || '';
          data.serviceEndTime = record['サービス終了日時'] || '';
        }),
      );
      if (data && data.reporterId) {
        data.reporterData = await this.getUserDataFromDBWithUserKey(
          data.reporterId,
        );
      }
    }
    return data;
  }

  async getExtraChargeForExerciseWithQWhere(
    strWhere: string,
  ): Promise<string[]> {
    const result: string[] = [];
    const database = await getDBConnection();
    const strQuery = `SELECT FK_利用者, サービス開始日時, サービス終了日時, 対象_個別項目04 FROM T_予定管理_居宅月間 WHERE ${strWhere}`;
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getExtraChargeForExerciseWithQWhere',
    );
    if (records && Array.isArray(records) && records.length > 0) {
      records.forEach(record => {
        if (record['対象_個別項目04']) {
          result.push(record['対象_個別項目04']);
        }
      });
    }
    return result;
  }

  /**
   *  Get user data from DB by userKey
   *  @param conditionString
   */

  getUserDataFromDBWithUserKey = async (userKey: string) => {
    const database = await getDBConnection();
    const strQuery = ` SELECT M_登録情報_職員.職員コード, 
        M_登録情報_職員.職員名称_姓,
        M_登録情報_職員.職員名称_名,
        M_登録情報_職員.職員名称_姓F,
        M_登録情報_職員.職員名称_名F,
        M_登録情報_職員.パスワード,
        M_登録情報_職員.有効フラグ,
        M_登録情報_職員.レコード削除情報,
        M_登録情報_職員.職種_施設長,
        M_登録情報_職員.職種_医師,
        M_登録情報_職員.職種_介護支援専門員,
        M_登録情報_職員.職種_療法士,
        M_登録情報_職員.職種_看護師,
        M_登録情報_職員.職種_介護員,
        M_登録情報_職員.職種_支援相談員,
        M_登録情報_職員.職種_管理栄養士,
        M_登録情報_職員.職種_その他
    FROM M_登録情報_職員 WHERE M_登録情報_職員.職員コード = '${userKey}'`;

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getUserDataFromDBWithUserKey',
    );
    if (records && Array.isArray(records) && records.length > 0) {
      const data = new cUserData(records[0]);
      return data;
    }
    return undefined;
  };

  async getExtraChargeForExerciseFromResultWithQWhere(
    strWhere: string,
  ): Promise<string[]> {
    const database = await getDBConnection();
    const result: string[] = [];
    const strQuery = `SELECT FK_利用者, サービス開始日時, サービス終了日時, 対象_個別項目04 FROM T_実績管理_居宅_月間 WHERE ${strWhere}`;
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getExtraChargeForExerciseFromResultWithQWhere',
    );
    if (records && Array.isArray(records) && records.length > 0) {
      records.forEach(record => {
        if (record['対象_個別項目04']) {
          result.push(record['対象_個別項目04']);
        }
      });
    }
    return result;
  }

  async getExerciseDetailReportWithFkExerciseBase(
    fk_ex_base: number,
  ): Promise<cExerciseDetailReport[]> {
    const {selectedStaff} = getReduxStates('authentication') as AuthState;
    const database = await getDBConnection();
    const strQuery = `
        SELECT T.更新キー, T.PK_機能訓練記録_詳細, T.FK_機能訓練記録_基本,
               T.FK_機能訓練計画書_詳細, T.FK_利用者, T.FK_訓練内容,
               T.表示SEQ番号, T.報告者, T.実施状況, T.中止理由,
               T.開始時刻, T.終了時刻, T.結果_強度, T.結果_量,
               T.結果_セット, T.ボルグスケール, T.達成度, T.特記事項,
               T.新規フラグ, T.変更フラグ, T.送信エラー, M.有効フラグ,
               M.訓練内容名, M.カテゴリ1, M.カテゴリ2, M.単位_強度,
               M.単位_量, M.単位_セット, M.ボルグスケールを表示する, M.特記事項
        FROM T_日常業務_機能訓練記録02_詳細 AS T
        LEFT JOIN M_登録情報_機能訓練_訓練内容 AS M on T.FK_訓練内容=M.PK_訓練内容
        WHERE FK_機能訓練記録_基本 = ${fk_ex_base}
        ORDER BY 表示SEQ番号
    `;
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getExerciseDetailReportWithFkExerciseBase',
    );

    const recordArray: cExerciseDetailReport[] = [];

    for (let row of records) {
      const ex_detail = new cExerciseDetailReport(row);
      // Login user correction
      if (
        !ex_detail.reporterId &&
        ex_detail.exceedStatus === '1.未実施' &&
        selectedStaff
      ) {
        ex_detail.reporterId = selectedStaff.staffCode; // Replace with actual logic to get logged-in user ID
      }

      // Reporter Data
      if (ex_detail.reporterId) {
        ex_detail.reporterData = await this.getUserDataFromDBWithUserKey(
          ex_detail.reporterId,
        );
      }
      recordArray.push(ex_detail);
    }

    return recordArray;
  }

  async getListOfSatelites() {
    const strQuery = `
        SELECT FK_事業所, PK_サテライト, サービス種類, 特別地域加算_算定値, 
               適用開始日, レコード作成情報, 更新ユーザー情報, レコード更新情報, 
               更新キー, 名称, 地域区分
        FROM M_登録情報_サテライト情報
    `;
    const database = await getDBConnection();
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getExerciseDetailReportWithFkExerciseBase',
    );
    const result: CustomSatelite[] = [];
    if (records && Array.isArray(records) && records.length > 0) {
      records.forEach(record => {
        const data = new CustomSatelite(record);
        result.push(data);
      });
    }
    return result;
  }
}
