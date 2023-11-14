import {StyleSheet, View} from 'react-native';
import React from 'react';
import BaseText from '@atoms/BaseText';
import FastImage from 'react-native-fast-image';
import {Colors} from '@themes/colors';
import {images} from '@constants/images';
import {TElapsedRecordData} from '@modules/elapsed/elapsed.type';
import {TIME_24H_FORMAT} from '@constants/constants';
import moment from 'moment';
import BaseButton from '@atoms/BaseButton';
import {getIconSettingReport} from '@modules/elapsed/elapsed.utils';

interface IElapsedPreviousInfoProps {
  data?: TElapsedRecordData;
  onPress?: () => void;
}

const ElapsedPreviousInfo = (props: IElapsedPreviousInfoProps) => {
  const {data, onPress} = props;

  return data ? (
    <BaseButton onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <BaseText
          color={Colors.BLACK}
          weight="semiBold"
          text={data?.classification}
          numberOfLines={1}
        />
        <FastImage
          style={styles.reportLevelIcon}
          resizeMode="contain"
          source={getIconSettingReport(data.settingReport)}
        />
      </View>
      <BaseText
        style={styles.contentLimit}
        numberOfLines={1}
        color={Colors.TEXT_GREY}
        size="xSmall"
        text={data?.content}
      />
      <View style={styles.footer}>
        <View style={styles.iconFrame}>
          {data?.isAssign && (
            <FastImage
              source={images.assignIcon}
              resizeMode="contain"
              style={styles.iconPhoto}
            />
          )}
          {!data?.isSynced && (
            <FastImage
              source={images.elapsedRecordUnsync}
              resizeMode="contain"
              style={styles.iconUnSync}
            />
          )}
          {!!data?.registerPhoto.length && (
            <FastImage
              source={images.photoIcon}
              resizeMode="contain"
              style={styles.iconPhoto}
            />
          )}
        </View>
        <BaseText
          size="small"
          color={Colors.TEXT_GREY}
          text={moment(data.recordDate).format(TIME_24H_FORMAT)}
        />
      </View>
    </BaseButton>
  ) : (
    <></>
  );
};

export default ElapsedPreviousInfo;

const styles = StyleSheet.create({
  container: {
    rowGap: 3,
    width: '100%',
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 20,
  },
  contentLimit: {
    width: 150,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  iconUnSync: {
    width: 22,
    height: 22,
  },
  iconPhoto: {
    width: 17,
    height: 17,
  },
  reportLevelIcon: {
    width: 28,
    height: 26,
  },
});
