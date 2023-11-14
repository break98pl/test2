import {StyleSheet, View} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import SortOptionsSelector from '@molecules/SortOptionsSelector';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectAllTenantsData,
  selectAppTenantCount,
  selectSortingOption,
  setFilteringCharacter,
  setSortingOption,
} from '@modules/tenant/tenant.slice';
import AlphabetFilterButton from '@organisms/AlphabetFilterButton';
import {SortingType} from '@modules/tenant/tenant.type';
import {selectAuthState} from '@modules/authentication/auth.slice';
import {getUserDefaultKeyMultiService} from '@modules/authentication/auth.utils';
import {
  SHISETSU_JUTAKU_SORTING_OPTIONS,
  TAKINO_KANTAKI_SORTING_OPTIONS,
  TAKINO_SORTING_OPTIONS,
} from '@modules/tenant/tenant.constant';
import {AppType} from '@modules/setting/setting.type';
import ElapsedRecordToolBar from './ElapsedRecordToolBar';
import {useRoute} from '@react-navigation/native';
import {ScreenName} from '@navigation/type';

interface IShiJuTaToolBarProps {
  onCheckAll?: () => void;
  onCancelCheckAll?: () => void;
  allowRegister?: boolean;
}

const ShiJuTaToolBar = (props: IShiJuTaToolBarProps) => {
  const {onCheckAll, onCancelCheckAll, allowRegister} = props;
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {appType} = useAppSelector(selectAuthState);
  const tenantCount = useAppSelector(selectAppTenantCount);
  const allTenantsData = useAppSelector(selectAllTenantsData);
  const sortedBy = useAppSelector(selectSortingOption);
  const route = useRoute();

  /**
   * Sorting option data.
   */
  const sortingOptions = useMemo(() => {
    const isKantaki = getUserDefaultKeyMultiService() === '2';
    if (appType === AppType.TAKINO) {
      if (isKantaki) {
        return TAKINO_KANTAKI_SORTING_OPTIONS;
      } else {
        return TAKINO_SORTING_OPTIONS;
      }
    } else {
      return SHISETSU_JUTAKU_SORTING_OPTIONS;
    }
  }, []);

  /**
   * Called when user select a sorting option in the tooltip.
   */
  const handleSelectSortOption = useCallback((selectedValue: SortingType) => {
    dispatch(setSortingOption({sortedBy: selectedValue}));
  }, []);

  /**
   * Called when user selects a character in the filter-by-character tooltip.
   */
  const handleSelectFilteringCharacter = useCallback((char: string) => {
    dispatch(setFilteringCharacter({char}));
  }, []);

  return (
    <View style={styles.toolbar}>
      <View style={styles.leftToolbar}>
        {route.name === ScreenName.Elapsed && (
          <ElapsedRecordToolBar
            onCheckAll={onCheckAll}
            onCancelCheckAll={onCancelCheckAll}
            allowRegister={allowRegister}
          />
        )}
        <SortOptionsSelector
          data={sortingOptions}
          defaultSelectedOption={sortedBy}
          onSelectItem={handleSelectSortOption}
        />
        <AlphabetFilterButton
          onSelectCharacter={handleSelectFilteringCharacter}
        />
      </View>
      {allTenantsData.length > 0 && (
        <BaseText
          size="xxLarge"
          weight="normal"
          text={`${tenantCount} ${t('user_list.userCount')}`}
        />
      )}
    </View>
  );
};

export default ShiJuTaToolBar;

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center',
  },
  leftToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
