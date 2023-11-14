import {View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import useHighlightMemo from '@hooks/useHighlightMemo';

type Props = {
  memo: string;
  category: string;
};

const CareListAttendanceContent = ({category, memo}: Props) => {
  const {highlightMemo} = useHighlightMemo();

  return (
    <View>
      <BaseText>{category}</BaseText>
      {memo && <BaseText>{highlightMemo(memo)}</BaseText>}
    </View>
  );
};

export default CareListAttendanceContent;
