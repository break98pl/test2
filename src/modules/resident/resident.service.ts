import {cBathPeriodData} from '@database/models/various-registration-information-data/cBathPeriodData';
import {executeSelectQuery, getDBConnection} from '@database/helper';
import {
  FloorAndUnitSectionData,
  FloorUnitModel,
  Room,
} from '@modules/resident/resident.type';
import {cTenantData} from '@database/models/various-registration-information-data/cTenantData';
import {cDataClass} from '@database/models/cDataClass';
import axiosClient from '@modules/api/api.service';
import {DBOperation} from '@modules/operation/operation.service';
import {TableName} from '@database/type';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';

interface RoomWithTenantRecord {
  roomCode: string;
  roomName: string;
  buildingName: string;
  tenantId: string;
  tenantSurname: string;
  tenantName: string;
  tenantGender: string;
}

export class DBOperation_Residence {
  constructor() {}

  async isResidedAsElderlyFkKey(fk_key: string, date_string: string) {
    const database = await getDBConnection();

    let hasRec: boolean;
    const strQuery = `SELECT COUNT(*) as count FROM T_入居管理_入居期間管理_部屋予約情報 WHERE FK_利用者 = '${fk_key}'"
                                                        "AND 開始日 <= '${date_string}'"
                                                        "AND 終了日>= '${date_string}'`;

    const records = await executeSelectQuery(
      database,
      strQuery,
      'isResidedAsElderlyFkKey',
    );
    const count = records.map(it => it.count)[0];
    hasRec = count > 0;
    return hasRec;
  }

  async getNyusyokikanDataForFkKey(fk_key: string, str_date: string) {
    const database = await getDBConnection();

    const strQuery = `SELECT T_入居管理_入居期間管理_部屋予約情報.FK_利用者,"
                                                            "T_入居管理_入居期間管理_部屋予約情報.開始日,"
                                                            "T_入居管理_入居期間管理_部屋予約情報.終了日,"
                                                            "T_入居管理_入居期間管理_部屋予約情報.ベッド番号,"
                                                            "M_登録情報_部屋.コード,"
                                                            "M_登録情報_部屋.表示用通番,"
                                                            "M_登録情報_部屋.棟名,"
                                                            "M_登録情報_部屋.部屋名称,"
                                                            "M_登録情報_部屋.備考, "
                                                            "M_登録情報_部屋.棟コード "
                                                "FROM T_入居管理_入居期間管理_部屋予約情報 "
                                                "LEFT JOIN  M_登録情報_部屋 ON T_入居管理_入居期間管理_部屋予約情報.FK_部屋コード = M_登録情報_部屋.コード "
                                                "WHERE FK_利用者='${fk_key}' AND 開始日 <= '${str_date}'AND 終了日>= '${str_date}' "
                                                "ORDER BY FK_部屋コード DESC "
                                                "LIMIT 1`;

    const records = await executeSelectQuery(
      database,
      strQuery,
      'getNyusyokikanDataForFkKey',
    );

    const bathPeriod: cBathPeriodData = new cBathPeriodData();

    records.forEach(record => {
      bathPeriod.startDate = record[
        'T_入居管理_入居期間管理_部屋予約情報.開始日'
      ]
        ? record['T_入居管理_入居期間管理_部屋予約情報.開始日']
        : '';
      bathPeriod.endDate = record['T_入居管理_入居期間管理_部屋予約情報.終了日']
        ? record['T_入居管理_入居期間管理_部屋予約情報.終了日']
        : '';
      bathPeriod.bedNumber = record[
        'T_入居管理_入居期間管理_部屋予約情報.ベッド番号'
      ]
        ? record['T_入居管理_入居期間管理_部屋予約情報.ベッド番号']
        : '';
      bathPeriod.roomCode = record['M_登録情報_部屋.コード']
        ? record['M_登録情報_部屋.コード']
        : '';
      bathPeriod.displayNumber = record['M_登録情報_部屋.表示用通番']
        ? record['M_登録情報_部屋.表示用通番']
        : '';
      bathPeriod.buildingCode = record['M_登録情報_部屋.棟名']
        ? record['M_登録情報_部屋.棟名']
        : '';
      bathPeriod.roomName = record['M_登録情報_部屋.部屋名称']
        ? record['M_登録情報_部屋.部屋名称']
        : '';
      bathPeriod.unitName = record['M_登録情報_部屋.備考']
        ? record['M_登録情報_部屋.備考']
        : '';
      bathPeriod.buildingCode = record['M_登録情報_部屋.棟コード']
        ? record['M_登録情報_部屋.棟コード']
        : '';
    });

    return bathPeriod;
  }

  async getFloorData() {
    const database = await getDBConnection();
    const strQuery =
      'select distinct (棟コード||SUBSTR(コード,2,1)) as floorCode from M_登録情報_部屋 where (棟コード is not null and  コード is not null) ORDER BY FloorCode';

    const records: Record<string, any>[] = await executeSelectQuery(
      database,
      strQuery,
      'getFloorData',
    );
    return records.map(it => it.floorCode);
  }

  async getUnitData() {
    const database = await getDBConnection();
    const strQuery =
      'SELECT DISTINCT 備考 as unit FROM M_登録情報_部屋 ORDER BY 備考';

    const records = await executeSelectQuery(database, strQuery, 'getUnitData');
    return records.map(it => it.unit);
  }

  async totalUser() {
    const database = await getDBConnection();
    const strQuery =
      'SELECT COUNT (*) as count FROM (SELECT FK_利用者 FROM T_入居管理_入居期間管理_部屋予約情報,M_利用者_個人  WHERE T_入居管理_入居期間管理_部屋予約情報.FK_利用者 = M_利用者_個人.PK_利用者 GROUP BY FK_利用者) tmpTbl';

    const records = await executeSelectQuery(database, strQuery, 'totalUser');
    const counts = records.map(it => it.count);
    return counts.length > 0 ? parseInt(counts[0], 10) : 0;
  }

  // async floorCount(floorCode: string, buildingName: string) {
  //   const database = await getDBConnection();
  //   const strQuery = `SELECT COUNT(*) as count FROM  (SELECT FK_利用者 FROM T_入居管理_入居期間管理_部屋予約情報,M_登録情報_部屋,M_利用者_個人 WHERE T_入居管理_入居期間管理_部屋予約情報.FK_部屋コード = M_登録情報_部屋.コード AND T_入居管理_入居期間管理_部屋予約情報.FK_利用者 = M_利用者_個人.PK_利用者 AND SUBSTR(T_入居管理_入居期間管理_部屋予約情報.FK_部屋コード,2,1) = '${floorCode}' AND M_登録情報_部屋.棟名 = '${buildingName}' GROUP BY FK_利用者) tmpTbl`;
  //   const records = await executeSelectQuery(database, strQuery, 'floorCount');
  //   const counts = records.map(it => it.count);
  //   return counts.length > 0 ? parseInt(counts[0], 10) : 0;
  // }

  // async numberOfUser() {
  //   const database = await getDBConnection();
  //   const strQuery =
  //     'SELECT COUNT(*) as count FROM (SELECT FK_利用者 FROM M_登録情報_部屋,T_入居管理_入居期間管理_部屋予約情報,M_利用者_個人 WHERE M_登録情報_部屋.備考 is null AND M_登録情報_部屋.コード = T_入居管理_入居期間管理_部屋予約情報.FK_部屋コード AND T_入居管理_入居期間管理_部屋予約情報.FK_利用者 = M_利用者_個人.PK_利用者 GROUP BY FK_利用者) tmpTbl';
  //
  //   const records = await executeSelectQuery(
  //     database,
  //     strQuery,
  //     'numberOfUser',
  //   );
  //   const counts = records.map(it => it.count);
  //   return counts.length > 0 ? parseInt(counts[0], 10) : 0;
  // }

  // async numberOfUserWithUnit(unit: string) {
  //   const database = await getDBConnection();
  //   const strQuery = `SELECT COUNT(*) as count FROM ( SELECT FK_利用者 FROM M_登録情報_部屋,T_入居管理_入居期間管理_部屋予約情報,M_利用者_個人 WHERE M_登録情報_部屋.備考 = '${unit}' AND M_登録情報_部屋.コード = T_入居管理_入居期間管理_部屋予約情報.FK_部屋コード AND T_入居管理_入居期間管理_部屋予約情報.FK_利用者 = M_利用者_個人.PK_利用者 GROUP BY FK_利用者) tmpTbl`;
  //
  //   const records = await executeSelectQuery(
  //     database,
  //     strQuery,
  //     'numberOfUserWithUnit',
  //   );
  //   const counts = records.map(it => it.count);
  //   return counts.length > 0 ? parseInt(counts[0], 10) : 0;
  // }

  // async floorDetail(strRoomCode: string, strType: number) {
  //   const database = await getDBConnection();
  //
  //   //0 means room and 1 means unit
  //   let strQuery = '';
  //   if (strType === 0) {
  //     strQuery = `SELECT M_登録情報_部屋.コード, M_登録情報_部屋.部屋名称 FROM M_登録情報_部屋 WHERE M_登録情報_部屋.棟コード||SUBSTR(M_登録情報_部屋.コード,2,1) == '${strRoomCode}' ORDER BY M_登録情報_部屋.部屋名称`;
  //   } else {
  //     if (strRoomCode === '未指定') {
  //       strQuery =
  //         'SELECT M_登録情報_部屋.コード, M_登録情報_部屋.部屋名称 FROM M_登録情報_部屋 WHERE M_登録情報_部屋.備考 is null ORDER BY M_登録情報_部屋.棟コード,SUBSTR(M_登録情報_部屋.コード,2,1),M_登録情報_部屋.部屋名称';
  //     } else {
  //       strQuery = `SELECT M_登録情報_部屋.コード, M_登録情報_部屋.部屋名称 FROM M_登録情報_部屋 WHERE M_登録情報_部屋.備考 == '${strRoomCode}' ORDER BY M_登録情報_部屋.棟コード,SUBSTR(M_登録情報_部屋.コード,2,1),M_登録情報_部屋.部屋名称`;
  //     }
  //   }
  //   return await executeSelectQuery(database, strQuery, 'floorDetail');
  // }

  // async tenantsForFloor(roomCode: string) {
  //   const database = await getDBConnection();
  //
  //   const strQuery = `SELECT PK_利用者,姓_16進文字列,名_16進文字列,M_利用者_個人.性別 FROM M_利用者_個人 WHERE M_利用者_個人.PK_利用者 IN (SELECT FK_利用者 FROM T_入居管理_入居期間管理_部屋予約情報 WHERE FK_部屋コード = '${roomCode}') `;
  //
  //   return await executeSelectQuery(database, strQuery, 'tenantsForFloor');
  // }

  async getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL(roomCodeArray: string[]) {
    let condition = '';
    if (roomCodeArray.length > 0) {
      const codeStr = `${roomCodeArray.map(a => `'${a}'`).join(',')}`;
      condition = `WHERE T_入居管理_入居期間管理_部屋予約情報.FK_部屋コード IN (${codeStr})`;
    }

    const strQuery = `SELECT DISTINCT T_入居管理_入居期間管理_部屋予約情報.FK_利用者 as fkKey FROM T_入居管理_入居期間管理_部屋予約情報 ${condition}`;

    const database = await getDBConnection();
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL',
    );

    const keys: string[] = records.map(it => it.fkKey);
    return keys;
  }

  executeGetCompany() {
    return 'SELECT 自己_PK_事業所_11, 自己_PK_事業所_12, 自己_PK_事業所_13, 自己_PK_事業所_14, 自己_PK_事業所_17, 自己_PK_事業所_31, 自己_PK_事業所_71, 自己_PK_事業所_76 FROM M_登録情報_自社 ';
  }

  /**
   * Convert all records returned from SQLite to an array of Rooms.
   *
   * @appType Jutaku
   * @param records
   */
  convertDBRecordToRoomList(records: RoomWithTenantRecord[]): Room[] {
    const control: cDataClass = new cDataClass();
    return records.reduce((rooms: Room[], curr) => {
      let tenant: cTenantData | null = new cTenantData();
      if (curr.tenantId) {
        tenant.fkKey = curr.tenantId;
        tenant.gender = curr.tenantGender;
        tenant.firstName = control.toStringFromHexString(curr.tenantName);
        tenant.lastName = control.toStringFromHexString(curr.tenantSurname);
      } else {
        tenant = null;
      }

      const index = rooms.findIndex(e => e.code === curr.roomCode);
      if (index > -1 && tenant) {
        rooms[index].tenants.push(tenant);
      } else {
        rooms.push({
          code: curr.roomCode,
          name: curr.roomName,
          buildingName: curr.buildingName,
          tenants: tenant ? [tenant] : [],
        });
      }
      return rooms;
    }, []);
  }

  /**
   * Get the room list with all the tenants belonging to it by floor code.
   *
   * @appType Jutaku
   * @param floorCode
   */
  async getAllRoomsOfFloor(floorCode: string): Promise<Room[]> {
    const database = await getDBConnection();
    const query = `SELECT Room.コード as roomCode,
                                 Room.部屋名称 as roomName,
                                 Room.棟名 as buildingName,
                                 Tenant.PK_利用者 as tenantId,
                                 Tenant.姓_16進文字列 as tenantSurname,
                                 Tenant.名_16進文字列 as tenantName,
                                 Tenant.性別 as tenantGender
                          FROM M_登録情報_部屋 Room
                          LEFT JOIN T_入居管理_入居期間管理_部屋予約情報 Schedule
                          ON Room.コード = Schedule.FK_部屋コード AND Room.コード IS NOT NULL
                          LEFT JOIN M_利用者_個人 Tenant
                          ON Tenant.PK_利用者 = Schedule.FK_利用者 AND Tenant.PK_利用者 IS NOT NULL
                          WHERE Room.棟コード||SUBSTR(Room.コード,2,1) = '${floorCode}' 
                          ORDER BY Room.部屋名称`;

    const records: RoomWithTenantRecord[] = await executeSelectQuery(
      database,
      query,
      'getAllRoomsOfFloor',
    );

    return this.convertDBRecordToRoomList(records);
  }

  /**
   * Get the room list with all the tenants belonging to it by unit code.
   *
   * @appType Jutaku
   * @param unit
   */
  async getAllRoomsOfUnit(unit: string | null): Promise<Room[]> {
    const database = await getDBConnection();
    let query: string;
    if (unit) {
      query = `SELECT Room.コード as roomCode,
                      Room.部屋名称 as roomName,
                      Room.棟名 as buildingName,
                      Tenant.PK_利用者 as tenantId,
                      Tenant.姓_16進文字列 as tenantSurname,
                      Tenant.名_16進文字列 as tenantName,
                      Tenant.性別 as tenantGender
               FROM M_登録情報_部屋 Room
               LEFT JOIN T_入居管理_入居期間管理_部屋予約情報 Schedule
               ON Room.コード = Schedule.FK_部屋コード AND Room.コード IS NOT NULL
               LEFT JOIN M_利用者_個人 Tenant
               ON Tenant.PK_利用者 = Schedule.FK_利用者 AND Tenant.PK_利用者 IS NOT NULL
               WHERE Room.備考 == '${unit}'
               ORDER BY Room.部屋名称`;
    } else {
      query = `SELECT Room.コード as roomCode,
                      Room.部屋名称 as roomName,
                      Room.棟名 as buildingName,
                      Tenant.PK_利用者 as tenantId,
                      Tenant.姓_16進文字列 as tenantSurname,
                      Tenant.名_16進文字列 as tenantName,
                      Tenant.性別 as tenantGender
               FROM M_登録情報_部屋 Room
               LEFT JOIN T_入居管理_入居期間管理_部屋予約情報 Schedule
               ON Room.コード = Schedule.FK_部屋コード AND Room.コード IS NOT NULL
               LEFT JOIN M_利用者_個人 Tenant
               ON Tenant.PK_利用者 = Schedule.FK_利用者 AND Tenant.PK_利用者 IS NOT NULL
               WHERE Room.備考 IS NULL
               ORDER BY Room.部屋名称`;
    }

    const records: RoomWithTenantRecord[] = await executeSelectQuery(
      database,
      query,
      'getAllRoomsOfUnit',
    );
    return this.convertDBRecordToRoomList(records);
  }
}

export namespace ResidentService {
  const isEditionOfTokuteiOrGH = () => {
    const {dbName} = getReduxStates('authentication') as AuthState;

    let result = false;
    ['生活介護', 'GH', '特定', '地特'].forEach(n => {
      if (dbName.toUpperCase().indexOf(n) < 0) {
        result = true;
      }
    });

    return result;
  };

  const userNameForService = () => {
    let strUserName = '入所者';
    if (isEditionOfTokuteiOrGH()) {
      strUserName = '入居者';
    }

    return strUserName;
  };

  const getPeopleWithRoomCode = (
    roomCode: string,
    roomReservations: any[],
  ): cTenantData[] => {
    const peoples: cTenantData[] = [];
    const roomCodeFK = 'FK_部屋コード';
    const userIndividualKey = 'M_利用者_個人';

    roomReservations.forEach(reservation => {
      const code: string = reservation[roomCodeFK];
      const rawTenant = reservation[userIndividualKey];
      if (code.indexOf(roomCode) >= 0 && rawTenant) {
        const tenant = new cTenantData();
        tenant.parseFromRawData(rawTenant);
        peoples.push(tenant);
      }
    });
    return peoples;
  };

  const getFloorsWithRooms = (
    rooms: any[],
    roomReservations: any[],
  ): {[key: string]: Room[]} => {
    const floorDic: {[key: string]: Room[]} = {};
    rooms.forEach(rawRoom => {
      const roomCode = rawRoom['コード'];
      const roomName = rawRoom['部屋名称'];
      const building = roomCode.substring(2, 3);
      const people = getPeopleWithRoomCode(roomCode, roomReservations);
      const room: Room = {
        code: roomCode,
        name: roomName,
        tenants: people,
        buildingName: building === '0' ? '本館' : '別館',
      };

      const floorStr = `${building}${roomCode.substring(1, 2)}階`;
      let floors: Room[] = floorDic[floorStr];
      if (floors && floors.length > 0) {
        floors.push(room);
      } else {
        floors = [room];
      }
      floors.sort((a, b) =>
        a.code.substring(3, 7).localeCompare(b.code.substring(3, 7)),
      );
      floorDic[floorStr] = floors;
    });
    return floorDic;
  };

  const getUnitsWithRooms = (
    rooms: any[],
    manages: any[],
  ): {[key: string]: Room[]} => {
    const unitDic: {[key: string]: Room[]} = {};
    rooms.forEach(rawRoom => {
      const roomCode = rawRoom['コード'];
      const roomName = rawRoom['部屋名称'];
      const people = getPeopleWithRoomCode(roomCode, manages);
      const building = roomCode.substring(2, 3);
      const room: Room = {
        code: roomCode,
        name: roomName,
        tenants: people,
        buildingName: building === '0' ? '本館' : '別館',
      };
      let unitStr = rawRoom['備考'];
      if (!unitStr) {
        unitStr = '未指定';
      }
      let units: Room[] = unitDic[unitStr];
      if (units && units.length > 0) {
        units.push(room);
      } else {
        units = [room];
      }
      units.sort((a, b) =>
        a.code.substring(3, 7).localeCompare(b.code.substring(3, 7)),
      );
      unitDic[unitStr] = units;
    });
    return unitDic;
  };

  const getAllPeopleWithManages = (tenants: any[]) => {
    const userIndividualKey = 'M_利用者_個人';
    const peoples: any[] = [];
    tenants.forEach(tenant => {
      if (tenant[userIndividualKey]) {
        peoples.push(tenant[userIndividualKey]);
      }
    });
    return peoples;
  };

  const getArrInDic = (dic: {[key: string]: Room[]}, row: number): Room[] => {
    let keys: string[] = [];
    Object.keys(dic).forEach(k => {
      if (k !== '未指定') {
        keys.push(k);
      }
    });
    keys = keys.sort();
    keys.push('未指定');
    const iKey = keys[row];
    return dic[iKey];
  };

  const getKeyFromDic = (dic: {[key: string]: any}, row: number) => {
    let keys: string[] = [];
    Object.keys(dic).forEach(k => {
      if (k !== '未指定') {
        keys.push(k);
      }
    });
    keys = keys.sort();
    keys.push('未指定');
    return keys[row];
  };

  /**
   * Generate resident section data (units, floors) for Shisetsu.
   *
   * @appType Shisetsu
   */
  export const getResidentSectionDataForShisetsu = async () => {
    const rooms = await axiosClient.fetchRoomList();
    const roomReservations: any[] = await axiosClient.fetchRoomReservations();

    const dbOperation = new DBOperation();
    await dbOperation.insertDbWithJsonDict(TableName.Room, rooms);
    await dbOperation.insertDbWithJsonDict(
      TableName.RoomReservation,
      roomReservations,
    );

    const floorDic = getFloorsWithRooms(rooms, roomReservations);
    const uDic = getUnitsWithRooms(rooms, roomReservations);
    const all = getAllPeopleWithManages(roomReservations);

    let idx = 1;
    let keys = Object.keys(floorDic);
    const sectionFloor: any[] = [];
    keys.forEach(() => {
      let buildingName = '';
      const roomList = getArrInDic(floorDic, idx - 1);
      if (roomList.length > 0) {
        buildingName = roomList[0].buildingName;
      }

      const iKey = getKeyFromDic(floorDic, idx - 1);
      sectionFloor.push({
        id: `${buildingName}${iKey.substring(1, 2)}`,
        title: `${buildingName}${iKey.substring(1, iKey.length)}`,
        count: roomList.map(e => e.tenants).flat().length,
        rooms: roomList,
        isFloor: true,
      });
      idx += 1;
    });

    idx = 1;
    keys = Object.keys(uDic);
    const sectionUnit: any[] = [];
    keys.forEach(() => {
      const roomList: Room[] = getArrInDic(uDic, idx - 1);
      sectionUnit.push({
        id: getKeyFromDic(uDic, idx - 1),
        title: getKeyFromDic(uDic, idx - 1),
        count: roomList.map(e => e.tenants).flat().length,
        rooms: roomList,
        isFloor: false,
      });
      idx += 1;
    });

    return [
      {
        title: '全て選択',
        data: [
          {
            id: '1',
            title: `すべての${userNameForService()}を選択`,
            count: all.length,
            row: 0,
            section: 0,
          },
        ],
      },
      {
        title: 'フロアから選択',
        data: sectionFloor,
      },
      {
        title: '備考（ユニット名等）から選択',
        data: sectionUnit,
      },
    ];
  };

  /**
   * Generate resident section data (units, floors) for Jutaku.
   *
   * @appType Jutaku
   */
  export const getResidentSectionDataForJutaku = async (): Promise<
    FloorAndUnitSectionData[]
  > => {
    const control: cUserControls = new cUserControls();
    const dbOperationResidence: DBOperation_Residence =
      new DBOperation_Residence();
    const dbOperation = new DBOperation();
    const [startDate, endDate] = dbOperation.GetQueryDateRangeForPlans();

    const rooms = await axiosClient.fetchRoomList();
    const tenants = await axiosClient.fetchTenants();
    const schedules = await axiosClient.getSchedulesForJutaku(
      startDate,
      endDate,
    );

    await dbOperation.insertDbWithJsonDict(TableName.Room, rooms);
    await dbOperation.insertDbWithJsonDict(TableName.Tenant, tenants);
    await dbOperation.insertDbWithJsonDict(TableName.RoomSchedule, schedules);

    const total = await dbOperationResidence.totalUser();
    if (total === 0) {
      return [
        {
          title: '全て選択',
          data: [
            {
              id: '1',
              title: `すべての${control.userNameForService()}を選択`,
              count: 0,
              rooms: [],
            },
          ],
        },
      ];
    }

    const floorCodes: string[] = await dbOperationResidence.getFloorData();
    const unitsDB: string[] = await dbOperationResidence.getUnitData();
    const units: string[] = unitsDB.filter(u => !!u);
    units.push('未指定');

    const sectionFloor: FloorUnitModel[] = [];
    const sectionUnits: FloorUnitModel[] = [];

    for (const floorCode of floorCodes) {
      const floorNo = floorCode.substring(1, 2);
      const buildingName = floorCode.substring(0, 1) === '0' ? '本館' : '別館';
      const roomsOfFloor: Room[] =
        await dbOperationResidence.getAllRoomsOfFloor(floorCode);
      const tenantCount = roomsOfFloor.map(r => r.tenants).flat().length;

      sectionFloor.push({
        id: floorCode,
        title: `${buildingName}${floorNo}階`,
        count: tenantCount,
        rooms: roomsOfFloor,
      });
    }

    for (const unit of units) {
      const roomsOfUnit = await dbOperationResidence.getAllRoomsOfUnit(
        unit === '未指定' ? null : unit,
      );
      const tenantCount = roomsOfUnit.map(r => r.tenants).flat().length;
      sectionUnits.push({
        id: unit,
        title: unit,
        count: tenantCount,
        rooms: roomsOfUnit,
      });
    }

    return [
      {
        title: '全て選択',
        data: [
          {
            id: '1',
            title: `すべての${control.userNameForService()}を選択`,
            count: total,
            rooms: [],
          },
        ],
      },
      {
        title: 'フロアから選択',
        data: sectionFloor,
      },
      {
        title: '備考（ユニット名等）から選択',
        data: sectionUnits,
      },
    ];
  };
}
