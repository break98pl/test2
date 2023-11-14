import React, {useCallback} from 'react';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '@themes/colors';
import ClassificationTemplateItem from '@molecules/ClassificationTemplateItem';
import _ from 'lodash';

export interface IElapsedTemplateListItem {
  id: string;
  content: string;
  place?: string;
}

interface Props {
  /**
   * List data.
   */
  data: IElapsedTemplateListItem[];

  /**
   * Called when user has selected an item.
   *
   * @param value
   */
  onSelectItem?: (value: IElapsedTemplateListItem) => void;

  /**
   * Style of View
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Value is chosen
   */
  valueChosen?: string;

  /**
   * Change color background of chosen value
   */
  allowChangeBgChosen?: boolean;

  /**
   * Render separator
   */
  separator?: boolean;

  /**
   * Allow check multiple choices
   */
  isMultipleChoice?: boolean;

  /**
   * Function add template to queue
   */
  onAdd?: (e: IElapsedTemplateListItem) => void;

  /**
   * Function add template to queue
   */
  onRemove?: (e: IElapsedTemplateListItem) => void;

  /**
   * Array template added
   */
  queue?: IElapsedTemplateListItem[];
}

const ClassificationTemplateSelectionList = ({
  data,
  onSelectItem,
  style,
  separator = true,
  isMultipleChoice,
  onAdd,
  onRemove,
  queue,
}: Props) => {
  const keyExtractor = useCallback(
    (item: IElapsedTemplateListItem, index: number) => {
      if (item.id) {
        item.id.toString();
      }
      return index.toString();
    },
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: IElapsedTemplateListItem}) => {
      const handleSelectDB = () => {
        if (_.filter(queue, e => e.id === item.id).length > 0) {
          onRemove && onRemove(item);
        } else {
          onAdd && onAdd(item);
        }
      };

      return (
        <ClassificationTemplateItem
          isMultipleChoice={isMultipleChoice}
          onPress={handleSelectDB}
          textLeft={item.content}
          textRight={item.place}
          isChecked={_.filter(queue, e => e.id === item.id).length > 0}
        />
      );
    },
    [onSelectItem, onAdd, onRemove],
  );

  const renderSeparator = useCallback(
    () => <>{separator && <View style={styles.separator} />}</>,
    [],
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      style={StyleSheet.compose(styles.list, style)}
    />
  );
};

const styles = StyleSheet.create({
  list: {},
  separator: {
    height: 0.5,
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

export default React.memo(ClassificationTemplateSelectionList);
