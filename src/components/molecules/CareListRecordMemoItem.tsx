import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import useHighlightMemo from '@hooks/useHighlightMemo';

type CareListRecordMemoItemProps = {
  memo: string;
};

const CareListRecordMemoItem = ({memo = ''}: CareListRecordMemoItemProps) => {
  const {t} = useTranslation();
  const memoText = t('care_list.memo');
  const {highlightMemo} = useHighlightMemo();

  return memo.length > 0 ? (
    <View style={styles.container}>
      <BaseText>{memoText}:</BaseText>
      <BaseText>----------------------------</BaseText>
      <BaseText>{highlightMemo(memo)}</BaseText>
    </View>
  ) : (
    <></>
  );
};

export default CareListRecordMemoItem;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
