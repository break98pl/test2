import React from 'react';
import {
  ActivityIndicator,
  ColorValue,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import useVisible from '@hooks/useVisible';

export interface BaseButtonProps extends TouchableOpacityProps {
  /**
   * Button label
   */
  text?: string;

  /**
   * Custom label style
   */
  textStyle?: StyleProp<TextStyle>;

  /**
   * Show/hide loading button's indicator.
   */
  loading?: boolean;

  /**
   * loading color
   */
  colorLoading?: ColorValue;

  /**
   * Dimming button when it is disabled.
   */
  dimmingWhenDisabled?: boolean;

  /**
   * change backgroundcolor when pressing
   */
  enableAnimatedPress?: boolean;
}

const BaseButton = ({
  text,
  style,
  textStyle,
  loading,
  disabled,
  colorLoading,
  dimmingWhenDisabled = false,
  children,
  enableAnimatedPress = false,
  ...rest
}: BaseButtonProps) => {
  const customStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      opacity: disabled && dimmingWhenDisabled ? 0.5 : 1,
    },
    style,
  ]);
  const {
    isVisible: isShowReportTooltip,
    showComponent: openSettingReportTooltip,
    hideComponent: hideSettingReportTooltip,
  } = useVisible();
  return (
    <TouchableOpacity
      disabled={disabled}
      onPressIn={openSettingReportTooltip}
      onPressOut={hideSettingReportTooltip}
      activeOpacity={disabled ? (dimmingWhenDisabled ? 0.5 : 1) : 0.7}
      style={StyleSheet.compose(
        styles.button,
        enableAnimatedPress && isShowReportTooltip
          ? StyleSheet.compose(customStyle, styles.chosenItem)
          : customStyle,
      )}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={colorLoading} />
      ) : children ? (
        children
      ) : (
        <BaseText
          text={text}
          style={StyleSheet.compose(styles.text, textStyle)}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {},
  text: {
    textAlign: 'center',
  },
  chosenItem: {
    backgroundColor: Colors.CHOOSING_BG,
  },
});

export default React.memo(BaseButton);
