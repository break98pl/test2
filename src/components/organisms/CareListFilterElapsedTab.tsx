import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TabComponentProps} from '@templates/SlideTabsModal';
import SelectionList, {TextListItem} from '@organisms/SelectionList';
import {FilterModalTabs} from './CareListFilterModal';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@store/config';
import {selectFilterElapsedClassificationValues} from '@modules/careList/careList.slice';
import {convertFilterValuesToTextListItems} from '@modules/careList/careList.utils';

interface Props extends TabComponentProps {
  setElapsedClassificationText: React.Dispatch<React.SetStateAction<string>>;
  setIsShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInMainTab: React.Dispatch<React.SetStateAction<boolean>>;
}

const CareListFilterElapsedTab = ({
  setElapsedClassificationText,
  setIsShowSaveButton,
  setIsInMainTab,
  jumpTo,
}: Props) => {
  const {t} = useTranslation();
  const defaultValue = t('common.all'); // elapsed classification default options is "all"

  const defaultItem: TextListItem = {id: 'default', label: defaultValue};
  const elapsedValues = useAppSelector(selectFilterElapsedClassificationValues);

  /**
   * handle clicking on an elapsed classification choice
   */
  const handleChooseElapsedItem = (item: TextListItem) => {
    if (item.label === defaultValue) {
      setElapsedClassificationText('');
    } else {
      setElapsedClassificationText(item.label);
    }

    setIsInMainTab(true);
    setIsShowSaveButton(true);
    jumpTo(FilterModalTabs.MainTab);
  };

  return (
    <View style={styles.container}>
      <SelectionList
        onSelectItem={handleChooseElapsedItem}
        data={[
          defaultItem,
          ...convertFilterValuesToTextListItems(elapsedValues),
        ]}
      />
    </View>
  );
};

export default CareListFilterElapsedTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
