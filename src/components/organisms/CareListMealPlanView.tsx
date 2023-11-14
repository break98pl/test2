import React from 'react';
import {StyleSheet, View} from 'react-native';
import MealPlanTooltip from '@organisms/MealPlanTooltip';
import {MealPlan, MealPlanManagementId} from '@modules/record/record.type';

interface Props {
  mealPlans: MealPlan[];
}

const CareListMealPlanView = ({mealPlans}: Props) => {
  const mealTicket =
    mealPlans?.find(p => p.managementId === MealPlanManagementId.Ticket) ??
    null;
  const mealContactForm =
    mealPlans?.find(p => p.managementId === MealPlanManagementId.ContactForm) ??
    null;

  return (
    <View style={styles.mealPlanView}>
      <MealPlanTooltip
        mealPlan={mealTicket}
        type={MealPlanManagementId.Ticket}
      />
      <MealPlanTooltip
        mealPlan={mealContactForm}
        type={MealPlanManagementId.ContactForm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mealPlanView: {
    flexDirection: 'row',
  },
});

export default CareListMealPlanView;
