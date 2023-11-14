import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Gender, TenantInfo} from '@modules/tenant/tenant.type';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import BaseText from '@atoms/BaseText';
import {Colors} from '@themes/colors';
import {useTranslation} from 'react-i18next';
import {FontSize} from '@themes/typography';
import _ from 'lodash';

interface IUserInfoRehaProps {
  data: TenantInfo;
  attendanceStatus?: string;
}

const UserInfoReha = (props: IUserInfoRehaProps) => {
  const {data, attendanceStatus} = props;
  const {t} = useTranslation();

  const getPhotoSource = () => {
    if (data.photoPath) {
      return {
        uri: `file://${data.photoPath}`,
      };
    } else {
      return data.gender === Gender.Male
        ? images.malePhoto
        : images.femalePhoto;
    }
  };

  const getColorFromAttendanceStatus = () => {
    if (!attendanceStatus) {
      return Colors.TEXT_PRIMARY;
    } else if (
      _.includes(
        [
          t('popover.attendance_providing_service').slice(0, 3),
          t('popover.attendance_go_home').slice(0, 3),
        ],
        attendanceStatus,
      )
    ) {
      return Colors.TEXT_SECONDARY;
    } else {
      return Colors.DEEP_PINK_COLOR;
    }
  };

  return (
    <View style={styles.container}>
      <FastImage
        source={getPhotoSource()}
        resizeMode="contain"
        style={styles.userImage}
      />
      <View style={styles.infoContainer}>
        <View style={styles.infoTop}>
          <BaseText
            size="xxLarge"
            color={
              data.gender === Gender.Male
                ? Colors.TEXT_SECONDARY
                : Colors.FEMALE_RED
            }>
            {data.surnameKanji} {data.firstNameKanji}
          </BaseText>
          <BaseText color={Colors.BLUR_GREY}>{t('common.sama')}</BaseText>
        </View>
        <View style={styles.infoBottom}>
          <BaseText size="xxLarge" color={Colors.TEXT_PRIMARY}>
            {t('popover.attendance_status')}
          </BaseText>
          <BaseText size="xxLarge" color={getColorFromAttendanceStatus()}>
            {attendanceStatus || '---'}
          </BaseText>
        </View>
      </View>
    </View>
  );
};

export default UserInfoReha;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  userImage: {
    height: 84,
    width: 64,
  },
  infoContainer: {
    marginLeft: 20,
    height: '100%',
    rowGap: 20,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150,
  },
  furiganaName: {
    fontSize: FontSize.SMALL,
    marginBottom: 4,
  },
  tenantWarningImg: {
    width: 17,
    height: 17,
  },
  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 150,
  },
  kanjiName: {
    fontSize: FontSize.XX_LARGE,
  },
  sama: {
    fontSize: FontSize.X_SMALL,
    marginBottom: 2,
  },
});
