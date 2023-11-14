import {View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {ExcretionResult} from '@modules/record/record.type';
import CareListRecordMemoItem from '@molecules/CareListRecordMemoItem';

type Props = {
  memo: string;
  excretionResult: ExcretionResult;
};

const CareListExcretionContent = ({excretionResult, memo}: Props) => {
  const {t} = useTranslation();

  const excretionEquipmentText = t('care_list.excretionEquipment');
  const outOfControlExcretionText = t('care_list.outOfControlExcretion');
  const urinationAmountText = t('care_list.urinationAmount');
  const stateOfUrination = t('care_list.stateOfUrination');
  const amountOfDefecation = t('care_list.amountOfDefecation');
  const stateOfDefecation = t('care_list.stateOfDefecation');
  const noneUrineOutput = t('care_list.noneUrineOutput');
  const noneFecalOutput = t('care_list.noneFecalOutput');

  return (
    <View>
      {excretionResult.equipment && (
        <BaseText>
          {excretionEquipmentText}
          {excretionResult.equipment}
        </BaseText>
      )}
      {excretionResult.isUncontrolled && (
        <BaseText style={styles.marginLeft}>
          {outOfControlExcretionText}
        </BaseText>
      )}
      <BaseText>
        {excretionResult.urineOutput
          ? `${urinationAmountText}${excretionResult.urineOutput}`
          : noneUrineOutput}
      </BaseText>
      <BaseText>
        {excretionResult.urineForm &&
          `${stateOfUrination}${excretionResult.urineForm}`}
        {excretionResult.fecalOutput
          ? `${amountOfDefecation}${excretionResult.fecalOutput}`
          : noneFecalOutput}
        {excretionResult.fecalForm &&
          `${stateOfDefecation}${excretionResult.fecalForm}`}
      </BaseText>
      <CareListRecordMemoItem memo={memo} />
    </View>
  );
};

export default CareListExcretionContent;

const styles = StyleSheet.create({
  marginLeft: {
    marginLeft: 12,
  },
});
