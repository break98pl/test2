import React from 'react';
import Screen from '@templates/Screen';
import TsushoVPTable from '@organisms/TsushoVPTable';
import {StyleSheet, View} from 'react-native';
import TsushoVPTableHeader from '@organisms/TsushoVPTableHeader';
import TsuNavBar from '@organisms/TsuNavBar';

const TsushoVisitPlanList = () => {
  return (
    <Screen
      barStyle="dark-content"
      withBottomBar
      enableSafeArea
      navBar={<TsuNavBar />}>
      <View style={styles.fullSize}>
        <TsushoVPTableHeader />
        <TsushoVPTable />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  fullSize: {
    flex: 1,
  },
});

export default TsushoVisitPlanList;
