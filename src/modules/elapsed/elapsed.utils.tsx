import {images} from '@constants/images';
import {TsushoResidentTenantItem} from '@modules/visitPlan/type';
import i18n from 'i18next';
import {ElapsedListItem} from './elapsed.type';

export const getIconSettingReport = (report: string) => {
  switch (report) {
    case i18n.t('report.three_day_report'):
      return images.reportWarningThreeDay;
    case i18n.t('report.one_week_report'):
      return images.reportWarningOneWeek;
    case i18n.t('report.one_month_report'):
      return images.reportWarningOneMonth;
  }
};

/**
 * Convert resident tenant data to UI Item
 *
 * @AppType Tsusho
 * @param residentTenant
 * @param index
 */
export const convertToElapsedUIItem = (
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
export const convertToElapsedUIList = (
  residentTenants: TsushoResidentTenantItem[],
): ElapsedListItem[] => {
  //Handle display Attendace
  let dataConverted: ElapsedListItem[] = [];
  residentTenants.forEach((e, index) => {
    dataConverted.push(convertToElapsedUIItem(e, index));
  });
  return dataConverted;
};
