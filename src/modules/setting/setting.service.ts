import {FetchTimeType, SettingState} from '@modules/setting/setting.type';
import {getReduxStates} from '@store/helper';
import moment from 'moment';

export namespace SettingService {
  export const getNumOfDayByFetchTimeType = (fetchTime?: FetchTimeType) => {
    const settingStates = getReduxStates('setting') as SettingState;
    const value = fetchTime ? fetchTime : settingStates.fetchTime;

    switch (value) {
      case FetchTimeType.OneDay:
        return 1;
      case FetchTimeType.OneWeek:
        return 7;
      case FetchTimeType.TwoWeek:
        return 14;
      case FetchTimeType.ThreeDay:
        return 3;
      case FetchTimeType.OneMonth:
        return 30;
      default:
        return 14;
    }
  };

  export const getDataDaysFromUserDefault = () => {
    const {fetchTime} = getReduxStates('setting') as SettingState;
    let termForGettingData = getNumOfDayByFetchTimeType(fetchTime);
    return moment(new Date()).add(
      -termForGettingData * 24 * 60 * 60,
      'seconds',
    );
  };
}
