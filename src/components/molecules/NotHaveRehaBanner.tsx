import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize, FontWeight} from '@themes/typography';

const NotHaveRehaBanner = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <BaseText style={styles.text}>{t('tsusho_vp_list.noRehaPlan')}</BaseText>
    </View>
  );
};

export default NotHaveRehaBanner;

const styles = StyleSheet.create({
  container: {
    width: '94%',
    height: '80%',
    backgroundColor: Colors.REHA_LIGHT_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.WHITE,
    fontSize: FontSize.XX_LARGE,
    fontWeight: FontWeight.NORMAL,
  },
});
