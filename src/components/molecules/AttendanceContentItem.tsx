import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {Colors} from '@themes/colors';

interface IAttendanceContentItemProps {
  label?: string;
  content?: string;
  checked?: boolean;
  onPress?: () => void;
  textColor?: string;
  selectedInPast?: boolean;
  disabled?: boolean;
}

const AttendanceContentItem = (props: IAttendanceContentItemProps) => {
  const {
    label,
    content,
    checked,
    onPress,
    textColor,
    selectedInPast,
    disabled,
  } = props;

  const getLabelColor = () => {
    if (disabled) {
      return Colors.GRAY_TEXT;
    } else if (checked) {
      return Colors.WHITE;
    }
    return textColor;
  };

  const getBackgroundColor = () => {
    if (checked) {
      return Colors.GRAY_PH;
    } else if (selectedInPast) {
      return Colors.WHITE;
    }
    return Colors.POPOVER_BG;
  };

  return (
    <BaseButton
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, {backgroundColor: getBackgroundColor()}]}>
      <View style={styles.left}>
        <BaseText
          color={getLabelColor()}
          size="xLarge"
          weight="semiBold"
          text={label}
        />
      </View>
      <View style={styles.right}>
        <BaseText color={Colors.GRAY_TEXT} size="xLarge" text={content} />
      </View>
      {checked && (
        <FastImage
          style={styles.checkedIcon}
          source={images.checkMark}
          resizeMode={'contain'}
          tintColor={Colors.PRIMARY}
        />
      )}
    </BaseButton>
  );
};

export default AttendanceContentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 25,
  },
  left: {
    flex: 4,
  },
  right: {
    flex: 9,
  },
  checkedIcon: {
    marginRight: 10,
    width: 22,
    height: 22,
  },
});
