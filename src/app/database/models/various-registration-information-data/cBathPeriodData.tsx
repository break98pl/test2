import moment from 'moment';

import {cUserControls} from '@database/models/functional-model/cUserControls';

/**
 * class old name: cNyusyoKikanData
 */
export class cBathPeriodData {
  startDate?: string; //KaisiDate
  endDate?: string; //SyuryoDate
  roomCode?: string; //code
  buildingName?: string; //toumei
  /**
   * buildingCode - touCode has only in shisetsu
   */
  buildingCode?: string; //touCode
  roomName?: string; //heyameisyo
  unitName?: string; //UnitMei
  displayNumber?: string; //hyojiNum
  bedNumber?: string; //bedNum

  constructor() {}

  isBetweenKikan(iDate: Date) {
    const control: cUserControls = new cUserControls();
    const DateKaisi = control.DateFormatterFromString2Date(this.startDate);
    const DateSyuryo = control.DateFormatterFromString2Date(this.endDate);

    if (
      (iDate > DateKaisi && iDate < DateSyuryo) ||
      iDate === DateKaisi ||
      iDate === DateSyuryo
    ) {
      return true;
    }

    return false;
  }

  getFloor() {
    if (this.roomCode.length > 2) {
      return this.roomCode.substr(1, 1);
    }

    return '';
  }

  getStartDate() {
    const control: cUserControls = new cUserControls();
    return control.DateFormatterFromString2Date(this.startDate);
  }

  getEndDate() {
    const control: cUserControls = new cUserControls();
    const dateRet = control.DateFormatterFromString2Date(this.endDate);
    const hours23 = 60 * 60 * 23;
    const minds59 = 60 * 59;
    const secs59 = 59;
    return moment(dateRet)
      .add(hours23 + minds59 + secs59)
      .toDate();
  }
}
