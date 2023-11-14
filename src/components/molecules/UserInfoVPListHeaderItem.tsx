import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';

type Props = {
  width: DimensionValue;
};

const UserInfoVPListHeaderItem = ({width}: Props) => {
  const {t} = useTranslation();

  return (
    <View
      style={StyleSheet.flatten([styles.center, styles.borderRight, {width}])}>
      <BaseText style={styles.headerText}>
        {t('tsusho_vp_list.userInfo')}
      </BaseText>
    </View>
  );
};

export default UserInfoVPListHeaderItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: FontSize.MEDIUM,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderRight: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.LIGHT_GRAY,
  },
});
