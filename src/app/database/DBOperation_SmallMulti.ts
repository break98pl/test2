import {executeSelectQuery, getDBConnection} from './helper';

export class DBOperation_SmallMulti {
  constructor() {}

  async getFK_KeyDistinctByTenantDataTBL() {
    const database = await getDBConnection();
    if (!database) {
      return [];
    }
    const strQuery =
      "SELECT M_利用者_個人.PK_利用者 as pkKey from M_利用者_個人 ORDER BY  (姓_ﾌﾘｶﾞﾅ<'A'),姓_ﾌﾘｶﾞﾅ,(名_ﾌﾘｶﾞﾅ<'A'),名_ﾌﾘｶﾞﾅ ";
    const records = await executeSelectQuery(
      database,
      strQuery,
      'getFK_KeyDistinctByTenantDataTBL',
    );
    return records.map(it => it.pkKey);
  }
}
