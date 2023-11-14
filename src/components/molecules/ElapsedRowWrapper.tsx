import {StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import {FontWeight} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import NavigationArrowRight from '@atoms/NavigationArrowRight';

interface IElapsedRowWrapperProps {
  isHeader?: boolean;
  renderUserInfo?: React.ReactNode;
  renderSchedule?: React.ReactNode;
  renderRecord?: React.ReactNode;
  renderRecordIcon?: React.ReactNode;
  renderRecordDetail1?: React.ReactNode;
  renderRecordDetail2?: React.ReactNode;
  renderRecordDetail3?: React.ReactNode;
  onPress?: () => void;
  deepBg?: boolean;
  isChecked?: boolean;
  onCheck?: () => void;
}

const windowWidth = Dimensions.get('window').width;

const ElapsedRowWrapper = (props: IElapsedRowWrapperProps) => {
  const {
    isHeader,
    renderUserInfo,
    renderSchedule,
    renderRecord,
    renderRecordIcon,
    renderRecordDetail1,
    renderRecordDetail2,
    renderRecordDetail3,
    onPress,
    deepBg,
    isChecked,
    onCheck,
  } = props;

  if (isHeader) {
    return (
      <View style={styles.rowContainer}>
        <View
          style={StyleSheet.compose(
            styles.itemHeaderColumn,
            styles.userInfoColumn,
          )}>
          {renderUserInfo}
        </View>
        <View
          style={StyleSheet.compose(
            styles.itemHeaderColumn,
            styles.scheduleColumn,
          )}>
          {renderSchedule}
        </View>
        <View
          style={StyleSheet.compose(
            styles.itemHeaderColumn,
            styles.recordColumn,
          )}>
          {renderRecord}
        </View>
        <View
          style={StyleSheet.compose(
            styles.itemHeaderColumn,
            styles.arrowHeader,
          )}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.rowDataContainer,
        deepBg && {
          backgroundColor: Colors.DEEP_WHITE,
        },
      ]}>
      <View
        style={StyleSheet.compose(
          styles.itemDataColumn,
          styles.userInfoColumn,
        )}>
        <View style={styles.userFrame}>
          <BaseButton onPress={onCheck}>
            {isChecked ? (
              <FastImage
                resizeMode="contain"
                source={images.doneCheckboxLarge}
                style={styles.tickIcon}
              />
            ) : (
              <FastImage
                resizeMode="contain"
                source={images.emptyCheckboxFrameLarge}
                style={styles.tickIcon}
              />
            )}
          </BaseButton>
          {renderUserInfo}
        </View>
      </View>
      <View
        style={StyleSheet.compose(
          styles.itemDataColumn,
          styles.scheduleColumn,
        )}>
        {renderSchedule}
      </View>
      <View
        style={StyleSheet.compose(
          styles.itemDataColumn,
          styles.recordIconColumn,
        )}>
        {renderRecordIcon}
      </View>
      <View
        style={StyleSheet.compose(
          styles.itemDataColumn,
          styles.recordDetailColumn,
        )}>
        {renderRecordDetail1}
      </View>
      <View
        style={StyleSheet.compose(
          styles.itemDataColumn,
          styles.recordDetailColumn,
        )}>
        {renderRecordDetail2}
      </View>
      <View
        style={StyleSheet.compose(
          styles.itemDataColumn,
          styles.recordDetailColumn,
        )}>
        {renderRecordDetail3}
      </View>
      <BaseButton
        onPress={onPress}
        style={StyleSheet.compose(styles.itemDataColumn, styles.arrowHeader)}>
        <NavigationArrowRight />
      </BaseButton>
    </View>
  );
};

export default ElapsedRowWrapper;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    height: 25,
    backgroundColor: Colors.HEADER_GRAY,
  },
  rowDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    height: 66,
  },
  itemHeaderColumn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDataColumn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.5,
    borderLeftColor: Colors.HEADER_BLUE,
  },
  userInfoColumn: {
    width: 260,
    borderLeftWidth: 0,
  },
  scheduleColumn: {
    width: 120,
    zIndex: 99,
  },
  recordColumn: {
    width: windowWidth - 380,
  },
  recordIconColumn: {
    width: 80,
  },
  recordDetailColumn: {
    width: (windowWidth - 520) / 3,
  },
  arrowHeader: {
    width: 60,
  },
  arrowBtn: {
    color: Colors.TEXT_BLUE,
    fontWeight: FontWeight.bold,
  },
  userFrame: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickIcon: {
    width: 34,
    height: 34,
  },
});
