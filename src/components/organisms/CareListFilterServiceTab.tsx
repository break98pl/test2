import {StyleSheet, View} from 'react-native';
import React from 'react';
import {TabComponentProps} from '@templates/SlideTabsModal';
import SelectionList, {TextListItem} from './SelectionList';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@store/config';
import {
  selectAppType,
  selectChoseServiceName,
  selectListLoginServiceNames,
} from '@modules/authentication/auth.slice';
import {AppType, TakinoServiceType} from '@modules/setting/setting.type';
import {FilterModalTabs} from './CareListFilterModal';

interface Props extends TabComponentProps {
  setLoginServiceText: React.Dispatch<React.SetStateAction<string>>;
  setIsShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInMainTab: React.Dispatch<React.SetStateAction<boolean>>;
}

const CareListFilterServiceTab = ({
  setLoginServiceText,
  setIsShowSaveButton,
  setIsInMainTab,
  jumpTo,
}: Props) => {
  const {t} = useTranslation();

  const all = t('common.all');
  const visit = t('care_list.visit');
  const commute = t('care_list.commute');
  const overnightStay = t('care_list.overnightStay');
  const shortTermStay = t('care_list.shortTermStay');
  const nursing = t('care_list.nursing');
  const caring = t('care_list.caring');
  const notSet = t('popover.not_set');

  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const listServiceNames = useAppSelector(selectListLoginServiceNames);

  const defaultItem = {id: 'default', label: all};

  const takinoDefaultServices = [
    {id: '1', label: visit},
    {id: '2', label: commute},
    {id: '3', label: overnightStay},
    {id: '4', label: shortTermStay},
    {id: '5', label: notSet},
  ];

  const takinoKangoServices = [
    {id: '1', label: nursing},
    {id: '2', label: caring},
    {id: '3', label: commute},
    {id: '4', label: overnightStay},
    {id: '5', label: shortTermStay},
    {id: '6', label: notSet},
  ];

  const getServiceData = () => {
    let data: TextListItem[] = [];

    if (
      appType === AppType.TAKINO &&
      serviceName === TakinoServiceType.DEFAULT
    ) {
      data = takinoDefaultServices;
    } else if (
      appType === AppType.TAKINO &&
      serviceName === TakinoServiceType.KANGO
    ) {
      data = takinoKangoServices;
    } else {
      // show on Jutaku app
      data = listServiceNames;
    }

    return [defaultItem, ...data];
  };

  const onChooseLoginService = (item: TextListItem) => {
    if (item.label === all) {
      setLoginServiceText('');
    } else {
      setLoginServiceText(item.label);
    }

    setIsShowSaveButton(true);
    setIsInMainTab(true);
    jumpTo(FilterModalTabs.MainTab);
  };

  return (
    <View style={styles.container}>
      <SelectionList
        onSelectItem={onChooseLoginService}
        data={getServiceData()}
      />
    </View>
  );
};

export default CareListFilterServiceTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
