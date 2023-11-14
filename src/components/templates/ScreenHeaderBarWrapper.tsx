import {StyleSheet, View} from 'react-native';
import React, {ReactNode} from 'react';
import {Colors} from '@themes/colors';

type ScreenHeaderBarWrapperProps = {
  children: ReactNode;
};

const ScreenHeaderBarWrapper = ({children}: ScreenHeaderBarWrapperProps) => {
  return <View style={styles.container}>{children}</View>;
};

export default ScreenHeaderBarWrapper;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.TABLE_BORDER_GRAY,
  },
});
