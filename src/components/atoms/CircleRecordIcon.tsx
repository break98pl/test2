import {StyleSheet, View} from 'react-native';
import React from 'react';
import {images} from '@constants/images';
import FastImage from 'react-native-fast-image';
import {RecordType} from '@modules/record/record.type';
import {
  getRecordSyncImage,
  getRecordUnSyncImage,
} from '@modules/record/record.utils';

type CircleRecordIconSize = 'medium' | 'large';

type CircleRecordIconProps = {
  recordType: RecordType;
  isSynced: boolean;
  isPreventedToSync?: boolean;
  size: CircleRecordIconSize;
  isAPRecord?: boolean;
};

const CircleRecordIcon = ({
  recordType,
  isSynced,
  isPreventedToSync = false,
  size,
  isAPRecord = false,
}: CircleRecordIconProps) => {
  const getIconSize = () => {
    switch (size) {
      case 'medium':
        return styles.medium;
      case 'large':
        return styles.large;
      default:
        return {};
    }
  };

  return !isPreventedToSync ? (
    <View>
      <FastImage
        source={
          isSynced
            ? getRecordSyncImage(recordType)
            : getRecordUnSyncImage(recordType)
        }
        style={getIconSize()}
      />
      {isAPRecord && (
        <FastImage source={images.assignPortableRecord} style={getIconSize()} />
      )}
    </View>
  ) : (
    <FastImage source={images.recordSyncPrevented} style={getIconSize()} />
  );
};

export default CircleRecordIcon;

const styles = StyleSheet.create({
  medium: {
    width: 18,
    height: 18,
  },
  large: {
    width: 24,
    height: 24,
  },
});
