import {StyleSheet} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {FontSize} from '@themes/typography';
import {Colors} from '@themes/colors';

const CreateNewRecordButton = () => {
  const {t} = useTranslation();

  const createNewRecordText = t('care_list.createNewRecord');

  return <BaseText style={styles.text}>{createNewRecordText}</BaseText>;
};

export default CreateNewRecordButton;

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.XX_LARGE,
    color: Colors.PRIMARY,
    marginLeft: 10,
  },
});
