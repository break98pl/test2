import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Room} from '@modules/resident/resident.type';
import BaseButton from '@atoms/BaseButton';
import BaseText from '@atoms/BaseText';
import {cTenantData} from '@database/models/various-registration-information-data/cTenantData';
import {Colors} from '@themes/colors';
import LineSeparator from '@atoms/LineSeparator';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import {useTranslation} from 'react-i18next';
import {Gender} from '@modules/tenant/tenant.type';
import {Size} from '@themes/typography';

interface Props {
  title?: string;
  data: Room[];
  onSelectRoom?: (selectedRoomCodes: string[]) => void;
}

const RoomList = ({title, data, onSelectRoom}: Props) => {
  const {t} = useTranslation();
  const [selectedRoomCodes, setSelectedRoomCodes] = useState<string[]>(
    data.filter(room => room.tenants.length > 0).map(room => room.code),
  );

  const renderHeader = useCallback(
    () => (
      <BaseButton activeOpacity={1} style={styles.listHeader}>
        <BaseText text={title} color={Colors.GRAY_PH} />
      </BaseButton>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Room) => item.code, []);

  const renderItem = useCallback(
    ({item}: {item: Room}) => {
      const tenantList: cTenantData[] = item.tenants.slice(0, 4);
      const sizeOfName: Size = tenantList.length > 1 ? 'medium' : 'xxLarge';
      const isDisable = tenantList.length === 0;

      const onPressItem = () => {
        if (isDisable) {
          return;
        }
        const index = selectedRoomCodes.findIndex(e => e === item.code);
        let roomCodes: string[];
        if (index > -1) {
          roomCodes = selectedRoomCodes.filter(e => e !== item.code);
        } else {
          roomCodes = [...selectedRoomCodes, item.code];
        }
        setSelectedRoomCodes(roomCodes);
        if (onSelectRoom) {
          onSelectRoom(roomCodes);
        }
      };

      return (
        <BaseButton
          style={styles.item}
          activeOpacity={isDisable ? 1 : 0.7}
          onPress={onPressItem}>
          <View style={styles.infoView}>
            <BaseText
              text={item.name}
              size={'xxLarge'}
              color={isDisable ? Colors.GRAY_PH : Colors.TEXT_PRIMARY}
            />
            <View style={styles.tenantView}>
              {tenantList.map((tenant, index) => (
                <View key={index.toString()} style={styles.tenantInfoView}>
                  <BaseText
                    size={sizeOfName}
                    text={tenant.kanjiName}
                    color={
                      tenant.gender === Gender.Male
                        ? Colors.TEXT_SECONDARY
                        : Colors.ERROR
                    }
                    numberOfLines={1}
                  />
                  <BaseText
                    text={t('user_list.sama')}
                    size={'xSmall'}
                    color={Colors.GRAY_PH}
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.checkIconView}>
            {!isDisable && selectedRoomCodes.includes(item.code) && (
              <FastImage
                source={images.checkMark}
                resizeMode={'contain'}
                tintColor={Colors.PRIMARY}
                style={styles.checkIcon}
              />
            )}
          </View>
        </BaseButton>
      );
    },
    [selectedRoomCodes],
  );

  const renderSeparator = useCallback(() => <LineSeparator />, []);

  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      ListHeaderComponent={renderHeader}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    backgroundColor: Colors.GRAY_BACKGROUND,
  },
  listHeader: {
    // height: 36,
    paddingTop: 30,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  item: {
    flex: 1,
    gap: 30,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
  },
  infoView: {
    flex: 1,
    gap: 5,
    justifyContent: 'center',
  },
  tenantView: {
    rowGap: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tenantInfoView: {
    gap: 10,
    flexBasis: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkIconView: {
    width: 25,
  },
  checkIcon: {
    width: 25,
    height: 25,
  },
});

export default RoomList;
