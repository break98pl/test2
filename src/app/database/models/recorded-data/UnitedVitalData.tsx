import moment from 'moment';

import {DBOperation} from '@modules/operation/operation.service';
import {cUserControls} from '@database/models/functional-model/cUserControls';
import {cBitalData} from './cBitalData';

export enum VitalItemBit {
  VitalNone = 0, //未設定
  VitalPls = 1, //脈拍
  VitalRr = 2, //呼吸
  VitalBph = 3, //血圧高
  VitalBpl = 4, //血圧低
  VitalTmp = 5, //体温
  VitalOx = 6, //酸素
  VitalWeight = 7, //体重
  VitalAll = 8, //全て　メモは含まない
  VitalMemo = 9, //メモ
}

export class UnitedVitalData extends cBitalData {
  //項目別の記録日時
  recDatePls?: Date; //脈拍記録日 //record pulse date
  recDateRr?: Date; //呼吸記録日 //breath record date
  recDateBph?: Date; //血圧高記録日//high blood pressure record date
  recDateBpl?: Date; //血圧低記録日//low blood pressure record date
  recDateTmp?: Date; //体温記録日//temperature record date
  recDateOx?: Date; //酸素記録日//spo2 record date
  recDatePreviousStayInFlag?: Date; //体重記録日//weight record date
  recDateMemo?: Date; //メモ//memo record date
  newestDateOfAll?: Date;

  //最新の記録かどうか
  isNewestPls?: boolean; //脈拍//pulse
  isNewestRr?: boolean; //呼吸//breath
  isNewestBph?: boolean; //血圧高//high blood pressure
  isNewestBpl?: boolean; //血圧低//low blood pressure
  isNewestTmp?: boolean; //体温// temperature
  isNewestOx?: boolean; //体温//spo2
  isNewestWeight?: boolean; //体重
  isNewestMemo?: boolean; //メモ

  readonly isHasUpdated?: boolean;

  //複数日の記録の混合であるかどうか
  isMultipleDate?: boolean;

  settledItem?: VitalItemBit; //記録済み項目//already recorded vital items

  constructor() {
    super();
  }

  initWithCbital(aBital: cBitalData) {
    this.fkKey = aBital.fkKey;
    this.name = aBital.name;
    this.recordTime = aBital.recordTime;
    this.staffCode = aBital.staffCode;
    this.staffName = aBital.staffName;
  }

  getAlphaForItem(itemBit: VitalItemBit) {
    let fltRetalpha = 1.0;
    const recDate = this.recordDateTime();
    let isNewest = true;

    if (!recDate) {
      return fltRetalpha;
    }

    switch (itemBit) {
      case VitalItemBit.VitalPls:
        isNewest = this.isNewestPls;
        break;
      case VitalItemBit.VitalRr:
        isNewest = this.isNewestRr;
        break;
      case VitalItemBit.VitalBph:
        isNewest = this.isNewestBph;
        break;
      case VitalItemBit.VitalBpl:
        isNewest = this.isNewestBpl;
        break;
      case VitalItemBit.VitalTmp:
        isNewest = this.isNewestTmp;
        break;
      case VitalItemBit.VitalOx:
        isNewest = this.isNewestOx;
        break;
      case VitalItemBit.VitalWeight:
        isNewest = this.isNewestWeight;
        break;
      case VitalItemBit.VitalMemo:
        isNewest = this.isNewestMemo;
        break;
      case VitalItemBit.VitalAll:
      case VitalItemBit.VitalNone:
      default:
        isNewest = true;
        break;
    }

    if (!isNewest) {
      fltRetalpha = 0.4;
    }

    return fltRetalpha;
  }

  //cSuperReport　オーバーライド
  //親クラスの未送信判定は、単独のレポートデータを想定しているため、オーバーライドする
  async isUpdate() {
    let blnRet = false;

    const dbLogic: DBOperation = new DBOperation();

    blnRet = await dbLogic.hasNewOrUpdatedRecordWithFkKey(
      this.fkKey,
      'T_日常業務_バイタル',
    );

    return blnRet;
  }

  async hasUpdated() {
    let blnRet = false;

    const dbLogic: DBOperation = new DBOperation();

    blnRet = await dbLogic.hasNewOrUpdatedRecordOnVitalRecordWithFkKey(
      this.fkKey,
      this.newestDateOfAll,
    );

    return blnRet;
  }

  /**
   指定された項目の記録日時から　本日・昨日・一昨日・n日前などの文字列を返す
   @return NSString 本日、昨日..n日前　などの日付表現時列　パラメータが不適切、該当日時がない場合はnilが戻される
   * @param bit
   */
  strRecordDateExpressionFromVitalItemBit(bit: VitalItemBit) {
    let strRet = '';
    let targetDate;

    switch (bit) {
      case VitalItemBit.VitalPls:
        targetDate = this.recDatePls;
        break;
      case VitalItemBit.VitalRr:
        targetDate = this.recDateRr;
        break;
      case VitalItemBit.VitalBph:
        targetDate = this.recDateBph;
        break;
      case VitalItemBit.VitalBpl:
        targetDate = this.recDateBpl;
        break;
      case VitalItemBit.VitalTmp:
        targetDate = this.recDateTmp;
        break;
      case VitalItemBit.VitalOx:
        targetDate = this.recDateOx;
        break;
      case VitalItemBit.VitalWeight:
        targetDate = this.recDatePreviousStayInFlag;
        break;
      case VitalItemBit.VitalMemo:
        targetDate = this.recDateMemo;
        break;
      case VitalItemBit.VitalNone:
      case VitalItemBit.VitalAll:
      default:
        return strRet;
    }
    if (!targetDate) {
      return strRet;
    }

    const control: cUserControls = new cUserControls();
    strRet = control.strDateExpressionFromTodayForDate(targetDate);
    return strRet;
  }

  strRecordTimeFromVitalItemBit(bit: VitalItemBit) {
    let strRet = '';
    let targetDate;

    switch (bit) {
      case VitalItemBit.VitalPls:
        targetDate = this.recDatePls;
        break;
      case VitalItemBit.VitalRr:
        targetDate = this.recDateRr;
        break;
      case VitalItemBit.VitalBph:
        targetDate = this.recDateBph;
        break;
      case VitalItemBit.VitalBpl:
        targetDate = this.recDateBpl;
        break;
      case VitalItemBit.VitalTmp:
        targetDate = this.recDateTmp;
        break;
      case VitalItemBit.VitalOx:
        targetDate = this.recDateOx;
        break;
      case VitalItemBit.VitalWeight:
        targetDate = this.recDatePreviousStayInFlag;
        break;
      case VitalItemBit.VitalMemo:
        targetDate = this.recDateMemo;
        break;
      case VitalItemBit.VitalNone:
      case VitalItemBit.VitalAll:
      default:
        return strRet;
    }
    if (!targetDate) {
      return strRet;
    }

    strRet = moment(targetDate).format('HH:mm');
    return strRet;
  }
}
