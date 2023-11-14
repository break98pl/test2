import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import moment from 'moment';

import {
  APIDatabaseInfo,
  APIResult,
  GetAllStaffData,
  GetDatabaseData,
  GetGroupStaffData,
  GetLicenseData,
  GetServicesData,
} from '@modules/api/api.type';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {ASP_DIRECTORY, DATE_FORMAT, DEMO_ADDRESS} from '@constants/constants';
import {APINoInternetError, APITimeoutError} from '@modules/errors/error.type';
import {hasInternet} from '@modules/api/api.utils';
import {TableName} from '@database/type';

const requestTimeout = 1000 * 20;

class AxiosClient {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      headers: {
        'Cache-Control': 'no-cache',
      },
      timeout: requestTimeout,
    });

    this.axios.interceptors.request.use(
      async config => {
        if (await hasInternet()) {
          return config;
        }
        return Promise.reject(new APINoInternetError());
      },
      error => {
        return Promise.reject(error);
      },
    );

    this.axios.interceptors.response.use(
      response => {
        let returnValue: APIResult;
        if (!response.data) {
          returnValue = {
            key: 200,
            data: undefined,
            message: 'NODATA',
          };
        } else if (typeof response.data === 'string') {
          const responseString = response.data;
          returnValue = {
            key: 999,
            data: undefined,
            message: responseString,
          };
        } else {
          returnValue = {
            key: 200,
            data: JSON.parse(response.request.response),
            message: 'OK',
          };
        }
        response.data = returnValue;
        return response.data;
      },
      async error => {
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new APITimeoutError());
        }
        return Promise.reject(error);
      },
    );
  }

  async GetSQLserverData(queryString: string) {
    const {serverName, protocol, dbName} = getReduxStates(
      'authentication',
    ) as AuthState;
    if (!(serverName && protocol && dbName)) {
      throw new Error('[GetSQLServerData] Get config failed');
    }

    const path = `${protocol}://${serverName}/${ASP_DIRECTORY}`;
    const postData = new FormData();
    postData.append('databasename', dbName);
    const uriParams = queryString.split('&');
    if (uriParams.length > 0) {
      uriParams.forEach(param => {
        const values = param.split('=');
        if (values.length === 2) {
          postData.append(values[0], values[1]);
        }
      });
    }

    const config: AxiosRequestConfig = {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    };
    return await this.axios.post(path, postData, config);
  }
  async getAllStaff(serverAddress: string, dbName: string) {
    const tableName = 'M_登録情報_職員';
    const postData = {
      type: 'read',
      case: 'login',
    };
    const config = this.getAxiosConfigType1(serverAddress, dbName, postData);
    const response: APIResult<GetAllStaffData> = await this.axios(config);
    if (
      response.key === 200 &&
      response.data &&
      response.data.ROOT &&
      response.data.ROOT[tableName]
    ) {
      return response.data.ROOT[tableName];
    } else {
      return [];
    }
  }

  async getGroupStaff(serverAddress: string, dbName: string) {
    const postData = {
      type: 'read',
      case: 'group',
    };
    const config = this.getAxiosConfigType1(serverAddress, dbName, postData);
    const response: APIResult<GetGroupStaffData> = await this.axios(config);
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data.ROOT[TableName.StaffGroup]
    ) {
      return response.data.ROOT[TableName.StaffGroup];
    } else {
      return [];
    }
  }

  async doQueryOnSqlServer(strSql: string): Promise<APIResult> {
    const {serverName, protocol, dbName} = getReduxStates(
      'authentication',
    ) as AuthState;
    if (!(serverName && protocol && dbName)) {
      throw new Error('[doQueryOnSqlServer] Get config failed');
    }

    let path = `${protocol}://${serverName}/${ASP_DIRECTORY}`;
    path = `${path}?databasename=${dbName}&type=sqlread`;

    const config: AxiosRequestConfig = {
      headers: {'Content-Type': 'text/json'},
    };

    return await this.axios.post(path, strSql, config);
  }

  // async doQueryOnSqlServerWithDB(
  //   server: string,
  //   dbName: string,
  //   strSql: string,
  // ) {
  //   let path = `${
  //     server === DEMO_ADDRESS ? 'https' : 'http'
  //   }://${server}/${ASP_DIRECTORY}`;
  //   if (dbName) {
  //     path = `${path}?databasename=${dbName}&type=sqlread`;
  //   }
  //
  //   const config: AxiosRequestConfig = {
  //     headers: {'Content-Type': 'text/json'},
  //   };
  //   return await this.axios.post(path, strSql, config);
  // }

  /**
   * Fetch photo data.
   *
   * @param photos list of photo key.
   */
  async loadBinary(photos: string[]) {
    const jsonStr = `[${photos.map(p => `"${p}"`).join(',')}]`;
    const {serverName, protocol, dbName} = getReduxStates(
      'authentication',
    ) as AuthState;
    if (!(serverName && protocol)) {
      throw new Error('[doQueryOnSqlServer] Get config failed');
    }
    let path = `${protocol}://${serverName}/${ASP_DIRECTORY}`;
    if (dbName && dbName !== '') {
      path = `${path}?databasename=${dbName}&type=read&case=binary`;
    }
    const config: AxiosRequestConfig = {
      headers: {'Content-Type': 'text/json'},
    };
    const binaryTable = 'T_バイナリ';
    const response: APIResult = await this.axios.post(path, jsonStr, config);
    if (
      response.key === 200 &&
      response.data &&
      response.data.ROOT &&
      response.data.ROOT[binaryTable]
    ) {
      return response.data.ROOT[binaryTable];
    }
    return [];
  }

  /**
   * Generate request config for api type 1.
   *
   * @param serverAddress
   * @param dbName
   * @param body
   */
  getAxiosConfigType1(
    serverAddress: string,
    dbName = '',
    body: Record<string, any>,
  ): AxiosRequestConfig {
    let baseUrl = `${
      serverAddress === DEMO_ADDRESS ? 'https' : 'http'
    }://${serverAddress}/${ASP_DIRECTORY}`;
    const postData = new FormData();
    if (dbName && dbName !== '') {
      postData.append('databasename', dbName);
    }
    //Add post data
    Object.entries(body).forEach(([key, value]) => {
      postData.append(key, value);
    });
    return {
      method: 'POST',
      url: baseUrl,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: postData,
    };
  }

  /**
   * Generate request config for api type 2.
   *
   * @param serverAddress
   * @param dbName
   * @param sqlQuery
   */
  getAxiosConfigType2(
    serverAddress: string,
    dbName = '',
    sqlQuery = '',
  ): AxiosRequestConfig {
    let baseUrl = `${
      serverAddress === DEMO_ADDRESS ? 'https' : 'http'
    }://${serverAddress}/${ASP_DIRECTORY}`;

    return {
      method: 'POST',
      url: baseUrl,
      headers: {'Content-Type': 'text/json'},
      params: {
        databasename: dbName,
        type: 'sqlread',
      },
      data: sqlQuery,
    };
  }

  /**
   * Get request's config for API type 1.
   *
   * @param params
   */
  getAxiosConfigTypeV1(params: {[key: string]: string}): AxiosRequestConfig {
    const {serverName, protocol, dbName} = getReduxStates(
      'authentication',
    ) as AuthState;
    if (!(serverName && protocol && dbName)) {
      throw new Error('[getAxiosConfigType1] Get config failed');
    }

    let baseUrl = `${protocol}://${serverName}/${ASP_DIRECTORY}`;
    const dataToPost = new FormData();
    dataToPost.append('databasename', dbName);
    Object.keys(params).forEach(key => dataToPost.append(key, params[key]));

    return {
      method: 'POST',
      url: baseUrl,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      data: dataToPost,
    };
  }

  /**
   * Get database list from server.
   *
   * @param serverAddress
   */
  async fetchDatabaseList(serverAddress: string): Promise<APIDatabaseInfo[]> {
    const config = this.getAxiosConfigType2(
      serverAddress,
      'FirstCareV7',
      'select name from master.sys.databases',
    );
    const response: APIResult<GetDatabaseData> = await this.axios(config);
    if (response.key === 200 && response.data?.ROOT?.sysdbreg) {
      return response.data.ROOT.sysdbreg;
    } else {
      return [];
    }
  }

  /**
   * Fetch the license string.
   *
   * @param serverAddress
   * @param dbName
   */
  async fetchLicenseString(
    serverAddress: string,
    dbName: string,
  ): Promise<string | null> {
    const certificationNumber = 'Ver7認証番号';
    const infoManagementTable = TableName.InfoManagement;
    const config = this.getAxiosConfigType2(
      serverAddress,
      dbName,
      `select ${certificationNumber} from ${infoManagementTable}`,
    );
    const response: APIResult<GetLicenseData> = await this.axios(config);

    let licenseString = null;
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data.ROOT[infoManagementTable]
    ) {
      const items: {[certificationNumber]: string}[] =
        response.data.ROOT[infoManagementTable];
      if (items.length > 0 && items[0][certificationNumber]) {
        licenseString = items[0][certificationNumber];
      }
    }
    return licenseString;
  }

  /**
   * Get all services from server by connection information.
   *
   * @param serverAddress
   * @param dbName
   */
  async getServicesByAppType(
    serverAddress: string,
    dbName: string,
  ): Promise<any[]> {
    const config = this.getAxiosConfigType2(
      serverAddress,
      dbName,
      `select * from ${TableName.Company}`,
    );
    const response: APIResult<GetServicesData> = await this.axios(config);
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data?.ROOT[TableName.Company]
    ) {
      return response.data.ROOT[TableName.Company];
    } else {
      return [];
    }
  }

  /**
   * Fetch all rooms from server.
   */
  async fetchRoomList() {
    const config = this.getAxiosConfigTypeV1({
      type: 'read',
      case: 'room',
    });
    const response: APIResult = await this.axios(config);

    const tableName = 'M_登録情報_部屋';
    let rooms = [];
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data.ROOT[tableName]
    ) {
      rooms = response.data.ROOT[tableName];
    }
    return rooms;
  }

  /**
   * Fetch room reservation infos from server.
   *
   * @appType Shisetsu
   */
  async fetchRoomReservations() {
    const config = this.getAxiosConfigTypeV1({
      type: 'read',
      case: 'tenant',
      nowdate: `${moment(new Date()).format(DATE_FORMAT)}`,
      days: 'today',
    });
    const response: APIResult = await this.axios(config);

    const tableName = 'T_施設利用管理_部屋予約';
    let tenants = [];
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data.ROOT[tableName]
    ) {
      tenants = response.data.ROOT[tableName];
    }
    return tenants;
  }

  /**
   * Fetch room reservation infos from server.
   *
   * @appType Jutaku
   */
  async fetchTenants() {
    const config = this.getAxiosConfigTypeV1({
      type: 'read',
      case: 'kyotakuriyosya',
    });
    const response: APIResult = await this.axios(config);

    const tableName = TableName.Tenant;
    let tenants = [];
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data.ROOT[tableName]
    ) {
      tenants = response.data.ROOT[tableName];
    }
    return tenants;
  }

  // async getIsAssignRecord() {
  //   const tableName = 'K_管理情報';
  //   const key = 'アサインPro_最新ダウンロード日時';
  //   const response = await this.doQueryOnSqlServer(
  //     `SELECT * FROM ${tableName}`,
  //   );
  //   if (
  //     response.key === 200 &&
  //     response.data?.ROOT &&
  //     response.data.ROOT[tableName]
  //   ) {
  //     const items: any[] = response.data.ROOT[tableName];
  //     if (items.length > 0) {
  //       const item = items[0];
  //       return !!item[key];
  //     }
  //   }
  //   return false;
  // }

  async getSchedulesForJutaku(startDate: Date, endDate: Date) {
    const tableName = TableName.RoomSchedule;
    const {service} = getReduxStates('authentication') as AuthState;
    const config = this.getAxiosConfigTypeV1({
      type: 'read',
      case: 'residenceterm',
      serviceno: service?.serviceName ?? '',
      fromdate: moment(startDate).format(DATE_FORMAT),
      todate: moment(endDate).format(DATE_FORMAT),
    });

    const response: APIResult = await this.axios(config);
    if (
      response.key === 200 &&
      response.data?.ROOT &&
      response.data.ROOT[tableName]
    ) {
      return response.data.ROOT[tableName];
    }
    return [];
  }
}

export default new AxiosClient();
