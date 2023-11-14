import {getReduxStates} from '@store/helper';
import {AuthState} from '@modules/authentication/auth.type';
import {AppType} from '@modules/setting/setting.type';
import moment from 'moment';
import {TodayPlanType} from '@modules/tenant/tenant.type';

export class cOvernightData {
  _goingOutType: TodayPlanType; //GaisyutuGaihakuSyubetsu
  startDate: string; //KaisiDate
  endDate: string; //SyuryoDate
  isConfirmedStart: boolean; //Kaisi_KakuninZumi
  isConfirmedEnd: boolean; //Syuryo_KakuninZumi
  fkKey: string;
  userName: string; //RiyosyaMei
  goingOutPlace: string; //GaisyutuGaihakuSaki
  comment: string;
  reportDate: string; //HoukokuDate
  staffCode: string; //SyokuinCode
  staffName: string; //SyokuinMei

  // Shisetsu does not have below props
  updateDict: {[key: string]: any};
  updateKey: string;

  constructor() {
    this.updateKey = '';
    this._goingOutType = TodayPlanType.Unknown;
    this.startDate = '';
    this.endDate = '';
    this.isConfirmedStart = false;
    this.isConfirmedEnd = false;
    this.fkKey = '';
    this.userName = '';
    this.goingOutPlace = '';
    this.comment = '';
    this.reportDate = '';
    this.staffCode = '';
    this.staffName = '';

    this.updateDict = {};
  }

  get goingOutType(): TodayPlanType {
    const {appType} = getReduxStates('authentication') as AuthState;
    if (appType === AppType.SHISETSHU && this.startDate && this.endDate) {
      return moment(this.startDate).isSame(moment(this.endDate), 'day')
        ? TodayPlanType.DayOuting
        : TodayPlanType.OvernightOuting;
    } else {
      return this._goingOutType;
    }
  }

  parseFromRawData(record: Record<string, string | null>) {
    this.updateKey = record['更新キー'] ?? '';
    this._goingOutType =
      (record['外出外泊_種別'] as TodayPlanType) ?? TodayPlanType.Unknown;
    this.startDate = record['開始日時'] ?? '';
    this.endDate = record['終了日時'] ?? '';
    this.isConfirmedStart = !!+(record['開始_確認済み'] ?? '0');
    this.isConfirmedEnd = !!+(record['終了_確認済み'] ?? '0');
    this.fkKey = record['FK_利用者'] ?? '';
    this.userName = record['利用者名'] ?? '';
    this.goingOutPlace = record['外出外泊先'] ?? '';
    this.comment = record['コメント'] ?? '';
    this.reportDate = record['報告日時'] ?? '';
    this.staffCode = record['職員コード'] ?? '';
    this.staffName = record['職員名'] ?? '';
  }
}
