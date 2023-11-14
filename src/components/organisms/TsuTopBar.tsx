import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import DateTimePicker from '@organisms/DateTimePicker';
import {DateTimePickerMode} from '@molecules/DateTimePickerText';
import ScreenTitle from '@molecules/ScreenTitle';
import {useTranslation} from 'react-i18next';
import {images} from '@constants/images';
import ScreenHeaderBarWrapper from '@templates/ScreenHeaderBarWrapper';
import {selectFetchTime} from '@modules/setting/setting.slice';
import {SettingService} from '@modules/setting/setting.service';
import moment from 'moment/moment';
import {
  selectFilteringDate,
  setFilteringDate,
} from '@modules/tenant/tenant.slice';
import {DATE_FORMAT} from '@constants/constants';
import {useAppDispatch, useAppSelector} from '@store/config';
import TsushoVPListFilteredGroup from './TsushoVPListFilteredGroup';
import {useSelector} from 'react-redux';
import InitAppDataView from '@organisms/InitAppDataView';
import {getLabelOfScreen} from '@modules/tenant/tenant.utils';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {useRoute} from '@react-navigation/native';

const TsuTopBar = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const fetchTime = useAppSelector(selectFetchTime);
  const filteringDate = useSelector(selectFilteringDate);
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const route = useRoute();

  // TODO: When the logic of fetching more data has implemented, fix min date and max date
  const pickerMinDate = moment()
    .subtract(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
    .toDate();
  const pickerMaxDate = moment()
    .add(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
    .toDate();

  const updateFilteredDate = useCallback((date: Date) => {
    dispatch(setFilteringDate({date: moment(date).format(DATE_FORMAT)}));
  }, []);

  return (
    <ScreenHeaderBarWrapper>
      <View style={styles.leftSection}>
        <InitAppDataView />
        <View style={styles.dateTimePickerContainer}>
          <DateTimePicker
            title={t('common.targetDay')}
            mode={DateTimePickerMode.Date}
            isShowSuffix={true}
            minDate={pickerMinDate}
            maxDate={pickerMaxDate}
            onConfirmDate={updateFilteredDate}
            defaultDate={moment(filteringDate).toDate()}
            allowChangeDefaultDate
          />
        </View>
        <TsushoVPListFilteredGroup />
      </View>
      {/* screen title */}
      <ScreenTitle
        containerStyle={styles.screenTitle}
        title={getLabelOfScreen(route.name, appType, serviceName)}
        img={images.tsusho40}
        isShowImg={true}
      />
    </ScreenHeaderBarWrapper>
  );
};

export default TsuTopBar;

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
