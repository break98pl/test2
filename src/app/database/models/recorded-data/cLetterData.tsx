import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cSuperReportDataClass} from './cSuperReportDataClass';
import {TableName} from '@database/type';

export class cLetterData extends cSuperReportDataClass {
  updateScreenId?: string;
  visitorName?: string;
  targetDate?: string;
  note?: string;
  logInUserId?: string;
  logInUserName?: string;

  constructor(dict?: {[key: string]: any}) {
    super();
    if (dict) {
      this.updateKey = dict['更新キー'] ? dict['更新キー'] : '';
      this.updateScreenId = dict['設定画面ID'] ? dict['設定画面ID'] : '';
      this.serviceType = dict['サービス種類'] ? dict['サービス種類'] : '';
      this.fkKey = dict['FK_利用者'] ? dict['FK_利用者'] : '';
      this.visitorName = dict['氏名'] ? dict['氏名'] : '';
      this.targetDate = dict['対象年月日'] ? dict['対象年月日'] : '';
      this.note = dict['内容'] ? dict['内容'] : '';
      this.logInUserId = dict['職員コード'] ? dict['職員コード'] : '';
      this.logInUserName = dict['職員名'] ? dict['職員名'] : '';
      this.newFlag = dict['新規フラグ'] ? dict['新規フラグ'] : '';
      this.updateFlag = dict['変更フラグ'] ? dict['変更フラグ'] : '';
      this.serviceStartTime = dict['サービス開始日時'];
      this.serviceEndTime = dict['サービス終了日時'];
    }
  }

  getQueryNowDeviceDate() {
    const control: cUserControls = new cUserControls();

    const nowDate = new Date();
    const fromDate = moment(nowDate)
      .add(-control.getTermForGettingData(), 'seconds')
      .toDate();

    return `&fromdate=${moment(fromDate).format('YYYY-MM-DD')}&todate=${moment(
      new Date(),
    ).format('YYYY-MM-DD')}`;
  }

  getQueryStringFromUsers(users: string, serviceNo: string, rangeDate: string) {
    const strUsers = users
      .split(',')
      .map(a => `'${a}'`)
      .join(',');

    const strDate = rangeDate.replace('&fromdate=', '').replace('todate=', '');
    const fromDate = strDate.split('&')[0];
    const toDate = strDate.split('&')[1];
    const serviceCodes: string[] = [serviceNo];
    if (serviceNo === '78') {
      serviceCodes.push('15');
    }

    return `
      SELECT 更新キー,設定画面ID,サービス種類,FK_利用者,氏名,対象年月日,内容,職員コード,職員名,サービス開始日時,サービス終了日時
      FROM ${TableName.Letter}
      WHERE FK_利用者 in (${strUsers}) AND
            レコード削除情報 IS NULL AND
            サービス種類 IN (${serviceCodes.map(e => `'${e}'`).join(',')}) AND
            対象年月日 >= '${fromDate}' AND
            対象年月日 <= '${toDate}'
    `;
  }
}
