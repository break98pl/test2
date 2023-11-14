import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';

interface IPlaceInfoProps {
  buildingName?: string;
  floorNo?: string;
  roomNo?: string;
  color?: string;
  borderColor?: string;
  isHeader?: boolean;
}

const PlaceInfo = (props: IPlaceInfoProps) => {
  const {buildingName, floorNo, roomNo, color, borderColor, isHeader} = props;

  return (
    <View style={[styles.addressInfo, {borderRightColor: borderColor}]}>
      <View style={styles.addressLeft}>
        <BaseText
          size={isHeader ? 'small' : 'medium'}
          weight={'normal'}
          color={color}
          text={buildingName}
        />
        <BaseText
          size={isHeader ? 'small' : 'medium'}
          weight={'normal'}
          color={color}
          style={styles.roomView}
          text={roomNo}
        />
      </View>
      <BaseText
        size={isHeader ? 'small' : 'medium'}
        weight={'normal'}
        color={color}
        text={floorNo}
      />
    </View>
  );
};

export default PlaceInfo;

const styles = StyleSheet.create({
  addressInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  addressLeft: {
    width: 70,
  },
  roomView: {
    width: 150,
  },
});
