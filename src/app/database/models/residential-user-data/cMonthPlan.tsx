/**
 * Represent schedule data.
 * old name: cYoteiData
 */
export class cMonthPlanData {
  userName: string; // RiyosyaMei
  serviceStartDate: string; // ServiceKaishiNengappi
  serviceEndDate: string; // ServiceSyuryoNengappi

  // TODO: need confirm
  Taisyo_KobetsuKoumoku1_Nyuyoku: string; //Target_Individual item_Bath
  Taisyo_KobetsuKoumoku2_Eiyou: string;
  Taisyo_KobetsuKoumoku3_Kouku: string;
  Taisyo_KobetsuKoumoku4_Kinou: string;

  unInsuranceName: string; //保険外サービス　課金名称
  unInsuranceServiceNo: string; //保険外サービス サービス種類
  unInsuranceIsVisible: number; //保険外サービス 通所日付別で表示するか

  fkSateLite?: string;

  constructor(dict: {[key: string]: any}) {
    this.userName = dict['利用者名'] ? dict['利用者名'] : '';
    this.serviceStartDate = dict['サービス開始日時']
      ? dict['サービス開始日時']
      : '';
    this.serviceEndDate = dict['サービス終了日時']
      ? dict['サービス終了日時']
      : '';

    this.Taisyo_KobetsuKoumoku1_Nyuyoku = dict['対象_個別項目01']
      ? dict['対象_個別項目01']
      : '';
    this.Taisyo_KobetsuKoumoku2_Eiyou = dict['対象_個別項目02']
      ? dict['対象_個別項目02']
      : '';
    this.Taisyo_KobetsuKoumoku3_Kouku = dict['対象_個別項目03']
      ? dict['対象_個別項目03']
      : '';
    this.Taisyo_KobetsuKoumoku4_Kinou = dict['対象_個別項目04']
      ? dict['対象_個別項目04']
      : '';
    this.unInsuranceName = dict['課金名称'] ? dict['課金名称'] : '';
    this.unInsuranceServiceNo = dict['保険外単独専用_サービス種類']
      ? dict['保険外単独専用_サービス種類']
      : '';
    this.unInsuranceIsVisible = dict['通所日付別で表示対象とする']
      ? parseInt(dict['通所日付別で表示対象とする'], 10)
      : 0;
    this.fkSateLite = dict['FK_サテライト'] ? dict['FK_サテライト'] : '';
  }

  getActualWorkingDayData(ad: any[]) {} // GetJissekiData

  // TODO: Need confirm
  getServiceJiknasu() {}
}
