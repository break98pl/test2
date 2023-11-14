import {StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import {FontWeight} from '@themes/typography';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import NavigationArrowRight from '@atoms/NavigationArrowRight';

interface IVitalRowWrapperProps {
  isHeader?: boolean;
  renderUserInfo?: React.ReactNode;
  renderSchedule?: React.ReactNode;
  renderPulse?: React.ReactNode;
  renderRespiratory?: React.ReactNode;
  renderBloodPressure?: React.ReactNode;
  renderTemperature?: React.ReactNode;
  renderSaturation?: React.ReactNode;
  renderWeight?: React.ReactNode;
  renderMemo?: React.ReactNode;
  onPress?: () => void;
  deepBg?: boolean;
  isSynced?: boolean;
}

const windowWidth = Dimensions.get('window').width;

const VitalRowWrapper = (props: IVitalRowWrapperProps) => {
  const {
    isHeader,
    renderUserInfo,
    renderSchedule,
    renderPulse,
    renderRespiratory,
    renderBloodPressure,
    renderTemperature,
    renderSaturation,
    renderWeight,
    renderMemo,
    onPress,
    deepBg,
    isSynced = true,
  } = props;

  return (
    <View
      style={
        isHeader
          ? styles.rowContainer
          : [
              styles.rowDataContainer,
              deepBg && {
                backgroundColor: Colors.DEEP_WHITE,
              },
            ]
      }>
      <View
        style={StyleSheet.compose(styles.itemColumn, styles.userInfoColumn)}>
        {renderUserInfo}
      </View>
      <View
        style={StyleSheet.compose(styles.itemColumn, styles.scheduleColumn)}>
        {renderSchedule}
      </View>
      <View style={StyleSheet.compose(styles.itemColumn, styles.pulseColumn)}>
        {renderPulse}
      </View>
      <View
        style={StyleSheet.compose(styles.itemColumn, styles.respiratoryColumn)}>
        {renderRespiratory}
      </View>
      <View
        style={StyleSheet.compose(
          styles.itemColumn,
          styles.bloodPressureColumn,
        )}>
        {renderBloodPressure}
      </View>
      <View
        style={StyleSheet.compose(styles.itemColumn, styles.temperatureColumn)}>
        {renderTemperature}
      </View>
      <View
        style={StyleSheet.compose(styles.itemColumn, styles.saturationColumn)}>
        {renderSaturation}
      </View>
      <View style={StyleSheet.compose(styles.itemColumn, styles.weightColumn)}>
        {renderWeight}
      </View>
      <View style={StyleSheet.compose(styles.itemColumn, styles.memoColumn)}>
        {renderMemo}
      </View>
      <BaseButton
        disabled={isHeader}
        onPress={onPress}
        style={StyleSheet.compose(styles.itemColumn, styles.arrowHeader)}>
        {!isHeader && (
          <>
            {!isSynced && (
              <FastImage
                source={images.vitalRecordUnsync}
                resizeMode="contain"
                style={styles.unSyncIcon}
              />
            )}
            <NavigationArrowRight />
          </>
        )}
      </BaseButton>
    </View>
  );
};

export default VitalRowWrapper;

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
  itemColumn: {
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
    width: 180,
    borderLeftWidth: 0,
  },
  scheduleColumn: {
    width: 110,
    zIndex: 99,
  },
  pulseColumn: {
    width: 75,
  },
  respiratoryColumn: {
    width: 75,
  },
  bloodPressureColumn: {
    width: 150,
  },
  temperatureColumn: {
    width: 75,
  },
  saturationColumn: {
    width: 75,
  },
  weightColumn: {
    width: 75,
  },
  memoColumn: {
    width: windowWidth - 875,
  },
  arrowHeader: {
    width: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingRight: 15,
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
  unSyncIcon: {
    width: 18,
    height: 18,
  },
});
