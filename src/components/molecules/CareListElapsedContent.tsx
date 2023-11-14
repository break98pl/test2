import {View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import useHighlightMemo from '@hooks/useHighlightMemo';

type Props = {
  memo: string;
  place: string;
};

const CareListElapsedContent = ({place, memo}: Props) => {
  const {t} = useTranslation();
  const placeText = t('care_list.place');
  const {highlightMemo} = useHighlightMemo();

  return (
    <View>
      {place && (
        <BaseText>
          {placeText}
          {place}
          {'\n'}
        </BaseText>
      )}
      <BaseText>{highlightMemo(memo)}</BaseText>
    </View>
  );
};

export default CareListElapsedContent;
