import {View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {
  getDrinkVolumeText,
  getFoodPercentageText,
} from '@modules/record/record.utils';
import {MealResult} from '@modules/record/record.type';
import CareListRecordMemoItem from '@molecules/CareListRecordMemoItem';

type Props = {
  memo: string;
  mealResult: MealResult;
};

const CareListSubMealContent = ({mealResult, memo}: Props) => {
  const {t} = useTranslation();

  const snackText = t('care_list.snack');
  const drinkText = t('care_list.drink');
  const milliliterText = t('care_list.milliliter');

  return (
    <View>
      <BaseText>
        {snackText}
        {getFoodPercentageText(mealResult.snackFood)}
        {drinkText}
        {getDrinkVolumeText(mealResult.snackDrink)} {milliliterText}
      </BaseText>
      <CareListRecordMemoItem memo={memo} />
    </View>
  );
};

export default CareListSubMealContent;
