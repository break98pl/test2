import React from 'react';
import {StyleSheet, View} from 'react-native';
import BaseText from '@atoms/BaseText';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectFetchTime} from '@modules/setting/setting.slice';
import {fetchTimeList} from '@constants/constants';
import deviceInfo from '@libs/deviceInfo';
import {Colors} from '@themes/colors';

const AppVersionSection = () => {
  const {t} = useTranslation();
  const fetchTimeSelector = useSelector(selectFetchTime);

  const getFetchingTimeText = (): string => {
    let result = '';
    const fetchingTime = fetchTimeList.find(
      time => time.type === fetchTimeSelector,
    );
    if (fetchingTime) {
      result = t(fetchingTime.text);
    }
    return result;
  };

  return (
    <View style={styles.appVersionContainer}>
      <BaseText
        color={Colors.GRAY_PH}
        text={`${t('setting.period_fetch')}:  ${getFetchingTimeText()}`}
      />
      <BaseText
        color={Colors.GRAY_PH}
        text={`${t('login.version')}: ${deviceInfo.getAppVersion().appVersion}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  appVersionContainer: {
    gap: 8,
  },
});

export default AppVersionSection;
