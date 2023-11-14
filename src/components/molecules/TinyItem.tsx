import {StyleSheet} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';

interface ITinyItemProps {
  isChoosing?: boolean;
  label?: string;
  value?: string;
  onPress?: () => void;
}

const TinyItem = (props: ITinyItemProps) => {
  const {isChoosing, label, value, onPress} = props;

  return (
    <BaseButton
      onPress={onPress}
      style={[styles.container, isChoosing && styles.chosenItem]}>
      <BaseText size="small" color={Colors.PRIMARY} text={label} />
      <BaseText size="small" color={Colors.TEXT_PRIMARY} text={value} />
    </BaseButton>
  );
};

export default TinyItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 50,
    alignItems: 'center',
  },
  chosenItem: {
    backgroundColor: Colors.GRAY_BORDER,
  },
});
