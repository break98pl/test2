import React from 'react';
import {GoingOutPlan, TodayPlanType} from '@modules/tenant/tenant.type';
import {StyleSheet, View} from 'react-native';
import CareListBadge from '@molecules/CareListBadge';
import {getCareListTodayPlanText} from '@modules/careList/careList.utils';

interface Props {
  goingOutPlans: GoingOutPlan[];
  onPressPlan?: () => void;
}

const CareListGoingOutPlans = ({goingOutPlans, onPressPlan}: Props) => {
  const overnightOutingPlans = goingOutPlans.filter(
    p => p.planType === TodayPlanType.OvernightOuting,
  );
  const dayOutingPlans = goingOutPlans.filter(
    p => p.planType === TodayPlanType.DayOuting,
  );
  const havingVisitorPlans = goingOutPlans.filter(
    p => p.planType === TodayPlanType.HavingVisitors,
  );
  const medicalExamPlans = goingOutPlans.filter(
    p => p.planType === TodayPlanType.MedicalExamination,
  );

  return (
    <View style={styles.todayPlanView}>
      <CareListBadge
        onPress={onPressPlan}
        visible={
          overnightOutingPlans.length > 0 ||
          dayOutingPlans.length > 0 ||
          havingVisitorPlans.length > 0 ||
          medicalExamPlans.length > 0
        }
        {...getCareListTodayPlanText(
          TodayPlanType.OvernightOuting,
          overnightOutingPlans.length === 1
            ? overnightOutingPlans[0].goingOutStatus
            : null,
          overnightOutingPlans.length > 1,
        )}
      />
      <CareListBadge
        onPress={onPressPlan}
        visible={
          dayOutingPlans.length > 0 ||
          havingVisitorPlans.length > 0 ||
          medicalExamPlans.length > 0
        }
        {...getCareListTodayPlanText(TodayPlanType.DayOuting)}
      />
      <CareListBadge
        onPress={onPressPlan}
        visible={havingVisitorPlans.length > 0 || medicalExamPlans.length > 0}
        {...getCareListTodayPlanText(TodayPlanType.HavingVisitors)}
      />
      <CareListBadge
        onPress={onPressPlan}
        visible={medicalExamPlans.length > 0}
        {...getCareListTodayPlanText(TodayPlanType.MedicalExamination)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  todayPlanView: {
    flexDirection: 'row',
  },
});

export default CareListGoingOutPlans;
