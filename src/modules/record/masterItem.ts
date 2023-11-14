import {images} from '@constants/images';
import {executeSelectQuery, getDBConnection} from '@database/helper';
import {TextListItem} from '@organisms/SelectionList';
import i18n from 'i18next';
export namespace MasterItems {
  /***** Common *****/

  /**
   * Get value by key in dictionary
   * @param dic
   * @param key
   * @param defaultValue
   * @returns
   */
  export const getValueForKey = (dic: any, key: string, defaultValue: any) => {
    return dic[key] === undefined || dic[key] === null
      ? defaultValue
      : dic[key];
  };

  /**
   * Get Master report period list in db
   * @returns
   */
  export const getMasterReportPeriodList = async () => {
    let str = `SELECT 
    レポート掲載期間1,
    レポート掲載期間2,
    レポート掲載期間3 
    FROM M_初期値情報`;
    const database = await getDBConnection();
    const records = await executeSelectQuery(
      database,
      str,
      'getReportPeriodList',
    );
    const convertDayReport = (rawValue: string) => {
      switch (rawValue) {
        case null:
          return '-1';
        case '7':
          return '1 ' + i18n.t('report.week_report');
        case '30':
          return '1 ' + i18n.t('report.month_report');
        default:
          return rawValue + ' ' + i18n.t('report.day_report');
      }
    };
    let field1: string = '';
    let field2: string = '';
    let field3: string = '';
    if (
      records &&
      records.length >= 0 &&
      (records[0]['レポート掲載期間1'] ||
        records[0]['レポート掲載期間2'] ||
        records[0]['レポート掲載期間3'])
    ) {
      field1 = convertDayReport(records[0]['レポート掲載期間1'].toString());
      field2 = convertDayReport(records[0]['レポート掲載期間2'].toString());
      field3 = convertDayReport(records[0]['レポート掲載期間3'].toString());
    }
    const newArr: TextListItem[] = [
      {
        id: '0',
        label: records[0]['レポート掲載期間1']
          ? field1
          : '3 ' + i18n.t('report.day_report'),
        icon: images.reportWarningThreeDay,
      },
      {
        id: '1',
        label: records[0]['レポート掲載期間2']
          ? field2
          : '1 ' + i18n.t('report.week_report'),
        icon: images.reportWarningOneWeek,
      },
      {
        id: '2',
        label: records[0]['レポート掲載期間3']
          ? field3
          : '1 ' + i18n.t('report.month_report'),
        icon: images.reportWarningOneMonth,
      },
      {
        id: 'cancel',
        label: i18n.t('report.remove_choose_report'),
      },
    ];
    return newArr;
  };

  /***** Excretion *****/
  /**
   * Get amount and status of excretion output in db
   * @param type
   * @returns
   */
  export const getMasterExcretionOutputs = async () => {
    const getExcretionOutput = async (type: string) => {
      const strQuery = `SELECT 
      値,
      更新キー 
      FROM M_記録設定_選択項目  
      WHERE レコード削除情報 Is Null AND  項目名 = '${type}' 
      ORDER BY 登録Seq番号 DESC`;
      const database = await getDBConnection();
      const records = await executeSelectQuery(
        database,
        strQuery,
        'getUrineOutput',
      );
      const arrayData: TextListItem[] = [];
      if (records && records.length > 0) {
        records.forEach((record, index) => {
          const urineOutput: TextListItem = {
            id: index.toString(),
            label: getValueForKey(record, '値', ''),
          };
          arrayData.push(urineOutput);
        });
      }
      return arrayData;
    };

    //排尿量 - Urination amount
    const urination_amount = await getExcretionOutput('排泄記録_排尿量');
    //排尿形態 - Urination form
    const urination_form = await getExcretionOutput('排泄記録_排尿形態');
    //排便量 - Defecation amount
    const defecation_amount = await getExcretionOutput('排泄記録_排便量');
    //排便形態 - Defecation form
    const defecation_form = await getExcretionOutput('排泄記録_排便形態');
    //排泄記録_排泄用具 - Excretion tools
    const excretion_tools = await getExcretionOutput('排泄記録_排泄用具');
    return [
      urination_amount,
      urination_form,
      defecation_amount,
      defecation_form,
      excretion_tools,
    ];
  };

  /**
   * Get incontinence type
   * @returns
   */
  export const getMasterIncontinence = (): TextListItem[] => {
    return [
      {
        id: '0',
        label: 'あり',
      },
      {
        id: '1',
        label: 'なし',
      },
      {
        id: '2',
        label: '',
      },
    ];
  };
}
