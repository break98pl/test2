import {View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {MealResult} from '@modules/record/record.type';
import {
  getDrinkVolumeText,
  getFoodPercentageText,
} from '@modules/record/record.utils';
import CareListRecordMemoItem from '@molecules/CareListRecordMemoItem';

type Props = {
  memo: string;
  mealResult: MealResult;
};

const CareListMainMealContent = ({mealResult, memo}: Props) => {
  const {t} = useTranslation();

  const mainMealText = t('care_list.mainMeal');
  const subMealText = t('care_list.subMeal');
  const soupText = t('care_list.soup');
  const drinkText = t('care_list.tea');
  const milliliter = t('care_list.milliliter');

  return (
    <View>
      <BaseText>
        {mainMealText}
        {getFoodPercentageText(mealResult.stapleFood)}
        {subMealText}
        {getFoodPercentageText(mealResult.sideFood)}
        {soupText}
        {getDrinkVolumeText(mealResult.soupVolume)} {milliliter}
        {drinkText}
        {getDrinkVolumeText(mealResult.teaVolume)} {milliliter}
      </BaseText>
      <CareListRecordMemoItem memo={memo} />
    </View>
  );
};

export default CareListMainMealContent;
