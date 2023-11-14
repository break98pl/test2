import {selectAppType} from '@modules/authentication/auth.slice';
import {ElapsedListItem} from '@modules/elapsed/elapsed.type';
import {AppType} from '@modules/setting/setting.type';
import ElapsedTableHeader from '@organisms/ElapsedTableHeader';
import ElapsedSectionList from '@organisms/ElapsedSectionList';
import ShiJuTaNavBar from '@organisms/ShiJuTaNavBar';
import TsuNavBar from '@organisms/TsuNavBar';
import {useAppSelector} from '@store/config';
import Screen from '@templates/Screen';
import _ from 'lodash';
import React, {useState} from 'react';
import i18n from 'i18next';
import {selectListVisitPlans} from '@modules/visitPlan/tsushoVPList.slice';
import {selectTenantSectionData} from '@modules/tenant/tenant.slice';
import {convertToElapsedUIList} from '@modules/elapsed/elapsed.utils';

const ElapsedScreen = () => {
  const [checkedQueue, setCheckedQueue] = useState<string[]>([]);
  const appType = useAppSelector(selectAppType);
  const elapsedSectionList = useAppSelector(selectTenantSectionData);
  const elapsedTsushoList = useAppSelector(selectListVisitPlans);

  const handleChangeStatusCheck = (code: string) => {
    setCheckedQueue(state => {
      if (_.includes(state, code)) {
        return _.filter(state, e => e !== code);
      }
      return [...state, code];
    });
  };

  const enoughConditionAllowTick = (value: ElapsedListItem) => {
    switch (appType) {
      case AppType.SHISETSHU:
      case AppType.JUTAKU:
        return !value.goingOutPlans?.length;
      case AppType.TAKINO:
        return !!value.servicePlans?.length || value.hasPreviousOvernightStay;
      case AppType.TSUSHO:
        return !_.includes(
          [
            i18n.t('tsusho_vp_list.cancelVPState'),
            i18n.t('tsusho_vp_list.cancelWhenDoingVPState'),
            i18n.t('tsusho_vp_list.absenceVPState'),
          ],
          value.registerVPState?.stateText,
        );
    }
  };

  const handleCheckAll = () => {
    let newCheckedList: string[] = [];
    if (appType === AppType.TSUSHO) {
      convertToElapsedUIList(elapsedTsushoList).forEach(e => {
        if (enoughConditionAllowTick(e)) {
          newCheckedList.push(e.tenantCode);
        }
      });
    } else {
      elapsedSectionList.forEach(section => {
        section.data.forEach(e => {
          if (enoughConditionAllowTick(e)) {
            newCheckedList.push(e.tenantCode);
          }
        });
      });
    }

    setCheckedQueue([...checkedQueue, ...newCheckedList]);
  };

  const handleCancelCheckAll = () => {
    setCheckedQueue([]);
  };

  const renderNavBar = () => {
    return appType === AppType.TSUSHO ? (
      <TsuNavBar
        allowRegister={!!checkedQueue.length}
        onCheckAll={handleCheckAll}
        onCancelCheckAll={handleCancelCheckAll}
      />
    ) : (
      <ShiJuTaNavBar
        allowRegister={!!checkedQueue.length}
        onCheckAll={handleCheckAll}
        onCancelCheckAll={handleCancelCheckAll}
      />
    );
  };

  return (
    <Screen
      enableSafeArea={true}
      barStyle="dark-content"
      withBottomBar
      navBar={renderNavBar()}>
      <ElapsedTableHeader />
      <ElapsedSectionList
        checkedList={checkedQueue}
        onCheckItem={handleChangeStatusCheck}
        data={convertToElapsedUIList(elapsedTsushoList)}
        sections={appType === AppType.TSUSHO ? undefined : elapsedSectionList}
      />
    </Screen>
  );
};

export default ElapsedScreen;
