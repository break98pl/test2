import moment from 'moment';

import {DBOperation} from '@modules/operation/operation.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {TableName} from '@database/type';

export class cExerciseBaseSchedule {
  pkBasePlanNumber?: number;
  fkPlanBase?: number;
  planNumber?: number;
  fkVisitor?: string;
  fkVisitorName?: string;
  startDate?: string;
  endDate?: string;
  assessment?: string;
  note?: string;

  constructor(dict?: {[key: string]: any}) {
    if (dict) {
      this.pkBasePlanNumber = dict['PK_機能訓練計画書_基本'] || 0;
      this.fkPlanBase = dict['FK_計画基準'] || 0;
      this.planNumber = dict['計画書番号'] || 0;
      this.fkVisitor = dict['FK_利用者'] || '';
      this.fkVisitorName = dict['利用者_氏名'] || '';
      this.startDate = dict['開始日'] || '';
      this.endDate = dict['終了日'] || '';
      this.assessment = dict['評価'] || '';
      this.note = dict['特記事項'] || '';
    }
  }

  initWithFkUser(fkUser: string) {
    this.fkVisitor = fkUser;
    this.pkBasePlanNumber = 0;
    this.fkPlanBase = 0;
    this.planNumber = 0;
  }

  getSqlStringForGettingDataFromServerWithUserFK(
    userFK: string,
    listPK: string[],
  ) {
    const control: cUserControls = new cUserControls();

    let sqlString = '';
    const nowDate = new Date();
    const toDate = moment(nowDate).add(
      control.getTermForGettingData1Month(),
      'seconds',
    );
    const fromDate = moment(nowDate).add(
      -control.getTermForGettingData1Month(),
      'seconds',
    );

    const strFromDate = `${fromDate.format('YYYY-MM-DD')} 00:00:00`;
    const strToDate = `${toDate.format('YYYY-MM-DD')} 00:00:00`;

    let userFKCondition = '';
    if (userFK && userFK !== '') {
      userFKCondition = `AND FK_利用者 = '${userFK}' `;
    }

    let pkCondition = '';
    if (listPK && listPK.length > 0) {
      pkCondition = `OR PK_機能訓練計画書_基本 IN (${listPK.join(',')})`;
    }

    sqlString = `
      SELECT レコード削除情報,レコード更新情報,更新キー,更新ユーザー情報,レコード作成情報,PK_機能訓練計画書_基本,FK_計画基準,計画書番号,FK_利用者,利用者_氏名,作成日,作成者,開始日,終了日,初回評価,暫定版として作成,特記事項 
      FROM ${TableName.RehaSchedule} 
      WHERE ((開始日 <= '${strToDate}' AND 終了日 >= '${strFromDate}') ${pkCondition}) AND 
            レコード削除情報 IS NULL
            ${userFKCondition}
    `;

    return sqlString;
  }

  async getSqlStringForGettingDataFromServer(tenantCode = '') {
    const dbLogic: DBOperation = new DBOperation();
    const exerciseBasePlanPK = await dbLogic.getUniqueFkPlanBasesFromReportBase(
      tenantCode ? [tenantCode] : [],
    );

    return this.getSqlStringForGettingDataFromServerWithUserFK(
      tenantCode,
      exerciseBasePlanPK,
    );
  }
}
