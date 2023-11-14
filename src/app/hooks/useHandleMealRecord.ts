import {checkTimeAlertWhenSaveRecord} from '@modules/record/record.utils';
import {useAppDispatch, useAppSelector} from '@store/config';
import {TenantListItem} from '@modules/tenant/tenant.type';
import {
  selectChoseService,
  selectSelectedStaff,
} from '@modules/authentication/auth.slice';
import {
  selectFilteringDate,
  updateRecordOfSelectedTenant,
} from '@modules/tenant/tenant.slice';
import {convertDateToDateTime} from '@modules/tenant/tenant.utils';
import {TMealRecordData} from '@organisms/MealRecordContent';
import {MealDB} from '@modules/record/models/meal.model';
import uuid from 'react-native-uuid';
import moment from 'moment';
import {DATABASE_DATETIME_FORMAT} from '@constants/constants';
import deviceInfo from '@libs/deviceInfo';
import {MealCategory, RecordType} from '@modules/record/record.type';
import {getDefaultTimeFromMealType} from '@modules/meal/meal.ultils';
import {isEmpty} from 'lodash';
import {useTranslation} from 'react-i18next';
import {
  handleAlertContentConfirm,
  handleAlertErrorConfirm,
} from '@modules/alerts/alert.ultils';

type MealSaveProps = {
  recordData: TMealRecordData;
  tenant?: TenantListItem;
  isEdit: boolean;
};

const useHandleMealRecord = () => {
  const dispatch = useAppDispatch();
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedService = useAppSelector(selectChoseService);
  const {t} = useTranslation();

  const validateRecord = async (
    recordData: TMealRecordData,
  ): Promise<boolean> => {
    let isValid = true;
    let contentAlert = t('popover.content_confirm');
    const {
      mealType,
      mainDish,
      subDish,
      soupVolume,
      teaVolume,
      snackVolume,
      drinkVolume,
      waterVolume,
      waterType,
    } = recordData;
    if (
      [
        MealCategory.Breakfast,
        MealCategory.Lunch,
        MealCategory.Dinner,
      ].includes(mealType) &&
      (isEmpty(mainDish) ||
        isEmpty(subDish) ||
        isEmpty(soupVolume) ||
        isEmpty(teaVolume))
    ) {
      contentAlert = t('meal.please_input_filed_soup_tea');
      isValid = false;
    } else if (
      [MealCategory.AmSnack, MealCategory.PmSnack].includes(mealType) &&
      (isEmpty(snackVolume) || isEmpty(drinkVolume))
    ) {
      contentAlert = t('meal.please_input_filed_snack_drink');
      isValid = false;
    } else if (
      mealType === MealCategory.OtherDrink &&
      isEmpty(waterVolume) &&
      isEmpty(waterType)
    ) {
      contentAlert = t('meal.please_input_filed_water_both');
      isValid = false;
    } else if (mealType === MealCategory.OtherDrink && isEmpty(waterVolume)) {
      contentAlert = t('meal.please_input_filed_water_amount');
      isValid = false;
    } else if (mealType === MealCategory.OtherDrink && isEmpty(waterType)) {
      contentAlert = t('meal.please_input_filed_water_type');
      isValid = false;
    }
    if (isValid) {
      const isConfirmed = await handleAlertContentConfirm(contentAlert);
      return isConfirmed;
    } else {
      await handleAlertErrorConfirm(contentAlert);
      return false;
    }
  };

  const onSaveRecord = async ({
    recordData,
    tenant,
  }: // isEdit,
  MealSaveProps): Promise<boolean> => {
    try {
      const {
        id,
        recordDate,
        reporter,
        serviceType,
        mealType,
        timeValue,
        mainDish,
        subDish,
        soupVolume,
        teaVolume,
        snackVolume,
        drinkVolume,
        waterVolume,
        waterType,
        memo,
        isSynced,
      } = recordData;
      const isValid = await validateRecord(recordData);
      if (!isValid) {
        return false;
      }
      let currentFilterDate: Date | string = recordDate;
      if (!recordDate) {
        currentFilterDate = convertDateToDateTime(filteringDate);
      }
      //check alert time
      const isConfirmAlertCheckTime = await checkTimeAlertWhenSaveRecord(
        tenant!,
        recordDate,
      );
      if (isConfirmAlertCheckTime) {
        const deviceData = deviceInfo.getDeviceInfo();
        let mealingTime: string | Date = timeValue;
        if (!timeValue) {
          mealingTime = await getDefaultTimeFromMealType(mealType);
        }
        const dataSave = {
          updateKey: id || uuid.v4().toString(),
          mealMainDish: mainDish,
          mealSideDish: subDish,
          mealSoup: soupVolume,
          mealTea: teaVolume,
          memo: memo,
          mealCategory: mealType,
          staffName: reporter,
          targetDate: moment(currentFilterDate).format(
            DATABASE_DATETIME_FORMAT,
          ),
          postingPeriodDate: '', // append recordData.settingRecord
          newFlag: isSynced ? '0' : '1',
          updateFlag: isSynced ? '1' : '0',
          updateUserInformation: `${deviceData.name}¥${selectedStaff?.staffCode}`,
          fkUser: tenant?.tenantCode,
          staffCode: selectedStaff?.staffCode,
          mealingTime: moment(mealingTime, 'HH:mm').format(
            DATABASE_DATETIME_FORMAT,
          ),
          serviceType,
          snackSnack: snackVolume,
          snackDrink: drinkVolume,
          otherWaterIntakeMoisture: waterVolume,
          otherWaterIntakeContents: waterType,
        };
        await MealDB.saveDataMeal(dataSave);
        dispatch(
          updateRecordOfSelectedTenant({
            fcpRecord: {
              type: RecordType.Meal,
              category: dataSave.mealCategory as MealCategory,
              warningDueDate: '',
              isAPRecord: false,
              result: {
                stapleFood: dataSave.mealMainDish,
                sideFood: dataSave.mealSideDish,
                soupVolume: dataSave.mealSoup,
                teaVolume: dataSave.mealTea,
                snackFood: dataSave.snackSnack,
                snackDrink: dataSave.snackDrink,
                otherDrink: dataSave.otherWaterIntakeMoisture,
                otherDrinkType: dataSave.otherWaterIntakeContents,
              },
              id: dataSave.updateKey,
              time: dataSave.targetDate,
              note: dataSave.memo,
              isSynced: false,
              reporter: {
                name: dataSave.staffName!,
                jobs: [''],
              },
              serviceCode: selectedService?.serviceCode!,
              tenantCode: dataSave.fkUser!,
            },
          }),
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('error save meal record', {error});
      return false;
    }
  };

  return {
    onSaveRecord,
  };
};

export default useHandleMealRecord;
