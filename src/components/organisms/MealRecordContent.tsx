import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import BaseText from '@atoms/BaseText';
import BaseTextInput from '@molecules/BaseTextInput';
import {DateTimePickerMode} from '@molecules/DateTimePickerText';
import {Colors} from '@themes/colors';
import RecordContentItem from '@molecules/RecordContentItem';
import {useTranslation} from 'react-i18next';
import {
  TIME_24H_FORMAT,
  serviceTypeListOne,
  serviceTypeListTwo,
  snackVolumeList,
  soupList,
  teaList,
  volumeDishList,
} from '@constants/constants';
import _ from 'lodash';
import VolumeInputRecord from '@molecules/VolumeInputRecord';
import ReportInputRecord from '@molecules/ReportInputRecord';
import CapacityInputRecord from '@molecules/CapacityInputRecord';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import {getDefaultTimeFromMealType} from '@modules/meal/meal.ultils';
import DateTimePickerInputRecord from '@molecules/DateTimePickerInputRecord';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from '@store/config';
import {MealDB} from '@modules/record/models/meal.model';
import {selectRecordSetting, setWaterList} from '@modules/record/record.slice';
import {useSelector} from 'react-redux';
import {convertSettingsSelectItemToTextListItem} from '@modules/record/record.utils';
import {MealCategory} from '@modules/record/record.type';

export type TMealRecordData = {
  id: string;
  recordDate: string;
  reporter: string;
  serviceType: string;
  mealType: MealCategory;
  timeValue: string;
  mainDish: string;
  subDish: string;
  soupVolume: string;
  teaVolume: string;
  snackVolume: string;
  drinkVolume: string;
  waterVolume: string;
  waterType: string;
  memo: string;
  settingReport: string;
  isSynced: boolean;
};

export type TMealRecordDataChange = {
  recordDate?: string;
  reporter?: string;
  serviceType?: string;
  mealType?: MealCategory;
  timeValue?: string;
  mainDish?: string;
  subDish?: string;
  soupVolume?: string;
  teaVolume?: string;
  snackVolume?: string;
  drinkVolume?: string;
  waterVolume?: string;
  waterType?: string;
  memo?: string;
  settingReport?: string;
};

enum InputSoupType {
  AvailableValue = 'availableSoupValue',
  TypingValue = 'typingSoupValue',
}

enum InputTeaType {
  AvailableValue = 'availableTeaValue',
  TypingValue = 'typingTeaValue',
}

enum InputDrinkType {
  AvailableValue = 'availableDrinkValue',
  TypingValue = 'typingDrinkValue',
}

enum InputWaterType {
  AvailableValue = 'availableWaterValue',
  TypingValue = 'typingWaterValue',
}

interface IMealRecordContentProps {
  data: TMealRecordData;
  onChange: (e: TMealRecordDataChange) => void;
}

const MealRecordContent = (props: IMealRecordContentProps) => {
  const {data, onChange} = props;
  const {t} = useTranslation();
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const recordSetting = useSelector(selectRecordSetting);
  const timeInit = moment(data.timeValue, TIME_24H_FORMAT).toDate();
  const [defaultDateOfMeal, setDefaultDateOfMeal] = useState(timeInit);

  const dispatch = useAppDispatch();

  const getWaterList = useCallback(async () => {
    try {
      const waterList = await MealDB.findWaterTypeListRecords();
      dispatch(setWaterList({waterList}));
    } catch (error) {
      console.error('getWaterList error', {error});
    }
  }, []);

  const getDefaultDateOfMeal = async () => {
    if (!data.timeValue) {
      const defaultTimeFromMealType = await getDefaultTimeFromMealType(
        data.mealType,
      );
      setDefaultDateOfMeal(defaultTimeFromMealType);
    }
  };

  useEffect(() => {
    getDefaultDateOfMeal();
  }, [data.mealType, data.timeValue]);

  useEffect(() => {
    //get water list
    getWaterList();
  }, []);

  const renderMainMeal = () => {
    return (
      <>
        <CapacityInputRecord
          label={t('popover.main_dish')}
          title={t('popover.main_dish')}
          value={data.mainDish}
          data={volumeDishList}
          onChange={e => onChange({mainDish: e})}
        />

        <CapacityInputRecord
          label={t('popover.sub_dish')}
          title={t('popover.sub_dish')}
          value={data.subDish}
          data={volumeDishList}
          onChange={e => onChange({subDish: e})}
        />

        <VolumeInputRecord
          label={t('popover.soup')}
          title={t('popover.soup')}
          value={data.soupVolume}
          data={soupList}
          keyTabs={[InputSoupType.AvailableValue, InputSoupType.TypingValue]}
          onChange={e => onChange({soupVolume: e})}
        />

        <VolumeInputRecord
          label={t('popover.tea')}
          title={t('popover.tea')}
          value={data.teaVolume}
          data={soupList}
          keyTabs={[InputTeaType.AvailableValue, InputTeaType.TypingValue]}
          onChange={e => onChange({teaVolume: e})}
        />
      </>
    );
  };

  const renderSnackMeal = () => {
    return (
      <>
        <CapacityInputRecord
          label={t('popover.snack')}
          title={t('popover.snack')}
          value={data.snackVolume}
          data={snackVolumeList}
          onChange={e => onChange({snackVolume: e})}
        />

        <VolumeInputRecord
          label={t('popover.drink')}
          title={t('popover.drink')}
          value={data.drinkVolume}
          data={teaList}
          keyTabs={[InputDrinkType.AvailableValue, InputDrinkType.TypingValue]}
          onChange={e => onChange({drinkVolume: e})}
        />
      </>
    );
  };

  const renderDrinkMeal = () => {
    return (
      <>
        <VolumeInputRecord
          label={t('popover.water_volume')}
          title={t('popover.water_volume')}
          value={data.waterVolume}
          data={soupList}
          keyTabs={[InputWaterType.AvailableValue, InputWaterType.TypingValue]}
          onChange={e => onChange({waterVolume: e})}
        />

        <CapacityInputRecord
          label={t('common.content')}
          title={t('popover.water_type_long')}
          value={data.waterType}
          data={convertSettingsSelectItemToTextListItem(
            recordSetting.waterList,
          )}
          onChange={e => onChange({waterType: e})}
        />
      </>
    );
  };

  const renderMealFromType = () => {
    if (data.mealType === t('popover.meal_drink')) {
      return renderDrinkMeal();
    } else if (
      !_.includes(
        [t('popover.meal_am_snack'), t('popover.meal_pm_snack')],
        data.mealType,
      )
    ) {
      return renderMainMeal();
    }

    return renderSnackMeal();
  };

  return (
    <View style={styles.container}>
      <DateTimePickerInputRecord
        label={t('popover.record_date')}
        mode={
          data.mealType === t('popover.meal_drink')
            ? DateTimePickerMode.DateTime
            : DateTimePickerMode.Date
        }
        onChange={e => onChange({recordDate: moment(e).toISOString()})}
      />

      <RecordContentItem disable title={t('popover.reporter')}>
        <BaseText
          opacity="low"
          color={Colors.TEXT_PRIMARY}
          text={data.reporter}
        />
      </RecordContentItem>

      {appType === AppType.TAKINO && (
        <CapacityInputRecord
          label={t('popover.service_type')}
          title={t('popover.service_type')}
          value={data.serviceType}
          data={
            serviceName === t('care_list.smallMultiFunctionsService')
              ? serviceTypeListOne
              : serviceTypeListTwo
          }
          onChange={e => onChange({serviceType: e})}
          placeholder={t('popover.not_set')}
          showInfoIcon
        />
      )}

      <RecordContentItem disable title={t('popover.meal_type')}>
        <BaseText color={Colors.TEXT_PRIMARY} text={data.mealType} />
      </RecordContentItem>

      {data.mealType !== t('popover.meal_drink') && (
        <DateTimePickerInputRecord
          label={t('popover.time_meal')}
          mode={DateTimePickerMode.Time}
          onChange={e =>
            onChange({timeValue: moment(e).format(TIME_24H_FORMAT)})
          }
          defaultDate={defaultDateOfMeal}
          allowChangeDefaultDate
        />
      )}

      {renderMealFromType()}

      <RecordContentItem
        titleStyle={styles.memoLabel}
        leftViewStyle={styles.contentLeftMemoView}
        disable
        title={t('popover.memo')}>
        <BaseTextInput
          onChangeText={e => onChange({memo: e})}
          value={data.memo}
          multiline
          containerStyle={styles.memoViewStyle}
          style={styles.memoInputStyle}
        />
      </RecordContentItem>

      <ReportInputRecord
        value={data.settingReport}
        onChange={e => onChange({settingReport: e})}
      />
    </View>
  );
};

export default MealRecordContent;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  timeValueView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    justifyContent: 'space-between',
  },
  memoViewStyle: {
    height: 200,
    backgroundColor: Colors.WHITE,
    width: 410,
  },
  memoInputStyle: {
    height: 200,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingTop: 10,
    width: 410,
  },
  contentLeftMemoView: {
    height: '100%',
    width: 110,
  },
  memoLabel: {
    marginTop: 15,
  },
});
