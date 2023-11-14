import {StyleSheet, View} from 'react-native';
import React from 'react';
import {DimensionValue} from 'react-native';

type Props = {
  width: DimensionValue;
};

const NavigationVPListHeaderItem = ({width}: Props) => {
  return (
    <View
      style={StyleSheet.flatten([
        styles.center,
        {
          width,
        },
      ])}
    />
  );
};

export default NavigationVPListHeaderItem;

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
