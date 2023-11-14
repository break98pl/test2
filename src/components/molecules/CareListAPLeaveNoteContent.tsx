import React from 'react';
import BaseText from '@atoms/BaseText';
import {View} from 'react-native';
import useHighlightMemo from '@hooks/useHighlightMemo';

interface Props {
  memo: string;
}

const CareListAPLeaveNoteContent = ({memo}: Props) => {
  const {highlightMemo} = useHighlightMemo();

  return memo ? (
    <View>
      <BaseText>{highlightMemo(memo)}</BaseText>
    </View>
  ) : (
    <></>
  );
};

export default CareListAPLeaveNoteContent;
