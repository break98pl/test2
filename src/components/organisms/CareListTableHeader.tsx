import React, {memo} from 'react';
import {
  StyleSheet,
  View,
  DimensionValue,
  StyleProp,
  ViewStyle,
  InteractionManager,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';

import {Colors} from '@themes/colors';
import {hs} from '@themes/responsive';
import BaseText from '@atoms/BaseText';
import {images} from '@constants/images';
import {FontSize} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import {useAppDispatch, useAppSelector} from '@store/config';
import {
  selectCareListSortedBy,
  setCareListSortedBy,
} from '@modules/record/record.slice';

type colWidthType = {
  recordDateTime: DimensionValue;
  recordName: DimensionValue;
  recordContent: DimensionValue;
  recordReporter: DimensionValue;
};

export const careListTableColWidths: colWidthType = {
  recordDateTime: '16%',
  recordName: '21%',
  recordContent: '49%',
  recordReporter: '12%',
};

const CareListTableHeader = () => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const currentSortedBy = useAppSelector(selectCareListSortedBy);

  // text
  const recordDateTimeText = t('care_list.recordDateTime');
  const recordTypeText = t('care_list.recordType');
  const recordContentText = t('care_list.recordContent');
  const recordReporterText = t('care_list.recordReporter');

  const arrowIconStyle: StyleProp<ViewStyle> = {
    transform: [
      {
        rotate: currentSortedBy === 'desc' ? '0deg' : '180deg',
      },
    ],
  };

  const changeCareListSortedBy = () => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(
        setCareListSortedBy({
          sortedBy: currentSortedBy === 'asc' ? 'desc' : 'asc',
        }),
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* record date time col */}
      <BaseButton
        hitSlop={5}
        style={styles.recordDateTime}
        onPress={changeCareListSortedBy}>
        <BaseText style={styles.headerText}>{recordDateTimeText}</BaseText>
        <View style={arrowIconStyle}>
          <FastImage
            style={styles.dateTimeArrow}
            source={images.arrowDown}
            tintColor={Colors.WHITE}
          />
        </View>
      </BaseButton>
      {/* record type col */}
      <View style={styles.recordName}>
        <BaseText style={styles.headerText}>{recordTypeText}</BaseText>
      </View>
      {/* record content col */}
      <View style={styles.recordContent}>
        <BaseText style={styles.headerText}>{recordContentText}</BaseText>
      </View>
      {/* record reporter col */}
      <View style={styles.recordReporter}>
        <BaseText style={styles.headerText}>{recordReporterText}</BaseText>
      </View>
    </View>
  );
};

export default memo(CareListTableHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    backgroundColor: Colors.DARK_GRAY,
  },
  recordDateTime: {
    paddingLeft: 40,
    flexDirection: 'row',
    alignItems: 'center',
    width: careListTableColWidths.recordDateTime,
  },
  recordName: {
    textAlign: 'center',
    paddingLeft: hs(60),
    width: careListTableColWidths.recordName,
  },
  recordContent: {
    width: careListTableColWidths.recordContent,
  },
  recordReporter: {
    width: careListTableColWidths.recordReporter,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: FontSize.SMALL,
  },
  dateTimeArrow: {
    width: 12,
    height: 12,
    marginLeft: 4,
  },
});
