import {StyleSheet} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import SlideTabsModal, {TabComponentProps} from '@templates/SlideTabsModal';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import CareListMainFilterTab from '@organisms/CareListMainFilterTab';
import CareListFilterElapsedTab from '@organisms/CareListFilterElapsedTab';
import {SceneRendererProps} from 'react-native-tab-view';
import CareListFilterReporterTab from '@organisms/CareListFilterReporterTab';
import CareListFilterCooperationRecordTab from '@organisms/CareListFilterCooperationRecordTab';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectCooperationRecords,
  selectElapsedClassification,
  selectFilterOtherSystemNameValues,
  selectLoginService,
  selectOccupations,
  selectRecords,
  selectReporter,
  selectSearchNoteText,
  selectIsCheckAllCooperations,
  setIsCheckAllCooperations,
  filterOptionsInitData,
  setFilterOptions,
  setFilterCooperationRecords,
  selectFilterOptions,
} from '@modules/careList/careList.slice';
import CareListFilterServiceTab from './CareListFilterServiceTab';
import {CareListFilterOptions} from '@modules/record/record.type';
import _ from 'lodash';

export enum FilterModalTabs {
  MainTab = 'mainTab',
  ElapsedTab = 'elapsedTab',
  ReporterTab = 'reporterTab',
  CooperationRecordTab = 'cooperationRecordTab',
  ServiceTab = 'serviceTabs',
}

interface CareListFilterModalProps {
  isVisible: boolean;
  onCloseModal?(): void;
  onSaveFilter?(): void;
}

export type CareListFilterModalRef = {
  resetFilterValue(initValue?: CareListFilterOptions): void;
};

const CareListFilterModal = forwardRef<
  CareListFilterModalRef,
  CareListFilterModalProps
>(({isVisible, onCloseModal, onSaveFilter}: CareListFilterModalProps, ref) => {
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const closeText = t('common.close');
  const searchText = t('common.search');
  const searchConditionsText = t('care_list.searchConditions');

  const otherSystemNameValues = useAppSelector(
    selectFilterOtherSystemNameValues,
  );
  // global states
  const currentFilterOptions = useAppSelector(selectFilterOptions);
  const defaultSearchText = useAppSelector(selectSearchNoteText);
  const defaultElapsedClassification = useAppSelector(
    selectElapsedClassification,
  );
  const defaultReporter = useAppSelector(selectReporter);
  const defaultLoginService = useAppSelector(selectLoginService);
  const defaultRecords = useAppSelector(selectRecords);
  const defaultOccupations = useAppSelector(selectOccupations);
  const defaultCooperationRecords = useAppSelector(selectCooperationRecords);
  const defaultIsCheckAllCooperationRecords = useAppSelector(
    selectIsCheckAllCooperations,
  );

  // is show save button to save filter options to global state
  const [isShowSaveButton, setIsShowSaveButton] = useState(true);
  // local filter states - live inside the filter form (can be saved as global state to filter or not)
  const [searchValue, setSearchValue] = useState(defaultSearchText);
  const [elapsedClassificationText, setElapsedClassificationText] = useState(
    defaultElapsedClassification,
  );
  const [reporterText, setReporterText] = useState(defaultReporter);
  const [loginServiceText, setLoginServiceText] = useState(defaultLoginService);
  const [localRecords, setLocalRecords] = useState(defaultRecords);
  const [localOccupations, setLocalOccupations] = useState(defaultOccupations);
  const [localCooperationRecords, setLocalCooperationRecords] = useState<
    string[]
  >(otherSystemNameValues);
  const initData: CareListFilterOptions = {
    ...filterOptionsInitData,
    cooperationRecords: [...otherSystemNameValues],
  };

  const [tempCooperationRecords, setTempCooperationRecords] = useState(
    localCooperationRecords,
  );
  const [isCheckAllCooperationRecords, setIsCheckAllCooperationRecords] =
    useState(defaultIsCheckAllCooperationRecords);
  const [isInMainTab, setIsInMainTab] = useState(true);

  // refs
  const initCheckAllRef = useRef(defaultIsCheckAllCooperationRecords);
  const filterOptionsToSave = useRef<CareListFilterOptions>(initData);
  const isSaveFilter = useRef(false);

  useImperativeHandle(ref, () => ({
    resetFilterValue(initValue?) {
      resetFilterValue(initValue);
    },
  }));

  const mainFilterTab = ({...props}: TabComponentProps) => {
    return (
      <CareListMainFilterTab
        searchValue={searchValue}
        elapsedClassificationText={elapsedClassificationText}
        reporter={reporterText}
        loginServiceText={loginServiceText}
        localRecords={localRecords}
        localOccupations={localOccupations}
        localCooperationRecords={localCooperationRecords}
        setIsInMainTab={setIsInMainTab}
        setIsShowSaveButton={setIsShowSaveButton}
        setSearchValue={setSearchValue}
        setLocalRecords={setLocalRecords}
        setLocalOccupations={setLocalOccupations}
        {...props}
      />
    );
  };

  const elapsedTab = ({...props}: TabComponentProps) => {
    return (
      <CareListFilterElapsedTab
        {...props}
        setElapsedClassificationText={setElapsedClassificationText}
        setIsShowSaveButton={setIsShowSaveButton}
        setIsInMainTab={setIsInMainTab}
      />
    );
  };

  const reporterTab = ({...props}: TabComponentProps) => {
    return (
      <CareListFilterReporterTab
        {...props}
        setReporter={setReporterText}
        setIsShowSaveButton={setIsShowSaveButton}
        setIsInMainTab={setIsInMainTab}
      />
    );
  };

  const cooperationRecordTab = ({...props}: TabComponentProps) => {
    return (
      <CareListFilterCooperationRecordTab
        {...props}
        tempCooperationRecords={tempCooperationRecords}
        isCheckAllCooperationRecords={isCheckAllCooperationRecords}
        setTempCooperationRecords={setTempCooperationRecords}
        setIsCheckAllCooperationRecords={setIsCheckAllCooperationRecords}
      />
    );
  };

  const serviceTab = ({...props}: TabComponentProps) => {
    return (
      <CareListFilterServiceTab
        {...props}
        setLoginServiceText={setLoginServiceText}
        setIsShowSaveButton={setIsShowSaveButton}
        setIsInMainTab={setIsInMainTab}
      />
    );
  };

  const renderScene = (props: TabComponentProps) => {
    switch (props.route.key) {
      case FilterModalTabs.MainTab:
        return mainFilterTab(props);
      case FilterModalTabs.ElapsedTab:
        return elapsedTab(props);
      case FilterModalTabs.ReporterTab:
        return reporterTab(props);
      case FilterModalTabs.CooperationRecordTab:
        return cooperationRecordTab(props);
      case FilterModalTabs.ServiceTab:
        return serviceTab(props);
      default:
    }
  };

  /**
   * prepare cooperation data on fist time go to care list screen
   */
  const prepareCooperationRecordsData = () => {
    if (defaultCooperationRecords !== null) {
      setLocalCooperationRecords(defaultCooperationRecords);
      setTempCooperationRecords(defaultCooperationRecords);
      setIsCheckAllCooperationRecords(defaultIsCheckAllCooperationRecords);
    }
  };

  const handleBackToMainTab = (sceneProps: SceneRendererProps) => {
    setIsShowSaveButton(true);
    setIsInMainTab(true);
    setTempCooperationRecords(localCooperationRecords);
    setIsCheckAllCooperationRecords(initCheckAllRef.current);
    sceneProps.jumpTo(FilterModalTabs.MainTab);
  };

  const resetFilterValue = (initValue?: CareListFilterOptions) => {
    setSearchValue(!initValue ? defaultSearchText : '');
    setElapsedClassificationText(
      !initValue
        ? defaultElapsedClassification
        : initValue.elapsedClassification,
    );
    setReporterText(!initValue ? defaultReporter : initValue.reporter);
    setLoginServiceText(
      !initValue ? defaultLoginService : initValue.loginService,
    );
    setLocalRecords(!initValue ? defaultRecords : initValue.records);
    setLocalOccupations(
      !initValue ? defaultOccupations : initValue.occupations,
    );

    if (defaultCooperationRecords !== null) {
      setLocalCooperationRecords(
        !initValue ? defaultCooperationRecords : otherSystemNameValues,
      );
      setTempCooperationRecords(
        !initValue ? defaultCooperationRecords : otherSystemNameValues,
      );
    }

    if (initValue) {
      dispatch(setFilterCooperationRecords(otherSystemNameValues));
      dispatch(setIsCheckAllCooperations(true));
    }
  };

  const handleSaveFilter = (sceneProps: SceneRendererProps) => {
    if (isInMainTab) {
      isSaveFilter.current = true;
      filterOptionsToSave.current = {
        searchNoteText: searchValue,
        elapsedClassification: elapsedClassificationText,
        reporter: reporterText,
        loginService: loginServiceText,
        records: localRecords,
        occupations: localOccupations,
        cooperationRecords: localCooperationRecords,
      };

      onSaveFilter && onSaveFilter();
    } else {
      // handle save local cooperation records
      const newCooperationRecords = [...tempCooperationRecords];

      setLocalCooperationRecords(newCooperationRecords);
      setTempCooperationRecords(newCooperationRecords);
      setIsInMainTab(true);

      initCheckAllRef.current = isCheckAllCooperationRecords;
      setIsCheckAllCooperationRecords(initCheckAllRef.current);

      sceneProps.jumpTo(FilterModalTabs.MainTab);
    }
  };

  const handleCloseModal = () => {
    onCloseModal && onCloseModal();
  };

  const handleSaveFilterOnCloseModal = () => {
    if (
      isSaveFilter.current &&
      !_.isEqual(filterOptionsToSave.current, currentFilterOptions)
    ) {
      dispatch(setFilterOptions(filterOptionsToSave.current));
      dispatch(setIsCheckAllCooperations(initCheckAllRef.current));

      filterOptionsToSave.current = initData;
      isSaveFilter.current = false;
    }
  };

  return (
    <SlideTabsModal
      isVisible={isVisible}
      showBackIcon
      showHeader
      backText={searchConditionsText}
      title={isInMainTab ? searchConditionsText : ''}
      leftHeaderButtonText={closeText}
      rightHeaderButtonText={isShowSaveButton ? searchText : ''}
      tabComponents={[
        {
          key: FilterModalTabs.MainTab,
          component: mainFilterTab,
        },
        {
          key: FilterModalTabs.ElapsedTab,
          component: elapsedTab,
        },
        {
          key: FilterModalTabs.ReporterTab,
          component: reporterTab,
        },
        {
          key: FilterModalTabs.CooperationRecordTab,
          component: cooperationRecordTab,
        },
        {
          key: FilterModalTabs.ServiceTab,
          component: serviceTab,
        },
      ]}
      renderScene={renderScene}
      modalContainerStyle={styles.modalContainer}
      onLeftHeaderButtonPress={handleCloseModal}
      onRightHeaderButtonPress={handleSaveFilter}
      onBack={handleBackToMainTab}
      onModalWillShow={resetFilterValue}
      onModalHide={handleSaveFilterOnCloseModal}
      onModalShow={prepareCooperationRecordsData}
    />
  );
});

export default CareListFilterModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: 560,
    height: 700,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
  },
});
