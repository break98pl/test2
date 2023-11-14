import React from 'react';

import Screen from '@templates/Screen';
import ShiJuTaNavBar from '@organisms/ShiJuTaNavBar';
import TenantTableHeader from '@organisms/TenantTableHeader';
import TenantSectionList from '@organisms/TenantSectionList';

const TenantListScreen = () => {
  return (
    <Screen
      barStyle="dark-content"
      withBottomBar
      enableSafeArea
      navBar={<ShiJuTaNavBar />}>
      <TenantTableHeader />
      <TenantSectionList />
    </Screen>
  );
};

export default TenantListScreen;
