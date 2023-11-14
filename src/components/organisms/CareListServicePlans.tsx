import React from 'react';
import {ServicePlan, TodayPlanType} from '@modules/tenant/tenant.type';
import {getUserDefaultKeyMultiService} from '@modules/authentication/auth.utils';
import {StyleSheet, View} from 'react-native';
import CareListBadge from '@molecules/CareListBadge';
import {getCareListTodayPlanText} from '@modules/careList/careList.utils';

interface Props {
  servicePlans: ServicePlan[];
  onPressPlan?: () => void;
}

const CareListServicePlans = ({servicePlans, onPressPlan}: Props) => {
  const visitPlans = servicePlans.filter(
    p => p.planType === TodayPlanType.Visit,
  );
  const nursingPlans = servicePlans.filter(
    p => p.planType === TodayPlanType.Nursing,
  );
  const caringPlans = servicePlans.filter(
    p => p.planType === TodayPlanType.Caring,
  );
  const commutePlans = servicePlans.filter(
    p => p.planType === TodayPlanType.Commute,
  );
  const overnightStayPlans = servicePlans.filter(
    p => p.planType === TodayPlanType.OvernightStay,
  );
  const shortTermStayPlans = servicePlans.filter(
    p => p.planType === TodayPlanType.ShortTermStay,
  );
  const isKantaki = getUserDefaultKeyMultiService() === '2';

  return (
    <View style={styles.todayPlanView}>
      {isKantaki ? (
        <>
          <CareListBadge
            visible={
              nursingPlans.length > 0 ||
              caringPlans.length > 0 ||
              commutePlans.length > 0 ||
              overnightStayPlans.length > 0 ||
              shortTermStayPlans.length > 0
            }
            contentVisible={nursingPlans.length > 0}
            onPress={onPressPlan}
            {...getCareListTodayPlanText(TodayPlanType.Nursing)}
          />
          <CareListBadge
            visible={
              caringPlans.length > 0 ||
              commutePlans.length > 0 ||
              overnightStayPlans.length > 0 ||
              shortTermStayPlans.length > 0
            }
            contentVisible={caringPlans.length > 0}
            onPress={onPressPlan}
            {...getCareListTodayPlanText(TodayPlanType.Caring)}
          />
        </>
      ) : (
        <CareListBadge
          visible={
            visitPlans.length > 0 ||
            commutePlans.length > 0 ||
            overnightStayPlans.length > 0 ||
            shortTermStayPlans.length > 0
          }
          contentVisible={visitPlans.length > 0}
          onPress={onPressPlan}
          {...getCareListTodayPlanText(TodayPlanType.Visit)}
        />
      )}

      <CareListBadge
        visible={
          commutePlans.length > 0 ||
          overnightStayPlans.length > 0 ||
          shortTermStayPlans.length > 0
        }
        contentVisible={commutePlans.length > 0}
        onPress={onPressPlan}
        {...getCareListTodayPlanText(TodayPlanType.Commute)}
      />
      <CareListBadge
        visible={overnightStayPlans.length > 0 || shortTermStayPlans.length > 0}
        contentVisible={overnightStayPlans.length > 0}
        onPress={onPressPlan}
        {...getCareListTodayPlanText(TodayPlanType.OvernightStay)}
      />
      <CareListBadge
        visible={shortTermStayPlans.length > 0}
        contentVisible={shortTermStayPlans.length > 0}
        onPress={onPressPlan}
        {...getCareListTodayPlanText(TodayPlanType.ShortTermStay)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  todayPlanView: {
    flexDirection: 'row',
  },
});

export default CareListServicePlans;
