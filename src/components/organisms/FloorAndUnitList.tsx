import React, {useCallback} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import BaseText from '@atoms/BaseText';
import LineSeparator from '@atoms/LineSeparator';
import BaseButton from '@atoms/BaseButton';
import {AppType} from '@modules/setting/setting.type';
import {useTranslation} from 'react-i18next';
import {Colors} from '@themes/colors';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {
  FloorAndUnitSectionData,
  FloorUnitModel,
} from '@modules/resident/resident.type';
import {useAppSelector} from '@store/config';
import {
  selectAppType,
  selectChoseServiceName,
} from '@modules/authentication/auth.slice';
import {getUserLabel} from '@modules/tenant/tenant.utils';

interface Props {
  sections: FloorAndUnitSectionData[];
  appType: AppType;
  onSelectFloorOrUnit: (data: FloorUnitModel) => void;
}

const FloorAndUnitList = ({sections, onSelectFloorOrUnit}: Props) => {
  const {t} = useTranslation();
  const appType = useAppSelector(selectAppType);
  const serviceName = useAppSelector(selectChoseServiceName);
  const keyExtractor = useCallback((item: FloorUnitModel) => item.id, []);

  const convertTitle = (text: string) => {
    return text.includes('すべての')
      ? text.slice(0, 4) + t(getUserLabel(appType, serviceName), {text: '一覧'})
      : text;
  };

  const renderItem = useCallback(
    ({item}: {item: FloorUnitModel}) => {
      const isDisable = item.count === 0;

      const onPress = async () => {
        if (isDisable) {
          return;
        }
        onSelectFloorOrUnit(item);
      };

      return (
        <BaseButton
          onPress={onPress}
          style={styles.item}
          activeOpacity={isDisable ? 1 : 0.7}>
          <BaseText
            size={'xxLarge'}
            color={isDisable ? Colors.GRAY_PH : Colors.TEXT_PRIMARY}
            style={styles.itemTitle}>
            {convertTitle(item.title)}
          </BaseText>
          <BaseText
            size={'xxLarge'}
            color={isDisable ? Colors.GRAY_PH : Colors.TEXT_PRIMARY}>
            {item.count + ' ' + t('common.human')}
          </BaseText>
          <FastImage
            source={images.rightArrow}
            resizeMode={'contain'}
            style={styles.arrowIcon}
          />
        </BaseButton>
      );
    },
    [sections],
  );

  const renderHeader = useCallback(
    ({section}: {section: FloorAndUnitSectionData}) => {
      return (
        <BaseButton style={styles.sectionHeader} activeOpacity={1}>
          <BaseText size="small" color={Colors.GRAY_PH}>
            {section.title}
          </BaseText>
        </BaseButton>
      );
    },
    [sections],
  );

  const renderSeparator = useCallback(() => <LineSeparator />, [sections]);

  return (
    <SectionList
      scrollEnabled
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderHeader}
      ItemSeparatorComponent={renderSeparator}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={styles.listFooter} />}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  listFooter: {
    height: 30,
  },
  item: {
    gap: 7,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
  },
  itemTitle: {
    flex: 1,
  },
  sectionHeader: {
    height: 56,
    paddingTop: 21,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  arrowIcon: {
    height: 15,
    width: 9,
  },
});

export default FloorAndUnitList;
