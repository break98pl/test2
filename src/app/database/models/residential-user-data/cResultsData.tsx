import {cSuperReportDataClass} from '../recorded-data/cSuperReportDataClass';

export class cResultsData extends cSuperReportDataClass {
  startTimeOfService: string; // ServiceKaishiNitiji
  endTimeOfService: string; // ServiceSyuryoNitiji
  anItem01?: string;
  unInsuranceName: string;
  unInsuranceServiceNo: string;
  unInsuranceVisible: number;

  dataServiceStartDate?: string;
  dataServiceEndDate?: string;

  fkSateLite?: string;

  targetIndividualItemFourthFeature?: string;

  constructor(dict: {[key: string]: any}) {
    super();
    this.fkKey = dict['FK_利用者'] ? dict['FK_利用者'] : '';
    this.fkSateLite = dict['FK_サテライト'] ? dict['FK_サテライト'] : '';
    this.endTimeOfService = dict['サービス終了日時']
      ? dict['サービス終了日時']
      : '';
    this.startTimeOfService = dict['サービス開始日時']
      ? dict['サービス開始日時']
      : '';
    this.unInsuranceName = dict['課金名称'] ? dict['課金名称'] : '';
    this.unInsuranceServiceNo = dict['保険外単独専用_サービス種類']
      ? dict['保険外単独専用_サービス種類']
      : '';
    this.unInsuranceVisible = dict['通所日付別で表示対象とする']
      ? parseInt(dict['通所日付別で表示対象とする'], 10)
      : 0;
    this.targetIndividualItemFourthFeature = dict['対象_個別項目04']
      ? dict['対象_個別項目04']
      : '';
    const serviceTypeBuff = dict['対象_サービス種類']
      ? dict['対象_サービス種類']
      : '';
    if (serviceTypeBuff !== '') {
      if (serviceTypeBuff.split('.').length > 1) {
        this.serviceType = serviceTypeBuff.split('.')[0];
      }
    }
  }
}
