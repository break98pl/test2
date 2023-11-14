import {View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {BathResult} from '@modules/record/record.type';
import CareListRecordMemoItem from '@molecules/CareListRecordMemoItem';

type Props = {
  memo: string;
  bathResult: BathResult;
};

const CareListBathContent = ({bathResult, memo}: Props) => {
  const {t} = useTranslation();

  const bathingMethodText = t('care_list.bathingMethod');

  return (
    <View>
      <BaseText>
        {bathResult.isDone
          ? t('care_list.implemented')
          : t('care_list.notImplemented')}
      </BaseText>
      {bathResult.isDone && (
        <BaseText>
          {bathingMethodText}
          {bathResult.bathStyle ?? ''}
        </BaseText>
      )}
      <CareListRecordMemoItem memo={memo} />
    </View>
  );
};

export default CareListBathContent;
