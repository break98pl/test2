import React from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
} from 'react-native';
import {
  FontSize,
  Weight,
  Size,
  FontWeight,
  LineHeight,
  Opacity,
} from '@themes/typography';
import {Colors} from '@themes/colors';

interface Props extends TextProps {
  /**
   * Text content
   */
  text?: string;

  /**
   * Default text content.
   */
  defaultText?: string;

  /**
   * Custom text style
   */
  style?: StyleProp<TextStyle>;

  /**
   * Text weight, e.g Weight.LIGHT,...
   */
  weight?: Weight;

  /**
   * Text size, e.g Size.SMALL, Size.MEDIUM,...
   */
  size?: Size;

  /**
   * Text's color.
   */
  color?: ColorValue;

  /**
   * Line height size, e.g Size.SMALL, ...
   */
  lineHeight?: Size;

  /**
   * Down opacity of text as placeholder
   */
  opacity?: Opacity;
}

const BaseText = (props: Props) => {
  const {
    text,
    defaultText = '',
    style,
    weight = 'normal',
    size = 'medium',
    opacity = 'normal',
    lineHeight,
    color = Colors.TEXT_PRIMARY,
    children,
    ...rest
  } = props;

  const content = text ? text : defaultText;
  const defaultStyle: TextStyle = StyleSheet.flatten([
    weight === 'light' && styles.light,
    weight === 'normal' && styles.normal,
    weight === 'medium' && styles.medium,
    weight === 'semiBold' && styles.semiBold,
    weight === 'bold' && styles.bold,
    size === 'xSmall' && styles.xSmall,
    size === 'small' && styles.small,
    size === 'medium' && styles.mediumSize,
    size === 'large' && styles.large,
    size === 'xLarge' && styles.xLarge,
    size === 'xxLarge' && styles.xxLarge,
    lineHeight === 'small' && styles.lineHeightSmall,
    lineHeight === 'medium' && styles.lineHeightMedium,
    lineHeight === 'large' && styles.lineHeightLarge,
    lineHeight === 'xLarge' && styles.lineHeightXLarge,
    lineHeight === 'xxLarge' && styles.lineHeightXXLarge,
    opacity === 'low' && styles.opacity50Percent,
    opacity === 'normal' && styles.opacity100Percent,
    {
      color: color,
    },
  ]);

  return (
    <Text style={[StyleSheet.compose(defaultStyle, style)]} {...rest}>
      {children ? children : content}
    </Text>
  );
};

const styles = StyleSheet.create({
  light: {
    fontWeight: FontWeight.LIGHT,
  },
  normal: {
    fontWeight: FontWeight.NORMAL,
  },
  medium: {
    fontWeight: FontWeight.MEDIUM,
  },
  semiBold: {
    fontWeight: FontWeight.SEMI_BOLD,
  },
  bold: {
    fontWeight: FontWeight.BOLD,
  },
  xSmall: {
    fontSize: FontSize.X_SMALL,
  },
  small: {
    fontSize: FontSize.SMALL,
  },
  mediumSize: {
    fontSize: FontSize.MEDIUM,
  },
  large: {
    fontSize: FontSize.LARGE,
  },
  xLarge: {
    fontSize: FontSize.X_LARGE,
  },
  xxLarge: {
    fontSize: FontSize.XX_LARGE,
  },
  lineHeightSmall: {
    lineHeight: LineHeight.SMALL,
  },
  lineHeightMedium: {
    lineHeight: LineHeight.MEDIUM,
  },
  lineHeightLarge: {
    lineHeight: LineHeight.LARGE,
  },
  lineHeightXLarge: {
    lineHeight: LineHeight.XLARGE,
  },
  lineHeightXXLarge: {
    lineHeight: LineHeight.XX_LARGE,
  },
  opacity50Percent: {
    opacity: 0.5,
  },
  opacity100Percent: {
    opacity: 1,
  },
});

export default React.memo(BaseText);
