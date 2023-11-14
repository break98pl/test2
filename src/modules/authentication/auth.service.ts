import moment from 'moment';
import _ from 'lodash';
import {AppType, Service, SettingState} from '@modules/setting/setting.type';
import axiosClient from '@modules/api/api.service';
import {DatabaseInfo} from '@modules/api/api.type';
import {DBOperation} from '../operation/operation.service';
import {executeMultiQuery, getDBConnection} from '@database/helper';
import {AuthDB} from './auth.db';
import {
  WrongDatabaseError,
  AppDataInitializationError,
} from '@modules/errors/error.type';
import {DETECT_SERVICE_PREFIX} from '@modules/authentication/auth.constant';
import {
  APIModelForInitAppData,
  AuthState,
  PlaceholderConfig,
} from '@modules/authentication/auth.type';
import {getReduxStates} from '@store/helper';
import {Validator} from '@database/models/functional-model/Validator';
import {cReportData} from '@database/models/recorded-data/cReportData';
import {cMealData} from '@database/models/recorded-data/cMealData';
import {cBitalData} from '@database/models/recorded-data/cBitalData';
import {cExcretionData} from '@database/models/recorded-data/cExcretionData';
import {cSystemCommonData} from '@database/models/system-common/cSystemCommonData';
import {cBathData} from '@database/models/recorded-data/cBathData';
import {cRecordSetting_Selection} from '@database/models/recorded-data/cRecordSetting_Selection';
import {cRecordSetting_ProcessReport} from '@database/models/various-registration-information-data/cRecordSetting_ProcessReport';
import {cIngestion} from '@database/models/recorded-data/cIngestion';
import {DBOperation_Residence} from '@modules/resident/resident.service';
import {cAssignReportData} from '@database/models/recorded-data/cAssignReportData';
import {cOrderData} from '@database/models/recorded-data/cOrderData';
import {cInstructionsData} from '@database/models/recorded-data/cInstructionsData';
import {cExerciseBaseReport} from '@database/models/recorded-data/functional-training/cExerciseBaseReport';
import {cExerciseBaseSchedule} from '@database/models/various-registration-information-data/reha/cExerciseBaseSchedule';
import {cExerciseDetailSchedule} from '@database/models/various-registration-information-data/reha/cExerciseDetailSchedule';
import {cExerciseDetailReport} from '@database/models/recorded-data/functional-training/cExerciseDetailReport';
import {cAttendanceData} from '@database/models/recorded-data/cAttendanceData';
import {cLetterData} from '@database/models/recorded-data/cLetterData';
import {DBOperation_SmallMulti} from '@database/DBOperation_SmallMulti';
import {TableName} from '@database/type';
import {getUserDefaultKeyMultiService} from '@modules/authentication/auth.utils';
import {DATE_FORMAT} from '@constants/constants';
import i18n from 'i18next';

export namespace AuthService {
  /**
   * Get the application type based on the license character.
   *
   * @param licenseChar
   */
  export const getAppTypeByLicenseChar = (licenseChar: string) => {
    if (['B', 'C', 'H', 'K', 'M', 'Q', 'Y'].includes(licenseChar)) {
      return AppType.SHISETSHU;
    } else if (['E', 'X'].includes(licenseChar)) {
      return AppType.TAKINO;
    } else if (['D'].includes(licenseChar)) {
      return AppType.JUTAKU;
    } else if (['A'].includes(licenseChar)) {
      return AppType.TSUSHO;
    } else {
      return AppType.UNKNOWN;
    }
  };

  /**
   * Get service by license character.
   *
   * @appType Shisetsu + Takino
   * @param licenseChar
   */
  const getServiceNameByLicense = (licenseChar: string) => {
    switch (licenseChar) {
      case 'A':
        return '通所';
      case 'B':
        return 'グループホーム';
      case 'C':
        return '特定施設';
      case 'D':
        return '住宅';
      case 'E':
        return '小規模多機能';
      case 'H':
        return '小規模特養';
      case 'K':
        return '特養';
      case 'M':
        return '老健';
      case 'Q':
        return '介護医療院';
      case 'X':
        return '看護小規模多機能';
      case 'Y':
        return '地域密着型特定施設';
      default:
        return null;
    }
  };

  /**
   * Get service name by its code.
   *
   * @param serviceCode
   */
  export const getServiceNameByCode = (serviceCode: string | null) => {
    const isKantaki = getUserDefaultKeyMultiService() === '2';
    switch (serviceCode) {
      case '5':
        return '高齢者住宅';
      case '6':
        return isKantaki ? '訪介' : '訪問';
      case '7':
        return '通い';
      case '8':
        return '宿泊';
      case '9':
        return '訪看';
      case '10':
        return '短期';
      case '11':
      case 'A2':
      case 'A3':
      case 'A4':
        return '訪問介護';
      case '12':
      case '62':
        return '訪問入浴'; // 訪問入浴介護
      case '13':
      case '63':
        return '訪問看護';
      case '14':
      case '64':
        return '訪問リハビリ';
      case '15':
      case 'A6':
      case 'A7':
      case 'A8':
        return '通所介護';
      case '16':
      case '66':
        return '通所リハビリ';
      case '17':
      case '67':
        return '福祉用具貸与';
      case '21':
      case '24':
      case '51':
        return '介護福祉施設（特養）';
      case '22':
      case '25':
      case '52':
        return '介護保健施設（老健）';
      case '27':
      case '33':
      case '35':
        return '特定施設';
      case '28':
      case '36':
        return '地域密着型特定施設';
      case '31':
      case '34':
        return '居宅療養管理指導';
      case '32':
      case '37':
      case '38':
      case '39':
        return '認知症対応型共同生活介護（GH）';
      case '54':
        return '地域密着型介護老人福祉施設（小規模特養）';
      case '55':
      case '2A':
      case '2B':
        return '介護医療院';
      case '68':
      case '69':
      case '73':
      case '75':
        return '小規模多機能';
      case '71':
        return '夜間対応型訪問介護';
      case '72':
      case '74':
        return '認知症対応型通所介護';
      case '76':
        return '定期巡回型訪問介護看護';
      case '77':
      case '79':
        return '看護小規模多機能';
      case '78':
        return '地域密着型通所介護';
      default:
        return '';
    }
  };

  /**
   * Get app type by the service code.
   *
   * @param serviceCode
   */
  export const getAppTypeByServiceCode = (serviceCode: string): AppType => {
    switch (serviceCode) {
      case '5':
      case '11':
      case 'A2':
      case 'A3':
      case 'A4':
      case '12':
      case '62':
      case '13':
      case '63':
      case '14':
      case '64':
      case '17':
      case '67':
      case '31':
      case '34':
      case '71':
      case '76':
        return AppType.JUTAKU;
      case '51':
      case '21':
      case '24':
      case '52':
      case '22':
      case '25':
      case '55':
      case '2A':
      case '2B':
      case '32':
      case '37':
      case '38':
      case '39':
      case '27':
      case '33':
      case '35':
      case '28':
      case '36':
      case '54':
        return AppType.SHISETSHU;
      case '15':
      case 'A6':
      case 'A7':
      case 'A8':
      case '16':
      case '66':
      case '72':
      case '74':
      case '78':
        return AppType.TSUSHO;
      case '68':
      case '69':
      case '73':
      case '75':
      case '77':
      case '79':
        return AppType.TAKINO;
      default:
        return AppType.UNKNOWN;
    }
  };

  /**
   * Get all services for jutaku or tsusho application.
   *
   * @appType Jutaku + Tsusho
   *
   * @param serverAddress
   * @param databaseName
   * @param appType
   */
  export const getServicesForJutakuAndTsusho = async (
    serverAddress: string,
    databaseName: string,
    appType: AppType,
  ) => {
    const services: Service[] = [];

    const rawServices = await axiosClient.getServicesByAppType(
      serverAddress,
      databaseName,
    );

    if (rawServices.length > 0) {
      const item = rawServices[0];
      const prefix = DETECT_SERVICE_PREFIX;
      const allKeys: string[] = Object.keys(item).filter(
        it => it.indexOf(prefix) >= 0,
      );
      if (appType === AppType.JUTAKU) {
        services.push({
          serviceName: getServiceNameByCode('5'),
          serviceCode: '5',
          serviceType: null,
        });
      }
      allKeys.forEach(key => {
        if (item[key]) {
          const code = key.replace(prefix, '');
          const name = getServiceNameByCode(code);
          if (name) {
            services.push({
              serviceName: name,
              serviceCode: code,
              serviceType: null,
            });
          }
        }
      });
    }

    if (
      !services.some(s => getAppTypeByServiceCode(s.serviceCode) === appType)
    ) {
      return [];
    }

    return _.uniqBy(services, 'serviceName');
  };

  /**
   * Get all services for Shisetsu or Takino application.
   *
   * @appType Shisetsu + Takino
   * @param licenseChar
   */
  export const getServicesForShisetsuAndTakino = (
    licenseChar: string,
  ): Service[] => {
    const serviceName = getServiceNameByLicense(licenseChar);
    if (serviceName) {
      return [
        {
          serviceName,
          serviceCode: '-1',
          serviceType: null,
        },
      ];
    } else {
      throw new Error(
        '[getServicesForShisetsuAndTakino]: Cannot detect service ',
      );
    }
  };

  /**
   * Get license character by server's address and database name
   * and using it to detect the application type.
   *
   * @param serverAddress
   * @param databaseName
   */
  export const getLicenseChar = async (
    serverAddress: string,
    databaseName: string,
  ) => {
    const licenseString = await axiosClient.fetchLicenseString(
      serverAddress,
      databaseName,
    );
    let licenseChar = null;
    if (licenseString && licenseString?.length >= 5) {
      licenseChar = licenseString.slice(4, 5);
    }
    return licenseChar;
  };

  /**
   * Get license character and app type by server address and database name.
   *
   * @param serverAddress
   * @param dbName
   */
  export const getLicenseCharAndAppType = async (
    serverAddress: string,
    dbName: string,
  ) => {
    const licenseChar = await AuthService.getLicenseChar(serverAddress, dbName);
    if (licenseChar === null) {
      throw new Error('[getLicenseCharAndAppType]: License character is null');
    }
    const appType = getAppTypeByLicenseChar(licenseChar);
    if (appType === AppType.UNKNOWN) {
      throw new Error(
        `[getLicenseCharAndAppType]: Cannot detect app type for license "${licenseChar}"`,
      );
    }
    return {licenseChar, appType};
  };

  /**
   * Get available databases by the server address.
   *
   * @param serverAddress
   */
  export const getDatabaseListByServerAddress = async (
    serverAddress: string,
  ): Promise<DatabaseInfo[]> => {
    const databaseNameList = await axiosClient.fetchDatabaseList(serverAddress);
    return databaseNameList
      .map(it => ({
        ...it,
        id: Math.random(),
      }))
      .filter(
        it =>
          it.name !== 'master' &&
          it.name !== 'tempdb' &&
          it.name !== 'model' &&
          it.name !== 'msdb' &&
          it.name.toUpperCase().indexOf('FIRSTCAREV6') < 0,
      );
  };

  /**
   * Delete table data before init app data.
   */
  export const deleteTableDataBeforeInit = async () => {
    const shouldDeleteDataOfTable = (tableName: TableName) => {
      return ![
        // Not delete below tables:
        TableName.Room,
        TableName.Staff,
        TableName.Tenant,
        TableName.StaffGroup,
        TableName.UnInsurance,
        TableName.RoomSchedule,
        TableName.InfoManagement,
        TableName.RoomReservation,
      ].includes(tableName);
    };

    const queries: string[] = [];
    for (const tableName of Object.values(TableName)) {
      if (shouldDeleteDataOfTable(tableName)) {
        queries.push(`DELETE FROM ${tableName} WHERE 1 = 1`);
      }
    }

    const db = await getDBConnection();
    await executeMultiQuery(db, queries, 'deleteTableDataBeforeInit');
  };

  /**
   * Generate room reservation table data based on the response of API.
   *
   * @param data it's returned by server
   */
  const generateRoomReservationData = (data: any[]) => {
    const roomCode = 'FK_部屋コード';
    const bedNumber = 'ベッド番号';
    const clonedData: any[] = JSON.parse(JSON.stringify(data));
    return clonedData.reduce((acc, curr) => {
      const values = curr[roomCode].split('.');
      acc.push({
        ...curr,
        [roomCode]: values[0],
        [bedNumber]: values[1],
      });
      return acc;
    }, []);
  };

  const checkIsFileStreamServer = async () => {
    const FileStreamColumnCheck = 'K_管理情報';
    const FileStreamValueCheck = 'データ更新情報_V6toV65_バイナリ_FS移行';
    const strCheckSql = `SELECT syscolumns.name FROM syscolumns INNER JOIN sysobjects ON (sysobjects.id=syscolumns.id) WHERE sysobjects.name='${FileStreamColumnCheck}' AND syscolumns.name = '${FileStreamValueCheck}'`;
    const response = await axiosClient.doQueryOnSqlServer(strCheckSql);
    return !!(response.key === 200 && response.data && response.data.ROOT);
  };

  /**
   * Generate photo table data based on the response of API.
   *
   * @param data it's returned by server
   */
  const generatePhotoTableData = (data: any[]) => {
    const latestDateTime = '最新日時';
    const updatedAt = 'レコード更新情報';
    const lastSyncImage: string = moment()
      .subtract(2, 'minutes')
      .format('YYYY-MM-DD HH:mm:ss.SSS');

    const clonedData: any[] = JSON.parse(JSON.stringify(data));
    return clonedData.map(curr => ({
      ...curr,
      [latestDateTime]: curr[latestDateTime]
        ? curr[latestDateTime]
        : curr[updatedAt],
      lastSyncImage,
    }));
  };

  const getDataOfOutOfInsuranceIndividualExclusiveServiceType = (
    cloneData: any,
    nestedTableName?: TableName,
  ) => {
    const outOfInsuranceIndividualExclusiveServiceType =
      '保険外単独専用_サービス種類';
    const billingName = '課金名称';
    const displayByDateOfAttendance = '通所日付別で表示対象とする';
    let dataOutOfInsuranceIndividualExclusiveServiceTypeInUninsuranceData =
      null;
    let dataBillingName = null;
    let dataDisplayByDateOfAttendance = null;
    if (
      nestedTableName &&
      cloneData[nestedTableName] &&
      cloneData[nestedTableName][TableName.UnInsurance]
    ) {
      if (
        cloneData[nestedTableName][TableName.UnInsurance][
          outOfInsuranceIndividualExclusiveServiceType
        ]
      ) {
        dataOutOfInsuranceIndividualExclusiveServiceTypeInUninsuranceData =
          cloneData[nestedTableName][TableName.UnInsurance][
            outOfInsuranceIndividualExclusiveServiceType
          ];
      }
      if (cloneData[nestedTableName][TableName.UnInsurance][billingName]) {
        dataBillingName =
          cloneData[nestedTableName][TableName.UnInsurance][billingName];
      }
      if (
        cloneData[nestedTableName][TableName.UnInsurance][
          displayByDateOfAttendance
        ]
      ) {
        dataDisplayByDateOfAttendance =
          cloneData[nestedTableName][TableName.UnInsurance][
            displayByDateOfAttendance
          ];
      }
    } else {
      if (cloneData[TableName.UnInsurance]) {
        if (
          cloneData[TableName.UnInsurance][
            outOfInsuranceIndividualExclusiveServiceType
          ]
        ) {
          dataOutOfInsuranceIndividualExclusiveServiceTypeInUninsuranceData =
            cloneData[TableName.UnInsurance][
              outOfInsuranceIndividualExclusiveServiceType
            ];
        }
        if (cloneData[TableName.UnInsurance][billingName]) {
          dataBillingName = cloneData[TableName.UnInsurance][billingName];
        }
        if (cloneData[TableName.UnInsurance][displayByDateOfAttendance]) {
          dataDisplayByDateOfAttendance =
            cloneData[TableName.UnInsurance][displayByDateOfAttendance];
        }
      }
    }

    return {
      ...cloneData,
      [outOfInsuranceIndividualExclusiveServiceType]:
        dataOutOfInsuranceIndividualExclusiveServiceTypeInUninsuranceData,
      [billingName]: dataBillingName,
      [displayByDateOfAttendance]: dataDisplayByDateOfAttendance,
    };
  };

  const generateTableDataNestedWithUninsuranceData = (listTableData: any[]) => {
    const listClonedData: any[] = JSON.parse(JSON.stringify(listTableData));

    return listClonedData.map(cloneData =>
      getDataOfOutOfInsuranceIndividualExclusiveServiceType(cloneData),
    );
  };

  const generateWeeklyPlanData = (listData: any[]) => {
    const listClonedData: any[] = JSON.parse(JSON.stringify(listData));
    return listClonedData.map(cloneData =>
      getDataOfOutOfInsuranceIndividualExclusiveServiceType(
        cloneData,
        TableName.MonthlyPlanUnit,
      ),
    );
  };

  const saveNestedTable = async (tableName: string, items: any[]) => {
    let nestedTableName = '';
    let nestedTableData = [];
    if (tableName === TableName.Tenant) {
      nestedTableName = TableName.Binary; //T_バイナリ
      items.forEach(item => nestedTableData.push(item[nestedTableName]));
    }
    if (tableName === TableName.MealContactForm) {
      nestedTableName = TableName.PrescribedMealPlan; //M_約束食事箋
      nestedTableData = _.uniqBy(
        items.map(e => e[nestedTableName]),
        '約束食事箋番号',
      );
    } else if (tableName === TableName.WeeklyPlan) {
      // T_予定管理_居宅週間
      nestedTableName = TableName.MonthlyPlanUnit; // T_予定管理_月単位情報
      items.forEach(item => nestedTableData.push(item[nestedTableName]));
    }
    nestedTableData = nestedTableData.filter(
      row => row && Object.keys(row).length,
    );
    if (nestedTableName && nestedTableData.length) {
      const dbOperation: DBOperation = new DBOperation();
      await dbOperation.insertDbWithJsonDict(nestedTableName, nestedTableData);
    }
  };

  /**
   * Generate table data based on the response of API.
   * Called before save data into local DB.
   *
   * @param tableName
   * @param rawData
   */
  const generateTableData = (tableName: string, rawData: any[]) => {
    let result = rawData;
    if (tableName === TableName.RoomReservation) {
      // T_施設利用管理_部屋予約
      result = generateRoomReservationData(rawData);
    }
    if (tableName === TableName.Binary) {
      // T_バイナリ
      result = generatePhotoTableData(rawData);
    }
    if (
      tableName === TableName.MonthlyResult ||
      tableName === TableName.MonthlyPlan
    ) {
      result = generateTableDataNestedWithUninsuranceData(rawData);
    }
    if (tableName === TableName.WeeklyPlan) {
      result = generateWeeklyPlanData(rawData);
    }
    return result;
  };

  export const fetchDataAndSaveToLocalDBByAPI = async (
    api: APIModelForInitAppData,
  ) => {
    const dbOperation: DBOperation = new DBOperation();
    let response: any;
    let errorString = '';
    if (api.type === 1) {
      response = await axiosClient.GetSQLserverData(api.query);
    } else if (api.type === 2) {
      response = await axiosClient.doQueryOnSqlServer(api.query);
    }

    if (response.key === 200) {
      if (
        response.data &&
        response.data.ROOT &&
        response.data.ROOT[api.tableName]
      ) {
        let rawData: any[] = response.data.ROOT[api.tableName];
        // If the API response has nested table, save it first
        await saveNestedTable(api.tableName, rawData);

        const dataToSave = generateTableData(api.tableName, rawData);

        await dbOperation.insertDbWithJsonDict(
          api.tableName,
          dataToSave,
          !api.notDelete,
        );
      }
    } else {
      errorString = response.message;
    }
    return errorString;
  };

  /**
   * Get API list to init data for Shisetsu.
   *
   * @appType Shisetsu
   * @param tenantCodes
   */
  const getAPIsListToInitAppDataForShisetsu = async (
    tenantCodes: string[],
  ): Promise<APIModelForInitAppData[]> => {
    const dbOperation: DBOperation = new DBOperation();
    const validator: Validator = new Validator();

    const errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.RoomReservation, // T_施設利用管理_部屋予約
      query: validator.getQueryStringNyushoDataWithUserCode(
        tenantCodes,
        new Date(),
      ),
    });
    if (errorString !== '') {
      throw new Error(errorString);
    }

    const arrayUserId: string[] = await dbOperation.getUserID();
    const FKKeyStr = arrayUserId.join(',');

    const report: cReportData = new cReportData();
    const reportSql = await report.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const meal: cMealData = new cMealData();
    const mealSql = await meal.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const bital: cBitalData = new cBitalData();
    const bitalSql = await bital.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const excretion: cExcretionData = new cExcretionData();
    const excretionSql =
      await excretion.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        '',
      );
    const excretionIconSql =
      excretion.getSqlStringForGettingIconDataFromServer();

    const sCommon: cSystemCommonData = new cSystemCommonData();
    const sCommonSql1 = sCommon.getSqlStringForGettingM_連携DataFromServer();
    const sCommonSql2 =
      sCommon.getSqlStringForGettingM_連携_独自項目DataFromServer();
    const sCommonSql3 = await sCommon.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
    );

    const bath: cBathData = new cBathData();
    const bathSql = await bath.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const recordSetting: cRecordSetting_Selection =
      new cRecordSetting_Selection();
    const recordSettingSql =
      recordSetting.getSqlStringForGettingDataFromServer();

    const recordSettingProcess: cRecordSetting_ProcessReport =
      new cRecordSetting_ProcessReport();
    const recordSettingProcessSql =
      recordSettingProcess.getSqlStringForGettingDataFromServer();

    const APIs: APIModelForInitAppData[] = [
      {
        type: 2,
        tableName: TableName.Tenant, // M_利用者_個人
        query: validator.getQueryStringUserDataWithUserCode(arrayUserId),
      },
      {
        type: 2,
        tableName: TableName.Room, // M_登録情報_部屋
        query: validator.getQueryStringRoomData(),
      },
      {
        type: 2,
        tableName: TableName.Binary, // T_バイナリ
        query: validator.getQueryStringBinaryDataWithUserCode(arrayUserId),
      },
      {
        type: 2,
        tableName: TableName.ShisetsuElapsedRecord, // T_経過記録
        query: reportSql,
      },
      {
        type: 2,
        tableName: TableName.MealInTakeRecord, // T_日常業務_食事摂取記録
        query: mealSql,
      },
      {
        type: 2,
        tableName: TableName.VitalRecord, // T_日常業務_バイタル
        query: bitalSql,
      },
      {
        type: 2,
        tableName: TableName.ExcretionRecord, // T_日常業務_排泄記録
        query: excretionSql,
      },
      {
        type: 2,
        tableName: TableName.ExcretionIconSetting, // M_記録設定_排泄アイコン
        query: excretionIconSql,
      },
      {
        type: 2,
        tableName: TableName.Holiday, // M_登録情報_祝祭日
        query: validator.getHolidayDataQueryString(),
      },
      {
        type: 2,
        tableName: TableName.Collaboration,
        query: sCommonSql1,
      },
      {
        type: 2,
        tableName: TableName.OtherSystemRecordDisplaySetting,
        query: sCommonSql2,
      },
      {
        type: 2,
        tableName: TableName.OtherSystemRecord, // T_記録_共通
        query: sCommonSql3,
      },
    ];
    let hasTable = await dbOperation.hasTableOnServer(
      TableName.YakkunMedication,
    );

    const ingestion: cIngestion = new cIngestion();

    if (hasTable) {
      const ingestionSql =
        await ingestion.getSqlStringForGettingDataFromServerForFK(
          null,
          null,
          null,
          true,
        );
      APIs.push({
        type: 2,
        tableName: TableName.YakkunMedication, // T_服やっくん服薬情報
        query: ingestionSql,
      });
    }

    hasTable = await dbOperation.hasTableOnServer(
      TableName.YakkunCollaboration,
    );
    if (hasTable) {
      const ingestionSql = ingestion.getSqlStringForGettingControlTable();
      APIs.push({
        type: 2,
        tableName: TableName.YakkunCollaboration, // K_服やっくん連携
        query: ingestionSql,
      });
    }

    APIs.push({
      type: 2,
      tableName: TableName.BathRecord, // T_日常業務_入浴記録
      query: bathSql,
    });

    APIs.push({
      type: 2,
      tableName: recordSetting.tableName(),
      query: recordSettingSql,
    });

    APIs.push({
      type: 2,
      tableName: recordSettingProcess.tableName(),
      query: recordSettingProcessSql,
    });

    const {fetchTime} = getReduxStates('setting') as SettingState;

    APIs.push({
      type: 1,
      tableName: TableName.Overnight, // T_日常業務_外出外泊
      query: `type=read&case=overnight&key=${FKKeyStr}&nowdate=${moment(
        new Date(),
      ).format(DATE_FORMAT)}&days=${fetchTime}`,
    });

    APIs.push({
      type: 1,
      tableName: TableName.MealContactForm,
      query: 'type=read&case=syokujikanri',
    });

    APIs.push({
      type: 1,
      tableName: TableName.TenantNote, // T_利用者情報_注意事項
      query: `type=read&case=tyuuijikou&key=${FKKeyStr}`,
    });

    APIs.push({
      type: 1,
      tableName: TableName.History, // M_履歴
      query: 'type=read&case=history',
    });

    APIs.push({
      type: 1,
      tableName: TableName.InitialInformation, // M_初期値情報
      query: 'type=read&case=constants',
    });

    return APIs;
  };

  /**
   * Get API list to init data for Jutaku.
   *
   * @appType Jutaku.
   * @param tenantCodes
   * @param roomCodes
   */
  const getAPIsListToInitAppDataForJutaku = async (
    tenantCodes: string[],
    roomCodes: string[],
  ): Promise<APIModelForInitAppData[]> => {
    const dbOperation: DBOperation = new DBOperation();
    const dbOperation_Residence: DBOperation_Residence =
      new DBOperation_Residence();
    const validator: Validator = new Validator();

    const error = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.RoomSchedule,
      query: dbOperation.getNyukyoDataQueryString(roomCodes),
    });

    if (error) {
      throw new Error(error);
    }

    // TODO: Check later, save isAssignRecord to setting store???
    // const isAssignRecord = await axiosClient.getIsAssignRecord();

    // FIXME: use "tenantCodes" param instead of "arrayUserId" loaded from local db
    const arrayUserId: string[] =
      await dbOperation_Residence.getFK_KeyDistinctFK_KeyByNyukyoKikanKanriTBL(
        roomCodes,
      );
    const FKKeyStr = arrayUserId.join(',');

    const report: cReportData = new cReportData();
    const reportSql = await report.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const meal: cMealData = new cMealData();
    const mealSql = await meal.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const vital: cBitalData = new cBitalData();
    const vitalSql = await vital.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const excretion: cExcretionData = new cExcretionData();
    const excretionSql =
      await excretion.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        '',
      );
    const excretionIconSql =
      excretion.getSqlStringForGettingIconDataFromServer();

    const sCommon: cSystemCommonData = new cSystemCommonData();
    const sCommonSql1 = sCommon.getSqlStringForGettingM_連携DataFromServer();
    const sCommonSql2 =
      sCommon.getSqlStringForGettingM_連携_独自項目DataFromServer();
    const sCommonSql3 = await sCommon.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
    );

    const bath: cBathData = new cBathData();
    const bathSql = await bath.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      '',
    );

    const asR: cAssignReportData = new cAssignReportData();
    const asRSql = await asR.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
    );

    const order: cOrderData = new cOrderData();
    const orderSql = await order.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
    );

    const instructions: cInstructionsData = new cInstructionsData();
    const instructionsSql =
      await instructions.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
      );

    const recordSetting: cRecordSetting_Selection =
      new cRecordSetting_Selection();
    const recordSettingSql =
      recordSetting.getSqlStringForGettingDataFromServer();

    const recordSettingProcess: cRecordSetting_ProcessReport =
      new cRecordSetting_ProcessReport();
    const recordSettingProcessSql =
      recordSettingProcess.getSqlStringForGettingDataFromServer();
    const [startDate, endDate] = dbOperation.GetQueryDateRangeForPlans();
    const startDateString = moment(startDate).format(DATE_FORMAT);
    const endDateString = moment(endDate).format(DATE_FORMAT);
    const {fetchTime} = getReduxStates('setting') as SettingState;

    const APIs: APIModelForInitAppData[] = [
      {
        type: 1,
        tableName: TableName.Room, // M_登録情報_部屋
        query: 'type=read&case=room',
      },
      {
        type: 1,
        tableName: TableName.Overnight, // T_日常業務_外出外泊
        query: `type=read&case=overnight&key=${FKKeyStr}&fromdate=${startDateString}&todate=${endDateString}&days=${fetchTime}`,
      },
      {
        type: 2,
        tableName: TableName.Company, // M_登録情報_自社
        query: dbOperation_Residence.executeGetCompany(),
      },
      {
        type: 2,
        tableName: TableName.Holiday, // M_登録情報_祝祭日
        query: validator.getHolidayDataQueryString(),
      },
      {
        type: 2,
        tableName: report.tableNameForClass(), //lay elapsed photoKey 写真バイナリキー
        query: reportSql,
      },
      {
        type: 2,
        tableName: meal.tableNameForClass(),
        query: mealSql,
      },
      {
        type: 2,
        tableName: vital.tableNameForClass(),
        query: vitalSql,
      },
      {
        type: 2,
        tableName: excretion.tableNameForClass(),
        query: excretionSql,
      },
      {
        type: 2,
        tableName: TableName.ExcretionIconSetting, // M_記録設定_排泄アイコン
        query: excretionIconSql,
      },
      {
        type: 2,
        tableName: 'M_連携',
        query: sCommonSql1,
      },
      {
        type: 2,
        tableName: 'M_連携_独自項目',
        query: sCommonSql2,
      },
      {
        type: 2,
        tableName: TableName.OtherSystemRecord, // T_記録_共通
        query: sCommonSql3,
      },
    ];

    let hasTable = await dbOperation.hasTableOnServer(
      TableName.YakkunMedication,
    );

    const ingestion: cIngestion = new cIngestion();

    if (hasTable) {
      const ingestionSql =
        await ingestion.getSqlStringForGettingDataFromServerForFK(
          null,
          null,
          null,
          true,
        );
      APIs.push({
        type: 2,
        tableName: TableName.YakkunMedication, // T_服やっくん服薬情報
        query: ingestionSql,
      });
    }

    hasTable = await dbOperation.hasTableOnServer(
      TableName.YakkunCollaboration,
    );
    if (hasTable) {
      const ingestionSql = ingestion.getSqlStringForGettingControlTable();
      APIs.push({
        type: 2,
        tableName: TableName.YakkunCollaboration, // K_服やっくん連携
        query: ingestionSql,
      });
    }

    APIs.push({
      type: 2,
      tableName: bath.tableNameForClass(),
      query: bathSql,
    });

    APIs.push({
      type: 2,
      tableName: asR.tableNameForClass(),
      query: asRSql,
    });

    APIs.push({
      type: 2,
      tableName: order.tableNameForClass(),
      query: orderSql,
    });

    APIs.push({
      type: 2,
      tableName: instructions.tableNameForClass(),
      query: instructionsSql,
    });

    APIs.push({
      type: 2,
      tableName: recordSetting.tableName(),
      query: recordSettingSql,
    });

    APIs.push({
      type: 2,
      tableName: recordSettingProcess.tableName(),
      query: recordSettingProcessSql,
    });

    APIs.push({
      type: 1,
      tableName: TableName.Tenant, // M_利用者_個人
      query: `type=read&case=kyotakuriyosya&key=${FKKeyStr}`,
    });

    APIs.push({
      type: 1,
      tableName: TableName.TenantNote, // T_利用者情報_注意事項
      query: `type=read&case=tyuuijikou&key=${FKKeyStr}`,
    });

    APIs.push({
      type: 1,
      tableName: TableName.InitialInformation, // M_初期値情報
      query: 'type=read&case=constants',
    });
    return APIs;
  };

  /**
   * Fetch additional services for Tsusho from server
   */

  export const getAppAdditionalServices = async () => {
    const arrSrvices = ['A5', 'A6', '78', 'A7', 'A8'];
    let result: string[] = [];
    await Promise.all(
      arrSrvices.map(async serviceNum => {
        const strQuery = `SELECT syscolumns.name FROM syscolumns INNER JOIN sysobjects ON (sysobjects.id=syscolumns.id)  WHERE sysobjects.name='M_登録情報_自社'  AND syscolumns.name = '自己_PK_事業所_${serviceNum}'`;
        const response = await axiosClient.doQueryOnSqlServer(strQuery);
        if (response.key === 200 && response.data && response.data.ROOT) {
          result.push(serviceNum);
        }
      }),
    );
    return result;
  };

  /**
   * Prepare data before fetch api list for Tsusho
   *
   * @appType Tsusho
   */

  export const prepareDataBeforeCallAPIListForTsusho = async () => {
    const truncateTables = async () => {
      await dbOperation.deleteDataTable(TableName.WeeklyPlan); ////T_予定管理_居宅週間
      await dbOperation.deleteDataTable(TableName.MonthlyPlan); //T_予定管理_居宅月間
      await dbOperation.deleteDataTable(TableName.RoomSchedule); //T_入居管理_入居期間管理_部屋予約情報
      await dbOperation.deleteDataTable(TableName.MonthlyResult); //T_実績管理_居宅_月間
      await dbOperation.deleteDataTable(TableName.Letter); //T_日常業務_おたより帳
      await dbOperation.deleteDataTable(TableName.Holiday); //M_登録情報_祝祭日
      await dbOperation.deleteDataTable(
        TableName.RehaSchedule, // 'T_サービス計画_提供_機能訓練計画書01_基本'
      );
      await dbOperation.deleteDataTable(TableName.RehaScheduleExercise); //T_サービス計画_提供_機能訓練計画書02_詳細
      await dbOperation.deleteDataTable(TableName.RehaRecord); //T_日常業務_機能訓練記録01_基本
    };

    const fetchSatelite = async () => {
      const query =
        'SELECT FK_事業所, PK_サテライト, サービス種類, 特別地域加算_算定値, 適用開始日, レコード作成情報, 更新ユーザー情報, レコード更新情報, 更新キー, 名称, 地域区分 FROM M_登録情報_サテライト情報';
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI({
        type: 2,
        tableName: TableName.Satellite,
        query,
      });
      if (errorMsg) {
        throw new AppDataInitializationError();
      }
    };

    const fetchScheduleManagementMonthAtHome = async () => {
      const query = validator.sqlQueryForMonthPlanWithBasisDate(
        new Date(),
        serviceNo,
        null,
      );
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI({
        type: 2,
        tableName: TableName.MonthlyPlan, //T_予定管理_居宅月間
        query,
        notDelete: true,
      });
      if (errorMsg) {
        throw new AppDataInitializationError();
      }
    };

    const fetchScheduleManagementWeekAtHome = async () => {
      const query = validator.sqlQueryForWeekPlanWithBasisDate(
        new Date(),
        serviceNo,
      );
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI({
        type: 2,
        tableName: TableName.WeeklyPlan,
        query,
        notDelete: true,
      });
      if (errorMsg) {
        throw new AppDataInitializationError();
      }
    };

    const fetchResultManagementHomeByMonth = async () => {
      const query = validator.sqlQueryForMonthResultsWithBasisDate(
        new Date(),
        serviceNo,
        null,
      );
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI({
        type: 2,
        tableName: TableName.MonthlyResult, //T_実績管理_居宅_月間
        query,
        notDelete: true,
      });
      if (errorMsg) {
        throw new AppDataInitializationError();
      }
    };

    const fetchExerciseBaseReport = async () => {
      const getFetchExerciseBaseReportSQL = async () => {
        const exReport: cExerciseBaseReport = new cExerciseBaseReport();
        const exReportSql =
          await exReport.getSqlStringForGettingDataFromServerForFK(
            null,
            null,
            null,
            true,
            moment(new Date()).format(DATE_FORMAT),
          );
        return {tableName: TableName.RehaRecord, query: exReportSql};
      };
      const exerciseBaseReportSqlData = await getFetchExerciseBaseReportSQL();
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI({
        type: 2,
        tableName: exerciseBaseReportSqlData.tableName,
        query: exerciseBaseReportSqlData.query,
      });
      if (errorMsg) {
        throw new AppDataInitializationError();
      }
    };

    const fetchExerciseBaseSchedule = async () => {
      const getFetchExerciseBaseScheduleSQLData = async () => {
        const cExercise: cExerciseBaseSchedule = new cExerciseBaseSchedule();
        const cExerciseSql =
          await cExercise.getSqlStringForGettingDataFromServer();
        return {query: cExerciseSql};
      };
      const exerciseBaseScheduleSqlData =
        await getFetchExerciseBaseScheduleSQLData();
      const errorMsg = await AuthService.fetchDataAndSaveToLocalDBByAPI({
        type: 2,
        tableName: TableName.RehaSchedule,
        query: exerciseBaseScheduleSqlData.query,
      });
      if (errorMsg) {
        throw new AppDataInitializationError();
      }
    };

    const dbOperation: DBOperation = new DBOperation();
    const validator: Validator = new Validator();
    const {service} = getReduxStates('authentication') as AuthState;
    const serviceNo = service ? parseInt(service.serviceCode, 10) : -1;

    const additionalServices = await AuthService.getAppAdditionalServices();
    await truncateTables();
    await fetchSatelite();
    await fetchScheduleManagementMonthAtHome();
    await fetchScheduleManagementWeekAtHome();
    await fetchResultManagementHomeByMonth();
    await fetchExerciseBaseReport();
    await fetchExerciseBaseSchedule();
    const checkStream = await checkIsFileStreamServer();
    return {additionalServices, checkStream};
  };

  /**
   * Get API list to init data for Tsusho.
   *
   * @appType Tsusho.
   */
  const getAPIsListToInitAppDataForTsusho = async () => {
    const getFetchHolidaySqlData = async () => {
      return {
        tableName: TableName.Holiday, //M_登録情報_祝祭日
        query: validator.getHolidayDataQueryString(),
      };
    };

    const getFetchReportSQLData = async () => {
      const report: cReportData = new cReportData();
      const reportSql = await report.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        moment(new Date()).format(DATE_FORMAT),
      );
      return {tableName: TableName.JuTaTsuElapsedRecord, query: reportSql}; // T_サービス計画_介護支援経過
    };

    const getFetchMealRecordSQLData = async () => {
      const meal: cMealData = new cMealData();
      const mealSql = await meal.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        moment(new Date()).format(DATE_FORMAT),
      );
      return {tableName: TableName.MealInTakeRecord, query: mealSql};
    };

    const getFetchVitalRecordSQLData = async () => {
      const bital: cBitalData = new cBitalData();
      const bitalSql = await bital.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        moment(new Date()).format(DATE_FORMAT),
      );
      return {tableName: bital.tableNameForClass(), query: bitalSql};
    };

    const getFetchBathRecordSQLData = async () => {
      const bath: cBathData = new cBathData();
      const bathSql = await bath.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        moment(new Date()).format(DATE_FORMAT),
      );
      return {tableName: bath.tableNameForClass(), query: bathSql};
    };

    const getFetchExcretionSQLData = async () => {
      const excretion: cExcretionData = new cExcretionData();
      const excretionSql =
        await excretion.getSqlStringForGettingDataFromServerForFK(
          null,
          null,
          null,
          true,
          moment(new Date()).format(DATE_FORMAT),
        );
      return {
        tableName: excretion.tableNameForClass(),
        query: excretionSql,
      };
    };

    const getFetchExcretionIconSQLData = async () => {
      const excretion: cExcretionData = new cExcretionData();
      const excretionIconSql =
        excretion.getSqlStringForGettingIconDataFromServer();
      return {
        query: excretionIconSql,
        tableName: TableName.ExcretionIconSetting, //M_記録設定_排泄アイコン
      };
    };

    const getFetchExerciseDetailsScheduleSqlData = async () => {
      const fkBasePlanArray = await dbOperation.getUniqueFkPlanBases();
      const cExerciseDetail: cExerciseDetailSchedule =
        new cExerciseDetailSchedule();
      const cExerciseDetailSql =
        await cExerciseDetail.getSqlStringForGettingDataFromServerWithFKBasePlan(
          fkBasePlanArray,
        );
      return {
        query: cExerciseDetailSql,
        tableName: TableName.RehaScheduleExercise,
      };
    };

    const getFetchExcerciseDetailsReportSQLData = async () => {
      const cExerciseReport: cExerciseDetailReport =
        new cExerciseDetailReport();
      let cExerciseReportSql =
        await cExerciseReport.getSqlStringForGettingDataFromServerWithFkKey(
          null,
          null,
          null,
          true,
          moment(new Date()).format(DATE_FORMAT),
        );
      cExerciseReportSql = `${cExerciseReportSql} AND 実施状況 IS NOT NULL `;
      return {
        query: cExerciseReportSql,
        tableName: TableName.RehaRecordResult, //T_日常業務_機能訓練記録02_詳細
      };
    };

    const getFetchAttendanceSQLData = async () => {
      const cAttendance: cAttendanceData = new cAttendanceData();
      const queryNowForAttendance =
        await cAttendance.GetQueryNowDeviceDateForAttendance();
      const cAttendanceSql = cAttendance.getQueryStringFromUsers(
        FKkeyStr,
        `${serviceNo}`,
        queryNowForAttendance,
      );
      return {
        query: cAttendanceSql,
        tableName: TableName.Attendance,
      };
    };

    const getFetchLetterSQLData = async () => {
      const cLetter: cLetterData = new cLetterData();
      const cLetterSql = cLetter.getQueryStringFromUsers(
        FKkeyStr,
        `${serviceNo}`,
        cLetter.getQueryNowDeviceDate(),
      );
      return {query: cLetterSql, tableName: TableName.Letter};
    };

    const getFetchRecordSettingSelectionSQLData = async () => {
      const recordSetting: cRecordSetting_Selection =
        new cRecordSetting_Selection();
      const recordSettingSql =
        recordSetting.getSqlStringForGettingDataFromServer();
      return {tableName: recordSetting.tableName(), query: recordSettingSql};
    };

    const getFetchRecordSettingProcessSQlData = async () => {
      const recordSettingProcess: cRecordSetting_ProcessReport =
        new cRecordSetting_ProcessReport();
      const recordSettingProcessSql =
        recordSettingProcess.getSqlStringForGettingDataFromServer();
      return {
        tableName: recordSettingProcess.tableName(),
        query: recordSettingProcessSql,
      };
    };

    const getFetchSystemCommon1SqlData = async () => {
      const sCommon: cSystemCommonData = new cSystemCommonData();
      const sCommonSql = sCommon.getSqlStringForGettingM_連携DataFromServer();
      return {
        query: sCommonSql,
        tableName: 'M_連携',
      };
    };

    const getFetchSystemCommon2SqlData = async () => {
      const sCommon: cSystemCommonData = new cSystemCommonData();
      const sCommonSql =
        sCommon.getSqlStringForGettingM_連携_独自項目DataFromServer();
      return {
        query: sCommonSql,
        tableName: 'M_連携_独自項目',
      };
    };

    const getFetchSystemCommon3SqlData = async () => {
      const sCommon: cSystemCommonData = new cSystemCommonData();
      const sCommonSql =
        await sCommon.getSqlStringForGettingDataFromServerForFK(
          null,
          null,
          null,
          true,
        );
      return {
        query: sCommonSql,
        tableName: 'T_記録_共通',
      };
    };

    const getFetchYakkunMedicationSqlData = async () => {
      const ingestion: cIngestion = new cIngestion();
      const ingestionSql =
        await ingestion.getSqlStringForGettingDataFromServerForFK(
          null,
          null,
          null,
          false,
        );
      return {
        tableName: TableName.YakkunMedication, //K_服やっくん連携
        query: ingestionSql,
      };
    };

    const getFetchYakkunCollapborationSqlData = async () => {
      const ingestion: cIngestion = new cIngestion();
      const ingestionSql = ingestion.getSqlStringForGettingControlTable();
      return {
        tableName: TableName.YakkunCollaboration,
        query: ingestionSql,
      };
    };

    const addYakkunMedicationAPI = async () => {
      let hasTable = await dbOperation.hasTableOnServer(
        TableName.YakkunMedication,
      ); //K_服やっくん連携
      if (hasTable) {
        const api = {
          type: 2,
          tableName: yakkunMedicationSqlData.tableName,
          query: yakkunMedicationSqlData.query,
        };
        APIs.push(api);
      }
    };

    const addYakkunCollaborationAPI = async () => {
      const hasTable = await dbOperation.hasTableOnServer(
        TableName.YakkunCollaboration,
      ); //K_服やっくん連携
      if (hasTable) {
        APIs.push({
          type: 2,
          tableName: yakkunCollapborationSqlData.tableName,
          query: yakkunCollapborationSqlData.query,
        });
      }
    };

    const dbOperation: DBOperation = new DBOperation();
    const validator: Validator = new Validator();
    const {service} = getReduxStates('authentication') as AuthState;
    const serviceNo = service ? parseInt(service.serviceCode, 10) : -1;
    const arrayUserId: string[] =
      await dbOperation.getDistinctFK_KeysFromPlanAndResultTables();
    const FKkeyStr = arrayUserId.join(',');

    //prepare sql data to call API
    const holidaySqlData = await getFetchHolidaySqlData();
    const reportSqlData = await getFetchReportSQLData();
    const mealSqlData = await getFetchMealRecordSQLData();
    const bitalSqlData = await getFetchVitalRecordSQLData();
    const excretionSqlData = await getFetchExcretionSQLData();
    const excretionIconSqlData = await getFetchExcretionIconSQLData();
    const bathSqlData = await getFetchBathRecordSQLData();
    const exerciseDetailsScheduleSqlData =
      await getFetchExerciseDetailsScheduleSqlData();
    const excerciseDetailsReportSqlData =
      await getFetchExcerciseDetailsReportSQLData();
    const attendanceSqlData = await getFetchAttendanceSQLData();
    const letterSqlData = await getFetchLetterSQLData();
    const recordSettingSelectionSqlData =
      await getFetchRecordSettingSelectionSQLData();
    const recordSettingProcessSqlData =
      await getFetchRecordSettingProcessSQlData();
    const systemCommon1SqlData = await getFetchSystemCommon1SqlData();
    const systemCommon2SqlData = await getFetchSystemCommon2SqlData();
    const systemCommon3SqlData = await getFetchSystemCommon3SqlData();
    const yakkunMedicationSqlData = await getFetchYakkunMedicationSqlData();
    const yakkunCollapborationSqlData =
      await getFetchYakkunCollapborationSqlData();

    const APIs: APIModelForInitAppData[] = [
      {
        type: 2,
        tableName: holidaySqlData.tableName,
        query: holidaySqlData.query,
      },
      {
        type: 2,
        tableName: reportSqlData.tableName,
        query: reportSqlData.query,
      },
      {
        type: 2,
        tableName: mealSqlData.tableName,
        query: mealSqlData.query,
      },
      {
        type: 2,
        tableName: bitalSqlData.tableName,
        query: bitalSqlData.query,
      },
      {
        type: 2,
        tableName: excretionSqlData.tableName,
        query: excretionSqlData.query,
      },
      {
        type: 2,
        tableName: excretionIconSqlData.tableName,
        query: excretionIconSqlData.query,
      },
      {
        type: 2,
        tableName: bathSqlData.tableName,
        query: bathSqlData.query,
      },
      {
        type: 2,
        tableName: TableName.ExerciseContent,
        query:
          'SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,PK_訓練内容,有効フラグ,訓練内容名,カテゴリ1,カテゴリ2,単位_強度,単位_量,単位_セット,ボルグスケールを表示する,特記事項 FROM M_登録情報_機能訓練_訓練内容',
      },
      {
        type: 2,
        tableName: TableName.Binary, // T_バイナリ
        query: validator.getQueryStringBinaryDataWithUserCode(arrayUserId),
      },
      {
        type: 2,
        tableName: exerciseDetailsScheduleSqlData.tableName,
        query: exerciseDetailsScheduleSqlData.query,
      },
      {
        type: 2,
        tableName: excerciseDetailsReportSqlData.tableName,
        query: excerciseDetailsReportSqlData.query,
      },
      {
        type: 2,
        tableName: attendanceSqlData.tableName,
        query: attendanceSqlData.query,
      },
      {
        type: 2,
        tableName: letterSqlData.tableName, //T_日常業務_おたより帳,
        query: letterSqlData.query,
      },
      {
        type: 2,
        tableName: systemCommon1SqlData.tableName,
        query: systemCommon1SqlData.query,
      },
      {
        type: 2,
        tableName: systemCommon2SqlData.tableName,
        query: systemCommon2SqlData.query,
      },
      {
        type: 2,
        tableName: systemCommon3SqlData.tableName,
        query: systemCommon3SqlData.query,
      },
      {
        type: 2,
        tableName: recordSettingSelectionSqlData.tableName,
        query: recordSettingSelectionSqlData.query,
      },
      {
        type: 2,
        tableName: recordSettingProcessSqlData.tableName,
        query: recordSettingProcessSqlData.query,
      },
      {
        type: 1,
        tableName: TableName.Tenant, //M_利用者_個人
        query: `type=read&case=kyotakuriyosya&key=${FKkeyStr}`,
      },
      {
        type: 1,
        tableName: TableName.TenantNote, //T_利用者情報_注意事項
        query: `type=read&case=tyuuijikou&key=${FKkeyStr}`,
      },
      {
        type: 1,
        tableName: TableName.History, //M_履歴
        query: 'type=read&case=history',
      },
      {
        type: 1,
        tableName: TableName.InitialInformation, //M_初期値情報
        query: 'type=read&case=constants',
      },
    ];
    await addYakkunMedicationAPI();
    await addYakkunCollaborationAPI();
    return APIs;
  };

  /**
   * Get API list to init data for Takino.
   *
   * @appType Takino.
   */
  const getAPIsListToInitAppDataForTakino = async () => {
    let errorString: string;

    const dbOperation: DBOperation = new DBOperation();
    const dbOperation_SmallMulti: DBOperation_SmallMulti =
      new DBOperation_SmallMulti();
    const validator: Validator = new Validator();

    const userDefaultKeyMultiService = getUserDefaultKeyMultiService();

    const isKantaki = userDefaultKeyMultiService === '2';
    const serviceNo = isKantaki ? 77 : 73;
    const serviceNoTanki = isKantaki ? 79 : 68;

    await dbOperation.deleteDataTable(TableName.MonthlyPlan); //T_予定管理_居宅月間
    await dbOperation.deleteDataTable(TableName.WeeklyPlan); //T_予定管理_居宅週間
    await dbOperation.deleteDataTable(TableName.MonthlyResult); //T_実績管理_居宅_月間

    errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyPlan, //T_予定管理_居宅月間
      query: validator.sqlQueryForMonthPlanWithBasisDate(
        new Date(),
        serviceNo,
        null,
      ),
      notDelete: true,
    });
    if (errorString !== '') {
      throw new Error(errorString);
    }

    errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyPlan, //T_予定管理_居宅月間
      query: validator.sqlQueryForMonthPlanWithBasisDate(
        new Date(),
        serviceNoTanki,
        null,
      ),
      notDelete: true,
    });
    if (errorString !== '') {
      throw new Error(errorString);
    }

    errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.WeeklyPlan,
      query: validator.sqlQueryForWeekPlanWithBasisDate(new Date(), serviceNo),
      notDelete: true,
    });
    if (errorString !== '') {
      throw new Error(errorString);
    }

    errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 1,
      tableName: TableName.Tenant, // M_利用者_個人
      query: 'type=read&case=kyotakuriyosya',
    });
    if (errorString !== '') {
      return [];
    }

    const arrayUserId: string[] =
      await dbOperation_SmallMulti.getFK_KeyDistinctByTenantDataTBL();
    const fkKeyStr = arrayUserId.join(',');

    await dbOperation.deleteDataTable(TableName.RoomSchedule); // T_入居管理_入居期間管理_部屋予約情報

    // refTotalProcessing.current += 1;
    errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyResult, //T_実績管理_居宅_月間
      query: validator.sqlQueryForMonthResultsWithBasisDate(
        new Date(),
        serviceNo,
        null,
      ),
      notDelete: true,
    });
    if (errorString !== '') {
      return [];
    }

    errorString = await fetchDataAndSaveToLocalDBByAPI({
      type: 2,
      tableName: TableName.MonthlyResult, //T_実績管理_居宅_月間
      query: validator.sqlQueryForMonthResultsWithBasisDate(
        new Date(),
        serviceNoTanki,
        null,
      ),
      notDelete: true,
    });
    if (errorString !== '') {
      return [];
    }

    const report: cReportData = new cReportData();
    const reportSql = await report.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      moment(new Date()).format(DATE_FORMAT),
    );

    const meal: cMealData = new cMealData();
    const mealSql = await meal.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      moment(new Date()).format(DATE_FORMAT),
    );

    const vital: cBitalData = new cBitalData();
    const vitalSql = await vital.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      moment(new Date()).format(DATE_FORMAT),
    );

    const excretion: cExcretionData = new cExcretionData();
    const excretionSql =
      await excretion.getSqlStringForGettingDataFromServerForFK(
        null,
        null,
        null,
        true,
        moment(new Date()).format(DATE_FORMAT),
      );
    const excretionIconSql =
      excretion.getSqlStringForGettingIconDataFromServer();

    const bath: cBathData = new cBathData();
    const bathSql = await bath.getSqlStringForGettingDataFromServerForFK(
      null,
      null,
      null,
      true,
      moment(new Date()).format(DATE_FORMAT),
    );

    const recordSetting: cRecordSetting_Selection =
      new cRecordSetting_Selection();
    const recordSettingSql =
      recordSetting.getSqlStringForGettingDataFromServer();

    const recordSettingProcess: cRecordSetting_ProcessReport =
      new cRecordSetting_ProcessReport();
    const recordSettingProcessSql =
      recordSettingProcess.getSqlStringForGettingDataFromServer();

    const APIs: APIModelForInitAppData[] = [
      {
        type: 2,
        tableName: TableName.Holiday, // M_登録情報_祝祭日
        query: validator.getHolidayDataQueryString(),
      },
      {
        type: 2,
        tableName: report.tableNameForClass(), //lay elapsed photoKey 写真バイナリキー
        query: reportSql,
      },
      {
        type: 2,
        tableName: meal.tableNameForClass(),
        query: mealSql,
      },
      {
        type: 2,
        tableName: vital.tableNameForClass(),
        query: vitalSql,
      },
      {
        type: 2,
        tableName: excretion.tableNameForClass(),
        query: excretionSql,
      },
      {
        type: 2,
        tableName: TableName.ExcretionIconSetting, // M_記録設定_排泄アイコン
        query: excretionIconSql,
      },
      {
        type: 2,
        tableName: bath.tableNameForClass(),
        query: bathSql,
      },
      {
        type: 2,
        tableName: recordSetting.tableName(),
        query: recordSettingSql,
      },
      {
        type: 2,
        tableName: recordSettingProcess.tableName(),
        query: recordSettingProcessSql,
      },
      {
        type: 1,
        tableName: TableName.TenantNote, // T_利用者情報_注意事項
        query: `type=read&case=tyuuijikou&key=${fkKeyStr}`,
      },
      {
        type: 1,
        tableName: TableName.History, // M_履歴
        query: 'type=read&case=history',
      },
      {
        type: 1,
        tableName: TableName.InitialInformation, // M_初期値情報
        query: 'type=read&case=constants',
      },
    ];

    return APIs;
  };

  /**
   * Get API list to init app data.
   *
   * @param appType
   * @param tenantCodes
   * @param roomCodes
   */
  export const getAPIListToInitAppData = async (
    appType: AppType,
    tenantCodes: string[],
    roomCodes: string[],
  ): Promise<APIModelForInitAppData[]> => {
    switch (appType) {
      case AppType.SHISETSHU:
        return await getAPIsListToInitAppDataForShisetsu(tenantCodes);
      case AppType.JUTAKU:
        return await getAPIsListToInitAppDataForJutaku(tenantCodes, roomCodes);
      case AppType.TAKINO:
        return await getAPIsListToInitAppDataForTakino();
      case AppType.TSUSHO:
        return await getAPIsListToInitAppDataForTsusho();
      default:
        return [];
    }
  };

  /**
   * Remove unused data of local DB after init successfully
   * for Jutaku, Takino & Tsusho.
   *
   * @param appType
   */
  export const removeUnusedTableDataAfterInitSuccessfully = async (
    appType: AppType,
  ) => {
    if (appType === AppType.TSUSHO) {
      const dbOperation = new DBOperation();
      await dbOperation.removeDuplicatedExerciseBaseReport();
      await dbOperation.removeDuplicatedExerciseDetailReport();
      await dbOperation.removeDuplicatedNewExerciseDetailReport();
      await dbOperation.removeScheduleDeletedReport();
      await dbOperation.removeNonParentData();
    }
  };

  /**
   * Handle save raw binaries data which are returned by server into local DB.
   *
   * @param rawBinaries
   * @param appType
   */
  export const savePhotosToLocalDB = async (
    rawBinaries: any[],
    appType: AppType,
  ) => {
    const dbOperation: DBOperation = new DBOperation();
    let insertItems: any[] = [];
    let updateItems: any[] = [];
    const check = await dbOperation.loadAllPhoto();

    if (check.length === 0) {
      insertItems = rawBinaries;
    } else {
      rawBinaries.forEach((item: any) => {
        const photoKey: string = item['キー'];
        const idx = check.findIndex(c => c['キー'] === photoKey);
        if (idx < 0) {
          insertItems.push(item);
        } else {
          if (appType === AppType.TSUSHO) {
            //Need to check condition
            updateItems.push(item);
          } else {
            if (
              item['レコード更新情報'] !== check[idx]['レコード更新情報'] ||
              (!check[idx]['データ'] && item['データ'])
            ) {
              updateItems.push(item);
            }
          }
        }
      });
    }
    if (insertItems.length > 0) {
      await dbOperation.insertBinaryToDbWithJsonDict('T_バイナリ', insertItems);
    }
    if (updateItems.length > 0) {
      await dbOperation.updateBinaryToDbWithJsonDict('T_バイナリ', updateItems);
    }
  };

  /**
   * Init photos data.
   *
   * @param appType
   */
  export const initPhotosData = async (appType: AppType) => {
    const dbOperation: DBOperation = new DBOperation();

    const photos: string[] = await dbOperation.getArrayUsersPhotoKey(appType);
    const reportPhotos: string[] = await dbOperation.getArrayReportPhotoKey(
      appType,
    );
    const asPhotos: string[] = await dbOperation.getArrayASPhotoKey();
    if (reportPhotos.length) {
      photos.push(...reportPhotos);
    }
    if (asPhotos.length) {
      photos.push(...asPhotos);
    }

    if (photos.length > 0) {
      const items = await axiosClient.loadBinary(photos);
      await savePhotosToLocalDB(items, appType);
    }
  };

  /**
   * Get available staff list.
   *
   * @param serverAddress
   * @param dbName
   */
  export const getAllStaffs = async (serverAddress: string, dbName: string) => {
    const tableName = TableName.Staff;
    const staffs = await axiosClient.getAllStaff(serverAddress, dbName);
    const dbOperation: DBOperation = new DBOperation();
    await dbOperation.insertDbWithJsonDict(tableName, staffs);
    return staffs;
  };

  /**
   * Get available staff group list.
   *
   * @param serverAddress
   * @param dbName
   */
  export const getGroupStaffs = async (
    serverAddress: string,
    dbName: string,
  ) => {
    const tableName = TableName.StaffGroup;
    const groups = await axiosClient.getGroupStaff(serverAddress, dbName);

    const dbOperation: DBOperation = new DBOperation();
    await dbOperation.insertDbWithJsonDict(tableName, groups);
    return groups;
  };

  /**
   * @param serverName
   * @param dbName
   * @param appType
   * @param serviceCode
   */
  export const loadGroups = async (
    serverName: string,
    dbName: string,
    appType: AppType,
    serviceCode: string,
  ) => {
    try {
      const database = await getDBConnection();
      if (database) {
        let license5thChar = await AuthService.getLicenseChar(
          serverName,
          dbName,
        );
        if (license5thChar) {
          const groups = await AuthDB.loadGroupFromDB();
          const newGroup = await AuthDB.fillGroupWithStaff(
            groups,
            appType,
            license5thChar,
            serviceCode,
          );
          if (newGroup) {
            return newGroup;
          }
          return [];
        }
        return [];
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  /**
   * load group filled with staff list
   *
   * @param serverName
   * @param dbName
   * @param appType
   * @param serviceCode
   */
  export const loadGroupFilledWithStaffListByLoginInfo = async (
    serverName: string,
    dbName: string,
    appType: AppType,
    serviceCode: string,
  ) => {
    await getGroupStaffs(serverName, dbName);
    const allStaff = await getAllStaffs(serverName, dbName);

    if (allStaff.length === 0) {
      throw new WrongDatabaseError();
    }

    return await loadGroups(serverName, dbName, appType, serviceCode);
  };

  /**
   * Get placeholder text in login form UI
   *
   * @param config
   */
  export const showPlaceHolderMissingInputText = (
    config?: PlaceholderConfig,
  ) => {
    const {
      serverAddress = '',
      serviceType = '',
      serviceName = '',
      dbName = '',
      staff = null,
      password = '',
    } = config ?? {};

    if (serverAddress === '') {
      return i18n.t('login.ph_connection_setting');
    }
    if (serviceType === '') {
      return i18n.t('login.ph_select_category');
    }
    if (serviceName === '') {
      return i18n.t('login.pleaseSelectService');
    }
    if (dbName === '') {
      return i18n.t('login.ph_demo_database_input');
    }
    if (staff === null) {
      return i18n.t('login.pleaseSelectUser');
    }
    if (password === '') {
      return i18n.t('login.pleaseEnter');
    }
    return '';
  };

  /**
   * Get app type and database name in case of demo login.
   *
   * @params serviceType
   */
  export const getDemoDBNameAndAppType = (serviceName: string) => {
    let dbName;
    let appType;
    switch (serviceName) {
      case '特養':
        dbName = 'FIRSTCAREV7_特養';
        appType = AppType.SHISETSHU;
        break;
      case '老健':
        dbName = 'FIRSTCAREV7_老健';
        appType = AppType.SHISETSHU;
        break;
      case '介護医療院':
        dbName = 'FIRSTCAREV7_医療院';
        appType = AppType.SHISETSHU;
        break;
      case '地域密着特養':
        dbName = 'FIRSTCAREV7_小特';
        appType = AppType.SHISETSHU;
        break;
      case '特定施設':
        dbName = 'FIRSTCAREV7_特定施設';
        appType = AppType.SHISETSHU;
        break;
      case 'グループホーム':
        dbName = 'FIRSTCAREV7_GH';
        appType = AppType.SHISETSHU;
        break;
      case '地域密着特定施設':
        dbName = 'FIRSTCAREV7_地特';
        appType = AppType.SHISETSHU;
        break;
      case '通所介護':
      case '通所リハビリ':
      case '認知症対応型通所介護':
      case '地域密着型通所介護':
        dbName = 'FirstCareV7';
        appType = AppType.TSUSHO;
        break;
      case '高齢者住宅':
      case '訪問介護':
      case '訪問看護':
      case '訪問リハビリ':
      case '福祉用具貸与':
      case '居宅療養管理指導':
      case '夜間対応型訪問介護':
      case '定期巡回・随時対応型':
      case '訪問入浴介護':
        dbName = 'FirstCareV7';
        appType = AppType.JUTAKU;
        break;
      case '小規模多機能':
        dbName = 'FirstCareV7_小規模';
        appType = AppType.TAKINO;
        break;
      case '看護小規模多機能':
        dbName = 'FirstCareV7_看多機';
        appType = AppType.TAKINO;
        break;
      default:
        dbName = '';
        appType = AppType.UNKNOWN;
        break;
    }
    return {dbName, appType};
  };
}
