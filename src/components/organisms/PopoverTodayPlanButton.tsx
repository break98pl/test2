import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {useTranslation} from 'react-i18next';
import BaseButton from '@atoms/BaseButton';
import FastImage, {Source} from 'react-native-fast-image';
import {Colors} from '@themes/colors';
import TodayPlanDetailContent from './TodayPlanDetailContent';
import SlideTabsTooltip, {TabComponentProps} from '@templates/SlideTabsTooltip';
import BaseText from '@atoms/BaseText';
import {useSelector} from 'react-redux';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import TodayPlanSelectionList from './TodayPlanSelectionList';
import {GoingOutPlan} from '@modules/tenant/tenant.type';
import {SceneRendererProps} from 'react-native-tab-view';
import {TooltipImperativeHandle} from '@modules/careList/careList.type';
import {DimensionValue} from 'react-native';

export enum TodayPlanKey {
  TodayPlanList = 'todayPlanList',
  TodayPlanDetail = 'todayPlanDetail',
}

interface Props {
  count?: number;
  todayPlans: GoingOutPlan[];
  todayPlanIcon?: Source;
  useValueOutComponentShowTooltip?: boolean;
  showTooltip?: boolean;
  style?: ViewStyle;
  width?: DimensionValue;
  height?: DimensionValue;
  isLineBreakDate?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  tooltipTitle?: string;
  renderCustomChildren?: (goingOutPlans: GoingOutPlan[]) => React.ReactElement;
}

const PopoverTodayPlanButton = forwardRef<TooltipImperativeHandle, Props>(
  (props, ref) => {
    const {
      todayPlans,
      count = todayPlans.length,
      todayPlanIcon,
      useValueOutComponentShowTooltip,
      showTooltip,
      style,
      width = 580,
      height = 600,
      isLineBreakDate = false,
      onPress,
      onClose,
      tooltipTitle = '',
      renderCustomChildren,
    } = props;
    const {t} = useTranslation();
    const [isShowPopover, setIsShowPopover] = useState(false);
    const [todayPlanDetailData, setTodayPlanDetailData] =
      useState<GoingOutPlan>();
    const appType = useSelector(selectAppType);

    const openPopover = () => {
      if (useValueOutComponentShowTooltip && onPress) {
        onPress();
      } else if (todayPlans) {
        setIsShowPopover(true);
        setTodayPlanDetailData(todayPlans[0]);
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

    const renderTodayPlanListContent = ({jumpTo}: TabComponentProps) => {
      const handleShowPlanDetail = (value: GoingOutPlan) => {
        if (appType !== AppType.TAKINO) {
          setTodayPlanDetailData(value);
          jumpTo(TodayPlanKey.TodayPlanDetail);
        }
      };

      return (
        <>
          {todayPlans.length > 1 ? (
            <View style={styles.contentPopover}>
              <TodayPlanSelectionList
                separator
                style={styles.todayPlanListView}
                data={todayPlans}
                onSelectItem={handleShowPlanDetail}
                isLineBreakDate={isLineBreakDate}
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
        <TodayPlanDetailContent
          data={todayPlanDetailData}
          isLineBreakDate={isLineBreakDate}
        />
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

    useImperativeHandle(
      ref,
      () => {
        return {
          displayTooltip() {
            openPopover();
          },
        };
      },
      [],
    );

    return (
      <SlideTabsTooltip
        renderScene={renderScene}
        onBack={handleBack}
        showHeader
        isVisible={
          useValueOutComponentShowTooltip ? showTooltip : isShowPopover
        }
        placement="right"
        onClose={hidePopover}
        showChildInTooltip={false}
        closeOnContentInteraction={false}
        contentStyle={{width, height}}
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
        {renderCustomChildren ? (
          renderCustomChildren(todayPlans)
        ) : (
          <BaseButton style={style} onPress={openPopover}>
            <FastImage
              style={styles.recordInputIcon}
              source={todayPlanIcon}
              resizeMode="contain"
            />
            {count > 1 && (
              <View style={styles.scheduleCount}>
                <BaseText
                  weight="medium"
                  size="xSmall"
                  text={count.toString()}
                />
              </View>
            )}
          </BaseButton>
        )}
      </SlideTabsTooltip>
    );
  },
);

export default PopoverTodayPlanButton;

const styles = StyleSheet.create({
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
});
