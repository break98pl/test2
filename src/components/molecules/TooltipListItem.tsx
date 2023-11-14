import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import FastImage, {Source} from 'react-native-fast-image';

interface ITooltipListItemProps {
  onPress?: () => void;
  value?: string;
  isSelecting?: boolean;
  icon?: Source;
}

const TooltipListItem = (props: ITooltipListItemProps) => {
  const {value, onPress, isSelecting, icon} = props;
  return (
    <BaseButton
      style={isSelecting ? styles.chosenItem : undefined}
      onPress={onPress}>
      <View style={styles.periodViewType}>
        {icon && (
          <FastImage
            style={styles.periodIcon}
            source={icon}
            resizeMode="contain"
          />
        )}
        <BaseText size="xxLarge" text={value} />
      </View>
    </BaseButton>
  );
};

export default TooltipListItem;

const styles = StyleSheet.create({
  periodViewType: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY_PH,
    height: 43,
    gap: 10,
  },
  chosenItem: {
    backgroundColor: Colors.CHOOSING_BG,
  },
  periodIcon: {
    width: 42,
    height: 42,
  },
});
