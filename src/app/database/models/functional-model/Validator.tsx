import moment from 'moment';

import {
  TABLENAME_MONTHPLAN,
  TABLENAME_MONTHPLAN_UNIT,
  TABLENAME_MONTHRESULT,
  TABLENAME_MONTHRESULT_UNIT,
  TABLENAME_WEEKPLAN,
} from '@constants/constants';
import {AppType, SettingState} from '@modules/setting/setting.type';
import {AdditionalService, cUserControls} from './cUserControls';
import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {TableName} from '@database/type';
import {getUserDefaultKeyMultiService} from '@modules/authentication/auth.utils';

export class Validator {
  constructor() {}

  getQueryStringNyushoDataWithUserCode(userCodeArray: string[], date: Date) {
    const control: cUserControls = new cUserControls();
    const beginDate = control.GetIntervalBeginDateFromDate(date);

    const currentDateStr = `${moment(date).format('YYYY/MM/DD')} 23:59:59`;
    const beginDateStr = `${moment(beginDate).format('YYYY/MM/DD')} 00:00:00`;

    let conditionTempString = '';
    let userConditionString = '';
    if (userCodeArray && userCodeArray.length > 0) {
      userCodeArray.forEach(userCode => {
        conditionTempString = `${conditionTempString}'${userCode}',`;
      });
      userConditionString = `AND T_施設利用管理_部屋予約.FK_利用者 IN (${conditionTempString.substr(
        0,
        conditionTempString.length - 1,
      )})`;
    }

    return `SELECT T_施設利用管理_部屋予約.更新キー AS 更新キー , T_施設利用管理_部屋予約.FK_利用者, T_施設利用管理_部屋予約.FK_部屋コード, T_施設利用管理_部屋予約.開始日, T_施設利用管理_部屋予約.終了日 FROM T_施設利用管理_部屋予約 LEFT JOIN M_利用者_個人 ON T_施設利用管理_部屋予約.FK_利用者 = M_利用者_個人.PK_利用者 LEFT JOIN T_バイナリ ON M_利用者_個人.写真データKey = T_バイナリ.キー LEFT JOIN M_登録情報_部屋 ON LEFT(T_施設利用管理_部屋予約.FK_部屋コード, 8) = M_登録情報_部屋.コード WHERE T_施設利用管理_部屋予約.予約確定フラグ = 1 AND T_施設利用管理_部屋予約.開始日 <= '${currentDateStr}' AND T_施設利用管理_部屋予約.終了日 >= '${beginDateStr}' AND T_施設利用管理_部屋予約.レコード削除情報 IS NULL AND M_登録情報_部屋.レコード削除情報 IS NULL ${userConditionString}`;
  }

  getQueryStringUserDataWithUserCode(userCodeArray: string[]) {
    let conditionTempString = '';
    let userConditionString = '';
    if (userCodeArray && userCodeArray.length > 0) {
      userCodeArray.forEach(userCode => {
        conditionTempString = `${conditionTempString}'${userCode}',`;
      });
      userConditionString = `AND PK_利用者 IN (${conditionTempString.substr(
        0,
        conditionTempString.length - 1,
      )})`;
    }
    return `SELECT  名,薬局_TEL,サービス計画書_支援経過_回数,連絡先1_郵便番号,報告連絡_回数,名_16進文字列,引落とし銀行番号,引落とし銀行名,注意事項_回数,性別,住所_郵便番号,認定調査_最新作成番号,主治医_氏名,認定の有効期間_終了,歯科医_都道府県,名_ﾌﾘｶﾞﾅ,支払方法,主治医_住所,主治医_TEL,口座振替_開始日,預金者名,姓,リハビリ計画_最新作成番号,住所_都道府県,認定の有効期間_開始,会議要点_最新作成日,主治医_都道府県,連絡先1_氏名,歯科医_市区町村,主治医意見書_最新作成番号,引落とし銀行支店名,歯科医_FAX,家族図,引落とし銀行支店番号,要介護状態区分等,報告連絡_最新作成日,薬局_郵便番号,姓_16進文字列,有効フラグ,サービス計画書_最新作成番号,姓_ﾌﾘｶﾞﾅ,引落とし銀行名_カナ,連絡先1_FAX,世帯類型,連絡先1_市区町村,預金科目,入所前の状況,会議要点_回数,リハビリ計画_最終更新日,歯科医_病院名,主治医_市区町村,薬局_FAX,連絡先1_TEL,預金者名_カナ,新規コード,連絡先1_関係,歯科医_郵便番号,薬局_都道府県,サービス計画書_支援経過_最終更新日,備考,連絡先1_携帯,生年月日,認定調査_最新作成日,独居高齢者,主治医意見書_最新作成日,被保険者番号,歯科医_科名,連絡先1_住所,施設入所_年月日,保険者番号,サービス計画書_最新作成日,住所_市区町村,口座番号,歯科医_TEL,住所_その他,主治医_郵便番号,申請区分,PK_利用者,更新ユーザー情報,引落とし銀行支店名_カナ,主治医_科名,主治医_FAX,レコード作成情報,写真データKey,薬局_住所,レコード更新情報,薬局_薬局名,連絡先1_都道府県,歯科医_氏名,注意事項_最新作成日,更新キー,連絡先1_EMail,主治医_病院名,歯科医_住所,薬局_市区町村,電話番号,連絡先2_FAX,簡易アセスメント_最新作成番号,連絡先3_FAX,包括的自立支援プログラム_最新作成番号,連絡先2_市区町村,連絡先2_EMail,連絡先2_住所,連絡先3_EMail,連絡先2_携帯,連絡先3_郵便番号,連絡先3_住所,連絡先3_携帯,連絡先2_都道府県,包括的自立支援プログラム_最終更新日,連絡先2_TEL,連絡先2_関係,連絡先3_関係,連絡先3_TEL,連絡先3_市区町村,簡易アセスメント_最新作成日,連絡先2_郵便番号,連絡先2_氏名,連絡先3_都道府県,連絡先3_氏名,医療情報3_都道府県,医療情報3_市区町村,医療情報3_郵便番号,医療情報3_病院名,医療情報3_TEL,医療情報3_住所,医療情報3_FAX,EMail,薬局_担当者名,携帯番号,FAX番号,医療情報3_科名,住居の状況,住居周辺の状況,医療情報3_氏名 FROM M_利用者_個人 WHERE レコード削除情報 IS NULL ${userConditionString}`;
  }

  getQueryStringRoomData() {
    return 'SELECT レコード更新情報,更新キー,有効フラグ,コード,居住区分,表示用通番,ベッド区分1,ベッド区分2,ベッド区分3,ベッド区分4,人数,家賃,棟コード,棟名,部屋名称,備考,更新ユーザー情報,レコード作成情報 FROM M_登録情報_部屋 WHERE レコード削除情報 IS NULL';
  }

  getQueryStringBinaryDataWithUserCode(userCodeArray: string[]) {
    let conditionTempString = '';
    let userConditionString = '';
    if (userCodeArray && userCodeArray.length > 0) {
      userCodeArray.forEach(userCode => {
        conditionTempString = `${conditionTempString}'${userCode}',`;
      });
      userConditionString = `AND PK_利用者 IN (${conditionTempString.substr(
        0,
        conditionTempString.length - 1,
      )})`;
    }
    return `SELECT T_バイナリ.キー, T_バイナリ.レコード更新情報, T_バイナリ.レコード作成情報, T_バイナリ.更新キー FROM M_利用者_個人 INNER JOIN T_バイナリ ON  M_利用者_個人.写真データKey = T_バイナリ.キー WHERE T_バイナリ.レコード削除情報 IS NULL AND M_利用者_個人.レコード削除情報 IS NULL ${userConditionString}`;
  }

  getHolidayDataQueryString() {
    return "SELECT レコード更新情報,更新キー,年月日,コメント,更新ユーザー情報,レコード作成情報 FROM M_登録情報_祝祭日 WHERE レコード削除情報 IS NULL OR レコード削除情報 = ''";
  }

  columnForMonthPlan() {
    return [
      'FK_利用者',
      '利用者名',
      'サービス開始日時',
      'サービス終了日時',
      '対象_サービス種類',
      '対象_個別項目01',
      '対象_個別項目02',
      '対象_個別項目03',
      '対象_個別項目04',
      'FK_サテライト',
    ];
  }

  columnForMonthResult() {
    return [
      'レコード削除情報',
      'レコード更新情報',
      '更新キー',
      'PK_実績_居宅月間',
      'FK_実績_メイン',
      'FK_サービス事業所',
      'FK_利用者',
      'サービス開始日時',
      'サービス終了日時',
      '対象_サービス種類',
      '対象_個別項目01',
      '対象_個別項目04',
      'FK_サテライト',
    ];
  }

  columnForWeekPlan() {
    return [
      'FK_利用者',
      '対象_曜日',
      '対象_サービス種類',
      'サービス開始日時',
      'サービス終了日時',
      'FK_プラン_メイン',
      'レコード更新情報',
      '更新キー',
      '更新ユーザー情報',
      'レコード作成情報',
      'FK_サテライト',
    ];
  }

  columnForMonthPlanUnit() {
    return [
      'PK_プラン_メイン',
      'FK_利用者',
      'ケアプラン_対象年月',
      'ケアプラン_担当者コード',
      'ケアプラン_専門員番号',
      'ケアプラン_担当者名',
      'ケアプラン_状態',
      '対象_14_退院日',
      '対象_16_退院日',
      '対象_64_退院日',
      '最終確定日時',
    ];
  }

  fieldNameByMyCompanyServiceNumYobouWithServieNo(serviceNo: number) {
    switch (serviceNo) {
      case 15:
        return 65;
      case 16:
        return 66;
      case 72:
        return 74;
      case 73: //小規模
        return 75;
      case 68: //小規模　短期
        return 69;
      case 78:
        return 65;
    }
    return serviceNo;
  }

  carePlanTargetMonthWithBasisDate(basisDate: Date) {
    return moment(basisDate).format('YYYYMM');
  }

  carePlanTargetPrevMonthWithBasisDate(basisDate: Date) {
    const prevMonth = moment(basisDate).add(-1, 'month').toDate();
    return this.carePlanTargetMonthWithBasisDate(prevMonth);
  }

  carePlanTargetNextMonthWithBasisDate(basisDate: Date) {
    const nextMonth = moment(basisDate).add(1, 'month').toDate();
    return this.carePlanTargetMonthWithBasisDate(nextMonth);
  }

  //取得期間の開始-サービス開始年月日
  makeQueryDateRangeFirstWithBasisDate(basisDate: Date) {
    const control: cUserControls = new cUserControls();
    return `${control
      .GetIntervalBeginDateFromDate(basisDate)
      .format('YYYY-MM-DD')}T00:00:00`;
  }
  //取得期間の終わり-サービス終了年月日
  makeQueryDateRangeLastWithBasisDate(basisDate: Date) {
    const control: cUserControls = new cUserControls();
    return `${control
      .GetIntervalEndDateFromDate(basisDate)
      .format('YYYY-MM-DD')}T23:59:59`;
  }

  makeQueryJoinMyCompanyDataWithTableName(
    tableName: string,
    serviceNo: number,
  ) {
    const {additionalServices} = getReduxStates('setting') as SettingState;
    let query = ` INNER JOIN ${TableName.Company} on ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_PK_事業所_${serviceNo}`;

    if (serviceNo === 15 || serviceNo === 78) {
      if (
        additionalServices.includes(AdditionalService.ADDITIONAL_SERVICE_A5)
      ) {
        query = `${query} OR ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_PK_事業所_A5`;
      }

      if (
        additionalServices.includes(AdditionalService.ADDITIONAL_SERVICE_A6)
      ) {
        query = `${query} OR ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_PK_事業所_A6`;
      }

      if (
        additionalServices.includes(AdditionalService.ADDITIONAL_SERVICE_A7)
      ) {
        query = `${query} OR ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_PK_事業所_A7`;
      }

      if (
        additionalServices.includes(AdditionalService.ADDITIONAL_SERVICE_A8)
      ) {
        query = `${query} OR ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_PK_事業所_A8`;
      }
    }

    query = `${query} OR ${tableName}.FK_サービス事業所 = ${
      TableName.Company
    }.自己_PK_事業所_${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
      serviceNo,
    )}`;

    return query;
  }

  makeQueryJoinMyCompanyDataWithTableNameHoldServiceNo(tableName: string) {
    return ` INNER JOIN ${TableName.Company} on ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_PK_事業所_99 OR ${tableName}.FK_サービス事業所 = ${TableName.Company}.自己_事業所番号_99`;
  }

  makeQueryServieOfferTimeWithTableName(
    tableName: string,
    basisDate: Date,
    toDate: Date | null,
  ) {
    let query: string;
    query = `'${this.makeQueryDateRangeFirstWithBasisDate(basisDate)}'`;

    query = `${query} <= ${tableName}.サービス開始日時 AND ${tableName}.サービス終了日時 <= `;
    if (!toDate) {
      query = `${query}'${this.makeQueryDateRangeLastWithBasisDate(
        basisDate,
      )}'`;
    } else {
      query = `${query}'${this.makeQueryDateRangeLastWithBasisDate(toDate)}'`;
    }
    return query;
  }

  makeQueryColumWithTableName(tableName: string, columns: string[]) {
    return `${columns.map(c => `${tableName}.${c}`).join(',')}`;
  }

  sqlQueryForMonthPlanWithBasisDate(
    basisDate: Date,
    serviceNo: number,
    toDate: Date | null,
    tenantCodes: string[] = [],
  ) {
    const {appType} = getReduxStates('authentication') as AuthState;
    const {additionalServices} = getReduxStates('setting') as SettingState;
    const userDefaultKeyMultiService = getUserDefaultKeyMultiService();

    if (appType === AppType.TSUSHO) {
      let query = 'SELECT ';
      query = `${query} ${this.makeQueryColumWithTableName(
        TABLENAME_MONTHPLAN,
        this.columnForMonthPlan(),
      )}`;

      //保険外サービス
      query = `${query} ,${TableName.UnInsurance}.課金名称, ${TableName.UnInsurance}.保険外単独専用_サービス種類, ${TableName.UnInsurance}.通所日付別で表示対象とする FROM ${TABLENAME_MONTHPLAN} LEFT JOIN ${TABLENAME_MONTHPLAN_UNIT} ON ${TABLENAME_MONTHPLAN}.FK_プラン_メイン = ${TABLENAME_MONTHPLAN_UNIT}.PK_プラン_メイン`;

      //M_登録情報_自社
      query = `${query} ${this.makeQueryJoinMyCompanyDataWithTableName(
        TABLENAME_MONTHPLAN,
        serviceNo,
      )}`;

      //保険外サービスの条件も付加する
      query = `${query} OR (${TABLENAME_MONTHPLAN}.対象_サービス種類 LIKE '99%' AND ${TABLENAME_MONTHPLAN}.FK_サービス事業所 = M_登録情報_自社.自己_PK_事業所_99)`;
      //保険外サービス

      query = `${query} LEFT JOIN ${TableName.UnInsurance} ON ${TABLENAME_MONTHPLAN}.対象_サービスコード = ${TableName.UnInsurance}.課金コード`;

      query = `${query} AND ${TableName.UnInsurance}.通所日付別で表示対象とする = 1 AND ${TableName.UnInsurance}.有効フラグ = 1 AND ${TableName.UnInsurance}.レコード削除情報 IS NULL`;

      query = `${query} Where ${TABLENAME_MONTHPLAN}.レコード削除情報 IS NULL AND ${TABLENAME_MONTHPLAN_UNIT}.レコード削除情報 IS NULL AND (${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '確定' OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '暫定')`;

      query = `${query} AND (${TABLENAME_MONTHPLAN}.対象_サービス種類 Like '${serviceNo}%'`;

      if (serviceNo === 15 || serviceNo === 78) {
        const listAdditionalServices = ['A5', 'A6', 'A7', 'A8'];
        listAdditionalServices.forEach(service => {
          if (additionalServices.includes(service)) {
            query += ' OR ';
            query += `${TABLENAME_MONTHPLAN}.対象_サービス種類 LIKE '${service}%'`;
          }
        });
      }
      query = `${query} OR ${TABLENAME_MONTHPLAN}.対象_サービス種類 Like '${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
        serviceNo,
      )}%'`;

      //保険外サービスの条件もつなぐ
      query = `${query} OR (${TABLENAME_MONTHPLAN}.対象_サービス種類 Like '99%' AND `;
      if (serviceNo === 78) {
        query = `${query} (${TableName.UnInsurance}.保険外単独専用_サービス種類 Like '15%' OR `;
      }
      query = `${query} ${TableName.UnInsurance}.保険外単独専用_サービス種類 Like '${serviceNo}%'`;
      if (serviceNo === 78) {
        query = `${query})`;
      }
      query = `${query})) AND (${this.makeQueryServieOfferTimeWithTableName(
        TABLENAME_MONTHPLAN,
        basisDate,
        toDate,
      )})`;
      return query;
    } else if (appType === AppType.TAKINO) {
      let query = 'Select ';
      query = `${query} ${this.columnForMonthPlan()
        .map(c => `${TABLENAME_MONTHPLAN}.${c}`)
        .join(',')}`;

      query = `${query} from ${TABLENAME_MONTHPLAN} left join ${TABLENAME_MONTHPLAN_UNIT} on ${TABLENAME_MONTHPLAN}.FK_プラン_メイン = ${TABLENAME_MONTHPLAN_UNIT}.PK_プラン_メイン `;
      query = `${query} ${this.makeQueryJoinMyCompanyDataWithTableName(
        TABLENAME_MONTHPLAN,
        serviceNo,
      )}`;
      query = `${query} where ${TABLENAME_MONTHPLAN}.レコード削除情報 IS NULL AND ${TABLENAME_MONTHPLAN_UNIT}.レコード削除情報 IS NULL AND (${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '確定' OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '暫定') `;
      query = `${query} AND (${TABLENAME_MONTHPLAN}.対象_サービス種類 Like '${serviceNo}%'`;

      const iskantaki = userDefaultKeyMultiService === '2';
      if (!iskantaki) {
        query = `${query} OR ${TABLENAME_MONTHPLAN}.対象_サービス種類 Like '${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
          serviceNo,
        )}%'`;
      }

      query = `${query}) AND (${this.makeQueryServieOfferTimeWithTableName(
        TABLENAME_MONTHPLAN,
        basisDate,
        toDate,
      )})`;

      if (tenantCodes.length > 0) {
        query = `${query} AND ${
          TableName.MonthlyPlan
        }.FK_利用者 IN (${tenantCodes.map(e => `'${e}'`).join(',')})`;
      }

      return query;
    } else {
      return '';
    }
  }

  sqlQueryForWeekPlanWithBasisDate(basisDate: Date, serviceNo: number) {
    const {appType} = getReduxStates('authentication') as AuthState;
    const {additionalServices} = getReduxStates('setting') as SettingState;
    if (appType === AppType.TSUSHO) {
      let query = 'SELECT ';
      const weekPlanQuery = this.makeQueryColumWithTableName(
        TABLENAME_WEEKPLAN,
        this.columnForWeekPlan(),
      );
      const planunitQuery = this.makeQueryColumWithTableName(
        TABLENAME_MONTHPLAN_UNIT,
        this.columnForMonthPlanUnit(),
      );

      query = `${query}${weekPlanQuery},${planunitQuery}`;

      //保険外サービス
      query = `${query},${TableName.UnInsurance}.課金名称,${TableName.UnInsurance}.保険外単独専用_サービス種類,${TableName.UnInsurance}.通所日付別で表示対象とする FROM ${TABLENAME_WEEKPLAN}`;
      query = `${query} LEFT JOIN ${TABLENAME_MONTHPLAN_UNIT} ON ${TABLENAME_WEEKPLAN}.FK_プラン_メイン = ${TABLENAME_MONTHPLAN_UNIT}.PK_プラン_メイン`;
      //M_登録情報_自社
      query = `${query} ${this.makeQueryJoinMyCompanyDataWithTableName(
        TABLENAME_WEEKPLAN,
        serviceNo,
      )}`;
      //保険外サービスの条件も付加する
      query = `${query} OR (${TABLENAME_WEEKPLAN}.対象_サービス種類 LIKE '99%' AND ${TABLENAME_WEEKPLAN}.FK_サービス事業所 = M_登録情報_自社.自己_PK_事業所_99)`;
      //保険外サービス
      query = `${query} LEFT JOIN ${TableName.UnInsurance} ON ${TABLENAME_WEEKPLAN}.対象_サービスコード = ${TableName.UnInsurance}.課金コード`;
      query = `${query} AND ${TableName.UnInsurance}.通所日付別で表示対象とする = 1 AND ${TableName.UnInsurance}.有効フラグ = 1 AND ${TableName.UnInsurance}.レコード削除情報 IS NULL`;
      query = `${query} WHERE ${TABLENAME_WEEKPLAN}.レコード削除情報 IS NULL AND ${TABLENAME_MONTHPLAN_UNIT}.レコード削除情報 IS NULL AND `;
      query = `${query}(${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '確定' OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '暫定')`;
      query = `${query} AND (${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_対象年月 = '${this.carePlanTargetMonthWithBasisDate(
        basisDate,
      )}'`;
      query = `${query} OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_対象年月 = '${this.carePlanTargetPrevMonthWithBasisDate(
        basisDate,
      )}'`;
      query = `${query} OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_対象年月 = '${this.carePlanTargetNextMonthWithBasisDate(
        basisDate,
      )}')`;
      query = `${query} AND (${TABLENAME_WEEKPLAN}.対象_サービス種類 Like '${serviceNo}%'`;
      if (serviceNo === 15 || serviceNo === 78) {
        const listAdditionalServices = ['A5', 'A6', 'A7', 'A8'];
        listAdditionalServices.forEach(service => {
          if (additionalServices.includes(service)) {
            query += ' OR ';
            query += `${TABLENAME_WEEKPLAN}.対象_サービス種類 LIKE '${service}%'`;
          }
        });
      }

      query = `${query} OR ${TABLENAME_WEEKPLAN}.対象_サービス種類 Like '${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
        serviceNo,
      )}%'`;
      //保険外サービス
      query = `${query} OR (${TABLENAME_WEEKPLAN}.対象_サービス種類 Like '99%' AND `;
      if (serviceNo === 78) {
        query = `${query}(${TableName.UnInsurance}.保険外単独専用_サービス種類 Like '15%' OR `;
      }
      query = `${query}${TableName.UnInsurance}.保険外単独専用_サービス種類 Like '${serviceNo}%' `;
      if (serviceNo === 78) {
        query = `${query})`;
      }
      query = `${query}))`;
      return query;
    } else if (appType === AppType.TAKINO) {
      let query = 'Select ';

      const weekPlanQuery = this.makeQueryColumWithTableName(
        TABLENAME_WEEKPLAN,
        this.columnForWeekPlan(),
      );
      const planunitQuery = this.makeQueryColumWithTableName(
        TABLENAME_MONTHPLAN_UNIT,
        this.columnForMonthPlanUnit(),
      );
      query = `${query} ${weekPlanQuery},${planunitQuery} from ${TABLENAME_WEEKPLAN} left join ${TABLENAME_MONTHPLAN_UNIT} on ${TABLENAME_WEEKPLAN}.FK_プラン_メイン = ${TABLENAME_MONTHPLAN_UNIT}.PK_プラン_メイン`;
      query = `${query} ${this.makeQueryJoinMyCompanyDataWithTableName(
        TABLENAME_WEEKPLAN,
        serviceNo,
      )}`;
      query = `${query} where ${TABLENAME_WEEKPLAN}.レコード削除情報 IS NULL AND ${TABLENAME_MONTHPLAN_UNIT}.レコード削除情報 IS NULL AND (${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '確定' OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_状態 = '暫定')`;
      query = `${query} AND (${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_対象年月 = '${this.carePlanTargetMonthWithBasisDate(
        basisDate,
      )}' OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_対象年月 = '${this.carePlanTargetPrevMonthWithBasisDate(
        basisDate,
      )}' OR ${TABLENAME_MONTHPLAN_UNIT}.ケアプラン_対象年月 = '${this.carePlanTargetNextMonthWithBasisDate(
        basisDate,
      )}')`;
      query = `${query} AND (${TABLENAME_WEEKPLAN}.対象_サービス種類 Like '${serviceNo}%' OR ${TABLENAME_WEEKPLAN}.対象_サービス種類 Like '${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
        serviceNo,
      )}%')`;

      return query;
    } else {
      return '';
    }
  }

  sqlQueryForMonthResultsWithBasisDate(
    basisDate: Date,
    serviceNo: number,
    toDate: Date | null,
    tenantCodes: string[] = [],
  ) {
    const {appType} = getReduxStates('authentication') as AuthState;
    const {additionalServices} = getReduxStates('setting') as SettingState;
    const userDefaultKeyMultiService = getUserDefaultKeyMultiService();

    if (appType === AppType.TSUSHO) {
      let query = 'SELECT ';
      query = `${query}${this.makeQueryColumWithTableName(
        TABLENAME_MONTHRESULT,
        this.columnForMonthResult(),
      )}`;
      //保険外サービス
      query = `${query},${TableName.UnInsurance}.課金名称,${TableName.UnInsurance}.保険外単独専用_サービス種類,${TableName.UnInsurance}.通所日付別で表示対象とする FROM ${TABLENAME_MONTHRESULT}`;
      query = `${query} LEFT JOIN ${TABLENAME_MONTHRESULT_UNIT} ON ${TABLENAME_MONTHRESULT}.FK_実績_メイン = ${TABLENAME_MONTHRESULT_UNIT}.PK_実績_メイン`;
      //M_登録情報_自社
      query = `${query} ${this.makeQueryJoinMyCompanyDataWithTableName(
        TABLENAME_MONTHRESULT,
        serviceNo,
      )}`;
      //保険外サービスの条件も付加する
      query = `${query} OR (${TABLENAME_MONTHRESULT}.対象_サービス種類 LIKE '99%' AND ${TABLENAME_MONTHRESULT}.FK_サービス事業所 = M_登録情報_自社.自己_PK_事業所_99) `;
      //保険外サービスのマスタをつなぐ
      query = `${query} LEFT JOIN ${TableName.UnInsurance} ON ${TABLENAME_MONTHRESULT}.対象_サービスコード = ${TableName.UnInsurance}.課金コード`;
      query = `${query} AND ${TableName.UnInsurance}.通所日付別で表示対象とする = 1 AND ${TableName.UnInsurance}.有効フラグ = 1`;
      query = `${query} AND ${TableName.UnInsurance}.レコード削除情報 IS NULL`;
      query = `${query} WHERE ${TABLENAME_MONTHRESULT}.レコード削除情報 IS NULL AND ${TABLENAME_MONTHRESULT_UNIT}.レコード削除情報 IS NULL AND (${TABLENAME_MONTHRESULT}.対象_サービス種類 Like '${serviceNo}%'`;
      if (serviceNo === 15 || serviceNo === 78) {
        const listAdditionalServices = ['A5', 'A6', 'A7', 'A8'];
        listAdditionalServices.forEach(service => {
          if (additionalServices.includes(service)) {
            query += ' OR ';
            query += `${TABLENAME_MONTHRESULT}.対象_サービス種類 LIKE '${service}%'`;
          }
        });
      }

      query = `${query} OR ${TABLENAME_MONTHRESULT}.対象_サービス種類 Like '${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
        serviceNo,
      )}%'`;
      //保険外サービスの条件もつなぐ
      query = `${query} OR (${TABLENAME_MONTHRESULT}.対象_サービス種類 Like '99%' AND `;
      if (serviceNo === 78) {
        query = `${query}(${TableName.UnInsurance}.保険外単独専用_サービス種類 Like '15%' OR `;
      }
      query = `${query} ${TableName.UnInsurance}.保険外単独専用_サービス種類 Like '${serviceNo}%'`;
      if (serviceNo === 78) {
        query = `${query})`;
      }
      query = `${query})) AND (${this.makeQueryServieOfferTimeWithTableName(
        TABLENAME_MONTHRESULT,
        basisDate,
        toDate,
      )})`;

      return query;
    } else if (appType === AppType.TAKINO) {
      let query = 'Select ';

      query = `${query}${this.makeQueryColumWithTableName(
        TABLENAME_MONTHRESULT,
        this.columnForMonthResult(),
      )}`;
      query = `${query} from ${TABLENAME_MONTHRESULT} left join ${TABLENAME_MONTHRESULT_UNIT} on ${TABLENAME_MONTHRESULT}.FK_実績_メイン = ${TABLENAME_MONTHRESULT_UNIT}.PK_実績_メイン`;
      query = `${query} ${this.makeQueryJoinMyCompanyDataWithTableName(
        TABLENAME_MONTHRESULT,
        serviceNo,
      )}`;
      query = `${query} Where ${TABLENAME_MONTHRESULT}.レコード削除情報 IS NULL AND ${TABLENAME_MONTHRESULT_UNIT}.レコード削除情報 IS NULL AND (${TABLENAME_MONTHRESULT}.対象_サービス種類 Like '${serviceNo}%'`;

      const iskantaki = userDefaultKeyMultiService === '2';
      if (!iskantaki) {
        query = `${query} Or ${TABLENAME_MONTHRESULT}.対象_サービス種類 Like '${this.fieldNameByMyCompanyServiceNumYobouWithServieNo(
          serviceNo,
        )}%'`;
      }

      query = `${query}) AND (${this.makeQueryServieOfferTimeWithTableName(
        TABLENAME_MONTHRESULT,
        basisDate,
        toDate,
      )})`;

      if (tenantCodes.length > 0) {
        query = `${query} AND ${
          TableName.MonthlyResult
        }.FK_利用者 IN (${tenantCodes.map(e => `'${e}'`).join(',')})`;
      }

      return query;
    } else {
      return '';
    }
  }
}
