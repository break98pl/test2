import {cSuperReportDataClass} from '../recorded-data/cSuperReportDataClass';

export class cDataWeekPlan extends cSuperReportDataClass {
  weekdayTarget: string; // TaisyoYoubi
  startDateOfService: string; // ServiceKaishiNitiji
  endDateOfService: string; // ServiceSyuryoNitiji
  carePlanTargetDate: string; // CarePlanTasiyoNengetsu
  planMain?: string;

  unInsuranceName: string;
  unInsuranceServiceNo: string;
  unInsuranceIsVisible: number;
  serviceStartDate?: string;
  serviceEndDate?: string;

  fkSateLite?: string;

  constructor(dict: {[key: string]: any}) {
    super();
    this.fkSateLite = dict['FK_サテライト'] ? dict['FK_サテライト'] : '';
    this.fkKey = dict['FK_利用者'] ? dict['FK_利用者'] : '';
    this.weekdayTarget = dict['対象_曜日'] ? dict['対象_曜日'] : '';
    this.startDateOfService = dict['サービス開始日時']
      ? dict['サービス開始日時']
      : '';
    this.endDateOfService = dict['サービス終了日時']
      ? dict['サービス終了日時']
      : '';
    this.unInsuranceName = dict['課金名称'] ? dict['課金名称'] : '';
    this.unInsuranceServiceNo = dict['保険外単独専用_サービス種類']
      ? dict['保険外単独専用_サービス種類']
      : '';
    this.unInsuranceIsVisible = dict['通所日付別で表示対象とする']
      ? parseInt(dict['通所日付別で表示対象とする'], 10)
      : 0;
    this.carePlanTargetDate = dict['ケアプラン_対象年月']
      ? dict['ケアプラン_対象年月']
      : '';
  }
}
