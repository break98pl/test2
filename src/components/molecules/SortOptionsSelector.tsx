import {StyleSheet} from 'react-native';
import React, {memo, useCallback, useState} from 'react';
import BaseTooltip from '@templates/BaseTooltip';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {getTextFromFilterType} from '@modules/tenant/tenant.utils';
import BaseButton from '@atoms/BaseButton';
import useVisible from '@hooks/useVisible';
import {SortingType} from '@modules/tenant/tenant.type';

interface Props {
  data: TextListItem[];
  defaultSelectedOption?: SortingType;
  onSelectItem?: (value: SortingType) => void;
}

const SortOptionsSelector = ({
  data,
  onSelectItem,
  defaultSelectedOption = SortingType.ByAlphabet,
}: Props) => {
  const {t} = useTranslation();

  const [selectedSortingOption, setSortingOption] = useState(
    defaultSelectedOption,
  );

  const {
    isVisible: showSortingOptionTooltip,
    showComponent: displaySortingOptionTooltip,
    hideComponent: hideSortingOptionTooltip,
  } = useVisible();

  /**
   * Set selected sorting option.
   * Called when user chooses a sorting option on the tooltip.
   */
  const onSelectSortingOption = useCallback((value: TextListItem) => {
    hideSortingOptionTooltip();
    setSortingOption(+value.id);
    if (onSelectItem) {
      onSelectItem(+value.id);
    }
  }, []);

  return (
    <BaseTooltip
      headerStyle={styles.headerTooltipArrange}
      showHeader
      placement={'bottom'}
      isVisible={showSortingOptionTooltip}
      onClose={hideSortingOptionTooltip}
      contentStyle={styles.arrangeTooltipContent}
      closeOnContentInteraction={false}
      leftButtonText={t('user_list.close')}
      onLeftButtonPress={hideSortingOptionTooltip}
      title={t('user_list.arrange')}
      content={
        <SelectionList
          data={data}
          valueChosen={selectedSortingOption.toString()}
          showCheckIcon
          usingTrans
          onSelectItem={onSelectSortingOption}
        />
      }>
      <BaseButton
        onPress={displaySortingOptionTooltip}
        style={styles.arrangeBtn}>
        <BaseText
          size="xxLarge"
          color={Colors.TEXT_NAVY}
          text={t(getTextFromFilterType(selectedSortingOption))}
        />
      </BaseButton>
    </BaseTooltip>
  );
};

export default memo(SortOptionsSelector);

const styles = StyleSheet.create({
  headerTooltipArrange: {
    borderBottomWidth: 0,
  },
  arrangeTooltipContent: {
    backgroundColor: Colors.WHITE,
    width: 250,
    height: '100%',
  },
  arrangeBtn: {
    backgroundColor: Colors.LIGHT_BLUE,
    borderRadius: 4,
    borderColor: Colors.TEXT_NAVY,
    borderStyle: 'solid',
    borderWidth: 0.5,
    width: 101,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
