import React from 'react';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import ShiJuTaNavBar from '@organisms/ShiJuTaNavBar';
import TsuNavBar from '@organisms/TsuNavBar';
import {useAppSelector} from '@store/config';
import Screen from '@templates/Screen';
import VitalTableHeader from '@organisms/VitalTableHeader';
import VitalSectionList from '@organisms/VitalSectionList';
import {selectTenantSectionData} from '@modules/tenant/tenant.slice';
import {selectListVisitPlans} from '@modules/visitPlan/tsushoVPList.slice';
import {convertToVitalUIList} from '@modules/vital/vital.utils';

const VitalScreen = () => {
  const appType = useAppSelector(selectAppType);
  const vitalSectionList = useAppSelector(selectTenantSectionData);
  const vitalTsushoList = useAppSelector(selectListVisitPlans);

  const renderNavBar = () => {
    return appType === AppType.TSUSHO ? <TsuNavBar /> : <ShiJuTaNavBar />;
  };

  return (
    <Screen
      enableSafeArea={true}
      barStyle="dark-content"
      withBottomBar
      navBar={renderNavBar()}>
      <VitalTableHeader />
      <VitalSectionList
        data={convertToVitalUIList(vitalTsushoList)}
        sections={appType === AppType.TSUSHO ? undefined : vitalSectionList}
      />
    </Screen>
  );
};

export default VitalScreen;
