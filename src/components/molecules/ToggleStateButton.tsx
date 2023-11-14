import {StyleSheet, ViewStyle} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {ColorValue} from 'react-native';
import {Colors} from '@themes/colors';
import {TouchableOpacityProps} from 'react-native';
import BaseButton from '@atoms/BaseButton';

interface ToggleStateButtonProps extends TouchableOpacityProps {
  title: string;
  onStateColor?: ColorValue;
  onStateBorderColor?: ColorValue;
  containerStyle?: ViewStyle;
  isOn?: boolean;
}

const ToggleStateButton = ({
  title,
  onStateColor = Colors.EXTRA_LIGHT_BLUE_BACKGROUND,
  onStateBorderColor = Colors.TEXT_NAVY,
  containerStyle,
  isOn,
  ...rest
}: ToggleStateButtonProps) => {
  return (
    <BaseButton
      {...rest}
      style={StyleSheet.flatten([
        styles.container,
        containerStyle,
        {
          backgroundColor: isOn ? onStateColor : Colors.WHITE,
          borderColor: isOn ? onStateBorderColor : Colors.DARK_GRAY_BTN_BORDER,
        },
      ])}>
      <BaseText size="xxLarge" color={isOn ? Colors.TEXT_NAVY : undefined}>
        {title}
      </BaseText>
    </BaseButton>
  );
};

export default ToggleStateButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    height: 30,
    paddingHorizontal: 2,
  },
});
