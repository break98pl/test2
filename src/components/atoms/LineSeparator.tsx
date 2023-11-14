import React from 'react';
import {ColorValue, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '@themes/colors';

interface Props {
  /**
   * Define line's color.
   */
  color?: ColorValue;

  /**
   * Define custom style for separator.
   */
  style?: StyleProp<ViewStyle>;
}

const LineSeparator = ({color = Colors.LIGHT_GRAY, style}: Props) => {
  const customStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor: color,
    },
    style,
  ]);

  return <View style={StyleSheet.compose(styles.separator, customStyle)} />;
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
  },
});

export default React.memo(LineSeparator);
