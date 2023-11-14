import {StyleSheet, View} from 'react-native';
import React, {useCallback} from 'react';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import BaseButton from '@atoms/BaseButton';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';

interface IClassificationTemplateItemProps {
  isHeader?: boolean;
  textLeft?: string;
  textRight?: string;
  onPress?: () => void;
  isMultipleChoice?: boolean;
  isChecked?: boolean;
}

const ClassificationTemplateItem = (
  props: IClassificationTemplateItemProps,
) => {
  const {isHeader, textLeft, textRight, onPress, isMultipleChoice, isChecked} =
    props;

  const renderCheckIcon = useCallback(() => {
    if (isChecked) {
      return (
        <FastImage
          source={images.checkOn}
          resizeMode="contain"
          style={styles.checkIcon}
        />
      );
    }
    return (
      <FastImage
        source={images.checkOff}
        resizeMode="contain"
        style={styles.checkIcon}
      />
    );
  }, [isChecked]);

  return (
    <BaseButton onPress={onPress} disabled={isHeader}>
      <View
        style={[
          styles.container,
          isHeader && {backgroundColor: Colors.HEADER_GRAY},
        ]}>
        <View style={styles.contentLeftView}>
          {!isHeader && isMultipleChoice && renderCheckIcon()}
          <BaseText
            color={isHeader ? Colors.WHITE : Colors.TEXT_PRIMARY}
            text={textLeft}
          />
        </View>
        <View style={styles.addressRightView}>
          <BaseText
            color={isHeader ? Colors.WHITE : Colors.TEXT_PRIMARY}
            text={textRight}
          />
        </View>
      </View>
    </BaseButton>
  );
};

export default ClassificationTemplateItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: Colors.GRAY_PH,
    borderBottomWidth: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  contentLeftView: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  addressRightView: {
    flex: 2,
  },
  checkIcon: {
    width: 13,
    height: 13,
  },
});
