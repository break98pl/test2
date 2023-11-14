import {StyleSheet, View} from 'react-native';
import React from 'react';

interface IBloodPressureBlockProps {
  children?: React.ReactNode;
}

const BloodPressureBlock = (props: IBloodPressureBlockProps) => {
  const {children} = props;
  return <View style={styles.bloodPressureFrame}>{children}</View>;
};

export default BloodPressureBlock;

const styles = StyleSheet.create({
  bloodPressureFrame: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
