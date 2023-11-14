import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Colors} from '@themes/colors';
import BaseTooltip, {BaseTooltipProps} from '@templates/BaseTooltip';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {FontSize, FontWeight} from '@themes/typography';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import BaseButton from '@atoms/BaseButton';
import useVisible from '@hooks/useVisible';

export enum TsushoListFilterType {
  startTime,
  endTime,
  headquarterAndST,
}

interface Props extends BaseTooltipProps {
  type: TsushoListFilterType;
  items: string[];
  filterItems: string[];
  setFilterItems: (items: string[]) => void;
  contentContainerStyle?: ViewStyle;
}

const TsushoListFilterButton = ({
  type,
  contentContainerStyle,
  items = [],
  filterItems = [],
  setFilterItems,
  ...rest
}: Props) => {
  const {t} = useTranslation();

  const filteringCondition =
    items.every(item => filterItems.includes(item)) || !filterItems.length;

  const {
    isVisible,
    showComponent: showTooltip,
    hideComponent: hideTooltip,
  } = useVisible();
  const [tempFilterItems, setTempFilterItems] = useState(items);

  //Reset temp filter items every time tooltip is opened
  useEffect(() => {
    if (isVisible) {
      const newTempFilterItems = !filterItems.length ? items : filterItems;
      setTempFilterItems(newTempFilterItems);
    }
  }, [isVisible]);

  const filterString = useRef('');
  const tooltipTitle = useRef('');

  const handleCloseTooltip = () => {
    hideTooltip();
  };

  const handleSaveFilter = () => {
    let checks = [...tempFilterItems];

    if (!checks.length) {
      checks = [...items];
      setTempFilterItems(checks);
    }

    hideTooltip();
    setFilterItems(checks);
  };

  const handleToggleCheckItem = (item: string) => {
    const temp = [...tempFilterItems];
    const deleteIndex = temp.indexOf(item);

    if (deleteIndex !== -1) {
      temp.splice(deleteIndex, 1);
    } else {
      temp.push(item);
    }

    setTempFilterItems(temp);
  };

  const filterButtonColor = () => {
    return filteringCondition
      ? {}
      : {
          backgroundColor: Colors.EXTRA_LIGHT_BLUE_BACKGROUND,
          borderColor: Colors.TEXT_NAVY,
        };
  };

  const renderType = () => {
    switch (type) {
      case TsushoListFilterType.startTime:
        filterString.current = t('tsusho_vp_list.startTimeFilter');
        tooltipTitle.current = t('tsusho_vp_list.startTimeFilter');
        break;
      case TsushoListFilterType.endTime:
        filterString.current = t('tsusho_vp_list.endTimeFilter');
        tooltipTitle.current = t('tsusho_vp_list.endTimeFilter');
        break;
      case TsushoListFilterType.headquarterAndST:
        filterString.current = t('tsusho_vp_list.headquarterSTFiler');
        tooltipTitle.current = t('tsusho_vp_list.selectSatellite');
        break;
      default:
    }

    return (
      <BaseText
        style={styles.filterText}
        color={filteringCondition ? undefined : Colors.TEXT_NAVY}>
        {filterString.current}
      </BaseText>
    );
  };

  const renderTooltipContent = () => {
    return (
      <View style={styles.tooltipContentContainer}>
        {items.map((item, index) => {
          return (
            <BaseButton
              onPress={() => handleToggleCheckItem(item)}
              key={index}
              style={styles.listItemContainer}>
              <BaseText
                style={
                  type === TsushoListFilterType.headquarterAndST
                    ? styles.normalText
                    : styles.boldText
                }>
                {item}
              </BaseText>
              {tempFilterItems.includes(item) && (
                <FastImage
                  source={images.checkMark}
                  style={styles.checkMark}
                  tintColor={Colors.BLUE}
                />
              )}
            </BaseButton>
          );
        })}
      </View>
    );
  };

  return (
    <BaseTooltip
      isVisible={isVisible}
      showHeader
      leftButtonText={t('common.close')}
      onLeftButtonPress={handleCloseTooltip}
      rightButtonText={t('common.save')}
      onRightButtonPress={handleSaveFilter}
      title={tooltipTitle.current}
      content={renderTooltipContent()}
      placement={'bottom'}
      onClose={hideTooltip}
      closeOnBackgroundInteraction={false}
      tooltipStyle={styles.tooltip}
      {...rest}>
      <BaseButton
        onPress={showTooltip}
        style={StyleSheet.flatten([
          styles.contentContainer,
          contentContainerStyle,
          filterButtonColor(),
        ])}>
        {renderType()}
      </BaseButton>
    </BaseTooltip>
  );
};

export default TsushoListFilterButton;

const styles = StyleSheet.create({
  contentContainer: {
    borderWidth: 1,
    borderColor: Colors.DARK_GRAY_BTN_BORDER,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  filterText: {
    fontWeight: FontWeight.NORMAL,
    fontSize: FontSize.MEDIUM,
    textAlign: 'center',
  },
  tooltip: {
    width: 300,
  },
  tooltipHeader: {
    paddingLeft: 15,
    paddingRight: 10,
    marginBottom: -StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tooltipContentContainer: {
    paddingLeft: 30,
  },
  listItemContainer: {
    height: 56,
    paddingRight: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.GRAY_PH,
    marginTop: -StyleSheet.hairlineWidth,
  },
  boldText: {
    fontWeight: FontWeight.SEMI_BOLD,
    fontSize: FontSize.XX_LARGE,
  },
  normalText: {
    fontWeight: FontWeight.NORMAL,
    fontSize: FontSize.XX_LARGE,
  },
  checkMark: {
    width: 18,
    height: 18,
  },
});
