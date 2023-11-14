import {StyleSheet} from 'react-native';
import React from 'react';
import {images} from '@constants/images';
import FastImage from 'react-native-fast-image';
import BaseButton, {BaseButtonProps} from '@atoms/BaseButton';

export enum CheckboxType {
  Type1,
  Type2,
  CircleType1,
}

interface CheckboxProps extends BaseButtonProps {
  isCheck: boolean;
  size?: 'm' | 'l' | 's';
  checkboxType?: CheckboxType;
}

const Checkbox = ({
  isCheck = false,
  size = 'm',
  checkboxType = CheckboxType.Type1,
  ...rest
}: CheckboxProps) => {
  const getCheckboxSource = () => {
    switch (checkboxType) {
      case CheckboxType.Type1:
        if (size === 'm') {
          return images.doneCheckbox;
        } else {
          return images.doneCheckboxLarge;
        }
      case CheckboxType.Type2:
        return images.newCheckbox;
      case CheckboxType.CircleType1:
        return images.circleCheck;
      default:
    }
  };

  const getUncheckBoxSource = () => {
    switch (checkboxType) {
      case CheckboxType.Type1:
      case CheckboxType.Type2:
        return size === 'm'
          ? images.emptyCheckboxFrame
          : images.emptyCheckboxFrameLarge;
      case CheckboxType.CircleType1:
        return images.circleUncheck;
    }
  };

  const getCheckBoxSize = () => {
    switch (size) {
      case 'm':
        return styles.mediumSize;
      case 'l':
        return styles.largeSize;
      case 's':
        return styles.smallSize;
      default:
        return styles.mediumSize;
    }
  };

  return (
    <BaseButton activeOpacity={1} {...rest}>
      {isCheck ? (
        <FastImage
          source={getCheckboxSource()}
          resizeMode={'cover'}
          style={getCheckBoxSize()}
        />
      ) : (
        <FastImage
          source={getUncheckBoxSource()}
          resizeMode={'cover'}
          style={getCheckBoxSize()}
        />
      )}
    </BaseButton>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  mediumSize: {
    width: 34,
    height: 34,
  },
  largeSize: {
    width: 68,
    height: 68,
  },
  smallSize: {
    width: 16,
    height: 16,
  },
});
