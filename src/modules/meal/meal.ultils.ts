import {
  AM_SNACK_TIME,
  DATABASE_DATETIME_FORMAT,
  DINNER_TIME,
  INITIAL_TIME,
  LUNCH_TIME,
  MORNING_TIME,
  PM_SNACK_TIME,
  TIME_24H_FORMAT,
} from '@constants/constants';
import {MealDB} from '@modules/record/models/meal.model';
import {MealTimeDB} from '@modules/record/record.type';
import i18n from 'i18next';
import moment from 'moment';

export const convertDateTimeDbToTime = (dateTime: string) => {
  return moment(dateTime, DATABASE_DATETIME_FORMAT).format(TIME_24H_FORMAT);
};

export const getDefaultTimeFromMealType = async (
  mealType: string,
): Promise<Date> => {
  let customizedTime = INITIAL_TIME;
  const mealTimeDB: MealTimeDB = await MealDB.findTimeMealRecordFromDB();

  switch (mealType) {
    case i18n.t('popover.meal_breakfast'):
      customizedTime = mealTimeDB?.timeBreakfast
        ? convertDateTimeDbToTime(mealTimeDB.timeBreakfast)
        : MORNING_TIME;
      break;
    case i18n.t('popover.meal_am_snack'):
      customizedTime = mealTimeDB?.timeAmSnack
        ? convertDateTimeDbToTime(mealTimeDB.timeAmSnack)
        : AM_SNACK_TIME;
      break;
    case i18n.t('popover.meal_lunch'):
      customizedTime = mealTimeDB?.timeLunch
        ? convertDateTimeDbToTime(mealTimeDB.timeLunch)
        : LUNCH_TIME;
      break;
    case i18n.t('popover.meal_pm_snack'):
      customizedTime = mealTimeDB?.timePmSnack
        ? convertDateTimeDbToTime(mealTimeDB.timePmSnack)
        : PM_SNACK_TIME;
      break;
    case i18n.t('popover.meal_dinner'):
      customizedTime = mealTimeDB?.timeDinner
        ? convertDateTimeDbToTime(mealTimeDB.timeDinner)
        : DINNER_TIME;
      break;
  }
  return moment(customizedTime, TIME_24H_FORMAT).toDate();
};
