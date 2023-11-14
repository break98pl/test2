import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  SectionListData,
} from 'react-native';
import React, {memo, useCallback} from 'react';
import CareListSectionHeader from '@organisms/CareListSectionHeader';
import CareListSectionListItem from '@organisms/CareListSectionListItem';
import {CareListSection, FCPRecord} from '@modules/record/record.type';
import {Colors} from '@themes/colors';

interface Props {
  data: CareListSection[];
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEndDrag: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  ListHeaderComponent: React.ReactElement;
  ListFooterComponent: React.ReactElement;
}

const CareListSectionList = ({
  data,
  onScroll,
  onScrollEndDrag,
  ListHeaderComponent,
  ListFooterComponent,
}: Props) => {
  const keyExtractor = useCallback((item: FCPRecord) => item.id, []);

  const renderSectionHeader = useCallback(
    ({
      section: {headerData},
    }: {
      section: SectionListData<FCPRecord, CareListSection>;
    }) => {
      return <CareListSectionHeader {...headerData} />;
    },
    [],
  );

  const renderSectionItem = useCallback(
    ({item, index}: {item: FCPRecord; index: number}) => {
      return (
        <CareListSectionListItem
          recordItem={item}
          bgColor={
            index % 2 === 0 ? Colors.WHITE : Colors.LIGHT_GRAY_BACKGROUND
          }
        />
      );
    },
    [],
  );

  return (
    <SectionList
      sections={data}
      keyExtractor={keyExtractor}
      renderItem={renderSectionItem}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onScroll={onScroll}
      onScrollEndDrag={onScrollEndDrag}
      scrollEventThrottle={200}
      initialNumToRender={31}
      maxToRenderPerBatch={31}
      windowSize={41}
    />
  );
};

export default memo(CareListSectionList);
