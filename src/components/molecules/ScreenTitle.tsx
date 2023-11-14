import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import FastImage, {Source} from 'react-native-fast-image';
import BaseText from '@atoms/BaseText';
import {FontSize, FontWeight} from '@themes/typography';
import {Colors} from '@themes/colors';

type ScreenTitleProps = {
  title: string;
  img: Source;
  containerStyle?: ViewStyle;
  isShowImg?: boolean;
};

const ScreenTitle = ({
  title,
  img,
  containerStyle,
  isShowImg = false,
}: ScreenTitleProps) => {
  return (
    <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {isShowImg && (
        <FastImage source={img} style={styles.img} resizeMode="contain" />
      )}
      <BaseText style={styles.title}>{title}</BaseText>
    </View>
  );
};

export default ScreenTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  title: {
    color: Colors.GRAY_TITLE,
    fontWeight: FontWeight.SEMI_BOLD,
    fontSize: FontSize.XX_LARGE,
    marginLeft: 10,
  },
});
