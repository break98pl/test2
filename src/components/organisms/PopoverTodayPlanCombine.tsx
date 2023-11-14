import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {Colors} from '@themes/colors';
import TodayPlanDetailContent from './TodayPlanDetailContent';
import SlideTabsTooltip, {TabComponentProps} from '@templates/SlideTabsTooltip';
import BaseText from '@atoms/BaseText';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import TodayPlanSelectionList from './TodayPlanSelectionList';
import {
  GoingOutPlan,
  ServicePlan,
  TodayPlanType,
} from '@modules/tenant/tenant.type';
import {SceneRendererProps} from 'react-native-tab-view';
import {images} from '@constants/images';
import {getIconTodayPlan} from '@modules/tenant/tenant.utils';
import ServicePlanList from './ServicePlanList';
import BaseTooltip from '@templates/BaseTooltip';
import {uniqBy} from 'lodash';

export enum TodayPlanKey {
  TodayPlanList = 'todayPlanList',
  TodayPlanDetail = 'todayPlanDetail',
}

interface IPopoverTodayPlanCombineProps {
  count?: number;
  goingOutPlans?: GoingOutPlan[];
  servicePlans?: ServicePlan[];
  useValueOutComponentShowTooltip?: boolean;
  showTooltip?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
  onClose?: () => void;
  tooltipTitle?: string;
  hasPreviousOvernightStay?: boolean;
}

const PopoverTodayPlanCombine = (props: IPopoverTodayPlanCombineProps) => {
  const {
    goingOutPlans,
    servicePlans,
    count = 0,
    useValueOutComponentShowTooltip,
    showTooltip,
    style,
    onPress,
    onClose,
    tooltipTitle = '',
    hasPreviousOvernightStay,
  } = props;
  const {t} = useTranslation();
  const [isShowPopover, setIsShowPopover] = useState(false);
  const [todayPlanDetailData, setTodayPlanDetailData] =
    useState<GoingOutPlan>();
  const appType = useSelector(selectAppType);

  const openPopover = () => {
    if (useValueOutComponentShowTooltip && onPress) {
      onPress();
    } else if (goingOutPlans) {
      setIsShowPopover(true);
      setTodayPlanDetailData(goingOutPlans[0]);
    }
  };

  const hidePopover = () => {
    if (useValueOutComponentShowTooltip && onClose) {
      onClose();
    } else {
      setIsShowPopover(false);
    }
  };

  const handleBack = ({jumpTo}: SceneRendererProps) => {
    jumpTo(TodayPlanKey.TodayPlanList);
  };

  const getIconButtonTodayPlan = () => {
    if (!goingOutPlans || goingOutPlans.length === 0) {
      return null;
    }

    const planTypeCount = uniqBy(goingOutPlans, 'planType').length;
    const firstPlan = goingOutPlans[0];

    if (planTypeCount > 1) {
      return images.tpMoreOne;
    } else if (goingOutPlans.length > 1) {
      if (firstPlan.planType === TodayPlanType.OvernightOuting) {
        return images.tpSleepOverRepresent;
      } else {
        return getIconTodayPlan(firstPlan.planType);
      }
    } else {
      if (firstPlan.planType === TodayPlanType.OvernightOuting) {
        return getIconTodayPlan(firstPlan.goingOutStatus);
      } else {
        return getIconTodayPlan(firstPlan.planType);
      }
    }
  };

  const getIconButtonServicePlan = () => {
    if (!servicePlans || (servicePlans && !servicePlans.length)) {
      return '';
    } else if (servicePlans.length > 1) {
      return images.tpMoreOne;
    }
    return getIconTodayPlan(servicePlans[0].planType);
  };

  const renderTodayPlanListContent = ({jumpTo}: TabComponentProps) => {
    const handleShowPlanDetail = (value: GoingOutPlan) => {
      if (appType !== AppType.TAKINO) {
        setTodayPlanDetailData(value);
        jumpTo(TodayPlanKey.TodayPlanDetail);
      }
    };

    return (
      <>
        {goingOutPlans && goingOutPlans.length > 1 ? (
          <View style={styles.contentPopover}>
            <TodayPlanSelectionList
              separator
              style={styles.todayPlanListView}
              data={goingOutPlans}
              onSelectItem={handleShowPlanDetail}
            />
          </View>
        ) : (
          renderTodayPlanDetailContent()
        )}
      </>
    );
  };

  const renderTodayPlanDetailContent = () => {
    return todayPlanDetailData ? (
      <TodayPlanDetailContent data={todayPlanDetailData} />
    ) : (
      <></>
    );
  };

  const renderScene = (propers: TabComponentProps) => {
    switch (propers.route.key) {
      case TodayPlanKey.TodayPlanList:
        return renderTodayPlanListContent(propers);
      case TodayPlanKey.TodayPlanDetail:
        return renderTodayPlanDetailContent();
    }
  };

  const renderServicePlans = () => {
    return (
      <BaseTooltip
        isVisible={isShowPopover}
        showHeader
        placement={'right'}
        title={tooltipTitle}
        leftButtonText={t('common.close')}
        childContentSpacing={-90}
        onLeftButtonPress={hidePopover}
        closeOnBackgroundInteraction={false}
        contentStyle={styles.popoverContentListStyle}
        subTitle={t('user_list.sama')}
        content={
          <>
            {!!servicePlans?.length && (
              <ServicePlanList
                data={servicePlans}
                hasPreviousOvernightStay={hasPreviousOvernightStay}
              />
            )}
          </>
        }>
        <BaseButton style={style} onPress={openPopover}>
          <FastImage
            style={styles.recordInputIcon}
            source={getIconButtonServicePlan()}
            resizeMode="contain"
          />
          {count > -1 && servicePlans && servicePlans?.length > 1 && (
            <View style={styles.scheduleCount}>
              <BaseText
                weight="medium"
                size="xSmall"
                text={servicePlans?.length.toString()}
              />
            </View>
          )}
          {hasPreviousOvernightStay && (
            <View style={styles.previousOvernightView}>
              <BaseText
                size={'xSmall'}
                text={t('user_list.has_previous_overnight')}
              />
            </View>
          )}
        </BaseButton>
      </BaseTooltip>
    );
  };

  const renderGoingOutPlans = () => {
    return (
      <SlideTabsTooltip
        renderScene={renderScene}
        onBack={proper => handleBack(proper)}
        showHeader
        isVisible={
          useValueOutComponentShowTooltip ? showTooltip : isShowPopover
        }
        placement="right"
        onClose={hidePopover}
        closeOnContentInteraction={false}
        contentStyle={styles.popoverContentListStyle}
        onLeftButtonPress={hidePopover}
        title={tooltipTitle}
        subTitle={t('user_list.sama')}
        tabComponents={[
          {
            key: TodayPlanKey.TodayPlanList,
            component: renderTodayPlanListContent,
          },
          {
            key: TodayPlanKey.TodayPlanDetail,
            component: renderTodayPlanDetailContent,
          },
        ]}>
        <BaseButton style={style} onPress={openPopover}>
          <FastImage
            style={styles.recordInputIcon}
            source={getIconButtonTodayPlan()}
            resizeMode="contain"
          />
          {count > -1 && goingOutPlans && goingOutPlans?.length > 1 && (
            <View style={styles.scheduleCount}>
              <BaseText
                weight="medium"
                size="xSmall"
                text={goingOutPlans?.length.toString()}
              />
            </View>
          )}
        </BaseButton>
      </SlideTabsTooltip>
    );
  };

  return appType === AppType.TAKINO
    ? renderServicePlans()
    : renderGoingOutPlans();
};

export default PopoverTodayPlanCombine;

const styles = StyleSheet.create({
  popoverContentListStyle: {
    width: 580,
    height: 600,
  },
  contentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
  },
  todayPlanListView: {
    paddingTop: 30,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  scheduleCount: {
    width: 18,
    height: 18,
    borderRadius: 18,
    position: 'absolute',
    borderWidth: 0.7,
    borderColor: Colors.BLACK,
    backgroundColor: Colors.WHITE,
    right: -5,
    top: -3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousOvernightView: {
    bottom: -13,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 50,
  },
});
