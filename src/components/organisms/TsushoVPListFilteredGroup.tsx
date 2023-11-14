import {StyleSheet, View} from 'react-native';
import React from 'react';
import TsushoListFilterButton, {
  TsushoListFilterType,
} from '@organisms/TsushoListFilterButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectEndTimeItems,
  selectHeadquartersSTItems,
  selectStartTimeItems,
  setFilteredEndTimeItem,
  setFilteredStartTimeItem,
  selectFilteredStartTimeItems,
  selectFilteredEndTimeItems,
  selectFilteredHeadquartersSTItems,
  setFilteredHeadquarterSTItem,
} from '@modules/visitPlan/tsushoVPList.slice';
import {useTranslation} from 'react-i18next';
import {selectChoseServiceName} from '@modules/authentication/auth.slice';
import {
  extractText,
  getListNameOfSatelite,
} from '@modules/visitPlan/tsushoVPList.utils';
import {SateLiteInfo} from '@modules/visitPlan/type';

const TsushoVPListFilteredGroup = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  // global state
  const currentService = useSelector(selectChoseServiceName);
  const startTimeItems = useSelector(selectStartTimeItems);
  const endTimeItems = useSelector(selectEndTimeItems);
  const startTimeFilteredItems = useSelector(selectFilteredStartTimeItems);
  const endTimeFilteredItems = useSelector(selectFilteredEndTimeItems);
  const headquartersSTItems = useSelector(selectHeadquartersSTItems);
  const headquartersFilteredItems = useSelector(
    selectFilteredHeadquartersSTItems,
  );

  const listNameOfSatelite = getListNameOfSatelite(headquartersSTItems);
  const listNameOfFilteredSatelite = getListNameOfSatelite(
    headquartersFilteredItems,
  );

  // condition
  const isShowSatelliteFilterButton =
    extractText(currentService) === t('tsusho_vp_list.satelliteService');

  return (
    <View style={styles.leftSection}>
      {/* filter start time button */}
      <View style={styles.filterListContainer}>
        <TsushoListFilterButton
          type={TsushoListFilterType.startTime}
          items={startTimeItems}
          filterItems={startTimeFilteredItems}
          setFilterItems={(items: string[]) =>
            dispatch(setFilteredStartTimeItem(items))
          }
        />

        {/* filter end time button */}
        <TsushoListFilterButton
          contentContainerStyle={styles.listFilterTooltipContainer}
          type={TsushoListFilterType.endTime}
          items={endTimeItems}
          filterItems={endTimeFilteredItems}
          setFilterItems={(items: string[]) =>
            dispatch(setFilteredEndTimeItem(items))
          }
        />

        {/* filter satellite button */}
        {isShowSatelliteFilterButton && (
          <TsushoListFilterButton
            contentContainerStyle={styles.listFilterTooltipContainer}
            type={TsushoListFilterType.headquarterAndST}
            items={listNameOfSatelite}
            filterItems={listNameOfFilteredSatelite}
            setFilterItems={(items: string[]) => {
              const listFilteredSatelite: SateLiteInfo[] = [];
              items.forEach(name => {
                const matchingSatelite = headquartersSTItems.find(
                  st => st.name === name,
                );
                if (matchingSatelite) {
                  listFilteredSatelite.push(matchingSatelite);
                }
              });
              dispatch(setFilteredHeadquarterSTItem(listFilteredSatelite));
            }}
          />
        )}
      </View>
    </View>
  );
};

export default TsushoVPListFilteredGroup;

const styles = StyleSheet.create({
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  dateTimePickerContainer: {
    width: 240,
  },
  screenTitle: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
  },
  filterListContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listFilterTooltipContainer: {
    marginLeft: 14,
  },
});
