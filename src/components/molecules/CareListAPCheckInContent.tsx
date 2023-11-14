import React from 'react';
import {View} from 'react-native';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import useHighlightMemo from '@hooks/useHighlightMemo';

interface Props {
  memo: string;
}

const CareListAPCheckInContent = ({memo}: Props) => {
  const {t} = useTranslation();
  const {highlightMemo} = useHighlightMemo();

  return (
    <View>
      <BaseText>{t('care_list.apCheckin')}</BaseText>
      {memo && <BaseText>{highlightMemo(memo)}</BaseText>}
    </View>
  );
};

export default CareListAPCheckInContent;
