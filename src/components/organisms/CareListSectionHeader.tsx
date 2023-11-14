import React, {useCallback, useRef} from 'react';
import moment from 'moment';
import {StyleSheet, View} from 'react-native';

import {Colors} from '@themes/colors';
import {CareSectionHeaderData} from '@modules/record/record.type';
import CareListSectionHeaderDate from '@molecules/CareListSectionHeaderDate';
import {useAppSelector} from '@store/config';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {GoingOutPlan, ServicePlan} from '@modules/tenant/tenant.type';
import TenantServicePlanView from '@organisms/TenantServicePlanView';
import CareListServicePlans from '@organisms/CareListServicePlans';
import PopoverTodayPlanButton from '@organisms/PopoverTodayPlanButton';
import CareListGoingOutPlans from '@organisms/CareListGoingOutPlans';
import {TooltipImperativeHandle} from '@modules/careList/careList.type';
import {selectCurrentCareTenant} from '@modules/careList/careList.slice';
import CareListMealPlanView from '@organisms/CareListMealPlanView';

interface Props extends CareSectionHeaderData {}

const CareListSectionHeader = ({
  date,
  isHoliday,
  goingOutPlans,
  servicePlans,
  hasPreviousOvernightStay,
  mealPlans,
}: Props) => {
  const appType = useAppSelector(selectAppType);
  const {surnameKanji, firstNameKanji} =
    useAppSelector(selectCurrentCareTenant) ?? {};
  const todayPlanRef = useRef<TooltipImperativeHandle | null>(null);

  const renderGoingOutPlansView = useCallback(
    (plans: GoingOutPlan[]) => (
      <CareListGoingOutPlans
        goingOutPlans={plans}
        onPressPlan={todayPlanRef.current?.displayTooltip}
      />
    ),
    [],
  );

  const renderServicePlansView = useCallback(
    (plans: ServicePlan[]) => (
      <CareListServicePlans
        servicePlans={plans}
        onPressPlan={todayPlanRef.current?.displayTooltip}
      />
    ),
    [],
  );

  const renderMealPlansView = () => {
    if (appType !== AppType.SHISETSHU) {
      return <></>;
    }
    return <CareListMealPlanView mealPlans={mealPlans ?? []} />;
  };

  const renderTodayPlansView = () => {
    if (
      (appType === AppType.SHISETSHU || appType === AppType.JUTAKU) &&
      goingOutPlans?.length
    ) {
      return (
        <PopoverTodayPlanButton
          ref={todayPlanRef}
          tooltipTitle={`${surnameKanji} ${firstNameKanji}`}
          todayPlans={goingOutPlans}
          renderCustomChildren={renderGoingOutPlansView}
          isLineBreakDate={true}
          width={425}
          height={580}
        />
      );
    } else if (appType === AppType.TAKINO && servicePlans?.length) {
      return (
        <TenantServicePlanView
          ref={todayPlanRef}
          tenantKanjiName={`${surnameKanji} ${firstNameKanji}`}
          servicePlans={servicePlans}
          hasPreviousOvernightStay={hasPreviousOvernightStay}
          renderCustomChildren={renderServicePlansView}
          width={425}
          height={580}
        />
      );
    } else {
      return <></>;
    }
  };

  return (
    <View style={styles.container}>
      <CareListSectionHeaderDate
        isHoliday={isHoliday}
        date={moment(date).toDate()}
      />
      {mealPlans && renderMealPlansView()}
      {renderTodayPlansView()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    paddingLeft: 20,
    marginBottom: 1,
    backgroundColor: Colors.MEDIUM_GRAY_BACKGROUND,
  },
});

export default CareListSectionHeader;
