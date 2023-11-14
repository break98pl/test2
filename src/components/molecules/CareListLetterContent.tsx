import React from 'react';
import {View} from 'react-native';
import BaseText from '@atoms/BaseText';
import useHighlightMemo from '@hooks/useHighlightMemo';

type Props = {
  memo: string;
};

const CareListLetterContent = ({memo}: Props) => {
  const {highlightMemo} = useHighlightMemo();

  return (
    <View>
      <BaseText>{highlightMemo(memo)}</BaseText>
    </View>
  );
};

export default CareListLetterContent;
