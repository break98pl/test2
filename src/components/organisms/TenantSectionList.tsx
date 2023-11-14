import React, {useCallback, useEffect} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {Colors} from '@themes/colors';
import TenantTableItem from './TenantTableItem';
import BaseText from '@atoms/BaseText';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectAllTenantsData,
  selectFilteringDate,
  selectFilteringCharacter,
  selectSortingOption,
  selectTenantSectionData,
  setTenantSectionList,
} from '@modules/tenant/tenant.slice';
import {TenantListItem, TenantListSection} from '@modules/tenant/tenant.type';
import {TenantService} from '@modules/tenant/tenant.service';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import LineSeparator from '@atoms/LineSeparator';
import {setCurrentCareTenant} from '@modules/careList/careList.slice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenName, TenantStackNavigatorParams} from '@navigation/type';

const TenantSectionList = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<TenantStackNavigatorParams>>();

  const dispatch = useAppDispatch();
  const appType = useAppSelector(selectAppType);
  const filteringDate = useAppSelector(selectFilteringDate);
  const sortingOption = useAppSelector(selectSortingOption);
  const filteringCharacter = useAppSelector(selectFilteringCharacter);
  const allTenantsData = useAppSelector(selectAllTenantsData);
  const tenantSectionList = useAppSelector(selectTenantSectionData);

  /**
   * Generate section data.
   */
  useEffect(() => {
    const tenantSections = TenantService.generateTenantSectionDataForShiJuTa(
      allTenantsData,
      {
        filteringDate,
        filteringCharacter,
        sortBy: sortingOption,
      },
    );
    dispatch(setTenantSectionList({tenantSections}));
  }, [allTenantsData, filteringDate, sortingOption, filteringCharacter]);

  /**
   * Called when user presses the right arrow icon of the list item.
   *
   * @param item
   */
  const navigateToCareListScreen = useCallback(
    (item: TenantListItem) => {
      dispatch(setCurrentCareTenant(item.tenantCode));
      navigation.navigate(ScreenName.CareList);
    },
    [tenantSectionList],
  );

  const keyExtractor = useCallback((item: TenantListItem, index: number) => {
    if (appType === AppType.SHISETSHU || appType === AppType.JUTAKU) {
      return item.tenantCode;
    } else {
      return item.tenantCode + index;
    }
  }, []);

  const renderItem = useCallback(
    ({item, index}: {item: TenantListItem; index: number}) => {
      return (
        <TenantTableItem
          data={item}
          deepBg={index % 2 === 1}
          onPress={navigateToCareListScreen}
        />
      );
    },
    [navigateToCareListScreen],
  );

  const renderHeaderItem = useCallback(
    ({section}: {section: TenantListSection}) => (
      <View style={styles.greyLabelView}>
        <BaseText
          weight="semiBold"
          style={styles.label}
          color={Colors.WHITE}
          text={section.title}
        />
      </View>
    ),
    [],
  );

  const renderItemSeparator = useCallback(
    () => <LineSeparator color={Colors.SEPARATOR_LINE} />,
    [],
  );

  return (
    <SectionList
      keyExtractor={keyExtractor}
      sections={tenantSectionList}
      renderItem={renderItem}
      renderSectionHeader={renderHeaderItem}
      stickySectionHeadersEnabled
      ItemSeparatorComponent={renderItemSeparator}
      ListFooterComponent={renderItemSeparator}
    />
  );
};

const styles = StyleSheet.create({
  greyLabelView: {
    height: 25,
    backgroundColor: Colors.HEADER_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 15,
  },
});

export default TenantSectionList;
