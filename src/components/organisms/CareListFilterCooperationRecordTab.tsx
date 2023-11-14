import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {TabComponentProps} from '@templates/SlideTabsModal';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';
import {Colors} from '@themes/colors';
import {selectFilterOtherSystemNameValues} from '@modules/careList/careList.slice';
import Checkbox, {CheckboxType} from '@atoms/CheckBox';
import {useAppSelector} from '@store/config';

interface Props extends TabComponentProps {
  tempCooperationRecords: string[];
  isCheckAllCooperationRecords: boolean;
  setTempCooperationRecords: React.Dispatch<React.SetStateAction<string[]>>;
  setIsCheckAllCooperationRecords: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const CareListFilterCooperationRecordTab = ({
  tempCooperationRecords,
  setTempCooperationRecords,
  isCheckAllCooperationRecords,
  setIsCheckAllCooperationRecords,
}: Props) => {
  const {t} = useTranslation();
  const checkAllText = t('common.checkAll');
  const unCheckAllText = t('common.uncheckAll');

  const otherSystemNames = useAppSelector(selectFilterOtherSystemNameValues);

  /**
   * handle check and uncheck all
   */
  const handleCheck = () => {
    if (isCheckAllCooperationRecords) {
      setTempCooperationRecords([]);
    } else {
      setTempCooperationRecords(otherSystemNames);
    }
    setIsCheckAllCooperationRecords(!isCheckAllCooperationRecords);
  };

  const getIsCheckedItemCondition = (item: string) => {
    return tempCooperationRecords.includes(item);
  };

  const onPressListItem = (item: string) => {
    const isItemChecked = getIsCheckedItemCondition(item);

    if (isItemChecked) {
      // if item is already checked, remove it from temp array
      const deleteIndex = tempCooperationRecords.findIndex(
        record => record === item,
      );

      const newTemp = [...tempCooperationRecords];
      newTemp.splice(deleteIndex, 1);
      setTempCooperationRecords(newTemp);
    } else {
      // else add it into temp array
      const newTemp = [...tempCooperationRecords, item];
      setTempCooperationRecords(newTemp);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.checkContainer}>
        <BaseButton onPress={handleCheck}>
          <BaseText color={Colors.TEXT_NAVY}>
            {isCheckAllCooperationRecords ? unCheckAllText : checkAllText}
          </BaseText>
        </BaseButton>
      </View>
      <ScrollView>
        <BaseButton activeOpacity={1}>
          {otherSystemNames.map((item, index) => {
            return (
              <BaseButton
                onPress={() => onPressListItem(item)}
                key={item + index}
                style={styles.listItem}>
                <Checkbox
                  disabled
                  isCheck={getIsCheckedItemCondition(item)}
                  size="s"
                  checkboxType={CheckboxType.CircleType1}
                />
                <BaseText size="large">{item}</BaseText>
              </BaseButton>
            );
          })}
        </BaseButton>
      </ScrollView>
    </View>
  );
};

export default CareListFilterCooperationRecordTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkContainer: {
    backgroundColor: Colors.LIGHT_GRAY_BACKGROUND,
    padding: 14,
  },
  listItem: {
    height: 46,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
    gap: 12,
  },
});
