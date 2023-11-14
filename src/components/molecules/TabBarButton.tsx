import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import React from 'react';
import {
  ImageRequireSource,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props extends TouchableOpacityProps {
  /**
   * Tab bar label.
   */
  tabBarLabel: string;

  /**
   * Mark this tab bar is focused or not.
   */
  isFocused: boolean;

  /**
   * Name of tab icon.
   */
  tabBarIcon: ImageRequireSource;
}

const TabBarButton = ({tabBarLabel, tabBarIcon, isFocused, ...rest}: Props) => {
  return (
    <BaseButton {...rest}>
      <FastImage
        source={tabBarIcon}
        resizeMode={'contain'}
        style={styles.tabBarIcon}
        tintColor={isFocused ? Colors.PRIMARY : Colors.BOLD_GREY}
      />
      <BaseText
        weight="bold"
        color={isFocused ? Colors.PRIMARY : Colors.BOLD_GREY}
        size="xSmall">
        {tabBarLabel}
      </BaseText>
    </BaseButton>
  );
};

const styles = StyleSheet.create({
  tabBarIcon: {
    height: 36,
    width: 36,
  },
});

export default TabBarButton;
