export class CustomSatelite {
  fkOffice?: string;
  pkSatelite?: string;
  serviceType?: number;
  specialArea?: string;
  appStartDate?: string;
  createDate?: string;
  updateDate?: string;
  updateUser?: string;
  updateKey?: string;
  name?: string;
  division?: string;

  constructor(dict?: {[key: string]: any}) {
    if (dict) {
      this.fkOffice = dict['FK_事業所'] || '';
      this.pkSatelite = dict['PK_サテライト'] || '';
      this.serviceType = dict['サービス種類'] || 0;
      this.specialArea = dict['特別地域加算_算定値'] || '';
      this.appStartDate = dict['適用開始日'] || '';
      this.createDate = dict['レコード作成情報'] || '';
      this.updateUser = dict['更新ユーザー情報'] || '';
      this.updateDate = dict['レコード更新情報'] || '';
      this.updateKey = dict['更新キー'] || '';
      this.name = dict['名称'] || '';
      this.division = dict['地域区分'] || '';
    }
  }

  hontaiObject() {
    // Implement the logic for hontaiObject and return an instance of CustomSateliteObject
    this.pkSatelite = '';
    this.name = '本体';
  }

  static queryStringSatelite(): string {
    // Implement the logic for queryStringSatelite and return a string
    return '';
  }
}
