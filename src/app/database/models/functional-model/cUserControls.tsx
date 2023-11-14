/* eslint no-bitwise: 0 */
import Color from 'color';
import moment from 'moment-timezone';
import 'moment/locale/ja';
import 'moment/min/moment-with-locales';
import {AppType, SettingState} from '@modules/setting/setting.type';
import {getReduxStates} from '@store/helper';
import {SettingService} from '@modules/setting/setting.service';
import {AuthState} from '@modules/authentication/auth.type';

export enum SELECTED_SORTTYPE {
  GOJYUON,
  HOUMON,
  KAYOI,
  SYUKUHAKU,
  ZENHAKU,
  HEYA,
  UNIT,
  TANKI,
}

export enum SELECTED_SORTTYPE_MULTI {
  GOJYUON_MULTI,
  HOUMON_MULTI,
  KAYOI_MULTI,
  SYUKUHAKU_MULTI,
  ZENHAKU_MULTI,
  TANKI_MULTI,
}

/**
 * old name: GAISYUTUGAIHAKU_DATA
 */
export enum OvernightData {
  IsNone,
  IsGoOut, //IS_GAISYUTU
  IsGoOutMeeting, //IS_GAISYUTU_MENKAI
  IsGoOutMeetDoctor, //IS_GAISYUTU_JYUSIN
  IsSleepOver, //IS_GAIHAKU
  IsSleepOverOut, //IS_GAIHAKU_DE
  IsSleepOverBack, //IS_GAIHAKU_MODORI
  IsSleepOverBackAndOut, //IS_GAIHAKU_MODORI_DE
  IsVisit, //IS_HOUMON
  IsCommute, //IS_KAYOI
  IsOvernight, //IS_SYUKUHAKU
  IsGoOutAndOut, //IS_GAISYUTU_DE
  IsGoOutAndBack, //IS_GAISYUTU_MODORI
  IsGoOutInMiddle, //IS_GAISYUTU_IN_MIDDLE
  IsGoOutMeetingOut, //IS_GAISYUTU_MENKAI_DE
  IsGoOutMeetingBack, //IS_GAISYUTU_MENKAI_MODORI
  IsGoOutMeetingInMiddle, //IS_GAISYUTU_MENKAI_IN_MIDDLE
  IsGoOutMeetDoctorOut, //IS_GAISYUTU_JYUSIN_DE
  IsGoOutMeetDoctorBack, //IS_GAISYUTU_JYUSIN_MODORI
  IsGoOutMeetDoctorInMiddle, //IS_GAISYUTU_JYUSIN_IN_MIDDLE
  IsVisitStart, //IS_HOUMON_START
  IsVisitEnd, //IS_HOUMON_END
  IsVisitInMiddle, //IS_HOUMON_IN_MIDDLE
  IsVisitStarted, //IS_HOUMON_STARTEND
  IsCommuteStart, //IS_KAYOI_START
  IsCommuteEnd, //IS_KAYOI_END
  IsCommuteStartInMiddle, //IS_KAYOI_IN_MIDDLE
  IsCommuteStarted, //IS_KAYOI_STARTEND
  IsOvernightStart, //IS_SYUKUHAKU_START
  IsOvernightEnd, //IS_SYUKUHAKU_END
  IsOvernightInMiddle, //IS_SYUKUHAKU_IN_MIDDLE
  IsOvernightStarted, //IS_SYUKUHAKU_STARTEND
  IsHasPreviousServiceStart, //IS_ZENPAKU_START
  IsHasPreviousServiceEnd, //IS_ZENPAKU_END
  IsHasPreviousInMiddle, //IS_ZENPAKU_IN_MIDDLE
  IsHasPreviousStarted, //IS_ZENPAKU_STARTEND
  IsAllOuting = 999, //IS_ALL_OUTING
  IsShortTerm, //IS_TANKI
  IsShortTermStart, //IS_TANKI_START
  IsShortTermEnd, //IS_TANKI_END
  IsShortTermInMiddle, //IS_TANKI_IN_MIDDLE
  IsShortTermStarted, //IS_TANKI_STARTEND
}

export enum datePosition {
  DATE_TOO_OLD = 1 << 0,
  DATE_IN_RANGE = 1 << 1,
  DATE_IN_RANGE_TIME_FUTURE = 1 << 2,
  DATE_FUTURE = 1 << 3,
  DATE_IN_RANGE_TIME_OLD = 1 << 4,
}

export enum AdditionalService {
  ADDITIONAL_SERVICE_NONE = '', //追加なし独自サービス追加前
  ADDITIONAL_SERVICE_A5 = 'A5', //通所みなし A5
  ADDITIONAL_SERVICE_A6 = 'A6', //通所独自 A6
  ADDITIONAL_SERVICE_78 = '78', //地域密着通所介護 78
  ADDITIONAL_SERVICE_A7 = 'A7', //通所みなし A7
  ADDITIONAL_SERVICE_A8 = 'A8', //通所みなし A8
}

export class cUserControls {
  constructor() {}

  NameTextColorBySex(iSex: string) {
    if (iSex === '男性') {
      return Color.rgb(0.22 * 255, 0.32 * 255, 0.63 * 255).toString();
    }
    return Color.rgb(0.922 * 255, 0.482 * 255, 0.447 * 255).toString();
  }

  TextSaturDayColor() {
    return Color.rgb(0.22 * 255, 0.32 * 255, 0.63 * 255).toString();
  }

  TextSunDayColor() {
    return Color.rgb(0.922 * 255, 0.482 * 255, 0.447 * 255).toString();
  }

  DateFormatterFromString2Date(dateString: string) {
    return moment.tz(dateString, 'Asia/Tokyo').toDate();
  }

  DateFormatterFromString2DateNoTime(dateString: string) {
    return moment(dateString.split('T')[0]).toDate();
  }

  DateFormatterFromDate2DBFormat(iDate: Date) {
    return moment.tz(iDate, 'Asia/Tokyo').format("YYYY-MM-DD'T'HH:mm:ss");
  }

  DateFormatterFromDate2DBFormatNoTime(iDate: Date) {
    return moment(iDate).format('YYYY-MM-DD');
  }

  trimTimeFromDateTime(iDate: Date) {
    const str = moment(iDate).format('YYYY-MM-DD');
    return this.DateFormatterFromString2Date(str);
  }

  dateTimeJapanStyleFromString(dateString: string) {
    return moment(dateString).format('YYYY年MM月DD日 (ddd) HH:mm');
  }

  dateTimeJapanStyleFromStringNoTime(dateString: string) {
    return moment(dateString).format('YYYY年MM月DD日 (ddd)');
  }

  timeOnlyFromString(dateString: string) {
    return moment(dateString).format('HH:mm');
  }

  formatterWithDbFormat(iDate: Date) {
    return moment(iDate).format("YYYY-MM-DD'T'HH:mm:ss");
  }

  GetVBLineCode(TargetValue: string) {
    return TargetValue.replace(/\t/g, '\n');
  }

  getServiceName(service: string) {
    let ServiceName = '';

    if (service === '5') {
      ServiceName = '高齢者住宅';
    } else if (service === '11') {
      ServiceName = '11.訪問介護';
    } else if (service === '12') {
      ServiceName = '12.訪問入浴介護';
    } else if (service === '13') {
      ServiceName = '13.訪問看護';
    } else if (service === '14') {
      ServiceName = '14.訪問リハビリ';
    } else if (service === '15') {
      ServiceName = '通所介護';
    } else if (service === '16') {
      ServiceName = '通所リハビリ';
    } else if (service === '17') {
      ServiceName = '17.福祉用具貸与';
    } else if (service === '31') {
      ServiceName = '31.居宅療養管理指導';
    } else if (service === '71') {
      ServiceName = '71.夜間対応型訪問介護';
    } else if (service === '72') {
      ServiceName = '認知症対応型通所介護';
    } else if (service === '76') {
      ServiceName = '76.定期巡回・随時対応型';
    } else if (service === '78') {
      ServiceName = '地域密着型通所介護';
    }

    if (service === '6') {
      ServiceName = '訪問';
    } else if (service === '7') {
      ServiceName = '通い';
    } else if (service === '8') {
      ServiceName = '宿泊';
    } else if (service === '10') {
      ServiceName = '短期';
    }

    return ServiceName;
  }

  // TODO: Be moved to "SettingService", so remove this later.
  GetDataDaysFromUserDefault() {
    const {fetchTime} = getReduxStates('setting') as SettingState;
    let termForGettingData =
      SettingService.getNumOfDayByFetchTimeType(fetchTime);
    return moment(new Date()).add(
      -termForGettingData * 24 * 60 * 60,
      'seconds',
    );
  }

  GetDataDaysFromUserDefaultForToDate() {
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType === AppType.SHISETSHU) {
      return new Date();
    } else {
      const TermForGettingData = '90';

      let days = parseInt(TermForGettingData, 10);
      if (days === 0) {
        days = 14;
      }
      return moment(new Date()).add((days - 1) * 24 * 60 * 60, 'seconds');
    }
  }

  IsEditionOfTokuteiOrGH() {
    const {dbName} = getReduxStates('authentication') as AuthState;

    let result = false;
    ['生活介護', 'GH', '特定', '地特'].forEach(n => {
      if (dbName.toUpperCase().indexOf(n) < 0) {
        result = true;
      }
    });

    return result;
  }

  userNameForService() {
    let strUserName = '入所者';
    if (this.IsEditionOfTokuteiOrGH()) {
      strUserName = '入居者';
    }

    return strUserName;
  }

  userNameForServiceAndStrSuffix(strSuffix: string) {
    return `${this.userNameForService()}${strSuffix}`;
  }

  GetIntervalBeginDateFromDate(date: Date) {
    // const Days = global.DataDays;
    //
    // if (Days === '3d') {
    //   result = moment(date).add(-3 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '1w') {
    //   result = moment(date).add(-7 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '20d') {
    //   result = moment(date).add(-20 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '1m') {
    //   return moment(date).add(-30 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '3m') {
    //   result = moment(date).add(-90 * 24 * 60 * 60, 'seconds');
    // } else {
    //   result = moment(date).add(-3 * 24 * 60 * 60, 'seconds');
    // }
    // return result;
    const {fetchTime} = getReduxStates('setting') as SettingState;
    let termForGettingData =
      SettingService.getNumOfDayByFetchTimeType(fetchTime);
    return moment(date).add(-termForGettingData * 24 * 60 * 60, 'seconds');
  }

  GetIntervalEndDateFromDate(date: Date) {
    // const Days = global.DataDays;
    // let result = moment(date).add(90 * 24 * 60 * 60, 'seconds');
    // if (Days === '3d') {
    //   result = moment(date).add(3 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '1w') {
    //   result = moment(date).add(7 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '20d') {
    //   result = moment(date).add(20 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '1m') {
    //   return moment(date).add(30 * 24 * 60 * 60, 'seconds');
    // } else if (Days === '3m') {
    //   result = moment(date).add(90 * 24 * 60 * 60, 'seconds');
    // } else {
    //   result = moment(date).add(3 * 24 * 60 * 60, 'seconds');
    // }
    // return result;
    const {fetchTime} = getReduxStates('setting') as SettingState;
    let termForGettingData =
      SettingService.getNumOfDayByFetchTimeType(fetchTime);
    return moment(date).add(termForGettingData * 24 * 60 * 60, 'seconds');
  }

  getTermForGettingData1Month() {
    return 30 * 24 * 60 * 60;
  }

  getTermForGettingData() {
    const {fetchTime} = getReduxStates('setting') as SettingState;
    let intDays = SettingService.getNumOfDayByFetchTimeType(fetchTime);

    return intDays * 24 * 60 * 60;
  }

  strDateExpressionFromTodayForDate(date: Date) {
    if (!date) {
      return '';
    }

    let retString = '';
    //本日日付時刻無し
    const dateToday = new Date();
    const dateTodayWithoutTime = moment(dateToday).startOf('days').toDate();

    //対象日時刻無し
    const dateTargetwWithoutTime = moment(date).startOf('days').toDate();

    const utc1 = Date.UTC(
      dateTargetwWithoutTime.getFullYear(),
      dateTargetwWithoutTime.getMonth(),
      dateTargetwWithoutTime.getDate(),
    );
    const utc2 = Date.UTC(
      dateTodayWithoutTime.getFullYear(),
      dateTodayWithoutTime.getMonth(),
      dateTodayWithoutTime.getDate(),
    );

    const diff = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));

    switch (diff) {
      case 2:
        retString = '一昨日';
        break;
      case 1:
        retString = '昨日';
        break;
      case 0:
        retString = '本日';
        break;
      case -1:
        retString = '明日';
        break;
      case -2:
        retString = '明後日';
        break;
      default:
        retString = `${Math.abs(diff)}日${diff < 0 ? '後' : '前'}`;
        break;
    }

    return retString;
  }

  isInFromDate(
    date?: string,
    strFromDate?: string,
    strToDate?: string,
  ): boolean {
    const fromDate = moment(strFromDate).toDate();
    const toDate = moment(strToDate).toDate();
    const nowDate = moment(date).toDate();
    return nowDate >= fromDate && nowDate <= toDate;
  }

  isEqualOrOverlapStart1(
    start1?: string,
    end1?: string,
    start2?: string,
    end2?: string,
  ): boolean {
    return (
      this.isInFromDate(start2, start1, end1) ||
      this.isInFromDate(start1, start2, end2)
    );
  }

  replaceDate(date: string): string {
    let replacedDate = date.substring(0, 10);
    replacedDate = `${replacedDate}T${this.substring(11, 8)}`;
    return replacedDate;
  }

  substring(start: number, length: number): string {
    return this.substring(start, start + length);
  }
}
