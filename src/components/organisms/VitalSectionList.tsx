import React, {useCallback} from 'react';
import {
  FlatList,
  SectionList,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Colors} from '@themes/colors';
import BaseText from '@atoms/BaseText';
import {useAppSelector} from '@store/config';
import {selectAppType} from '@modules/authentication/auth.slice';
import {AppType} from '@modules/setting/setting.type';
import VitalTableItem from './VitalTableItem';
import {VitalListItem, VitalListSection} from '@modules/vital/vital.type';
import LineSeparator from '@atoms/LineSeparator';

interface Props {
  /**
   * Called when user has selected an item.
   *
   * @param value
   */
  onSelectItem?: (value: VitalListItem) => void;

  /**
   * Style of View
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Sections of vital record list
   */
  sections?: VitalListSection[];

  /**
   * Data of vital record list
   */
  data: VitalListItem[];
}

const VitalSectionList = ({onSelectItem, style, sections, data}: Props) => {
  const appType = useAppSelector(selectAppType);

  const keyExtractor = useCallback((item: VitalListItem, index: number) => {
    if (appType === AppType.SHISETSHU || appType === AppType.JUTAKU) {
      return item.tenantCode;
    } else {
      return item.tenantCode + index;
    }
  }, []);

  const renderItem = useCallback(
    ({item, index}: {item: VitalListItem; index: number}) => {
      const handleSelectDB = () => {
        if (onSelectItem) {
          onSelectItem(item);
        }
      };

      return (
        <VitalTableItem
          deepBg={index % 2 !== 0}
          data={item}
          onPress={handleSelectDB}
        />
      );
    },
    [onSelectItem],
  );

  const renderHeaderItem = useCallback(
    ({section}: {section: VitalListSection}) => (
      <View style={styles.greyLabelView}>
        <BaseText
          weight="semiBold"
          style={styles.label}
          color={Colors.WHITE}
          text={section.title}
        />
      </View>
    ),
    [],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 48,
      offset: 48 * index,
      index,
    }),
    [],
  );

  const renderItemSeparator = useCallback(
    () => <LineSeparator color={Colors.SEPARATOR_LINE} />,
    [],
  );

  return (
    <>
      {sections ? (
        <SectionList
          keyExtractor={keyExtractor}
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderHeaderItem}
          style={StyleSheet.compose(styles.list, style)}
          stickySectionHeadersEnabled
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={renderItemSeparator}
          ListFooterComponent={renderItemSeparator}
        />
      ) : (
        <FlatList
          keyExtractor={keyExtractor}
          data={data}
          renderItem={renderItem}
          style={StyleSheet.compose(styles.list, style)}
          getItemLayout={getItemLayout}
          ItemSeparatorComponent={renderItemSeparator}
          ListFooterComponent={renderItemSeparator}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  list: {},
  greyLabelView: {
    height: 25,
    backgroundColor: Colors.HEADER_BLUE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 15,
  },
});

export default VitalSectionList;
