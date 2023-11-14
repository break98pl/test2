import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';
import TodayPlanInfoItem from '@molecules/TodayPlanInfoItem';
import {MealPlan, MealPlanManagementId} from '@modules/record/record.type';
import moment from 'moment';
import {DATE_WEEKDAY_FORMAT} from '@constants/constants';

interface Props {
  type: MealPlanManagementId;
  mealPlan: MealPlan;
}

const MealPlanDetail = ({mealPlan, type}: Props) => {
  const {t} = useTranslation();

  const mealClassificationTitle = t('popover.meal_type');
  const mealReasonTitle = t('care_list.mealReason');
  const mealServiceTitle = t('care_list.mealService');
  const mealPeriodTitle = t('care_list.mealPeriod');
  const mealCategoryTitle = t('care_list.mealCategory');
  const mealMoneyInfoTitle = t('care_list.mealMoneyInfo');
  const mainMealDishTitle = t('care_list.mainMealDish');
  const mealVolumeTitle = t('care_list.mealVolume');
  const mainMealBreadTitle = t('care_list.mainMealBread');
  const sideMealDishTitle = t('care_list.sideMealDish');
  const mealToolTitle = t('care_list.mealTool');
  const diseaseTitle = t('care_list.disease');
  const mealNoteTitle = t('care_list.mealNote');
  const noteForUserTitle = t('care_list.noteForUser');

  const getMealPlanPeriod = () => {
    const startDateFormat = mealPlan.startDate
      ? `${moment(mealPlan.startDate).format(DATE_WEEKDAY_FORMAT)} ${
          mealPlan.startTimeCategory ?? ''
        }`
      : '';
    const endDateFormat = mealPlan.endDate
      ? `${moment(mealPlan.endDate).format(DATE_WEEKDAY_FORMAT)} ${
          mealPlan.endTimeCategory ?? ''
        }`
      : '';
    return `${startDateFormat} ${endDateFormat ? `〜\n${endDateFormat}` : ''}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>
        <BaseButton activeOpacity={1}>
          {type === MealPlanManagementId.Ticket && (
            <TodayPlanInfoItem
              label={mealServiceTitle}
              content={mealPlan.usedService ?? ''}
              backgroundColor={Colors.POPOVER_BG}
            />
          )}
          <TodayPlanInfoItem
            label={mealClassificationTitle}
            content={mealPlan.classification ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={mealReasonTitle}
            content={
              mealPlan.startingReason ||
              mealPlan.cancellationReason ||
              mealPlan.changingReason ||
              ''
            }
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={mealPeriodTitle}
            content={getMealPlanPeriod()}
            backgroundColor={Colors.POPOVER_BG}
          />

          {type === MealPlanManagementId.Ticket && (
            <>
              <TodayPlanInfoItem
                label={mealCategoryTitle}
                content={mealPlan.mealType ?? ''}
                backgroundColor={Colors.POPOVER_BG}
              />
              <TodayPlanInfoItem
                label={mealMoneyInfoTitle}
                // remove number and "." in meal money string
                content={
                  mealPlan.hasFunctionalFoods?.replace(/^\d+\.\s*/, '') ?? ''
                }
                backgroundColor={Colors.POPOVER_BG}
              />
            </>
          )}

          <TodayPlanInfoItem
            label={mainMealDishTitle}
            content={mealPlan.stapleFoodType ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={mealVolumeTitle}
            content={mealPlan.stapleFoodAmount ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={mainMealBreadTitle}
            content={mealPlan.noteForEatingBread ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={sideMealDishTitle}
            content={mealPlan.sideFoodType ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={mealToolTitle}
            content={mealPlan.eatingAids ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          {type === MealPlanManagementId.Ticket && (
            <TodayPlanInfoItem
              label={diseaseTitle}
              content={mealPlan.medicalCondition ?? ''}
              backgroundColor={Colors.POPOVER_BG}
            />
          )}
          <TodayPlanInfoItem
            label={mealNoteTitle}
            content={mealPlan.remarks ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
          <TodayPlanInfoItem
            label={noteForUserTitle}
            content={mealPlan.precautions ?? ''}
            backgroundColor={Colors.POPOVER_BG}
          />
        </BaseButton>
      </View>
    </ScrollView>
  );
};

export default MealPlanDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: Colors.POPOVER_BG,
  },
  inner: {
    paddingVertical: 15,
  },
});
