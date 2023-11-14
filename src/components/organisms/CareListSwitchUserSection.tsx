import React from 'react';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {FontSize} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import {images} from '@constants/images';
import {DATETIME_CARE_LIST_FORMAT} from '@constants/constants';

export enum CareListSwitchUserType {
  Previous,
  Next,
}

interface CareListSwitchUserSectionProps {
  type: CareListSwitchUserType;
  fromDate?: string;
  nextUserName?: string;
  prevUserName?: string;
  onPressNextUser?(): void;
  onPressPrevUser?(): void;
}

const CareListSwitchUserSection = ({
  type,
  nextUserName = '',
  prevUserName = '',
  onPressNextUser,
  onPressPrevUser,
  fromDate,
}: CareListSwitchUserSectionProps) => {
  const {t} = useTranslation();

  // text and dummy text
  const samaText = t('common.sama');
  const prevSuffix = '<';
  const nextPrefix = '>';
  const careListPeriod = fromDate
    ? `${moment(fromDate).format(DATETIME_CARE_LIST_FORMAT)} ～ ${t(
        'care_list.today',
      )}: ${t('common.day', {
        numberOfDays: moment().diff(moment(fromDate), 'day') + 1,
      })}`
    : '';

  return type === CareListSwitchUserType.Previous ? (
    // prev user info
    <View style={styles.prevUserContainer}>
      <View style={styles.prevUserInfo}>
        {/* go to prev target user */}
        <BaseButton
          onPress={onPressPrevUser}
          disabled={!prevUserName.length}
          dimmingWhenDisabled>
          <FastImage
            resizeMode="contain"
            style={styles.nextPrevImg}
            source={images.prevCareList}
          />
        </BaseButton>
        {prevUserName.length > 0 && (
          <>
            <BaseText style={styles.prevUserName}>{prevUserName}</BaseText>
            <BaseText style={styles.prevSama}>{samaText}</BaseText>
            <BaseText style={styles.suffix}>{prevSuffix}</BaseText>
          </>
        )}
      </View>
      {/* prev user info contains fetch days info */}
      <View style={styles.fetchedDaysInfo}>
        <BaseText>{careListPeriod}</BaseText>
      </View>
    </View>
  ) : (
    // next user info
    <View style={styles.nextUserContainer}>
      <View style={styles.nextUserInfo}>
        {nextUserName.length > 0 && (
          <>
            <BaseText style={styles.prefix}>{nextPrefix}</BaseText>
            <BaseText style={styles.nextUserName}>{nextUserName}</BaseText>
            <BaseText style={styles.nextSama}>{samaText}</BaseText>
          </>
        )}
        {/* go to next target user */}
        <BaseButton
          onPress={onPressNextUser}
          disabled={!nextUserName.length}
          dimmingWhenDisabled>
          <FastImage
            resizeMode="contain"
            style={styles.nextPrevImg}
            source={images.nextCareList}
          />
        </BaseButton>
      </View>
    </View>
  );
};

export default CareListSwitchUserSection;

const styles = StyleSheet.create({
  prevUserContainer: {
    width: 250,
  },
  prevUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prevUserName: {
    marginLeft: 20,
    color: Colors.DARK_GRAY,
    fontSize: FontSize.SMALL,
  },
  prevSama: {
    marginTop: 3,
    marginLeft: 12,
    color: Colors.DARK_GRAY,
    fontSize: FontSize.X_SMALL,
  },
  suffix: {
    marginLeft: 2,
    color: Colors.DARK_GRAY,
  },
  fetchedDaysInfo: {
    marginTop: 18,
    paddingLeft: 10,
  },
  nextUserContainer: {
    width: 250,
    alignItems: 'flex-end',
  },
  nextUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefix: {
    marginRight: 2,
    color: Colors.DARK_GRAY,
  },
  nextUserName: {
    marginRight: 10,
    color: Colors.DARK_GRAY,
    fontSize: FontSize.SMALL,
  },
  nextSama: {
    marginTop: 3,
    marginRight: 20,
    color: Colors.DARK_GRAY,
    fontSize: FontSize.X_SMALL,
  },
  nextPrevImg: {
    marginTop: -2,
    width: 32,
    height: 48,
  },
});
