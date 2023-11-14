import React, {useCallback} from 'react';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '@themes/colors';
import ExcretionTemplateItem from '@molecules/ExcretionTemplateItem';
import {IExcretionTemplate} from './ExcretionRecordTemplate';
import TooltipListData from './TooltipListData';
import {t} from 'i18next';

export interface ExcretionTemplateListList {
  id: string;
  content: string;
}

interface Props {
  /**
   * List data.
   */
  data: IExcretionTemplate[];

  /**
   * Called when user has selected an item.
   *
   * @param value
   */
  onSelectItem?: (value: IExcretionTemplate) => void;

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
    (item: IExcretionTemplate) => item.id.toString(),
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: IExcretionTemplate}) => {
      const handleSelectDB = () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
        onClose && onClose();
      };

      return <ExcretionTemplateItem onPress={handleSelectDB} icons={item} />;
    },
    [onSelectItem],
  );

  const renderSeparator = useCallback(
    () => <>{separator && <View style={styles.separator} />}</>,
    [],
  );

  return (
    <TooltipListData
      noDataText={t('popover.excretion_template')}
      existData={!!data.length}
      customStyle={styles.customStyle}>
      <FlatList
        keyExtractor={keyExtractor}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        style={StyleSheet.compose(styles.list, style)}
      />
    </TooltipListData>
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.TEMPLATE_BG,
    paddingHorizontal: 10,
    height: 100,
  },
  labelTemplate: {
    textAlign: 'center',
    width: 100,
  },
  customStyle: {
    backgroundColor: Colors.TEMPLATE_BG,
  },
});

export default React.memo(ExcretionTemplateSelectionList);
