import {StyleSheet, View, ViewStyle} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import PopoverRecordHeader, {RecordStatus} from './PopoverRecordHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import MealRecordContent, {
  TMealRecordData,
  TMealRecordDataChange,
} from '@organisms/MealRecordContent';
import BaseButton from '@atoms/BaseButton';
import SlideTabsTooltip, {
  SlideTabsRef,
  TabComponentProps,
} from '@templates/SlideTabsTooltip';
import {images} from '@constants/images';
import SelectionList from '@organisms/SelectionList';
import {SceneRendererProps} from 'react-native-tab-view';
import _ from 'lodash';
import {mealTypeList} from '@constants/constants';
import {
  handleAlertConfirm,
  handleAlertNotCreateRecord,
} from '@modules/alerts/alert.ultils';
import {selectFilteringDate} from '@modules/tenant/tenant.slice';
import {checkIsFutureDate} from '@modules/tenant/tenant.utils';
import {useAppSelector} from '@store/config';
import {selectSelectedStaff} from '@modules/authentication/auth.slice';
import {TenantListItem} from '@modules/tenant/tenant.type';
import useHandleMealRecord from '@hooks/useHandleMealRecord';
import {MealCategory} from '@modules/record/record.type';

enum MealRecordType {
  TypeMealInput = 'typeInput',
  KeyMealInput = 'keyInput',
}

export enum MealType {
  Breakfast = 'breakfast',
  AmSnack = 'amSnack',
  Lunch = 'lunch',
  PmSnack = 'pmSnack',
  Dinner = 'dinner',
  Drink = 'drink',
}

const initialMealData: TMealRecordData = {
  id: '',
  recordDate: new Date().toISOString(),
  reporter: '山下 達郎',
  serviceType: '',
  mealType: MealCategory.AmSnack,
  timeValue: '',
  mainDish: '',
  subDish: '',
  soupVolume: '',
  teaVolume: '',
  snackVolume: '',
  drinkVolume: '',
  waterVolume: '',
  waterType: '',
  memo: '',
  settingReport: '',
  isSynced: false,
};

interface IPopoverRecordMealProps {
  tenantKanjiName?: string;
  firstServicePlan?: string;
  tenant?: TenantListItem;
  isShowPopover?: boolean;
  setIsShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  style?: ViewStyle;
  showButton?: boolean;
  data?: TMealRecordData;
}

const PopoverRecordMeal = (props: IPopoverRecordMealProps) => {
  const {
    firstServicePlan = '',
    tenant,
    isShowPopover,
    setIsShowPopover,
    style,
    data = initialMealData,
    showButton = true,
  } = props;
  const {t} = useTranslation();
  const [showBtnSave, setShowBtnSave] = useState(false);
  const filteringDate = useAppSelector(selectFilteringDate);
  const selectedStaff = useAppSelector(selectSelectedStaff);
  const reporterName = `${selectedStaff?.firstName} ${selectedStaff?.lastName}`;
  const initRecordData = {
    ...data,
    reporter: reporterName,
    serviceType: firstServicePlan,
  };
  const [recordData, _setRecordData] =
    useState<TMealRecordData>(initRecordData);
  const recordDataRef = useRef<TMealRecordData>(initRecordData);
  const slideTabsRef = useRef<SlideTabsRef>(null);
  const tenantKanjiName = `${tenant?.surnameKanji} ${tenant?.firstNameKanji}`;
  const {onSaveRecord} = useHandleMealRecord();
  const isEdit = Boolean(recordData?.id);

  const setRecordData = (mealRecordData: TMealRecordData) => {
    _setRecordData(mealRecordData);
    recordDataRef.current = mealRecordData;
  };

  const changeMealRecordType = (mealRcordType: MealRecordType) => {
    if (slideTabsRef.current?.jumpTo) {
      slideTabsRef.current.jumpTo(mealRcordType);
    }
  };

  const hidePopover = (propers?: SceneRendererProps) => {
    setIsShowPopover(false);
    if (isEdit) {
      setShowBtnSave(true);
    } else {
      propers?.jumpTo(MealRecordType.TypeMealInput);
      setShowBtnSave(false);
      setRecordData(initRecordData);
    }
  };

  useEffect(() => {
    if (isShowPopover) {
      setShowBtnSave(true);
      if (isEdit) {
        setRecordData(data);
        changeMealRecordType(MealRecordType.KeyMealInput);
      } else {
        changeMealRecordType(MealRecordType.TypeMealInput);
      }
    }
  }, [isShowPopover]);

  const openPopover = () => {
    if (checkIsFutureDate(filteringDate)) {
      handleAlertNotCreateRecord();
    } else {
      setIsShowPopover(true);
    }
  };

  const handleChangeRecord = useCallback(
    (recordChange: TMealRecordDataChange) => {
      setRecordData({
        ...recordData,
        ...recordChange,
      });
    },
    [recordData],
  );

  const handleBack = ({jumpTo}: SceneRendererProps) => {
    const cloneRecordData = _.cloneDeep(recordData);
    if (
      JSON.stringify(
        _.assign(cloneRecordData, {
          mealType: '',
        }),
      ) !==
      JSON.stringify(
        _.assign(initRecordData, {
          mealType: '',
        }),
      )
    ) {
      handleAlertConfirm(
        () => {
          jumpTo(MealRecordType.TypeMealInput);
          setIsShowPopover(false);
          setRecordData(initRecordData);
        },
        () => {
          jumpTo(MealRecordType.TypeMealInput);
          setIsShowPopover(false);
          setRecordData(initRecordData);
        },
      );
    } else if (isEdit) {
      setIsShowPopover(false);
    } else {
      jumpTo(MealRecordType.TypeMealInput);
      setShowBtnSave(false);
    }
  };

  const handleSaveRecord = useCallback(async () => {
    const isSuccess = await onSaveRecord({
      recordData: recordDataRef.current,
      tenant,
      isEdit,
    });
    if (isSuccess) {
      hidePopover();
    }
  }, [recordData, tenant]);

  const checkDisabledSaveButton = () => {
    return (
      JSON.stringify(
        _.assign(_.cloneDeep(recordData), {
          mealType: '',
        }),
      ) ===
      JSON.stringify(
        _.assign(initRecordData, {
          mealType: '',
        }),
      )
    );
  };

  const mealTypePopover = ({jumpTo}: TabComponentProps) => {
    return (
      <View style={styles.mealContentPopover}>
        <PopoverRecordHeader
          source={images.rinMeal}
          recordName={t('popover.meal_label')}
          recordStatus={RecordStatus.Create}
        />
        <View style={styles.mealTypeList}>
          <SelectionList
            usingTrans
            separator={false}
            showArrowIcon
            itemStyle={styles.mealTypeItem}
            data={mealTypeList}
            onSelectItem={value => {
              handleChangeRecord({mealType: t(value.label) as MealCategory});
              jumpTo(MealRecordType.KeyMealInput);
              setShowBtnSave(true);
            }}
          />
        </View>
      </View>
    );
  };

  const mealContentPopover = () => {
    return (
      <KeyboardAwareScrollView style={styles.mealContentPopover}>
        <PopoverRecordHeader
          source={images.rinMeal}
          recordName={t('popover.meal_label')}
          recordStatus={RecordStatus.Create}
        />
        <MealRecordContent data={recordData} onChange={handleChangeRecord} />
      </KeyboardAwareScrollView>
    );
  };

  const renderScene = (props: TabComponentProps) => {
    switch (props.route.key) {
      case MealRecordType.TypeMealInput:
        return mealTypePopover(props);
      case MealRecordType.KeyMealInput:
        return mealContentPopover();
    }
  };

  return (
    <View style={StyleSheet.compose(styles.container, style)}>
      <SlideTabsTooltip
        ref={slideTabsRef}
        showBackIcon={!isEdit}
        showHeader
        isVisible={isShowPopover}
        placement="right"
        closeOnBackgroundInteraction={false}
        closeOnContentInteraction={false}
        contentStyle={styles.popoverContentStyle}
        rightButtonText={showBtnSave ? t('common.save') : ''}
        onLeftButtonPress={hidePopover}
        onRightButtonPress={handleSaveRecord}
        disabledRightButton={checkDisabledSaveButton()}
        title={tenantKanjiName}
        subTitle={t('user_list.sama')}
        renderScene={renderScene}
        tabComponents={[
          {
            key: MealRecordType.TypeMealInput,
            component: mealTypePopover,
          },
          {
            key: MealRecordType.KeyMealInput,
            component: mealContentPopover,
          },
        ]}
        onBack={handleBack}>
        <View style={styles.targetShowTooltip} />
      </SlideTabsTooltip>
      {showButton && (
        <BaseButton onPress={openPopover}>
          <FastImage
            style={styles.recordInputIcon}
            source={images.rinMeal}
            resizeMode="contain"
          />
        </BaseButton>
      )}
    </View>
  );
};

export default React.memo(PopoverRecordMeal);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: -450,
    width: 490,
    position: 'absolute',
  },
  targetShowTooltip: {
    width: 10,
    height: 30,
  },
  mealContentPopover: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.POPOVER_BG,
    paddingTop: 15,
  },
  popoverContentStyle: {
    width: 570,
    height: 700,
  },
  recordInputIcon: {
    width: 40,
    height: 36,
  },
  mealTypeList: {
    marginTop: 15,
  },
  mealTypeItem: {
    backgroundColor: Colors.WHITE,
  },
});
