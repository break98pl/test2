import {executeSelectQuery, getDBConnection} from '@database/helper';
import {cUserData} from '@database/models/various-registration-information-data/cUserData';
import {cDataClass} from '@database/models/cDataClass';
import {AppType} from '@modules/setting/setting.type';
import {DBOperation} from '@modules/operation/operation.service';
import {GroupModel} from '@modules/authentication/auth.type';

export namespace AuthDB {
  export const loadGroupFromDB = async () => {
    try {
      const db = await getDBConnection();
      const queryGroup =
        'select distinct グループ名 from T_日常業務_簡易メールグループ order by rowid;';
      const recordsG = await executeSelectQuery(db, queryGroup, 'loadGroups');
      if (recordsG && Array.isArray(recordsG) && recordsG.length > 0) {
        return recordsG.map(it => it['グループ名']);
      }
      return [];
    } catch (err) {
      console.error('Error at loadGroupFromDB: ', err);
      return [];
    }
  };

  export const loadStaffFromDB = async (conditionStr: string) => {
    try {
      const db = await getDBConnection();
      let strQuery =
        "select * from M_登録情報_職員 m WHERE m.有効フラグ = '1' AND m.レコード削除情報 IS NULL ";
      strQuery = `${strQuery}${conditionStr}`;

      const records = await executeSelectQuery(db, strQuery, 'loadStaff');
      const staffs: cUserData[] = [];
      records.forEach(record => {
        const staffClass: cDataClass[] = [];
        const keys: string[] = Object.keys(record);
        keys.forEach(key => {
          const c: cDataClass = new cDataClass();
          c.KeyName = key;
          c.DataValue = record[key];
          if (record[key]) {
            staffClass.push(c);
          }
        });
        const staff: cUserData = new cUserData();
        staff.getUserData(staffClass);
        staffs.push(staff);
      });
      return staffs;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  export const fillGroupWithStaff = async (
    listGroups: string[],
    appType: AppType,
    license5thChar: string,
    serviceCode = '-1',
  ) => {
    try {
      const db = await getDBConnection();
      const dbOperation = new DBOperation();
      const groups = listGroups;

      const conditionStr =
        appType === AppType.TAKINO
          ? dbOperation.getLoginStaffPermissionConditionForMulti(license5thChar)
          : dbOperation.getLoginStaffPermissionConditionService(serviceCode);

      if (
        (license5thChar === 'X' && serviceCode === '1') ||
        (license5thChar !== 'X' && serviceCode === '2')
      ) {
        const newGroup: GroupModel[] = [];
        newGroup.push({name: '全員', count: 0, staffs: []});

        groups.map(group => {
          newGroup.push({name: group, count: 0, staffs: []});
        });
        return newGroup;
      }
      const staffs = await loadStaffFromDB(conditionStr);
      const newGroup: GroupModel[] = [];
      newGroup.push({name: '全員', count: staffs.length, staffs: staffs});
      await Promise.all(
        groups.map(async group => {
          let strQuery = `select * from M_登録情報_職員 m, T_日常業務_簡易メールグループ t WHERE t.グループ名 = '${group}' AND m.職員コード = t.職員コード AND m.有効フラグ = '1' AND m.レコード削除情報 IS NULL `;
          strQuery = `${strQuery}${conditionStr}`;

          // console.log('qGroup: ', strQuery);

          const recordsGroup = await executeSelectQuery(
            db,
            strQuery,
            'loadGroups',
          );
          // console.log('records staffs of group: ', recordsGroup);

          const staffs: cUserData[] = [];
          recordsGroup.forEach(record => {
            const staffClass: cDataClass[] = [];

            const keys: string[] = Object.keys(record);
            keys.forEach(key => {
              const c: cDataClass = new cDataClass();
              c.KeyName = key;
              c.DataValue = record[key];
              if (record[key]) {
                staffClass.push(c);
              }
            });

            const staff: cUserData = new cUserData();
            staff.getUserData(staffClass);
            staffs.push(staff);
          });
          newGroup.push({
            name: group,
            count: recordsGroup.length,
            staffs: staffs,
          });
        }),
      );
      return newGroup;
    } catch (err) {
      console.error(err);
      return [];
    }
  };
}
