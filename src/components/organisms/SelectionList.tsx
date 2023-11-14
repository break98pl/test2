import React, {useCallback, forwardRef} from 'react';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import FastImage, {Source} from 'react-native-fast-image';
import {images} from '@constants/images';
import {useTranslation} from 'react-i18next';
export interface TextListItem {
  id: string;
  label: string;
  subLabel?: string;
  icon?: Source;
}

interface Props {
  /**
   * List data.
   */
  data: TextListItem[];

  /**
   * Called when user has selected an item.
   *
   * @param value
   */
  onSelectItem?: (value: TextListItem) => void;

  /**
   * Style of View
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Value is chosen
   */
  valueChosen?: string;

  /**
   * Show Check Icon
   */
  showCheckIcon?: boolean;

  /**
   * Change color background of chosen value
   */
  allowChangeBgChosen?: boolean;

  /**
   * Using translation i18 to translate text
   */
  usingTrans?: boolean;

  /**
   * Show arrow icon
   */
  showArrowIcon?: boolean;

  /**
   * Style of item
   */
  itemStyle?: ViewStyle;

  /**
   * Render separator
   */
  separator?: boolean;

  /**
   * Height of list item.
   */
  itemHeight?: number;

  /**
   * Rendered at the bottom of all the items.
   */
  listFooterComponent?: React.ReactElement;

  /**
   * Function add template to queue
   */
  onAdd?: (e: TextListItem) => void;

  /**
   * Function add template to queue
   */
  onRemove?: (e: TextListItem) => void;

  /**
   * Allow check multiple choices
   */
  isMultipleChoice?: boolean;

  /**
   * Array template added
   */
  queue?: TextListItem[];
}

const DEFAULT_ITEM_HEIGHT = 46;
const DEFAULT_SEPARATOR_HEIGHT = 1;

const SelectionList = forwardRef<FlatList, Props>(
  (
    {
      data,
      onSelectItem,
      onAdd,
      onRemove,
      isMultipleChoice,
      style,
      valueChosen,
      showCheckIcon,
      allowChangeBgChosen,
      usingTrans,
      showArrowIcon,
      itemStyle,
      separator = true,
      itemHeight = DEFAULT_ITEM_HEIGHT,
      listFooterComponent,
      queue,
    },
    ref,
  ) => {
    const {t} = useTranslation();
    const keyExtractor = useCallback(
      (item: TextListItem) => item.id.toString(),
      [],
    );
    const renderItem = useCallback(
      ({item}: {item: TextListItem}) => {
        const customStyle: StyleProp<ViewStyle> = {
          ...itemStyle,
          height: itemHeight,
        };

        const selectedItemStyle: StyleProp<ViewStyle> =
          !!valueChosen && valueChosen === item.label && allowChangeBgChosen
            ? styles.chosenItem
            : {};

        const handleSelectItem = () => {
          if (!isMultipleChoice && onSelectItem) {
            onSelectItem(item);
          } else {
            if (queue?.find(e => e.label === item.label)) {
              onRemove && onRemove(item);
            } else {
              onAdd && onAdd(item);
            }
          }
        };
        const handleShowIcon = () => {
          if (!isMultipleChoice) {
            if (!!valueChosen && valueChosen === item.id && showCheckIcon) {
              return (
                <FastImage
                  style={styles.checkIcon}
                  source={images.checkMark}
                  tintColor={Colors.TEXT_BLUE}
                  resizeMode="contain"
                />
              );
            } else if (showArrowIcon) {
              return (
                <FastImage
                  style={styles.arrowIcon}
                  source={images.nextArrow}
                  resizeMode="contain"
                />
              );
            }
          } else {
            if (queue?.find(x => x.label === item.label)) {
              return (
                <FastImage
                  style={styles.checkIcon}
                  source={images.checkMark}
                  tintColor={Colors.TEXT_BLUE}
                  resizeMode="contain"
                />
              );
            }
          }
        };
        return (
          <BaseButton
            enableAnimatedPress
            onPress={handleSelectItem}
            style={StyleSheet.flatten([
              styles.item,
              customStyle,
              selectedItemStyle,
            ])}>
            <View style={styles.leftView}>
              {item.icon && (
                <FastImage
                  style={styles.periodIcon}
                  source={item.icon}
                  resizeMode="contain"
                />
              )}
              <BaseText
                text={usingTrans ? t(item.label) : item.label}
                size={'large'}
              />
            </View>
            {item.subLabel && <BaseText text={item.subLabel} size={'small'} />}
            {handleShowIcon()}
          </BaseButton>
        );
      },
      [onSelectItem, onAdd, onRemove],
    );

    const renderSeparator = useCallback(
      () => <>{separator && <View style={styles.separator} />}</>,
      [],
    );

    const getItemLayout = useCallback(
      (_: any, index: number) => ({
        length: itemHeight,
        offset: (itemHeight + DEFAULT_SEPARATOR_HEIGHT) * index,
        index,
      }),
      [],
    );

    return (
      <FlatList
        ref={ref}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        ListFooterComponent={listFooterComponent}
        ItemSeparatorComponent={renderSeparator}
        style={StyleSheet.compose(styles.list, style)}
      />
    );
  },
);

const styles = StyleSheet.create({
  list: {},
  separator: {
    height: 1,
    backgroundColor: Colors.GRAY_BORDER,
  },
  item: {
    height: 46,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkIcon: {
    width: 23,
    height: 23,
  },
  arrowIcon: {
    width: 15,
    height: 15,
  },
  chosenItem: {
    backgroundColor: Colors.CHOOSING_BG,
  },
  periodIcon: {
    width: 42,
    height: 42,
  },
  leftView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default React.memo(SelectionList);
