import {DimensionValue, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '@themes/colors';
import FastImage from 'react-native-fast-image';
import {images} from '@constants/images';
import BaseText from '@atoms/BaseText';
import {FontSize} from '@themes/typography';
import {useTranslation} from 'react-i18next';
import {Gender, TenantInfo} from '@modules/tenant/tenant.type';
import UserDetailsTooltip from '@organisms/UserDetailsTooltip';
import useVisible from '@hooks/useVisible';
import BaseButton from '@atoms/BaseButton';
import {Placement} from 'react-native-popover-view/dist/Types';

interface IUserInfoProps {
  width?: DimensionValue;
  height?: 65 | 50;
  data: TenantInfo;
}

const UserInfo = (props: IUserInfoProps) => {
  const {width, height, data} = props;
  const {t} = useTranslation();

  const {
    isVisible: isShowUserDetailsTooltip,
    showComponent: showUserDetailsTooltip,
    hideComponent: hideUserDetailsTooltip,
  } = useVisible();

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

  return (
    <BaseButton
      onPress={showUserDetailsTooltip}
      activeOpacity={1}
      style={StyleSheet.flatten([styles.container, {width, height}])}>
      <UserDetailsTooltip
        isVisible={isShowUserDetailsTooltip}
        from={
          <FastImage
            source={getPhotoSource()}
            resizeMode="cover"
            style={styles.userImage}
          />
        }
        userInfo={data}
        placement={Placement.RIGHT}
        onLeftButtonPress={hideUserDetailsTooltip}
      />

      <View style={styles.infoContainer}>
        <View style={styles.infoTop}>
          <BaseText
            size={'small'}
            numberOfLines={1}
            weight="semiBold"
            color={
              data.gender === Gender.Male
                ? Colors.TEXT_SECONDARY
                : Colors.FEMALE_RED
            }
            style={styles.furiganaName}>
            {`${data.surnameFurigana} ${data.firstNameFurigana}`}
          </BaseText>
          {data.hasNotice && (
            <FastImage
              source={images.tenantWarning}
              resizeMode="contain"
              style={styles.tenantWarningImg}
            />
          )}
        </View>

        <View style={styles.infoBottom}>
          <BaseText
            style={styles.kanjiName}
            size={'xxLarge'}
            numberOfLines={1}
            color={
              data.gender === Gender.Male
                ? Colors.TEXT_SECONDARY
                : Colors.FEMALE_RED
            }>
            {`${data.surnameKanji} ${data.firstNameKanji}`}
          </BaseText>
          <BaseText style={styles.sama}>{t('common.sama')}</BaseText>
        </View>
      </View>
    </BaseButton>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 6,
  },
  userImage: {
    height: 42,
    width: 32,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  furiganaName: {
    flex: 1,
    marginBottom: 4,
  },
  tenantWarningImg: {
    width: 17,
    height: 17,
  },
  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  kanjiName: {
    flex: 1,
  },
  sama: {
    fontSize: FontSize.X_SMALL,
    marginBottom: 2,
  },
});
