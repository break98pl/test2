import React, {useCallback} from 'react';
import {FlatList, StyleProp, ViewStyle} from 'react-native';
import {Colors} from '@themes/colors';
import TodayPlanListItem from '@molecules/TodayPlanListItem';
import {GoingOutPlan} from '@modules/tenant/tenant.type';
import LineSeparator from '@atoms/LineSeparator';

interface Props {
  /**
   * List data.
   */
  data: GoingOutPlan[];

  /**
   * Called when user has selected an item.
   *
   * @param value
   */
  onSelectItem?: (value: GoingOutPlan) => void;

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
   * is line break for 2 date UI
   */
  isLineBreakDate?: boolean;
}

const TodayPlanSelectionList = ({
  data,
  onSelectItem,
  style,
  separator = true,
  isLineBreakDate,
}: Props) => {
  const keyExtractor = useCallback((item: GoingOutPlan) => item.id, []);

  const renderItem = useCallback(
    ({item}: {item: GoingOutPlan}) => {
      const handleSelectDB = () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
      };

      return (
        <TodayPlanListItem
          todayPlan={item}
          onPress={handleSelectDB}
          isLineBreakDate={isLineBreakDate}
        />
      );
    },
    [onSelectItem],
  );

  const renderSeparator = useCallback(
    () => (separator ? <LineSeparator color={Colors.GRAY_BORDER} /> : <></>),
    [],
  );

  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      ListFooterComponent={renderSeparator}
      style={style}
    />
  );
};

export default React.memo(TodayPlanSelectionList);
