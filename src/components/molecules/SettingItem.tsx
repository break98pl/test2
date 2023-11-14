import {View, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {images} from '@constants/images';

interface ISettingItemProps {
  label?: string;
  noBottomLine?: boolean;
  after?: string;
  link?: boolean;
  noLinkIcon?: boolean;

  /**
   * props of choose single options
   */
  checked?: boolean;
  onPress?: () => void;

  /**
   * Props of list toggle
   */
  toggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: () => void;
}

const SettingItem = (props: ISettingItemProps) => {
  const {
    label,
    after,
    noBottomLine,
    link,
    toggle,
    checked,
    onPress,
    noLinkIcon,
    toggleValue,
    onToggleChange,
  } = props;

  return (
    <TouchableOpacity
      disabled={!link}
      onPress={onPress}
      style={[styles.container, noBottomLine && styles.noBottomLine]}>
      <View style={styles.viewContent}>
        <BaseText
          size="large"
          style={styles.label}
          text={label}
          color={Colors.TEXT_PRIMARY}
        />
      </View>
      <View style={styles.after}>
        <BaseText
          size="large"
          style={styles.afterText}
          text={after}
          color={Colors.GRAY_PH}
        />
        {link && !noLinkIcon && (
          <FastImage
            style={styles.linkIcon}
            source={images.arrowRight}
            resizeMode={'contain'}
            tintColor={Colors.GRAY_PH}
          />
        )}

        {toggle && (
          <Switch onValueChange={onToggleChange} value={toggleValue} />
        )}

        {checked && (
          <FastImage
            style={styles.checkedIcon}
            source={images.checkMark}
            resizeMode={'contain'}
            tintColor={Colors.PRIMARY}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderBottomWidth: 0.5,
    borderColor: Colors.LIGHT_GRAY,
    paddingRight: 23,
  },
  label: {
    color: Colors.TEXT_PRIMARY,
    minWidth: 150,
  },
  noBottomLine: {
    borderBottomWidth: 0,
  },
  after: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  afterText: {
    color: Colors.GRAY_PH,
  },
  linkIcon: {
    width: 18,
    height: 18,
    marginLeft: 8,
  },
  checkedIcon: {
    width: 36,
    height: 36,
  },
  viewContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
