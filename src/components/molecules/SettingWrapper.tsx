import {View, StyleSheet, StyleProp, TextStyle} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';

interface ISettingWrapperProps {
  children?: React.ReactNode;
  title?: string;
  transparent?: boolean;
  style?: StyleProp<TextStyle>;
}

const SettingWrapper = (props: ISettingWrapperProps) => {
  const {children, title, transparent, style} = props;
  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <View style={styles.header}>
        <BaseText
          weight="normal"
          size="medium"
          style={styles.title}
          text={title}
          color={Colors.GRAY_PH}
        />
      </View>
      <View style={[styles.children, transparent && styles.transparent]}>
        {children}
      </View>
    </View>
  );
};

export default SettingWrapper;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {
    marginLeft: 23,
  },
  children: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 666,
    paddingLeft: 23,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
