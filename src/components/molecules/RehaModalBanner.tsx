import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';

const RehaModalBanner = () => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <BaseText text={t('tsusho_vp_list.banner_reha_text')} />
    </View>
  );
};

export default RehaModalBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 35,
    backgroundColor: Colors.LIGHT_RED,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
