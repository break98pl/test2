import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {FontSize} from '@themes/typography';
import {Colors} from '@themes/colors';
import BaseTooltip from '@templates/BaseTooltip';
import BaseButton from '@atoms/BaseButton';
import _ from 'lodash';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  filterOptionsInitData,
  selectFilterOptions,
  selectFilterOtherSystemNameValues,
  setIsFiltering,
} from '@modules/careList/careList.slice';
import {CareListFilterOptions} from '@modules/record/record.type';

interface Props {
  isVisible: boolean;
  onCloseButtonPress?(): void;
  onShowTooltipButtonPress?(): void;
  onChooseAdvancedFilterOption?(): void;
  onChooseDefaultFilterOption?(): void;
}

const CareListFilterOptionsButton = ({
  isVisible,
  onCloseButtonPress,
  onShowTooltipButtonPress,
  onChooseAdvancedFilterOption,
  onChooseDefaultFilterOption,
}: Props) => {
  const dispatch = useAppDispatch();

  // text
  const {t} = useTranslation();

  const advancedSearchText = t('care_list.advancedSearch');
  const searchText = t('common.search');
  const closeText = t('common.close');
  const advancedFilterText = t('care_list.openAdvancedFilter');
  const defaultFilterText = t('care_list.defaultFilter');
  const toolTipContentItems = [advancedFilterText, defaultFilterText];

  // states
  const filterOptions = useAppSelector(selectFilterOptions);
  const otherSystemNames = useAppSelector(selectFilterOtherSystemNameValues);
  const initData: CareListFilterOptions = {
    ...filterOptionsInitData,
    cooperationRecords: [...otherSystemNames],
  };
  const isActiveFiltering = !_.isEqual(filterOptions, initData);

  useEffect(() => {
    dispatch(setIsFiltering(isActiveFiltering));
  }, [filterOptions]);

  // methods
  const onChooseItem = (item: string) => {
    switch (item) {
      case advancedFilterText:
        onChooseAdvancedFilterOption && onChooseAdvancedFilterOption();
        break;
      case defaultFilterText:
        onChooseDefaultFilterOption && onChooseDefaultFilterOption();
        break;
    }
  };

  const renderTooltipContent = () => {
    return (
      <View style={styles.tooltipContentContainer}>
        {toolTipContentItems.map(item => {
          return (
            <BaseButton
              style={styles.tooltipItemContainer}
              onPress={() => onChooseItem(item)}
              key={item}>
              <View style={styles.tooltipItem}>
                <BaseText style={styles.tooltipItemText}>{item}</BaseText>
              </View>
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
      placement="bottom"
      closeOnBackgroundInteraction={false}
      closeOnChildInteraction={false}
      closeOnContentInteraction={false}
      title={searchText}
      leftButtonText={closeText}
      content={renderTooltipContent()}
      onLeftButtonPress={onCloseButtonPress}
      contentStyle={styles.tooltip}
      arrowStyle={styles.tooltipArrow}>
      <BaseButton
        style={[styles.button, isActiveFiltering && styles.activeFilterButton]}
        onPress={onShowTooltipButtonPress}>
        <BaseText
          size="xLarge"
          style={[styles.text, isActiveFiltering && styles.activeText]}>
          {advancedSearchText}
        </BaseText>
      </BaseButton>
    </BaseTooltip>
  );
};

export default CareListFilterOptionsButton;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  activeText: {
    color: Colors.TEXT_NAVY,
  },
  button: {
    borderColor: Colors.DARK_GRAY_BORDER,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 62,
    height: 30,
  },
  activeFilterButton: {
    borderColor: Colors.TEXT_NAVY,
    backgroundColor: Colors.EXTRA_LIGHT_BLUE_BACKGROUND,
  },
  tooltipArrow: {
    borderTopColor: Colors.TOOLTIP_HEADER,
  },
  tooltipHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tooltip: {
    borderRadius: 14,
  },
  tooltipContentContainer: {
    width: 260,
    marginTop: -StyleSheet.hairlineWidth,
  },
  tooltipItemContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 244,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.GRAY_PH,
  },
  tooltipItemText: {
    fontSize: FontSize.X_LARGE,
  },
});
