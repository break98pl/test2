import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';

interface INotExistDataProps {
  text?: string;
}

const NotExistData = (props: INotExistDataProps) => {
  const {text} = props;
  const {t} = useTranslation();

  return (
    <>
      <View style={styles.noRegisteredView}>
        <BaseText
          color={Colors.BOLD_RED}
          size="small"
          weight="normal"
          text={t('popover.no_data', {
            label: text,
          })}
        />
      </View>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(e => (
        <View key={e} style={styles.noRegisteredView} />
      ))}
    </>
  );
};

export default NotExistData;

const styles = StyleSheet.create({
  noRegisteredView: {
    flexWrap: 'wrap',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
    paddingHorizontal: 15,
    height: 70,
    justifyContent: 'center',
  },
});
