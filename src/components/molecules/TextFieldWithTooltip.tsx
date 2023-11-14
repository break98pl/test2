import React, {useCallback} from 'react';
import {FlatList, View, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '@themes/colors';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import BaseText from '@atoms/BaseText';
import BaseTooltip from '@templates/BaseTooltip';
import BaseButton from '@atoms/BaseButton';
import BaseTextInput, {BaseTextInputProps} from '@molecules/BaseTextInput';

const IconInfo = ({onPressTooltipIcon}: {onPressTooltipIcon(): void}) => {
  return (
    <BaseButton
      activeOpacity={0.7}
      onPress={() => {
        onPressTooltipIcon ? onPressTooltipIcon() : () => {};
      }}>
      <View style={styles.iconContainer}>
        <View style={styles.iconWrapper}>
          <View style={styles.groupIcon}>
            <FastImage
              source={images.info}
              style={styles.infoImage}
              resizeMode="contain"
            />
            <FastImage
              source={images.nextArrow}
              style={styles.nextArrow}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </BaseButton>
  );
};

const TooltipContent = ({
  customRenderItem,
  renderItem,
  data,
}: {
  customRenderItem?({item}: {item: any}): any;
  renderItem({item, index}: {item: any; index: number}): void;
  data: any[] | undefined;
}) => {
  const keyExtractor = useCallback(
    (item: any, index: number) => `${item.id}-${index}`,
    [],
  );
  return (
    <FlatList
      style={styles.tooltipContainer}
      scrollEnabled={true}
      keyboardShouldPersistTaps={'always'}
      overScrollMode="always"
      keyboardDismissMode={'none'}
      keyExtractor={keyExtractor}
      renderItem={customRenderItem ? customRenderItem : renderItem}
      data={data}
    />
  );
};

interface TextFieldWithTooltipProps extends BaseTextInputProps {
  isTooltipOpened?: boolean;
  onToolTipClose?(): void;
  onPressTooltipIcon?(): void;
  onPressItem?(item: any, index: number): void;
  data?: string[] | any[];
  onBlur?(): void;
  onChangeText?(text: string): void;
  isEditable?: boolean;
  isShowTooltip?: boolean;
  customRenderItem?({item}: {item: any}): any;
  isShowTooltipHeader?: boolean;
  headerStyle?: ViewStyle;
  tooltipHeaderTitle?: string;
  leftButtonTooltipHeaderText?: string;
  onLeftButtonTooltipHeaderPress?(): void;
}

const TextFieldWithTooltip = ({
  isTooltipOpened,
  onToolTipClose,
  onPressTooltipIcon = () => {},
  onPressItem,
  onBlur,
  onChangeText,
  isEditable,
  data,
  isShowTooltip = true,
  headerStyle,
  customRenderItem,
  isShowTooltipHeader = false,
  tooltipHeaderTitle = '',
  leftButtonTooltipHeaderText = '',
  onLeftButtonTooltipHeaderPress = () => {},
  ...rest
}: TextFieldWithTooltipProps) => {
  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <BaseButton
        style={styles.listItem}
        activeOpacity={0.7}
        onPress={onPressItem ? () => onPressItem(item, index) : () => {}}>
        <View style={styles.listItemContainer}>
          <BaseText
            text={item}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.listItemText}
          />
          <View style={styles.listItemSeparator} />
        </View>
      </BaseButton>
    );
  };

  return (
    <BaseTextInput
      containerStyle={styles.textInputContainer}
      editable={isEditable}
      onChangeText={onChangeText}
      onBlur={onBlur}
      {...rest}
      rightIcon={
        isShowTooltip ? (
          <BaseTooltip
            showHeader={isShowTooltipHeader}
            headerStyle={headerStyle}
            leftButtonText={leftButtonTooltipHeaderText}
            onLeftButtonPress={onLeftButtonTooltipHeaderPress}
            title={tooltipHeaderTitle}
            isVisible={isTooltipOpened}
            placement={'left'}
            closeOnContentInteraction={false}
            onClose={onToolTipClose}
            content={
              <TooltipContent
                customRenderItem={customRenderItem}
                renderItem={renderItem}
                data={data}
              />
            }>
            <IconInfo onPressTooltipIcon={onPressTooltipIcon} />
          </BaseTooltip>
        ) : (
          <></>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    alignContent: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  infoImage: {
    width: 24,
    height: 24,
  },
  tooltipContainer: {
    height: 272,
    width: 325,
  },
  listItem: {
    marginBottom: 6,
  },
  listItemContainer: {
    width: '100%',
    height: 44,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  listItemText: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.BLACK,
  },
  listItemSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.GRAY_BACKGROUND,
    position: 'absolute',
    bottom: 0,
  },
  textInputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY_BORDER,
  },
  groupIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextArrow: {
    width: 20,
    height: 20,
  },
});

export default TextFieldWithTooltip;
