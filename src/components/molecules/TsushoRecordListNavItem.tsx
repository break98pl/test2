import {StyleSheet} from 'react-native';
import React from 'react';
import NavigationArrowRight from '@atoms/NavigationArrowRight';
import {DimensionValue} from 'react-native';
import BaseButton from '@atoms/BaseButton';

type TsushoRecordListNavItemProps = {
  width: DimensionValue;
  onPress: () => void;
};

const TsushoRecordListNavItem = ({
  width,
  onPress,
}: TsushoRecordListNavItemProps) => {
  return (
    <BaseButton
      onPress={onPress}
      style={StyleSheet.flatten([styles.container, {width}])}>
      <NavigationArrowRight />
    </BaseButton>
  );
};

export default TsushoRecordListNavItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
