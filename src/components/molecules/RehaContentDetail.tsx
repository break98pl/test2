import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import RehaContentRow from './RehaContentRow';
import {FAKE_REHA_DATAIL} from '@modules/visitPlan/dummyData';

const RehaContentDetail = () => {
  return (
    <View style={styles.container}>
      <RehaContentRow isHeader />
      <ScrollView>
        {FAKE_REHA_DATAIL.map((e, index) => {
          return <RehaContentRow key={index} data={e} />;
        })}
      </ScrollView>
    </View>
  );
};

export default RehaContentDetail;

const styles = StyleSheet.create({
  container: {
    height: 430,
  },
});
