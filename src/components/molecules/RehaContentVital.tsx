import {StyleSheet, View} from 'react-native';
import React from 'react';
import RehaVitalRow, {TVitalReha} from './RehaVitalRow';

const FAKE_VITAL: TVitalReha = {
  temperature: '40',
  sys: '55',
  dia: '4',
  pulse: '55',
  spo2: '56',
};

const RehaContentVital = () => {
  return (
    <View style={styles.container}>
      <RehaVitalRow isHeader />
      <RehaVitalRow data={FAKE_VITAL} />
    </View>
  );
};

export default RehaContentVital;

const styles = StyleSheet.create({
  container: {
    height: 70,
  },
});
