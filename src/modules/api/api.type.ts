export interface DatabaseInfo {
  id: number;
  name: string;
}

export interface APIDatabaseInfo extends Omit<DatabaseInfo, 'id'> {}

export interface APIResult<T = any> {
  key: number;
  data: T;
  message: string;
}

export interface BaseResultData<T> {
  ROOT: T;
}

export interface GetDatabaseData {
  ROOT: {
    sysdbreg: APIDatabaseInfo[];
  };
}

export interface GetLicenseData {
  ROOT: {
    K_管理情報: {
      Ver7認証番号: string; // 'BEECK-8092223-023202-193438-135753-999147-001184-279097'
    }[];
  };
}

export interface GetServicesData {
  ROOT: {
    M_登録情報_自社: any[];
  };
}

export interface GetAllStaffData {
  ROOT: {
    M_登録情報_職員: any[];
  };
}

export interface GetGroupStaffData {
  ROOT: {
    T_日常業務_簡易メールグループ: any[];
  };
}
