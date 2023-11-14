import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cDataClass} from '../cDataClass';

/**
 * class old name: cSeigyoTeisuu
 */
export class cVitalControlData {
  mealBreak?: string; //Syokuji_Oyatu
  pulseLow?: string; //Bital_Syokiti_Myakuhaku_Low
  pulseMax?: string; //Bital_Syokiti_Myakuhaku_Max
  breathLow?: string; //Bital_Syokiti_Kokyu_Low
  breathMax?: string; //Bital_Syokiti_Kokyu_Max
  bloodPressureLow?: string; //Bital_Syokiti_Ketuatu_Low
  bloodPressureMax?: string; //Bital_Syokiti_Ketuatu_Max
  temperatureLow?: string; //Bital_Syokiti_Taion_Low
  temperatureMax?: string; //Bital_Syokiti_Taion_Max
  oxygenLow?: string; //Bital_Syokiti_Sanso_Low
  oxygenMax?: string; // Bital_Syokiti_Sanso_Max
  lowBloodPressureLow?: string; //Bital_Syokiti_KetuatuTei_Low
  highBloodMax?: string; //Bital_Syokiti_KetuatuTei_Max
  excretionTool?: string; //Haisetsu_Yougu
  mealTimeBreakFast?: string;
  mealTimeAmSnack?: string;
  mealTimeLunch?: string;
  mealTimePmSnack?: string;
  mealTimeSupper?: string;
  elapsedContentInputMethod?: string; //processReportNaiyoInput
  processElapseSaveHistory?: string;

  /**
   * available for Shisetsu
   */
  nightDutyEndTime?: string;

  reportPeriod1?: string;
  reportPeriod2?: string;
  reportPeriod3?: string;

  constructor() {}

  getDataBaseData(ad: cDataClass[]) {
    const parser: cDataClass = new cDataClass();
    this.mealBreak = parser.getDataValueFromKeyAndTargetArray(
      '食事_おやつ',
      ad,
    );

    this.pulseLow = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_脈拍_適正下限値',
      ad,
    );
    this.pulseMax = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_脈拍_適正上限値',
      ad,
    );

    this.breathLow = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_呼吸_適正下限値',
      ad,
    );
    this.breathMax = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_呼吸_適正上限値',
      ad,
    );

    this.bloodPressureLow = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_血圧_適正下限値',
      ad,
    );
    this.bloodPressureMax = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_血圧_適正上限値',
      ad,
    );

    this.temperatureLow = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_体温_適正下限値',
      ad,
    );
    this.temperatureMax = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_体温_適正上限値',
      ad,
    );

    this.oxygenLow = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_酸素_適正下限値',
      ad,
    );
    this.oxygenMax = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_酸素_適正上限値',
      ad,
    );

    this.lowBloodPressureLow = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_血圧低_適正下限値',
      ad,
    );
    this.highBloodMax = parser.getDataValueFromKeyAndTargetArray(
      'バイタル_初期値_血圧低_適正上限値',
      ad,
    );
  }

  isOverNightDutyNow() {
    const strOnlyDate = moment(new Date()).format('YYYY-MM-DD');
    const control: cUserControls = new cUserControls();
    const datenightDuyEndt = control.DateFormatterFromString2Date(
      `${strOnlyDate} ${this.nightDutyEndTime.split('T')[1]}`,
    );
    const dateNow = new Date();
    if (dateNow > datenightDuyEndt) {
      return true;
    }
    return false;
  }

  getSqlStringForGettingDataFromServer() {
    const strQuery =
      'SELECT M_初期値情報.食事_おやつ,M_初期値情報.バイタル_初期値_脈拍_適正下限値,M_初期値情報.バイタル_初期値_脈拍_適正上限値,M_初期値情報.バイタル_初期値_呼吸_適正下限値,M_初期値情報.バイタル_初期値_呼吸_適正上限値,M_初期値情報.バイタル_初期値_血圧_適正下限値,M_初期値情報.バイタル_初期値_血圧_適正上限値,M_初期値情報.バイタル_初期値_体温_適正下限値,M_初期値情報.バイタル_初期値_体温_適正上限値,M_初期値情報.バイタル_初期値_酸素_適正下限値,M_初期値情報.バイタル_初期値_酸素_適正上限値,M_初期値情報.排泄記録_排泄用具_項目名,M_初期値情報.食事時間_朝食,M_初期値情報.食事時間_amおやつ,M_初期値情報.食事時間_昼食,M_初期値情報.食事時間_pmおやつ,M_初期値情報.食事時間_夕食, M_初期値情報.経過記録_内容_FCP入力方法,M_初期値情報.経過記録_履歴保存,M_初期値情報.バイタル_初期値_血圧低_適正下限値,M_初期値情報.バイタル_初期値_血圧低_適正上限値 夜勤_終了時刻,レポート掲載期間1,レポート掲載期間2,レポート掲載期間3FROM M_初期値情報';
    return strQuery;
  }
}
