import React, {memo, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {images} from '@constants/images';
import {DATE_WEEKDAY_FORMAT} from '@constants/constants';
import {useAppSelector} from '@store/config';
import {CareListLoadingType} from '@modules/careList/careList.type';
import {
  selectCanFetchMoreCareList,
  selectCanReloadCareList,
} from '@modules/careList/careList.slice';

interface Props {
  loading: boolean;
  slot: 'header' | 'footer';
  loadType: CareListLoadingType;
  careFromDate: string;
}

const CareListLoadingView = ({
  slot,
  loading,
  loadType,
  careFromDate,
}: Props) => {
  const {t} = useTranslation();

  const canReloadCareList = useAppSelector(selectCanReloadCareList);
  const canFetchMoreCareList = useAppSelector(selectCanFetchMoreCareList);

  const rotateValue = useRef(new Animated.Value(0)).current;
  const arrowIconStyle: StyleProp<ImageStyle> = {
    height: 16,
    width: 16,
    transform: [
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  let desc = '';
  if (loadType === CareListLoadingType.Reload) {
    if (canReloadCareList) {
      desc = t('care_list.releaseFingerToUpdate');
    } else {
      desc = t('care_list.updateToLatestInfo');
    }
  } else if (loadType === CareListLoadingType.LoadMore) {
    if (canFetchMoreCareList) {
      desc = t('care_list.releaseFingerToFetchMore');
    } else {
      desc = t('care_list.datesToFetchMore', {
        date: moment(careFromDate).format(DATE_WEEKDAY_FORMAT),
      });
    }
  }

  /**
   * Handle arrow animation.
   */
  useEffect(() => {
    Animated.timing(rotateValue, {
      toValue:
        (canReloadCareList && loadType === CareListLoadingType.Reload) ||
        (canFetchMoreCareList && loadType === CareListLoadingType.LoadMore)
          ? 1
          : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [canReloadCareList, canFetchMoreCareList]);

  return (
    <View style={styles.container}>
      <View style={styles.indicatorContainer}>
        {loading ? (
          <ActivityIndicator color={Colors.GRAY_TEXT} size={18} />
        ) : (
          <Animated.Image
            style={arrowIconStyle}
            tintColor={Colors.GRAY_TEXT}
            source={
              slot === 'header' ? images.listArrowDown : images.listArrowUp
            }
          />
        )}
      </View>
      <BaseText style={styles.desc}>{desc}</BaseText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  indicatorContainer: {
    width: 40,
    alignItems: 'center',
  },
  desc: {
    flex: 1,
    paddingVertical: 5,
    textAlign: 'center',
    color: Colors.GRAY_TEXT,
  },
});

export default memo(CareListLoadingView);
