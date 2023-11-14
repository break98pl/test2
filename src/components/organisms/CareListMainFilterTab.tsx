import {SectionList, SectionListData, StyleSheet, View} from 'react-native';
import React from 'react';
import {TabComponentProps} from '@templates/SlideTabsModal';
import CareListSearchNoteInput from '@molecules/CareListSearchNoteInput';
import CareListFilterSectionListItem from './CareListFilterSectionListItem';
import {useAppSelector} from '@store/config';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {
  CareListFilterOccupations,
  CareListFilterRecords,
  RecordType,
} from '@modules/record/record.type';
import {
  selectFilterOtherSystemNameValues,
  selectIsShowAPFilterOptions,
  selectIsShowMedicationFilter,
} from '@modules/careList/careList.slice';
import {Occupations} from '@modules/careList/type';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {getMainTabFilterStructure} from '@modules/careList/careList.utils';

export enum TransitTabType {
  Elapsed,
  Reporter,
  CooperationRecord,
  LoginService,
}

export enum FilterRowType {
  TabOptions,
  Transit,
}

export enum FilterTabType {
  TwoOptions,
  ThreeOptions,
}

export type CareListFilterUIRow = {
  itemTitle: string;
  type: FilterRowType;
  tabType?: FilterTabType;
  defaultValue?: string;
  recordType?: RecordType;
  transitType?: TransitTabType;
  occupationType?: Occupations;
};

export enum FilterSection {
  Records,
  Occupation,
  Reporter,
  CooperationRecord,
  LoginService,
}

export type SectionType = {
  sectionTitle: string;
  filterSection: FilterSection;
  data: CareListFilterUIRow[];
};

interface Props extends TabComponentProps {
  searchValue: string;
  elapsedClassificationText: string;
  reporter: string;
  loginServiceText: string;
  localRecords: CareListFilterRecords;
  localOccupations: CareListFilterOccupations;
  localCooperationRecords: string[];
  setIsInMainTab: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalRecords: React.Dispatch<React.SetStateAction<CareListFilterRecords>>;
  setLocalOccupations: React.Dispatch<
    React.SetStateAction<CareListFilterOccupations>
  >;
  setIsShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const CareListMainFilterTab = ({
  searchValue,
  elapsedClassificationText,
  reporter,
  loginServiceText,
  localRecords,
  localOccupations,
  localCooperationRecords,
  setIsInMainTab,
  jumpTo,
  setIsShowSaveButton,
  setSearchValue,
  setLocalRecords,
  setLocalOccupations,
}: Props) => {
  const appType = useAppSelector(selectAppType);
  const otherSystemNames = useAppSelector(selectFilterOtherSystemNameValues);
  const isShowMedicationItem = useAppSelector(selectIsShowMedicationFilter);
  const isShowAPItems = useAppSelector(selectIsShowAPFilterOptions);

  const getShowSectionCondition = (sectionType: FilterSection) => {
    if (
      // occupation section only show in Shisetsu
      sectionType === FilterSection.Occupation &&
      appType !== AppType.SHISETSHU
    ) {
      return false;
    } else if (
      // login service only show in Jutaku and Takino
      sectionType === FilterSection.LoginService &&
      appType !== AppType.JUTAKU &&
      appType !== AppType.TAKINO
    ) {
      return false;
    } else if (
      // if there is no other system names then not show this section
      sectionType === FilterSection.CooperationRecord &&
      !otherSystemNames.length
    ) {
      return false;
    }
    return true;
  };

  const getShowSectionItemCondition = (recordType?: RecordType) => {
    const isAPItem =
      recordType === RecordType.APCheckin ||
      recordType === RecordType.APCheckout ||
      recordType === RecordType.APSignature ||
      recordType === RecordType.APLeaveNote ||
      recordType === RecordType.APOrder ||
      recordType === RecordType.APInstruction;

    const hideMedication =
      recordType &&
      recordType === RecordType.Medication &&
      !isShowMedicationItem;

    const hideApItems = recordType && isAPItem && !isShowAPItems;

    if (hideMedication || hideApItems) {
      return false;
    }
    return true;
  };

  const renderItem = ({
    item,
    section,
  }: {
    item: CareListFilterUIRow;
    section: {filterSection: FilterSection};
  }) => {
    const isShowItem =
      getShowSectionCondition(section.filterSection) &&
      getShowSectionItemCondition(item.recordType);

    return isShowItem ? (
      <CareListFilterSectionListItem
        item={item}
        jumpTo={jumpTo}
        elapsedClassificationText={elapsedClassificationText}
        loginServiceText={loginServiceText}
        reporter={reporter}
        localRecords={localRecords}
        localOccupations={localOccupations}
        localCooperationRecords={localCooperationRecords}
        setIsInMainTab={setIsInMainTab}
        setIsShowSaveButton={setIsShowSaveButton}
        setLocalRecords={setLocalRecords}
        setLocalOccupations={setLocalOccupations}
      />
    ) : (
      <></>
    );
  };

  const keyExtractor = (item: CareListFilterUIRow) => {
    return item.itemTitle + item.type;
  };

  const renderFilterSectionListHeader = ({
    section: {sectionTitle, filterSection},
  }: {
    section: SectionListData<CareListFilterUIRow, SectionType>;
  }) => {
    const isShowItem = getShowSectionCondition(filterSection);

    return isShowItem ? (
      <View style={styles.sectionTitle}>
        <BaseText size="large" weight="bold">
          {sectionTitle}
        </BaseText>
      </View>
    ) : (
      <></>
    );
  };

  return (
    <View style={styles.container}>
      {/* search input */}
      <CareListSearchNoteInput
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />

      {/* filter section */}
      <SectionList
        sections={getMainTabFilterStructure()}
        renderItem={renderItem}
        renderSectionHeader={renderFilterSectionListHeader}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default CareListMainFilterTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    backgroundColor: Colors.FILTER_HEADER_GRAY,
    paddingVertical: 1,
    paddingLeft: 16,
  },
});
