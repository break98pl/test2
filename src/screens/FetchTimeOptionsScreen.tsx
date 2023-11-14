import {StyleSheet} from 'react-native';
import React from 'react';
import SettingWrapper from '@molecules/SettingWrapper';
import SettingItem from '@molecules/SettingItem';
import {useDispatch, useSelector} from 'react-redux';
import {selectFetchTime, setFetchTime} from '@modules/setting/setting.slice';
import {useTranslation} from 'react-i18next';
import {FetchTimeType} from '@modules/setting/setting.type';
import Screen from '@templates/Screen';
import {Colors} from '@themes/colors';
import {fetchTimeList} from '@constants/constants';

const FetchTimeOptionsScreen = () => {
  const fetchTime = useSelector(selectFetchTime);
  const dispatch = useDispatch();
  const {t} = useTranslation();

  return (
    <Screen
      barStyle="dark-content"
      style={styles.screen}
      contentStyle={styles.contentContainer}
      scrollable>
      <SettingWrapper style={styles.fetchTimeList}>
        {fetchTimeList.map(time => {
          return (
            <SettingItem
              key={time.type}
              checked={fetchTime === time.type}
              onPress={() => dispatch(setFetchTime({fetchTime: time.type}))}
              link
              noLinkIcon
              label={t(time.text)}
              noBottomLine={time.type === FetchTimeType.OneMonth}
            />
          );
        })}
      </SettingWrapper>
    </Screen>
  );
};

export default FetchTimeOptionsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  fetchTimeList: {
    marginVertical: 25,
  },
});
