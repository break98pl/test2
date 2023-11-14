import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigatorParams, ScreenName} from '@navigation/type';
import BaseButton from '@atoms/BaseButton';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const SettingButton = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AuthStackNavigatorParams>>();

  return (
    <BaseButton
      hitSlop={10}
      style={styles.settingButton}
      onPress={() => {
        navigate(ScreenName.Setting);
      }}>
      <FastImage
        source={images.settings}
        style={styles.imgSetting}
        resizeMode="contain"
      />
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  settingButton: {
    position: 'absolute',
    top: 7,
    left: 20,
    zIndex: 1,
  },
  imgSetting: {
    width: 32,
    height: 32,
  },
});

export default SettingButton;
