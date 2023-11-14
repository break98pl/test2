import React, {forwardRef, useCallback, useImperativeHandle} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import ServicePlanList from '@organisms/ServicePlanList';
import {ServicePlan} from '@modules/tenant/tenant.type';
import useVisible from '@hooks/useVisible';
import BaseButton from '@atoms/BaseButton';
import {useTranslation} from 'react-i18next';
import {TooltipImperativeHandle} from '@modules/careList/careList.type';
import {DimensionValue} from 'react-native';

interface Props {
  tenantKanjiName: string;
  servicePlans: ServicePlan[];
  hasPreviousOvernightStay?: boolean;
  renderCustomChildren?: (servicePlans: ServicePlan[]) => React.ReactElement;
  width?: DimensionValue;
  height?: DimensionValue;
  /**
   *The distance between the tooltip-rendered child and the arrow pointing to it
   */
  childContentSpacing?: number;
}

const TenantServicePlanView = forwardRef<TooltipImperativeHandle, Props>(
  (
    {
      tenantKanjiName,
      servicePlans,
      hasPreviousOvernightStay = false,
      renderCustomChildren,
      width = 554,
      height = 660,
      childContentSpacing,
    }: Props,
    ref,
  ) => {
    const {t} = useTranslation();
    const {isVisible, showComponent, hideComponent} = useVisible();

    useImperativeHandle(
      ref,
      () => {
        return {
          displayTooltip() {
            handleOpenTooltip();
          },
        };
      },
      [],
    );

    /**
     * Called when the user presses service plan view in the Tenant List.
     */
    const handleOpenTooltip = useCallback(() => {
      if (servicePlans.length || hasPreviousOvernightStay) {
        showComponent();
      }
    }, []);

    return (
      <BaseTooltip
        showHeader
        placement={'right'}
        isVisible={isVisible}
        title={tenantKanjiName}
        showChildInTooltip={false}
        childContentSpacing={childContentSpacing}
        subTitle={t('user_list.sama')}
        leftButtonText={t('common.close')}
        onLeftButtonPress={hideComponent}
        closeOnBackgroundInteraction={false}
        contentStyle={{width, height}}
        content={
          <ServicePlanList
            data={servicePlans}
            hasPreviousOvernightStay={hasPreviousOvernightStay}
          />
        }>
        {renderCustomChildren ? (
          renderCustomChildren(servicePlans)
        ) : (
          <BaseButton onPress={handleOpenTooltip}>
            <ServicePlanList
              brief
              data={servicePlans}
              hasPreviousOvernightStay={hasPreviousOvernightStay}
            />
          </BaseButton>
        )}
      </BaseTooltip>
    );
  },
);

export default TenantServicePlanView;
