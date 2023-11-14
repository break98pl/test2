import moment from 'moment';
import {
  executeMultiQuery,
  executeSelectQuery,
  getDBConnection,
} from '@database/helper';
import {cRoomData} from '@database/models/various-registration-information-data/cRoomData';
import {cRoomReservation} from '@database/models/cRoomReservation';
import {AuthState} from '@modules/authentication/auth.type';
import {getReduxStates} from '@store/helper';
import {AppType} from '@modules/setting/setting.type';
import {TableName} from '@database/type';
import {cTenantData} from '@database/models/various-registration-information-data/cTenantData';
import {cTenantNote} from '@database/models/cTenantNote';
import {
  GoingOutPlan,
  ServicePlan,
  TodayPlanType,
} from '@modules/tenant/tenant.type';
import {
  COLUMNS_TO_SELECT_GOING_OUT_PLAN,
  COLUMNS_TO_SELECT_SERVICE_PLAN,
} from '@modules/tenant/tenant.constant';
import {getUserDefaultKeyMultiService} from '@modules/authentication/auth.utils';

export namespace TenantDB {
  /**
   * Convert raw data into going out plans.
   *
   * @param rawRecords
   */
  const convertToGoingOutPlans = (
    rawRecords: Record<string, string | null>[],
  ): GoingOutPlan[] => {
    const getPlanTypeOfRawRecord = (record: Record<string, string | null>) => {
      const {appType} = getReduxStates('authentication') as AuthState;
      const startDate = record['開始日時'];
      const endDate = record['終了日時'];
      if (appType === AppType.SHISETSHU && startDate && endDate) {
        return moment(startDate).isSame(moment(endDate), 'day')
          ? TodayPlanType.DayOuting
          : TodayPlanType.OvernightOuting;
      } else {
        return (
          (record['外出外泊_種別'] as TodayPlanType) ?? TodayPlanType.Unknown
        );
      }
    };

    return rawRecords.map(record => ({
      id: record['更新キー'] ?? Math.random().toString(),
      tenantCode: record['FK_利用者'] ?? '',
      startDate: record['開始日時'] ?? '',
      endDate: record['終了日時'] ?? '',
      planType: getPlanTypeOfRawRecord(record),
      isConfirmedStart: !!+(record['開始_確認済み'] ?? '0'),
      isConfirmedEnd: !!+(record['終了_確認済み'] ?? '0'),
      place: record['外出外泊先'] ?? '',
      comment: record['コメント'] ?? '',
      reporterName: record['職員名'] ?? '',
      reportDate: record['報告日時'] ?? '',
    }));
  };

  /**
   * Convert raw data into service plans.
   *
   * @param rawRecords
   */
  const convertToServicePlans = (
    rawRecords: Record<string, string | null>[],
  ): ServicePlan[] => {
    const getServicePlanType = (rawValue: string) => {
      const isKantaki = getUserDefaultKeyMultiService() === '2';
      let planType = TodayPlanType.Unknown;

      if (rawValue.includes('2.訪問')) {
        if (isKantaki) {
          planType = TodayPlanType.Caring;
        } else {
          planType = TodayPlanType.Visit;
        }
      } else if (rawValue.includes('6.複合型サービス_訪問看護')) {
        planType = TodayPlanType.Nursing;
      } else if (rawValue.includes('通所')) {
        planType = TodayPlanType.Commute;
      } else if (rawValue.includes('宿泊')) {
        planType = TodayPlanType.OvernightStay;
      } else if (rawValue.includes('短期')) {
        planType = TodayPlanType.ShortTermStay;
      }
      return planType;
    };

    return rawRecords.map(record => ({
      id: record['更新キー'] ?? Math.random().toString(),
      tenantCode: record['FK_利用者'] ?? '',
      startDate: record['サービス開始日時'] ?? '',
      endDate: record['サービス終了日時'] ?? '',
      planType: getServicePlanType(record['対象_個別項目01'] ?? ''),
    }));
  };

  /**
   * Get all staff id from local DB.
   */
  export const findAllTenantIDs = async () => {
    const {appType} = getReduxStates('authentication') as AuthState;
    const database = await getDBConnection();
    let strQuery: string;
    if (appType === AppType.SHISETSHU) {
      strQuery = `select distinct FK_利用者 as uId from ${TableName.RoomReservation}`;
    } else {
      strQuery = `select PK_利用者 as uId from ${TableName.Tenant}`;
    }

    const records: Record<string, string | null>[] = await executeSelectQuery(
      database,
      strQuery,
      'getUserID',
    );
    const userIdArray = records.map(it => it.uId);
    return userIdArray.length > 0 ? userIdArray : [];
  };

  /**
   * Find all rooms in SQLite.
   */
  export const findAllRooms = async (): Promise<cRoomData[]> => {
    const query: string = `SELECT Room.コード,Room.表示用通番,Room.棟名,Room.部屋名称,Room.備考,Room.棟コード 
                           FROM ${TableName.Room} AS Room
                           WHERE Room.コード IS NOT NULL`;

    const db = await getDBConnection();
    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAllRooms',
    );

    return records.map(r => {
      const room = new cRoomData();
      room.parseFromRawData(r);
      return room;
    });
  };

  /**
   * Find all room reservations.
   *
   * @appType Shisetsu & Jutaku
   */
  export const findAllRoomSchedule = async (): Promise<cRoomReservation[]> => {
    const {appType} = getReduxStates('authentication') as AuthState;

    let tableName: string;
    if (appType === AppType.SHISETSHU) {
      tableName = TableName.RoomReservation;
    } else if (appType === AppType.JUTAKU) {
      tableName = TableName.RoomSchedule;
    } else {
      throw new Error('Takino and Tsusho does not have Room Schedule table');
    }

    const query = `SELECT RoomSchedule.開始日, RoomSchedule.終了日, RoomSchedule.ベッド番号, RoomSchedule.FK_利用者, RoomSchedule.FK_部屋コード 
                           FROM ${tableName} AS RoomSchedule`;
    const db = await getDBConnection();
    const records = await executeSelectQuery(db, query, 'findAllRoomSchedule');

    return records.map(r => {
      const reservation = new cRoomReservation();
      reservation.parseFromRawData(r);
      return reservation;
    });
  };

  /**
   * Get query string for tenant list based on app type.
   */
  const getTenantQuery = () => {
    const {appType} = getReduxStates('authentication') as AuthState;

    switch (appType) {
      case AppType.SHISETSHU:
      case AppType.JUTAKU:
        return `SELECT Tenant.PK_利用者,Tenant.姓_16進文字列,Tenant.名_16進文字列,Tenant.姓_ﾌﾘｶﾞﾅ, Tenant.名_ﾌﾘｶﾞﾅ,Tenant.性別,Tenant.要介護状態区分等,Tenant.生年月日,Tenant.連絡先1_氏名,Tenant.連絡先1_関係,Tenant.連絡先1_TEL,Tenant.連絡先1_携帯,Tenant.連絡先1_EMail,Tenant.連絡先1_郵便番号,Tenant.連絡先1_都道府県,Tenant.連絡先1_市区町村,Tenant.連絡先1_住所,Tenant.連絡先2_氏名,Tenant.連絡先2_関係,Tenant.連絡先2_TEL,Tenant.連絡先2_携帯,Tenant.連絡先2_EMail,Tenant.連絡先2_郵便番号,Tenant.連絡先2_都道府県,Tenant.連絡先2_市区町村,Tenant.連絡先2_住所,Tenant.連絡先3_氏名,Tenant.連絡先3_関係,Tenant.連絡先3_TEL,Tenant.連絡先3_携帯,Tenant.連絡先3_EMail,Tenant.連絡先3_郵便番号,Tenant.連絡先3_都道府県,Tenant.連絡先3_市区町村,Tenant.連絡先3_住所,Tenant.主治医_病院名,Tenant.主治医_科名,Tenant.主治医_郵便番号,Tenant.主治医_都道府県,Tenant.主治医_市区町村,Tenant.主治医_住所,Tenant.主治医_TEL,Tenant.主治医_FAX,Tenant.主治医_氏名,Tenant.歯科医_病院名,Tenant.歯科医_科名,Tenant.歯科医_郵便番号,Tenant.歯科医_都道府県,Tenant.歯科医_市区町村,Tenant.歯科医_住所,Tenant.歯科医_TEL,Tenant.歯科医_FAX,Tenant.歯科医_氏名,Tenant.医療情報3_病院名,Tenant.医療情報3_科名,Tenant.医療情報3_郵便番号,Tenant.医療情報3_都道府県,Tenant.医療情報3_市区町村,Tenant.医療情報3_住所,Tenant.医療情報3_TEL,Tenant.医療情報3_FAX,Tenant.医療情報3_氏名,Tenant.薬局_薬局名,Tenant.薬局_郵便番号,Tenant.薬局_都道府県,Tenant.薬局_市区町村,Tenant.薬局_住所,Tenant.薬局_TEL,Tenant.薬局_FAX,Tenant.薬局_担当者名,Tenant.認定の有効期間_開始,Tenant.認定の有効期間_終了,Tenant.更新キー,Tenant.写真データ変更フラグ,Tenant.写真データKey,Tenant.hideFlag,Tenant.電話番号,Tenant.携帯番号,Tenant.FAX番号,Tenant.住所_郵便番号,Tenant.住所_都道府県,Tenant.住所_市区町村,Tenant.住所_その他,Tenant.住所_その他2,Tenant.EMail ,Tenant.自立
                 FROM ${TableName.Tenant} AS Tenant
                 WHERE Tenant.PK_利用者 IS NOT NULL`;
      case AppType.TAKINO:
      case AppType.TSUSHO:
        return `SELECT Tenant.PK_利用者,Tenant.姓_16進文字列,Tenant.名_16進文字列,Tenant.姓_ﾌﾘｶﾞﾅ, Tenant.名_ﾌﾘｶﾞﾅ,Tenant.性別,Tenant.要介護状態区分等,Tenant.生年月日,Tenant.連絡先1_氏名,Tenant.連絡先1_関係,Tenant.連絡先1_TEL,Tenant.連絡先1_携帯,Tenant.連絡先1_EMail,Tenant.連絡先1_郵便番号,Tenant.連絡先1_都道府県,Tenant.連絡先1_市区町村,Tenant.連絡先1_住所,Tenant.連絡先2_氏名,Tenant.連絡先2_関係,Tenant.連絡先2_TEL,Tenant.連絡先2_携帯,Tenant.連絡先2_EMail,Tenant.連絡先2_郵便番号,Tenant.連絡先2_都道府県,Tenant.連絡先2_市区町村,Tenant.連絡先2_住所,Tenant.連絡先3_氏名,Tenant.連絡先3_関係,Tenant.連絡先3_TEL,Tenant.連絡先3_携帯,Tenant.連絡先3_EMail,Tenant.連絡先3_郵便番号,Tenant.連絡先3_都道府県,Tenant.連絡先3_市区町村,Tenant.連絡先3_住所,Tenant.主治医_病院名,Tenant.主治医_科名,Tenant.主治医_郵便番号,Tenant.主治医_都道府県,Tenant.主治医_市区町村,Tenant.主治医_住所,Tenant.主治医_TEL,Tenant.主治医_FAX,Tenant.主治医_氏名,Tenant.歯科医_病院名,Tenant.歯科医_科名,Tenant.歯科医_郵便番号,Tenant.歯科医_都道府県,Tenant.歯科医_市区町村,Tenant.歯科医_住所,Tenant.歯科医_TEL,Tenant.歯科医_FAX,Tenant.歯科医_氏名,Tenant.医療情報3_病院名,Tenant.医療情報3_科名,Tenant.医療情報3_郵便番号,Tenant.医療情報3_都道府県,Tenant.医療情報3_市区町村,Tenant.医療情報3_住所,Tenant.医療情報3_TEL,Tenant.医療情報3_FAX,Tenant.医療情報3_氏名,Tenant.薬局_薬局名,Tenant.薬局_郵便番号,Tenant.薬局_都道府県,Tenant.薬局_市区町村,Tenant.薬局_住所,Tenant.薬局_TEL,Tenant.薬局_FAX,Tenant.薬局_担当者名,Tenant.認定の有効期間_開始,Tenant.認定の有効期間_終了,Tenant.更新キー,Tenant.写真データ変更フラグ,Tenant.写真データKey,Tenant.hideFlag,Tenant.電話番号,Tenant.携帯番号,Tenant.FAX番号,Tenant.住所_郵便番号,Tenant.住所_都道府県,Tenant.住所_市区町村,Tenant.住所_その他,Tenant.住所_その他2,Tenant.EMail 
                 FROM ${TableName.Tenant} AS Tenant`;
      default:
        return '';
    }
  };

  /**
   * Find tenants by room codes.
   */
  export const findAllTenants = async (): Promise<cTenantData[]> => {
    const db = await getDBConnection();
    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      getTenantQuery(),
      'findAllTenants',
    );

    return records.map(r => {
      const tenant = new cTenantData();
      tenant.parseFromRawData(r);
      return tenant;
    });
  };

  /**
   * Find all tenant notes from SQLite.
   */
  export const findAllNotes = async () => {
    const db = await getDBConnection();
    const query = `SELECT FK_利用者,報告者,年月日,区分,内容,分類 ,Seq番号 
                          FROM ${TableName.TenantNote} 
                          GROUP BY FK_利用者`;
    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findAllNotes',
    );

    return records.map(r => {
      const tenant = new cTenantNote();
      tenant.parseFromRawData(r);
      return tenant;
    });
  };

  /**
   * Find going out plans from local DB.
   *
   * @param tenantCode
   */
  export const findGoingOutPlans = async (
    tenantCode = '',
  ): Promise<GoingOutPlan[]> => {
    const db = await getDBConnection();
    const query = `
      SELECT ${COLUMNS_TO_SELECT_GOING_OUT_PLAN.join(',')}
      FROM ${TableName.Overnight}
      ${tenantCode ? `WHERE FK_利用者 = '${tenantCode}'` : ''}
      ORDER BY 開始日時
    `;

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findGoingOutPlans',
    );

    return convertToGoingOutPlans(records);
  };

  /**
   * Find service plans from local DB.
   *
   * @param tenantCode
   */
  export const findServicePlans = async (
    tenantCode = '',
  ): Promise<ServicePlan[]> => {
    const db = await getDBConnection();
    const query = `
      SELECT ${COLUMNS_TO_SELECT_SERVICE_PLAN.join(',')}
      FROM ${TableName.MonthlyResult}
      WHERE 対象_個別項目01 != '種別：4.初期加算'
            ${tenantCode ? `AND FK_利用者 = '${tenantCode}'` : ''}
      ORDER BY サービス開始日時
    `;

    const records: Record<string, string | null>[] = await executeSelectQuery(
      db,
      query,
      'findServicePlans',
    );

    return convertToServicePlans(records);
  };

  /**
   * Delete going out plans of a tenant.
   *
   * @param tenantCode
   * @appType Shisetsu & Jutaku
   */
  export const deleteGoingOutPlansOfTenant = async (tenantCode: string) => {
    const db = await getDBConnection();
    await executeSelectQuery(
      db,
      `delete from ${TableName.Overnight} where FK_利用者 = '${tenantCode}'`,
      'deleteGoingOutPlanOfTenant',
    );
  };

  /**
   * Delete going out plans of a tenant.
   *
   * @param tenantCode
   * @appType Takino
   */
  export const deleteServicePlansOfTenant = async (tenantCode: string) => {
    const db = await getDBConnection();
    await executeMultiQuery(
      db,
      [
        `delete from ${TableName.MonthlyPlan} where FK_利用者 = '${tenantCode}'`,
        `delete from ${TableName.MonthlyResult} where FK_利用者 = '${tenantCode}'`,
      ],
      'deleteServicePlansOfTenant',
    );
  };
}
