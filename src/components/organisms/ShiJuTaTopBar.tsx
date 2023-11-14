import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {getAppIcon, getLabelOfScreen} from '@modules/tenant/tenant.utils';
import {Colors} from '@themes/colors';
import {useAppDispatch, useAppSelector} from '@store/config';
import DateTimePicker from '@organisms/DateTimePicker';
import {DateTimePickerMode} from '@molecules/DateTimePickerText';
import {selectFetchTime} from '@modules/setting/setting.slice';
import moment from 'moment';
import {SettingService} from '@modules/setting/setting.service';
import {
  selectFilteringDate,
  setFilteringDate,
} from '@modules/tenant/tenant.slice';
import {AppType} from '@modules/setting/setting.type';
import {DATE_FORMAT} from '@constants/constants';
import TsushoVPListFilteredGroup from './TsushoVPListFilteredGroup';
import {useSelector} from 'react-redux';
import InitAppDataView from './InitAppDataView';
import {useRoute} from '@react-navigation/native';
import ScreenTitle from '@molecules/ScreenTitle';

const ShiJuTaTopBar = () => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const route = useRoute();
  const fetchTime = useAppSelector(selectFetchTime);
  const filteringDate = useSelector(selectFilteringDate);

  // TODO: When the logic of fetching more data has implemented, fix min date and max date
  const pickerMinDate = moment()
    .subtract(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
    .toDate();
  const pickerMaxDate =
    appType === AppType.SHISETSHU
      ? moment().toDate()
      : moment()
          .add(SettingService.getNumOfDayByFetchTimeType(fetchTime), 'days')
          .toDate();

  const updateFilteredDate = useCallback((date: Date) => {
    dispatch(setFilteringDate({date: moment(date).format(DATE_FORMAT)}));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.leftView}>
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
        {appType === AppType.TSUSHO && <TsushoVPListFilteredGroup />}
      </View>
      <ScreenTitle
        containerStyle={styles.appName}
        title={getLabelOfScreen(route.name, appType, serviceName)}
        img={getAppIcon(appType)}
        isShowImg={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
    alignItems: 'flex-end',
    paddingBottom: 10,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
  },
  leftView: {
    position: 'absolute',
    left: 20,
    flexDirection: 'row',
    gap: 20,
    bottom: 10,
  },
  appName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
  },
  dateTimePickerContainer: {
    width: 240,
  },
});

export default ShiJuTaTopBar;
