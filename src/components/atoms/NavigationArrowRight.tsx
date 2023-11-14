import {ColorValue, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';

type Props = {
  tintColor?: ColorValue;
};

const NavigationArrowRight = ({tintColor = Colors.TEXT_LINK_BLUE}: Props) => {
  return (
    <FastImage
      source={images.rightArrow}
      style={styles.navImg}
      tintColor={tintColor}
      resizeMode="contain"
    />
  );
};

export default NavigationArrowRight;

const styles = StyleSheet.create({
  navImg: {
    width: 11,
    height: 11,
  },
});
