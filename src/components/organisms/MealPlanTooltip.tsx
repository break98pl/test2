import {DimensionValue, StyleSheet} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseTooltip from '@templates/BaseTooltip';
import {Colors} from '@themes/colors';
import useVisible from '@hooks/useVisible';
import {MealPlan, MealPlanManagementId} from '@modules/record/record.type';
import {getCareListMealPlanText} from '@modules/careList/careList.utils';
import CareListBadge from '@molecules/CareListBadge';
import MealPlanDetail from '@organisms/MealPlanDetail';

interface Props {
  mealPlan: MealPlan | null;
  type: MealPlanManagementId;
  width?: DimensionValue;
}

const MealPlanTooltip = ({width, type, mealPlan}: Props) => {
  const {t} = useTranslation();

  const closeText = t('common.close');
  const mealInstructionText = t('care_list.mealInstruction');
  const mealContactFormText = t('care_list.mealContactForm');

  const {isVisible, showComponent, hideComponent} = useVisible();

  return (
    <BaseTooltip
      showHeader
      placement={'right'}
      isVisible={isVisible}
      onClose={hideComponent}
      title={
        type === MealPlanManagementId.Ticket
          ? mealInstructionText
          : mealContactFormText
      }
      content={
        mealPlan ? <MealPlanDetail type={type} mealPlan={mealPlan} /> : <></>
      }
      leftButtonText={closeText}
      showChildInTooltip={false}
      onLeftButtonPress={hideComponent}
      closeOnBackgroundInteraction={false}
      headerStyle={styles.tooltipHeader}
      contentStyle={[styles.tooltipContent, {width}]}
      arrowStyle={styles.tooltipArrow}>
      <CareListBadge
        visible={!!mealPlan}
        {...getCareListMealPlanText(type)}
        onPress={showComponent}
      />
    </BaseTooltip>
  );
};

export default MealPlanTooltip;

const styles = StyleSheet.create({
  tooltipHeader: {
    backgroundColor: Colors.WHITE,
  },
  tooltipContent: {
    height: 700,
    minWidth: 500,
  },
  tooltipArrow: {
    borderTopColor: Colors.POPOVER_BG,
  },
  button: {
    height: 20,
    width: 80,
  },
});
