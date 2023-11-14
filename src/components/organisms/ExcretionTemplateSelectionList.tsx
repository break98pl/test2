import React, {useCallback} from 'react';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '@themes/colors';
import ExcretionTemplateItem from '@molecules/ExcretionTemplateItem';

export interface ExcretionTemplateListList {
  id: string;
  content: string;
}

interface Props {
  /**
   * List data.
   */
  data: ExcretionTemplateListList[];

  /**
   * Called when user has selected an item.
   *
   * @param value
   */
  onSelectItem?: (value: ExcretionTemplateListList) => void;

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
   * Close popover record detail
   */
  onClose?: () => void;
}

const ExcretionTemplateSelectionList = ({
  data,
  onSelectItem,
  style,
  separator = true,
  onClose,
}: Props) => {
  const keyExtractor = useCallback(
    (item: ExcretionTemplateListList) => item.id.toString(),
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: ExcretionTemplateListList}) => {
      const handleSelectDB = () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
        onClose && onClose();
      };

      return <ExcretionTemplateItem onPress={handleSelectDB} />;
    },
    [onSelectItem],
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
    backgroundColor: Colors.BLACK,
    opacity: 0.3,
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

export default React.memo(ExcretionTemplateSelectionList);
