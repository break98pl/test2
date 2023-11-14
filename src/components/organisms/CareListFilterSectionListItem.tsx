import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  CareListFilterUIRow,
  FilterRowType,
  FilterTabType,
  TransitTabType,
} from '@organisms/CareListMainFilterTab';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import SlideTabButtons from '@molecules/SlideTabButtons';
import {FontSize} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import {FilterModalTabs} from './CareListFilterModal';
import {useAppSelector} from '@store/config';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {
  CareListFilterOccupations,
  CareListFilterRecords,
  RecordType,
  SlideTabFilterContent,
} from '@modules/record/record.type';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {
  addFilterHiddenReporterJob,
  deleteFilterHiddenReporterJob,
  selectFilterOtherSystemNameValues,
} from '@modules/careList/careList.slice';
import {
  getRecordIconName,
  parseRecordTypeKey,
} from '@modules/record/record.utils';
import {useDispatch} from 'react-redux';
import {selectIsShowReha} from '@modules/visitPlan/tsushoVPList.slice';

type Props = {
  item: CareListFilterUIRow;
  elapsedClassificationText: string;
  reporter: string;
  loginServiceText: string;
  localRecords: CareListFilterRecords;
  localOccupations: CareListFilterOccupations;
  localCooperationRecords: string[];
  jumpTo(key: string): void;
  setIsShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalRecords: React.Dispatch<React.SetStateAction<CareListFilterRecords>>;
  setLocalOccupations: React.Dispatch<
    React.SetStateAction<CareListFilterOccupations>
  >;
  setIsInMainTab: React.Dispatch<React.SetStateAction<boolean>>;
};

const CareListFilterSectionListItem = ({
  item,
  elapsedClassificationText,
  reporter,
  loginServiceText,
  localRecords,
  localOccupations,
  localCooperationRecords,
  jumpTo,
  setIsShowSaveButton,
  setLocalRecords,
  setLocalOccupations,
  setIsInMainTab,
}: Props) => {
  const {
    itemTitle,
    type,
    tabType,
    defaultValue,
    recordType,
    transitType,
    occupationType,
  } = item;
  const dispatch = useDispatch();

  const {t} = useTranslation();
  const display = t('common.display');
  const notDisplay = t('common.notDisplay');
  const haveMemo = t('common.haveMemo');
  const all = t('common.all');
  const checkOut = t('care_list.checkOut');

  const appType = useAppSelector(selectAppType);
  const otherSystemNameValues = useAppSelector(
    selectFilterOtherSystemNameValues,
  );
  const isShowReha = useAppSelector(selectIsShowReha);

  const threeTabsOptionContent = [notDisplay, haveMemo, all];
  const twoTabsOptionContent = [notDisplay, display];
  const tsuSpecialRecords = [
    RecordType.Reha,
    RecordType.Letter,
    RecordType.Attendance,
  ];

  const jutakuSpecialRecords = [
    RecordType.APCheckin,
    RecordType.APCheckout,
    RecordType.APOrder,
    RecordType.APSignature,
    RecordType.APInstruction,
    RecordType.APLeaveNote,
  ];

  /**
   * get slide tab content from EN to JP
   * @param slideTabContent - content of a tab in slide tab button in EN
   */
  const parseSlideTabContent = (slideTabContent: SlideTabFilterContent) => {
    switch (slideTabContent) {
      case SlideTabFilterContent.Display:
        return display;
      case SlideTabFilterContent.NotDisplay:
        return notDisplay;
      case SlideTabFilterContent.HaveMemo:
        return haveMemo;
      case SlideTabFilterContent.All:
        return all;
      default:
        return all;
    }
  };

  const getSlideTabDefaultIndex = () => {
    switch (tabType) {
      case FilterTabType.ThreeOptions:
        if (recordType) {
          const recordKey = parseRecordTypeKey(recordType);

          if (Object.keys(localRecords).includes(recordKey)) {
            const defaultSlideTabIndex = threeTabsOptionContent.indexOf(
              parseSlideTabContent(
                localRecords[
                  recordKey as keyof CareListFilterRecords
                ] as SlideTabFilterContent,
              ),
            );

            return defaultSlideTabIndex;
          }
        } else {
          if (
            Object.keys(localOccupations).includes(occupationType as string)
          ) {
            const defaultSlideTabIndex = threeTabsOptionContent.indexOf(
              parseSlideTabContent(
                localOccupations[
                  occupationType as keyof typeof localOccupations
                ] as SlideTabFilterContent,
              ),
            );

            return defaultSlideTabIndex;
          }
        }
        break;
      case FilterTabType.TwoOptions:
        if (recordType) {
          const recordKey = parseRecordTypeKey(recordType);

          if (Object.keys(localRecords).includes(recordKey)) {
            const defaultSlideTabIndex = twoTabsOptionContent.indexOf(
              parseSlideTabContent(
                localRecords[
                  recordKey as keyof CareListFilterRecords
                ] as SlideTabFilterContent,
              ),
            );

            return defaultSlideTabIndex;
          }
        } else {
          if (
            Object.keys(localOccupations).includes(occupationType as string)
          ) {
            const defaultSlideTabIndex = twoTabsOptionContent.indexOf(
              parseSlideTabContent(
                localOccupations[
                  occupationType as keyof typeof localOccupations
                ] as SlideTabFilterContent,
              ),
            );

            return defaultSlideTabIndex;
          }
        }
        break;
      default:
    }

    return 0;
  };
  const [tabIndex, setTabIndex] = useState(getSlideTabDefaultIndex());

  useEffect(() => {
    updateHiddenJobs();
  }, []);

  /**
   * update hidden care list job array
   */
  const updateHiddenJobs = () => {
    if (Object.keys(localOccupations).includes(occupationType as string)) {
      const occupationIndex = twoTabsOptionContent.indexOf(
        parseSlideTabContent(
          localOccupations[
            occupationType as keyof typeof localOccupations
          ] as SlideTabFilterContent,
        ),
      );

      // TODO: notice this when implement filter in report screen - it effects hidden reporter names state in care list when user change slide option
      if (occupationIndex === 0) {
        dispatch(addFilterHiddenReporterJob(itemTitle));
      } else {
        dispatch(deleteFilterHiddenReporterJob(itemTitle));
      }
    }
  };

  /**
   * handle how to change different tabs of filter modal
   */
  const handleChangeTab = () => {
    if (type === FilterRowType.Transit) {
      switch (transitType) {
        case TransitTabType.Elapsed:
          jumpTo(FilterModalTabs.ElapsedTab);
          setIsShowSaveButton(false);
          break;
        case TransitTabType.Reporter:
          jumpTo(FilterModalTabs.ReporterTab);
          setIsShowSaveButton(false);
          break;
        case TransitTabType.CooperationRecord:
          jumpTo(FilterModalTabs.CooperationRecordTab);
          break;
        case TransitTabType.LoginService:
          jumpTo(FilterModalTabs.ServiceTab);
          setIsShowSaveButton(false);
          break;
        default:
      }
      setIsInMainTab(false);
    }
  };

  /**
   * handle change slide tab options
   */
  const onChooseSlideOptionItem = (slideTabIndex: number) => {
    switch (tabType) {
      case FilterTabType.ThreeOptions:
        const itemOptionForThreeSlide = convertSlideTabContent(
          threeTabsOptionContent[slideTabIndex],
        );

        if (recordType) {
          const recordKey = parseRecordTypeKey(recordType);

          setLocalRecords({
            ...localRecords,
            [recordKey]: itemOptionForThreeSlide,
          });
        } else {
          setLocalOccupations({
            ...localOccupations,
            [occupationType as string]: itemOptionForThreeSlide,
          });
        }
        break;
      case FilterTabType.TwoOptions:
        const itemOptionForTwoSlide = convertSlideTabContent(
          twoTabsOptionContent[slideTabIndex],
        );
        if (recordType) {
          const recordKey = parseRecordTypeKey(recordType);

          setLocalRecords({
            ...localRecords,
            [recordKey]: itemOptionForTwoSlide,
          });
        } else {
          setLocalOccupations({
            ...localOccupations,
            [occupationType as string]: itemOptionForTwoSlide,
          });
        }

        // set hidden care list occupation
        // TODO: notice this when implement filter in report screen - it effects hidden reporter names state in care list when user change slide option
        if (
          itemOptionForTwoSlide === SlideTabFilterContent.NotDisplay &&
          occupationType
        ) {
          dispatch(addFilterHiddenReporterJob(itemTitle));
        } else {
          dispatch(deleteFilterHiddenReporterJob(itemTitle));
        }

        break;
      default:
    }
  };

  /**
   * convert slide tab content from JP to EN to save in store for filtering
   * @param slideTabContent - content of a tab in slide tab button
   */
  const convertSlideTabContent = (slideTabContent: string) => {
    switch (slideTabContent) {
      case display:
        return SlideTabFilterContent.Display;
      case notDisplay:
        return SlideTabFilterContent.NotDisplay;
      case haveMemo:
        return SlideTabFilterContent.HaveMemo;
      case all:
        return SlideTabFilterContent.All;
      default:
        return SlideTabFilterContent.All;
    }
  };

  const getTransitDefaultContent = () => {
    let defaultContent = defaultValue;

    switch (transitType) {
      case TransitTabType.Elapsed:
        if (elapsedClassificationText.length) {
          defaultContent = elapsedClassificationText;
        }
        break;
      case TransitTabType.CooperationRecord:
        if (localCooperationRecords.length === 0) {
          defaultContent = '';
        } else if (
          localCooperationRecords.length === otherSystemNameValues.length
        ) {
          defaultContent = all;
        } else {
          defaultContent = localCooperationRecords.join('\n');
        }
        break;
      case TransitTabType.LoginService:
        if (loginServiceText.length) {
          defaultContent = loginServiceText;
        }
        break;
      case TransitTabType.Reporter:
        if (reporter.length) {
          defaultContent = reporter;
        }
        break;
      default:
    }

    return defaultContent;
  };

  const renderTabItem = () => {
    const recordIconName = getRecordIconName(recordType as RecordType, true);

    const tabItem = (
      <View style={[styles.container, styles.tabItemContainer]}>
        {recordIconName && (
          <View style={styles.recordIconContainer}>
            <FastImage
              source={images[recordIconName]}
              style={styles.recordIcon}
            />
            {recordType === RecordType.APCheckin && (
              <FastImage
                source={images.apRecordCheckout}
                style={styles.recordIcon}
              />
            )}
          </View>
        )}

        <View>
          <BaseText size="large">{itemTitle}</BaseText>
          {recordType === RecordType.APCheckin && (
            <BaseText size="large">{checkOut}</BaseText>
          )}
        </View>

        <View>
          <SlideTabButtons
            chosenTabIndex={tabIndex}
            setChosenTabIndex={setTabIndex}
            tabContents={
              tabType === FilterTabType.ThreeOptions
                ? threeTabsOptionContent
                : twoTabsOptionContent
            }
            tabWidth={tabType === FilterTabType.ThreeOptions ? 74 : 111}
            tabHeight={26}
            textStyle={styles.slideTabText}
            onChooseItem={onChooseSlideOptionItem}
          />
        </View>
      </View>
    );

    if (
      (appType !== AppType.TSUSHO &&
        tsuSpecialRecords.includes(recordType as RecordType)) ||
      (appType === AppType.TSUSHO &&
        !isShowReha &&
        (recordType as RecordType) === RecordType.Reha) ||
      (appType !== AppType.JUTAKU &&
        jutakuSpecialRecords.includes(recordType as RecordType)) ||
      recordType === RecordType.APCheckout
    ) {
      return null;
    } else {
      return tabItem;
    }
  };

  const renderTransitItem = () => {
    return (
      <BaseButton
        onPress={handleChangeTab}
        style={[styles.container, styles.transitItemContainer]}>
        <View style={styles.transitTitleContainer}>
          <BaseText size="large">{`${itemTitle}：`}</BaseText>
        </View>
        <View>
          <BaseText size="large">{getTransitDefaultContent()}</BaseText>
        </View>

        <View style={styles.navIconContainer}>
          <FastImage
            style={styles.arrowIcon}
            source={images.rightArrow}
            resizeMode="contain"
          />
        </View>
      </BaseButton>
    );
  };

  const renderItemContent = () => {
    switch (type) {
      case FilterRowType.TabOptions:
        return renderTabItem();
      case FilterRowType.Transit:
        return renderTransitItem();
      default:
        return <></>;
    }
  };

  return renderItemContent();
};

export default CareListFilterSectionListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomColor: Colors.GRAY_PH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: -StyleSheet.hairlineWidth,
  },
  tabItemContainer: {
    justifyContent: 'space-between',
    height: 60,
    paddingLeft: 56,
    paddingRight: 80,
  },
  transitItemContainer: {
    minHeight: 60,
    paddingVertical: 14,
  },
  transitTitleContainer: {
    width: 270,
    alignItems: 'flex-end',
    paddingRight: 60,
  },
  recordIconContainer: {
    position: 'absolute',
    left: 16,
  },
  slideTabText: {
    fontSize: FontSize.SMALL,
  },
  navIconContainer: {
    position: 'absolute',
    right: 16,
  },
  arrowIcon: {
    width: 9,
    height: 15,
  },
  recordIcon: {
    width: 24,
    height: 24,
  },
});
