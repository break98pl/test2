import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {MealResult} from '@modules/record/record.type';
import {getDrinkVolumeText} from '@modules/record/record.utils';
import CareListRecordMemoItem from '@molecules/CareListRecordMemoItem';

type Props = {
  memo: string;
  mealResult: MealResult;
};

const CareListOtherDrinkContent = ({mealResult, memo}: Props) => {
  const {t} = useTranslation();

  // text
  const drinkCategoryText = t('care_list.drinkCategory');
  const drinkAmountText = t('care_list.drinkAmount');
  const drinkContentText = t('care_list.drinkContent');
  const milliliterText = t('care_list.milliliter');

  return (
    <View style={styles.container}>
      <BaseText>{drinkCategoryText}</BaseText>
      <BaseText>
        {drinkAmountText}
        {getDrinkVolumeText(mealResult.otherDrink)} {milliliterText}
        {drinkContentText}
        {mealResult.otherDrinkType}
      </BaseText>
      <CareListRecordMemoItem memo={memo} />
    </View>
  );
};

export default CareListOtherDrinkContent;

const styles = StyleSheet.create({
  container: {},
});
