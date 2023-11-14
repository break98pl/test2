import {TsushoResidentTenantItem} from '@modules/visitPlan/type';
import {TLatestVitalData, TVitalRecordData} from './vital.type';
import moment from 'moment';
import {ElapsedListItem} from '@modules/elapsed/elapsed.type';

export const getLatestVital = (
  vital: string,
  data?: TVitalRecordData[],
): TVitalRecordData => {
  let valueLatest: TVitalRecordData = {
    id: '0',
    recordDate: '2001-12-26T00:00:00',
    pulse: '',
    respiratory: '',
    highBloodPressure: '',
    lowBloodPressure: '',
    temperature: '',
    saturation: '',
    weight: '',
    memo: '',
  };
  if (!data?.length) {
    return valueLatest;
  }
  const vitalSortByDate = data.sort(
    (a, b) => moment(b.recordDate).valueOf() - moment(a.recordDate).valueOf(),
  );
  vitalSortByDate.every(vitalData => {
    const vitalConvert = vitalData as unknown as TLatestVitalData;
    if (vitalConvert[vital]) {
      valueLatest = vitalData;
      return false;
    } else {
      return true;
    }
  });
  return valueLatest;
};

/**
 * Convert resident tenant data to UI Item
 *
 * @AppType Tsusho
 * @param residentTenant
 * @param index
 */
export const convertToVItalUIItem = (
  residentTenant: TsushoResidentTenantItem,
  index: number,
): ElapsedListItem => {
  //Handle display Attendace
  return {
    tenantCode: residentTenant.user.tenantCode + index.toString(),
    firstNameFurigana: residentTenant.user.firstNameFurigana,
    surnameFurigana: residentTenant.user.surnameFurigana,
    firstNameKanji: residentTenant.user.firstNameKanji,
    surnameKanji: residentTenant.user.surnameKanji,
    gender: residentTenant.user.gender,
    hasNotice: residentTenant.user.hasNotice,
    photoPath: residentTenant.user.photoPath,
    registerVPState: residentTenant.registerVPState,
    isSettled: residentTenant.isSettled,
  };
};

/**
 * Convert resident tenant data to UI Item
 * @AppType Tsusho
 * @param residentTenant
 */
export const convertToVitalUIList = (
  residentTenants: TsushoResidentTenantItem[],
): ElapsedListItem[] => {
  //Handle display Attendace
  let dataConverted: ElapsedListItem[] = [];
  residentTenants.forEach((e, index) => {
    dataConverted.push(convertToVItalUIItem(e, index));
  });
  return dataConverted;
};

/**
 * Convert vital value to float string
 * @param value
 */

export const convertValueVitalToString = (value?: string) => {
  if (value && !isNaN(parseFloat(value))) {
    return `${parseFloat(value)}`;
  }
  return value || '';
};
